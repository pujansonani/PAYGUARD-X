#!/usr/bin/env python3
import sys
import os
import argparse
import json

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.evaluation.fidelity import AttackFidelityValidator

def main():
    parser = argparse.ArgumentParser(description="PAYGUARD-X Synthetic Data Generator CLI")
    parser.add_argument("--samples", type=int, default=3000, help="Total number of transaction samples")
    parser.add_argument("--fraud-ratio", type=float, default=0.15, help="Proportion of fraudulent transactions (0.01 - 0.90)")
    parser.add_argument("--family", type=str, default=None, help="Target attack family (optional)")
    parser.add_argument("--difficulty", type=float, default=1.0, help="Evasion stealth difficulty modifier (0.5 - 3.0)")
    parser.add_argument("--output", type=str, default="data/synthetic_transactions.csv", help="Output file path (CSV or JSON)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")

    args = parser.parse_args()

    print(f"[*] Initializing Synthetic Transaction Generator (Seed: {args.seed})...")
    gen = SyntheticTransactionGenerator(seed=args.seed)

    print(f"[*] Generating {args.samples} transactions (Fraud Ratio: {args.fraud_ratio*100:.1f}%, Family: {args.family or 'ALL'}, Difficulty: {args.difficulty}x)...")
    df = gen.generate_dataset(
        n_samples=args.samples,
        fraud_ratio=args.fraud_ratio,
        attack_family_filter=args.family,
        difficulty_modifier=args.difficulty
    )

    print(f"[+] Successfully generated {len(df)} transactions:")
    print(f"    - Legitimate: {(df['fraud_label'] == 0).sum():,}")
    print(f"    - Fraudulent: {(df['fraud_label'] == 1).sum():,}")

    print("\n[*] Validating Attack Fidelity & Non-Separability...")
    report = AttackFidelityValidator.calculate_fidelity_report(df)
    print(f"    - Fidelity Score: {report['overall_fidelity_score']}%")
    print(f"    - Average Jensen-Shannon Divergence: {report['average_jensen_shannon']}")
    print(f"    - Status: {report['non_separability_status']}")

    out_dir = os.path.dirname(args.output)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    if args.output.endswith(".json"):
        df.to_json(args.output, orient="records", indent=2)
    else:
        df.to_csv(args.output, index=False)

    print(f"\n[+] Saved dataset to: {args.output}")

if __name__ == "__main__":
    main()
