import uuid
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from ml.taxonomy.attack_catalog import FULL_ATTACK_TAXONOMY, AttackScenario

PAYMENT_CHANNELS = ["CARD_NOT_PRESENT", "INSTANT_PAYMENT", "WIRE", "P2P", "QR_PAYMENT", "POS", "WEB_GATEWAY"]
MERCHANT_CATEGORIES = ["RETAIL", "TRAVEL", "GAMING", "CRYPTO", "LUXURY", "GROCERY", "UTILITIES", "FINANCIAL_SERVICES"]
CURRENCIES = ["USD", "EUR", "GBP", "SGD"]

class SyntheticTransactionGenerator:
    def __init__(self, seed: int = 42):
        self.rng = np.random.default_rng(seed)
        self.taxonomy = FULL_ATTACK_TAXONOMY

    def generate_dataset(
        self,
        n_samples: int = 5000,
        fraud_ratio: float = 0.10,
        attack_family_filter: Optional[str] = None,
        difficulty_modifier: float = 1.0
    ) -> pd.DataFrame:
        """
        Generates realistic synthetic payment telemetry with parametric distributions and non-trivial class overlap.
        """
        n_fraud = int(n_samples * fraud_ratio)
        n_legit = n_samples - n_fraud

        legit_df = self._generate_legitimate(n_legit)
        fraud_df = self._generate_fraud(n_fraud, attack_family_filter, difficulty_modifier)

        if len(legit_df) == 0 and len(fraud_df) == 0:
            return pd.DataFrame()
        elif len(legit_df) == 0:
            combined = fraud_df
        elif len(fraud_df) == 0:
            combined = legit_df
        else:
            combined = pd.concat([legit_df, fraud_df], ignore_index=True)

        return combined.sample(frac=1.0, random_state=int(self.rng.integers(0, 100000))).reset_index(drop=True)

    def _generate_legitimate(self, count: int) -> pd.DataFrame:
        if count <= 0:
            return pd.DataFrame()

        # Realistic parametric tenure distributions
        account_age = self.rng.gamma(shape=3.2, scale=110.0, size=count) + 30.0
        device_age = np.minimum(account_age, self.rng.gamma(shape=2.5, scale=85.0, size=count) + 15.0)

        # Realistic log-normal baseline transaction amounts (e.g. median ~$70, long tail up to thousands)
        avg_amount = self.rng.lognormal(mean=4.25, sigma=0.65, size=count)
        amount_noise = self.rng.lognormal(mean=0.0, sigma=0.32, size=count)
        amount = avg_amount * amount_noise
        amount_dev = np.abs(amount - avg_amount) / (avg_amount + 1e-5)

        # Legitimate behavioral deviation (mostly low, occasional organic variance)
        behavioural_dev = self.rng.beta(a=1.8, b=7.5, size=count) * 40.0

        # Normal transaction velocity (Poisson distributed, mean ~1.7/hr)
        velocity = self.rng.poisson(lam=1.7, size=count) + 1

        # Temporal pacing (exponential gap in minutes, average ~12 hours)
        gap_mins = self.rng.exponential(scale=680.0, size=count) + 8.0

        # Categorical choices
        channels = self.rng.choice(PAYMENT_CHANNELS, p=[0.28, 0.20, 0.08, 0.16, 0.12, 0.12, 0.04], size=count)
        categories = self.rng.choice(MERCHANT_CATEGORIES, p=[0.30, 0.10, 0.08, 0.03, 0.05, 0.24, 0.15, 0.05], size=count)
        hour_probs = np.array([
            0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.05,
            0.07, 0.08, 0.08, 0.08, 0.08, 0.07, 0.07, 0.07,
            0.06, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.01
        ])
        hour_probs = hour_probs / np.sum(hour_probs)
        hours = self.rng.choice(np.arange(24), p=hour_probs, size=count)

        base_time = datetime(2026, 3, 1, 0, 0, 0)
        timestamps = [base_time + timedelta(minutes=float(m), hours=int(h)) for m, h in zip(gap_mins, hours)]

        # Legitimate anomalies are rare (e.g. traveling, new phone)
        device_change = self.rng.binomial(1, 0.035, count)
        location_change = self.rng.binomial(1, 0.045, count)

        cust_risk = self.rng.beta(2.0, 9.0, count) * 35.0
        merch_risk = self.rng.beta(2.0, 7.5, count) * 38.0

        return pd.DataFrame({
            "transaction_id": [f"TX-LEGIT-{uuid.uuid4().hex[:8].upper()}" for _ in range(count)],
            "timestamp": timestamps,
            "amount": np.round(amount, 2),
            "currency": self.rng.choice(CURRENCIES, p=[0.70, 0.15, 0.10, 0.05], size=count),
            "payment_channel": channels,
            "merchant_category": categories,
            "merchant_risk_score": np.round(merch_risk, 1),
            "customer_risk_score": np.round(cust_risk, 1),
            "account_age_days": np.round(account_age, 1),
            "device_age_days": np.round(device_age, 1),
            "device_change": device_change,
            "location_change": location_change,
            "transaction_velocity": velocity,
            "average_transaction_amount": np.round(avg_amount, 2),
            "amount_deviation": np.round(amount_dev, 3),
            "behavioural_deviation": np.round(behavioural_dev, 2),
            "hour_of_day": hours,
            "previous_transaction_gap": np.round(gap_mins, 1),
            "attack_family": ["NONE"] * count,
            "attack_intensity": [0.0] * count,
            "fraud_label": [0] * count
        })

    def _generate_fraud(
        self,
        count: int,
        attack_family_filter: Optional[str] = None,
        difficulty_modifier: float = 1.0
    ) -> pd.DataFrame:
        if count <= 0:
            return pd.DataFrame()

        scenarios: List[AttackScenario] = list(self.taxonomy.values())
        if attack_family_filter:
            filtered = [s for s in scenarios if s.category.lower() == attack_family_filter.lower() or s.id.lower() == attack_family_filter.lower()]
            if filtered:
                scenarios = filtered

        chosen_scenarios = self.rng.choice(scenarios, size=count)
        avg_amount = self.rng.lognormal(mean=4.25, sigma=0.65, size=count)

        amounts = []
        channels = []
        device_changes = []
        location_changes = []
        velocities = []
        amount_devs = []
        beh_devs = []
        merch_risks = []
        cust_risks = []
        account_ages = []
        device_ages = []
        gaps = []
        hours = []
        intensities = []

        base_time = datetime(2026, 3, 1, 0, 0, 0)
        timestamps = []

        for i, sc in enumerate(chosen_scenarios):
            sim_params = sc.simulation_parameters
            mult = sim_params.get("amount_multiplier", 2.5)
            # As difficulty increases (stealthier), multiplier gets pulled closer to normal 1.0 - 1.5
            effective_mult = max(1.1, 1.0 + (mult - 1.0) / max(0.5, difficulty_modifier))
            amt = float(avg_amount[i] * effective_mult * self.rng.uniform(0.85, 1.25))
            amt_dev = abs(amt - avg_amount[i]) / (avg_amount[i] + 1e-5)
            amounts.append(round(amt, 2))
            amount_devs.append(round(amt_dev, 3))

            # Channel selection from attack scenario
            ch = self.rng.choice(sc.payment_channels) if sc.payment_channels else "CARD_NOT_PRESENT"
            channels.append(ch)

            # Device / Location anomaly probabilities
            p_dev = sim_params.get("device_anomaly", 0.7) / (1.0 + 0.3 * (difficulty_modifier - 1.0))
            device_changes.append(int(self.rng.binomial(1, np.clip(p_dev, 0.05, 0.95))))
            location_changes.append(int(self.rng.binomial(1, np.clip(p_dev * 0.85, 0.05, 0.90))))

            # Velocity
            v_factor = sim_params.get("velocity_factor", 3.0)
            effective_v = max(1.5, v_factor / max(0.6, difficulty_modifier**0.5))
            velocities.append(int(self.rng.poisson(lam=effective_v) + 2))

            # Behavioural deviation
            base_beh = sim_params.get("behavioural_dev_base", 75.0)
            adj_beh = base_beh / max(0.7, (difficulty_modifier ** 0.4))
            beh_devs.append(round(float(np.clip(self.rng.normal(adj_beh, 8.0), 10.0, 98.0)), 2))

            # Risks
            cust_risks.append(round(float(np.clip(self.rng.normal(65.0 / difficulty_modifier**0.2, 12.0), 20.0, 99.0)), 1))
            merch_risks.append(round(float(np.clip(self.rng.normal(70.0 / difficulty_modifier**0.2, 10.0), 25.0, 99.0)), 1))

            # Account & Device ages
            acc_age = float(self.rng.gamma(2.2, 80.0) + 10.0)
            dev_age = float(np.clip(self.rng.exponential(45.0) + 1.0, 0.5, acc_age))
            account_ages.append(round(acc_age, 1))
            device_ages.append(round(dev_age, 1))

            # Gap (compressed for fraud velocity attacks)
            gap = float(np.clip(self.rng.exponential(35.0 * difficulty_modifier) + 1.0, 0.5, 400.0))
            gaps.append(round(gap, 1))

            f_hour_probs = np.array([
                0.05, 0.06, 0.07, 0.08, 0.06, 0.04, 0.03, 0.03,
                0.03, 0.04, 0.04, 0.05, 0.05, 0.05, 0.04, 0.04,
                0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.05, 0.05
            ])
            f_hour_probs = f_hour_probs / np.sum(f_hour_probs)
            h = int(self.rng.choice(np.arange(24), p=f_hour_probs))
            hours.append(h)
            timestamps.append(base_time + timedelta(minutes=gap, hours=h))
            intensities.append(round(float(np.clip(sc.novelty_score * 1.5 / difficulty_modifier, 0.2, 2.5)), 2))

        return pd.DataFrame({
            "transaction_id": [f"TX-FRAUD-{uuid.uuid4().hex[:8].upper()}" for _ in range(count)],
            "timestamp": timestamps,
            "amount": amounts,
            "currency": self.rng.choice(CURRENCIES, p=[0.75, 0.12, 0.08, 0.05], size=count),
            "payment_channel": channels,
            "merchant_category": self.rng.choice(["CRYPTO", "LUXURY", "GAMING", "TRAVEL", "RETAIL", "FINANCIAL_SERVICES"], size=count),
            "merchant_risk_score": merch_risks,
            "customer_risk_score": cust_risks,
            "account_age_days": account_ages,
            "device_age_days": device_ages,
            "device_change": device_changes,
            "location_change": location_changes,
            "transaction_velocity": velocities,
            "average_transaction_amount": np.round(avg_amount, 2),
            "amount_deviation": amount_devs,
            "behavioural_deviation": beh_devs,
            "hour_of_day": hours,
            "previous_transaction_gap": gaps,
            "attack_family": [sc.category for sc in chosen_scenarios],
            "attack_intensity": intensities,
            "fraud_label": [1] * count
        })
