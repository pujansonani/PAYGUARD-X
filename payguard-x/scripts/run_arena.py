#!/usr/bin/env python3
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.models.ensemble import PayGuardEnsemble
from ml.adversarial.mutator import AdversarialMutator

print("=== PAYGUARD-X ARENA RUNNER ===")
gen = SyntheticTransactionGenerator()
ens = PayGuardEnsemble()
ens.train(gen.generate_dataset(3000, 0.10))
mut = AdversarialMutator(ens, gen)

for r in range(1, 4):
    res = mut.execute_adversarial_cycle(gen.generate_dataset(1000, 0.15, difficulty_modifier=1.0 + r*0.25))
    print(f"Round {r} | Missed: {res['initial_missed_count']} | Mutated: {res['mutated_sample_count']} | Recall: {res['adversarial_round_evaluation']['recall']*100:.1f}%")
print("=== COMPLETE ===")
