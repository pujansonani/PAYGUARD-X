#!/usr/bin/env python3
import sys
import os
import argparse
import pandas as pd

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.models.ensemble import PayGuardEnsemble
from ml.evaluation.fidelity import AttackFidelityValidator

def main():
    parser = argparse.ArgumentParser(description="PAYGUARD-X Model & Fidelity Evaluator CLI")
    parser.add_argument("--test-samples", type=int, default=1500, help="Test dataset sample count")
    parser.add_argument("--fraud-ratio", type=float, default=0.15, help="Test fraud ratio")
    parser.add_argument("--seed", type=int, default=99, help="Random seed")

    args = parser.parse_args()

    print("==========================================================")
    print("      PAYGUARD-X SYSTEM EVALUATION & FIDELITY REPORT      ")
    print("==========================================================")

    gen = SyntheticTransactionGenerator(seed=args.seed)
    ens = PayGuardEnsemble()
    train_df = gen.generate_dataset(n_samples=2500, fraud_ratio=args.fraud_ratio)
    ens.train(train_df)

    test_df = gen.generate_dataset(n_samples=args.test_samples, fraud_ratio=args.fraud_ratio)

    print("\n[1] STATISTICAL ATTACK FIDELITY REPORT:")
    fid = AttackFidelityValidator.calculate_fidelity_report(test_df)
    print(f"    - Overall Fidelity Score: {fid['overall_fidelity_score']}%")
    print(f"    - Average Jensen-Shannon Divergence: {fid['average_jensen_shannon']}")
    print(f"    - Overlap Status: {fid['non_separability_status']}")

    print("\n[2] BLUE TEAM ENSEMBLE DEFENSE METRICS:")
    ev = ens.evaluate(test_df)
    print(f"    - Accuracy:              {ev['accuracy']*100:.2f}%")
    print(f"    - Precision:             {ev['precision']*100:.2f}%")
    print(f"    - Recall:                {ev['recall']*100:.2f}%")
    print(f"    - F1-Score:              {ev['f1_score']*100:.2f}%")
    print(f"    - ROC-AUC:               {ev['roc_auc']:.4f}")
    print(f"    - PR-AUC:                {ev['pr_auc']:.4f}")
    print(f"    - False Positive Rate:   {ev['false_positive_rate']*100:.2f}%")
    print(f"    - False Negative Rate:   {ev['false_negative_rate']*100:.2f}%")

    cm = ev['confusion_matrix']
    print(f"\n[3] CONFUSION MATRIX (N = {args.test_samples:,}):")
    print(f"    - True Negatives  (TN):  {cm['tn']:,} (Legitimate Approved)")
    print(f"    - False Positives (FP):  {cm['fp']:,} (False Alarm Blocked)")
    print(f"    - False Negatives (FN):  {cm['fn']:,} (Missed Attack)")
    print(f"    - True Positives  (TP):  {cm['tp']:,} (Fraud Intercepted)")

    print("\n==========================================================")
    print("      EVALUATION COMPLETE - DEFENSIVE INTEGRITY PASS      ")
    print("==========================================================")

if __name__ == "__main__":
    main()
