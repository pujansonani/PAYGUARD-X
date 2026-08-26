import pytest
from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.evaluation.fidelity import AttackFidelityValidator

def test_fidelity_report():
    gen = SyntheticTransactionGenerator(seed=42)
    df = gen.generate_dataset(n_samples=500, fraud_ratio=0.15)
    report = AttackFidelityValidator.calculate_fidelity_report(df)

    assert "overall_fidelity_score" in report
    assert 50.0 <= report["overall_fidelity_score"] <= 100.0
    assert "average_jensen_shannon" in report
    assert "feature_metrics" in report
    assert len(report["feature_metrics"]) > 0
    assert "non_separability_status" in report
