import pytest
from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.models.ensemble import PayGuardEnsemble
from ml.adversarial.mutator import AdversarialMutator
from ml.adversarial.arena import ArenaRunner

@pytest.fixture
def arena_setup():
    gen = SyntheticTransactionGenerator(seed=42)
    ens = PayGuardEnsemble()
    df = gen.generate_dataset(n_samples=500, fraud_ratio=0.15)
    ens.train(df)
    return ens, gen, df

def test_gap_analysis(arena_setup):
    ens, gen, df = arena_setup
    mutator = AdversarialMutator(ens, gen)
    analysis = mutator.analyze_blindspots(df)

    assert "missed_count" in analysis
    assert "evasion_rate" in analysis
    assert "primary_evasion_vector" in analysis

def test_adversarial_cycle(arena_setup):
    ens, gen, df = arena_setup
    mutator = AdversarialMutator(ens, gen)
    res = mutator.execute_adversarial_cycle(df, mutation_rate=0.35)

    assert "initial_missed_count" in res
    assert "mutated_sample_count" in res
    assert "adversarial_round_evaluation" in res
    assert "mutated_dataset" in res

def test_arena_runner_multi_round(arena_setup):
    ens, gen, df = arena_setup
    runner = ArenaRunner(ens, gen)
    battle = runner.run_battle(rounds=2, samples_per_round=400, fraud_ratio=0.15, retrain_between_rounds=True)

    assert battle["total_rounds"] == 2
    assert len(battle["rounds_history"]) == 2
    assert "net_adaptation_summary" in battle
    assert "final_recall" in battle["net_adaptation_summary"]
