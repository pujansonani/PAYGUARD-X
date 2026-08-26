# pyrefly: ignore [missing-import]
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.models.ensemble import PayGuardEnsemble

class AdversarialMutator:
    """
    Performs safe synthetic telemetry mutations on false negative transactions (missed detections)
    to generate harder adversarial evasions and probe defense blindspots.
    """

    def __init__(self, ensemble: PayGuardEnsemble, generator: SyntheticTransactionGenerator, seed: int = 42):
        self.ensemble = ensemble
        self.generator = generator
        self.rng = np.random.default_rng(seed)

    def analyze_blindspots(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Identifies systemic feature characteristics in missed fraud transactions.
        """
        scores, decisions, _ = self.ensemble.predict_risk(df)
        fn_mask = (df["fraud_label"] == 1) & (decisions != "BLOCK")
        missed = df[fn_mask]

        if len(missed) == 0:
            return {
                "missed_count": 0,
                "evasion_rate": 0.0,
                "primary_evasion_vector": "NONE",
                "weak_features": []
            }

        # Analyze average feature properties of missed vs detected fraud
        tp_mask = (df["fraud_label"] == 1) & (decisions == "BLOCK")
        detected = df[tp_mask]

        weak_features = []
        for feat in ["amount_deviation", "behavioural_deviation", "transaction_velocity", "customer_risk_score", "merchant_risk_score"]:
            if feat in df.columns:
                m_mean = float(missed[feat].mean())
                d_mean = float(detected[feat].mean()) if len(detected) > 0 else m_mean
                weak_features.append({
                    "feature": feat.replace("_", " ").title(),
                    "missed_mean": round(m_mean, 2),
                    "detected_mean": round(d_mean, 2),
                    "evasion_gap": round(abs(d_mean - m_mean), 2)
                })

        weak_features.sort(key=lambda x: x["evasion_gap"], reverse=True)

        return {
            "missed_count": len(missed),
            "evasion_rate": round(len(missed) / max(1, len(df[df["fraud_label"] == 1])), 4),
            "primary_evasion_vector": weak_features[0]["feature"] if weak_features else "Multi-Feature Mimicry",
            "weak_features": weak_features
        }

    def execute_adversarial_cycle(
        self,
        base_df: pd.DataFrame,
        mutation_rate: float = 0.30,
        strategy: str = "MULTI_VECTOR_EVASION"
    ) -> Dict[str, Any]:
        """
        Executes one adversarial mutation cycle on missed transactions.
        """
        scores, decisions, _ = self.ensemble.predict_risk(base_df)
        fn_mask = (base_df["fraud_label"] == 1) & (decisions != "BLOCK")
        missed = base_df[fn_mask].copy()

        # If zero missed, sample lowest-scoring fraud to continue co-evolution
        if len(missed) == 0:
            fraud_only = base_df[base_df["fraud_label"] == 1]
            if len(fraud_only) > 0:
                missed = fraud_only.head(max(5, int(len(fraud_only) * 0.2))).copy()
            else:
                missed = self.generator.generate_dataset(50, fraud_ratio=1.0)

        mutated = missed.copy()
        n_mut = len(mutated)

        # 1. Amount Mimicry Mutation (stealthy scaling toward legitimate average)
        amount_scale = self.rng.uniform(0.70, 0.95, size=n_mut)
        mutated["amount"] = np.round(mutated["amount"] * amount_scale, 2)
        if "average_transaction_amount" in mutated.columns:
            mutated["amount_deviation"] = np.round(
                np.abs(mutated["amount"] - mutated["average_transaction_amount"]) / (mutated["average_transaction_amount"] + 1e-4),
                3
            )

        # 2. Behavioral Smoothing (lowering behavioral deviation to avoid spike detection)
        mutated["behavioural_deviation"] = np.round(
            np.clip(mutated["behavioural_deviation"] * (1.0 - mutation_rate * 0.8), 8.0, 95.0),
            2
        )

        # 3. Velocity Dispersion (pacing transactions to avoid threshold alarms)
        mutated["transaction_velocity"] = np.maximum(
            1,
            np.round(mutated["transaction_velocity"] * (1.0 - mutation_rate * 0.6)).astype(int)
        )

        # 4. Temporal Pacing (expanding gap between transactions)
        if "previous_transaction_gap" in mutated.columns:
            mutated["previous_transaction_gap"] = np.round(
                mutated["previous_transaction_gap"] * self.rng.uniform(1.4, 2.8, size=n_mut),
                1
            )

        # 5. Device Masking Jitter
        if "device_change" in mutated.columns:
            flip_mask = self.rng.binomial(1, mutation_rate * 0.5, size=n_mut)
            mutated["device_change"] = np.where(flip_mask == 1, 0, mutated["device_change"])

        # Control Legitimate Stream for balanced round evaluation
        legit_control = self.generator.generate_dataset(n_samples=len(mutated) * 4, fraud_ratio=0.0)
        round_dataset = pd.concat([legit_control, mutated], ignore_index=True).sample(frac=1.0).reset_index(drop=True)

        blindspots = self.analyze_blindspots(base_df)
        round_eval = self.ensemble.evaluate(round_dataset)

        return {
            "initial_missed_count": len(missed),
            "mutated_sample_count": len(mutated),
            "mutation_rate_applied": mutation_rate,
            "strategy": strategy,
            "blindspots_analysis": blindspots,
            "adversarial_round_evaluation": round_eval,
            "mutated_dataset": round_dataset
        }
