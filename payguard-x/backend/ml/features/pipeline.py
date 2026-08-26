import numpy as np
import pandas as pd
from typing import Tuple, List

FEATURE_COLUMNS = [
    "amount",
    "amount_to_avg_ratio",
    "amount_deviation",
    "account_age_days",
    "device_age_days",
    "device_change",
    "location_change",
    "transaction_velocity",
    "previous_transaction_gap",
    "velocity_to_gap_ratio",
    "behavioural_deviation",
    "customer_risk_score",
    "merchant_risk_score",
    "risk_composite_interaction",
    "hour_of_day",
    "is_night_transaction",
    "is_card_not_present",
    "is_instant_wire"
]

class FeaturePipeline:
    def transform(self, df: pd.DataFrame) -> Tuple[np.ndarray, List[str]]:
        d = df.copy()

        # Engineered interaction features
        avg_amt = d["average_transaction_amount"] if "average_transaction_amount" in d.columns else d["amount"]
        d["amount_to_avg_ratio"] = d["amount"] / (avg_amt + 1e-4)

        if "amount_deviation" not in d.columns:
            d["amount_deviation"] = np.abs(d["amount"] - avg_amt) / (avg_amt + 1e-4)

        gap = d["previous_transaction_gap"] if "previous_transaction_gap" in d.columns else 120.0
        d["velocity_to_gap_ratio"] = (d["transaction_velocity"] * 60.0) / (gap + 1.0)

        cust_r = d["customer_risk_score"] if "customer_risk_score" in d.columns else 25.0
        merch_r = d["merchant_risk_score"] if "merchant_risk_score" in d.columns else 30.0
        d["risk_composite_interaction"] = (cust_r * merch_r) / 100.0

        hours = d["hour_of_day"] if "hour_of_day" in d.columns else 14
        d["is_night_transaction"] = ((hours >= 0) & (hours <= 5)).astype(float)

        channels = d["payment_channel"] if "payment_channel" in d.columns else "CARD_NOT_PRESENT"
        d["is_card_not_present"] = (channels == "CARD_NOT_PRESENT").astype(float)
        d["is_instant_wire"] = ((channels == "INSTANT_PAYMENT") | (channels == "WIRE")).astype(float)

        # Fill any missing columns with defaults
        for col in FEATURE_COLUMNS:
            if col not in d.columns:
                d[col] = 0.0

        X = d[FEATURE_COLUMNS].to_numpy(dtype=np.float32)
        X_clean = np.nan_to_num(X, nan=0.0, posinf=10000.0, neginf=-10000.0)
        X_clean = np.clip(X_clean, -10000.0, 10000.0)
        return X_clean, FEATURE_COLUMNS
