import pytest
import pandas as pd
from ml.generators.synthetic_engine import SyntheticTransactionGenerator

@pytest.fixture
def generator():
    return SyntheticTransactionGenerator(seed=123)

def test_generate_dataset_shape(generator):
    df = generator.generate_dataset(n_samples=500, fraud_ratio=0.10)
    assert len(df) == 500
    assert "fraud_label" in df.columns
    assert "amount" in df.columns
    assert "transaction_velocity" in df.columns
    assert "behavioural_deviation" in df.columns
    assert "payment_channel" in df.columns
    assert "merchant_category" in df.columns

def test_fraud_ratio(generator):
    df = generator.generate_dataset(n_samples=1000, fraud_ratio=0.20)
    fraud_count = (df["fraud_label"] == 1).sum()
    assert 180 <= fraud_count <= 220

def test_attack_family_filter(generator):
    df = generator.generate_dataset(n_samples=300, fraud_ratio=0.30, attack_family_filter="Account Takeover")
    fraud_df = df[df["fraud_label"] == 1]
    assert len(fraud_df) > 0
    assert (fraud_df["attack_family"] == "Account Takeover").all()

def test_difficulty_modifier(generator):
    df_easy = generator.generate_dataset(n_samples=200, fraud_ratio=0.5, difficulty_modifier=1.0)
    df_hard = generator.generate_dataset(n_samples=200, fraud_ratio=0.5, difficulty_modifier=2.5)

    mean_beh_easy = df_easy[df_easy["fraud_label"] == 1]["behavioural_deviation"].mean()
    mean_beh_hard = df_hard[df_hard["fraud_label"] == 1]["behavioural_deviation"].mean()

    # Harder attacks should have lower (stealthier) behavioral deviations
    assert mean_beh_hard < mean_beh_easy
