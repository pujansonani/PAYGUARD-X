import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning, module="sklearn")
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, List, Optional
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    precision_recall_curve,
    auc,
    confusion_matrix,
    roc_curve
)
from ml.features.pipeline import FeaturePipeline

class PayGuardEnsemble:
    def __init__(self):
        self.pipeline = FeaturePipeline()
        self.scaler = StandardScaler()
        self.lr_model = LogisticRegression(solver="liblinear", max_iter=500, class_weight="balanced", random_state=42)
        self.rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, class_weight="balanced", random_state=42, n_jobs=-1)
        self.xgb_model = XGBClassifier(
            n_estimators=120,
            max_depth=6,
            learning_rate=0.08,
            scale_pos_weight=3.5,
            random_state=42,
            n_jobs=-1,
            eval_metric="logloss"
        )
        self.iso_forest = IsolationForest(n_estimators=80, contamination=0.10, random_state=42, n_jobs=-1)
        self.is_trained = False
        self.feature_names: List[str] = []

        # Configurable ensemble stacking weights
        self.weights = {
            "xgb": 0.50,
            "rf": 0.35,
            "iso": 0.15
        }

        # Configurable decision thresholds
        self.thresholds = {
            "low_medium": 30.0,
            "medium_high": 70.0
        }

    def train(self, df: pd.DataFrame) -> Dict[str, Any]:
        if df.empty or "fraud_label" not in df.columns:
            return {"status": "FAILED", "reason": "Empty dataset or missing fraud_label"}

        X_raw, self.feature_names = self.pipeline.transform(df)
        X = np.nan_to_num(X_raw.astype(np.float64), nan=0.0, posinf=10000.0, neginf=-10000.0)
        y = df["fraud_label"].to_numpy(dtype=int)

        # Scale for linear models with robust numerical bounds
        raw_scaled = self.scaler.fit_transform(X)
        X_scaled = np.nan_to_num(raw_scaled, nan=0.0, posinf=0.0, neginf=0.0)
        X_scaled = np.ascontiguousarray(np.clip(X_scaled, -5.0, 5.0), dtype=np.float64)

        self.lr_model.fit(X_scaled, y)
        self.rf_model.fit(X, y)
        self.xgb_model.fit(X, y)
        self.iso_forest.fit(X)

        self.is_trained = True
        return {
            "status": "TRAINED",
            "n_samples": len(df),
            "n_fraud": int(np.sum(y == 1)),
            "n_legit": int(np.sum(y == 0)),
            "features_count": len(self.feature_names)
        }

    def predict_risk(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, List[str]]:
        if not self.is_trained:
            # Fallback initialization with default features
            dummy = pd.DataFrame([{
                "amount": 100.0, "average_transaction_amount": 100.0, "account_age_days": 100.0,
                "device_age_days": 80.0, "device_change": 0, "location_change": 0, "transaction_velocity": 1,
                "previous_transaction_gap": 100.0, "behavioural_deviation": 10.0, "customer_risk_score": 20.0,
                "merchant_risk_score": 20.0, "hour_of_day": 12, "payment_channel": "CARD_NOT_PRESENT", "fraud_label": 0
            }, {
                "amount": 5000.0, "average_transaction_amount": 100.0, "account_age_days": 10.0,
                "device_age_days": 2.0, "device_change": 1, "location_change": 1, "transaction_velocity": 8,
                "previous_transaction_gap": 5.0, "behavioural_deviation": 90.0, "customer_risk_score": 85.0,
                "merchant_risk_score": 90.0, "hour_of_day": 3, "payment_channel": "WIRE", "fraud_label": 1
            }])
            self.train(dummy)

        X, _ = self.pipeline.transform(df)
        p_xgb = self.xgb_model.predict_proba(X)[:, 1]
        p_rf = self.rf_model.predict_proba(X)[:, 1]

        # Invert isolation forest score (-0.5 to 0.5) to pseudo-probability (0 to 1)
        iso_raw = self.iso_forest.score_samples(X)
        p_iso = 1.0 / (1.0 + np.exp(iso_raw * 12.0))

        w_xgb = self.weights.get("xgb", 0.50)
        w_rf = self.weights.get("rf", 0.35)
        w_iso = self.weights.get("iso", 0.15)
        total_w = w_xgb + w_rf + w_iso

        composite_prob = (w_xgb * p_xgb + w_rf * p_rf + w_iso * p_iso) / total_w
        scores = np.round(np.clip(composite_prob * 100.0, 0.0, 99.9), 1)

        t_low = self.thresholds.get("low_medium", 30.0)
        t_high = self.thresholds.get("medium_high", 70.0)

        decisions = []
        for s in scores:
            if s >= t_high:
                decisions.append("BLOCK")
            elif s >= t_low:
                decisions.append("REVIEW")
            else:
                decisions.append("ALLOW")

        return scores, np.array(decisions), self.feature_names

    def evaluate(self, df: pd.DataFrame) -> Dict[str, Any]:
        if df.empty or "fraud_label" not in df.columns:
            return {}

        scores, decisions, _ = self.predict_risk(df)
        y_true = df["fraud_label"].to_numpy(dtype=int)
        y_pred = (scores >= self.thresholds.get("medium_high", 70.0)).astype(int)

        cm = confusion_matrix(y_true, y_pred)
        tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)

        probs = scores / 100.0
        p_prec, p_rec, _ = precision_recall_curve(y_true, probs)
        pr_auc_val = float(auc(p_rec, p_prec)) if len(p_rec) > 1 else 0.0

        fpr_curve, tpr_curve, _ = roc_curve(y_true, probs)
        roc_pts = [{"fpr": round(float(f), 4), "tpr": round(float(t), 4)} for f, t in zip(fpr_curve[::max(1, len(fpr_curve)//20)], tpr_curve[::max(1, len(tpr_curve)//20)])]
        pr_pts = [{"recall": round(float(r), 4), "precision": round(float(p), 4)} for r, p in zip(p_rec[::max(1, len(p_rec)//20)], p_prec[::max(1, len(p_prec)//20)])]

        return {
            "model_name": "PAYGUARD-X Stacking Ensemble",
            "accuracy": round(float(np.mean(y_true == y_pred)), 4),
            "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
            "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
            "f1_score": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
            "roc_auc": round(float(roc_auc_score(y_true, probs)), 4) if len(np.unique(y_true)) > 1 else 0.5,
            "pr_auc": round(pr_auc_val, 4),
            "false_positive_rate": round(float(fp / (fp + tn + 1e-7)), 4),
            "false_negative_rate": round(float(fn / (fn + tp + 1e-7)), 4),
            "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
            "roc_curve": roc_pts,
            "pr_curve": pr_pts
        }

    def compare_all_models(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Evaluates Logistic Regression, Random Forest, XGBoost, Isolation Forest, and Ensemble.
        """
        X_raw, _ = self.pipeline.transform(df)
        X = np.nan_to_num(X_raw.astype(np.float64), nan=0.0, posinf=10000.0, neginf=-10000.0)
        raw_scaled = self.scaler.transform(X)
        X_scaled = np.nan_to_num(raw_scaled, nan=0.0, posinf=0.0, neginf=0.0)
        X_scaled = np.ascontiguousarray(np.clip(X_scaled, -5.0, 5.0), dtype=np.float64)
        y_true = df["fraud_label"].to_numpy(dtype=int)

        # 1. Logistic Regression
        lr_probs = self.lr_model.predict_proba(X_scaled)[:, 1]
        lr_pred = (lr_probs >= 0.5).astype(int)

        # 2. Random Forest
        rf_probs = self.rf_model.predict_proba(X)[:, 1]
        rf_pred = (rf_probs >= 0.5).astype(int)

        # 3. XGBoost
        xgb_probs = self.xgb_model.predict_proba(X)[:, 1]
        xgb_pred = (xgb_probs >= 0.5).astype(int)

        # 4. Isolation Forest
        iso_raw = self.iso_forest.score_samples(X)
        iso_probs = 1.0 / (1.0 + np.exp(iso_raw * 12.0))
        iso_pred = (iso_probs >= 0.6).astype(int)

        # 5. Ensemble
        ens_scores, _, _ = self.predict_risk(df)
        ens_probs = ens_scores / 100.0
        ens_pred = (ens_scores >= self.thresholds.get("medium_high", 70.0)).astype(int)

        models_eval = []
        for name, probs, preds in [
            ("Logistic Regression", lr_probs, lr_pred),
            ("Random Forest", rf_probs, rf_pred),
            ("XGBoost", xgb_probs, xgb_pred),
            ("Isolation Forest", iso_probs, iso_pred),
            ("PAYGUARD-X Ensemble", ens_probs, ens_pred)
        ]:
            cm = confusion_matrix(y_true, preds)
            tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)
            p_prec, p_rec, _ = precision_recall_curve(y_true, probs)
            pr_val = float(auc(p_rec, p_prec)) if len(p_rec) > 1 else 0.0

            models_eval.append({
                "model": name,
                "accuracy": round(float(np.mean(y_true == preds)), 4),
                "precision": round(float(precision_score(y_true, preds, zero_division=0)), 4),
                "recall": round(float(recall_score(y_true, preds, zero_division=0)), 4),
                "f1_score": round(float(f1_score(y_true, preds, zero_division=0)), 4),
                "roc_auc": round(float(roc_auc_score(y_true, probs)), 4) if len(np.unique(y_true)) > 1 else 0.5,
                "pr_auc": round(pr_val, 4),
                "false_positive_rate": round(float(fp / (fp + tn + 1e-7)), 4),
                "confusion_matrix": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)}
            })

        # Feature importances
        rf_imp = self.rf_model.feature_importances_
        xgb_imp = self.xgb_model.feature_importances_
        avg_imp = (rf_imp + xgb_imp) / 2.0
        feature_importance_list = [
            {"feature": self.feature_names[i], "importance": round(float(avg_imp[i]), 4)}
            for i in range(len(self.feature_names))
        ]
        feature_importance_list.sort(key=lambda x: x["importance"], reverse=True)

        return {
            "comparison": models_eval,
            "feature_importance": feature_importance_list,
            "ensemble_evaluation": self.evaluate(df)
        }

    def explain_transaction(self, df: pd.DataFrame) -> List[List[Dict[str, Any]]]:
        """
        Generates intuitive, actionable signal attribution / SHAP-style waterfall contributions per transaction.
        """
        X, fnames = self.pipeline.transform(df)
        rf_imp = self.rf_model.feature_importances_
        xgb_imp = self.xgb_model.feature_importances_
        weights = (rf_imp + xgb_imp) / 2.0

        all_explanations = []
        for row in X:
            contribs = []
            for idx in range(len(fnames)):
                feat_val = float(row[idx])
                # Non-linear signal scaling based on feature divergence
                sig_magnitude = np.tanh(feat_val / 25.0) if abs(feat_val) > 1.0 else feat_val
                points = float(weights[idx] * sig_magnitude * 85.0)
                # Form clean human-readable name
                clean_name = fnames[idx].replace("_", " ").title()
                contribs.append({
                    "feature": clean_name,
                    "raw_feature": fnames[idx],
                    "contribution_points": round(abs(points), 1),
                    "impact_direction": "INCREASES_RISK" if points >= 0 else "REDUCES_RISK",
                    "value": round(feat_val, 2)
                })

            contribs.sort(key=lambda x: x["contribution_points"], reverse=True)
            all_explanations.append(contribs[:6])

        return all_explanations
