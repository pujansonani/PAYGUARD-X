#!/usr/bin/env python3
import sys
import os
import argparse
import json

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.models.ensemble import PayGuardEnsemble

def main():
    parser = argparse.ArgumentParser(description="PAYGUARD-X Model Trainer CLI")
    parser.add_argument("--samples", type=int, default=3000, help="Training dataset sample count")
    parser.add_argument("--fraud-ratio", type=float, default=0.12, help="Proportion of fraud in training data")
    parser.add_argument("--difficulty", type=float, default=1.0, help="Difficulty modifier for synthetic fraud")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")

    args = parser.parse_args()

    print("==========================================================")
    print("      PAYGUARD-X AI DEFENSE MODEL TRAINING PIPELINE      ")
    print("==========================================================")

    print(f"[*] Generating {args.samples} training transactions (Fraud Ratio: {args.fraud_ratio*100:.1f}%)...")
    gen = SyntheticTransactionGenerator(seed=args.seed)
    train_df = gen.generate_dataset(n_samples=args.samples, fraud_ratio=args.fraud_ratio, difficulty_modifier=args.difficulty)

    print(f"[*] Initializing and training Multi-Model Ensemble (LR + RF + XGBoost + Isolation Forest)...")
    ens = PayGuardEnsemble()
    train_res = ens.train(train_df)
    print(f"[+] Training complete: {train_res['n_samples']} samples ({train_res['n_fraud']} fraud, {train_res['n_legit']} legit)")

    print("\n[*] Evaluating multi-model benchmarks against holdout split...")
    test_df = gen.generate_dataset(n_samples=1000, fraud_ratio=args.fraud_ratio, difficulty_modifier=args.difficulty)
    comp = ens.compare_all_models(test_df)

    print("\n" + "="*80)
    print(f"{'Model Architecture':<30} | {'Accuracy':<8} | {'Precision':<9} | {'Recall':<8} | {'F1-Score':<8} | {'ROC-AUC':<8}")
    print("="*80)
    for m in comp["comparison"]:
        print(f"{m['model']:<30} | {m['accuracy']*100:>6.1f}% | {m['precision']*100:>7.1f}% | {m['recall']*100:>6.1f}% | {m['f1_score']*100:>6.1f}% | {m['roc_auc']:>8.4f}")
    print("="*80)

    print("\n[*] Top 5 Contributing Signals in Arbiter Stacking:")
    for feat in comp["feature_importance"][:5]:
        print(f"    - {feat['feature']:<30}: {feat['importance']:.4f}")

if __name__ == "__main__":
    main()
