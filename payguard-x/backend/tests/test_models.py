import pytest
import pandas as pd
from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.models.ensemble import PayGuardEnsemble

@pytest.fixture
def trained_ensemble():
    gen = SyntheticTransactionGenerator(seed=42)
    df = gen.generate_dataset(n_samples=600, fraud_ratio=0.15)
    ens = PayGuardEnsemble()
    ens.train(df)
    return ens, gen, df

def test_ensemble_training_and_scoring(trained_ensemble):
    ens, gen, df = trained_ensemble
    assert ens.is_trained

    test_df = gen.generate_dataset(n_samples=200, fraud_ratio=0.20)
    scores, decisions, fnames = ens.predict_risk(test_df)

    assert len(scores) == 200
    assert len(decisions) == 200
    assert all(0.0 <= s <= 100.0 for s in scores)
    assert all(d in ["ALLOW", "REVIEW", "BLOCK"] for d in decisions)

def test_ensemble_evaluation_metrics(trained_ensemble):
    ens, gen, df = trained_ensemble
    eval_res = ens.evaluate(df)

    assert "precision" in eval_res
    assert "recall" in eval_res
    assert "f1_score" in eval_res
    assert "roc_auc" in eval_res
    assert "false_positive_rate" in eval_res
    assert "confusion_matrix" in eval_res

def test_model_comparison(trained_ensemble):
    ens, gen, df = trained_ensemble
    comp_res = ens.compare_all_models(df)

    assert "comparison" in comp_res
    assert len(comp_res["comparison"]) == 5
    model_names = [m["model"] for m in comp_res["comparison"]]
    assert "Logistic Regression" in model_names
    assert "Random Forest" in model_names
    assert "XGBoost" in model_names
    assert "Isolation Forest" in model_names
    assert "PAYGUARD-X Ensemble" in model_names

def test_explainability_contributions(trained_ensemble):
    ens, gen, df = trained_ensemble
    sample_df = df.head(5)
    explanations = ens.explain_transaction(sample_df)

    assert len(explanations) == 5
    for row_contribs in explanations:
        assert len(row_contribs) > 0
        assert "feature" in row_contribs[0]
        assert "contribution_points" in row_contribs[0]
