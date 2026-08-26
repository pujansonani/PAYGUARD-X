import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from ml.generators.synthetic_engine import SyntheticTransactionGenerator
from ml.models.ensemble import PayGuardEnsemble
from ml.adversarial.mutator import AdversarialMutator

class ArenaRunner:
    """
    Coordinates multi-round Red Team vs Blue Team battles, recording adversarial co-evolution metrics.
    """

    def __init__(self, ensemble: PayGuardEnsemble, generator: SyntheticTransactionGenerator):
        self.ensemble = ensemble
        self.generator = generator
        self.mutator = AdversarialMutator(ensemble, generator)

    def run_battle(
        self,
        rounds: int = 3,
        samples_per_round: int = 1000,
        fraud_ratio: float = 0.15,
        base_mutation_rate: float = 0.30,
        attack_family: Optional[str] = None,
        retrain_between_rounds: bool = True
    ) -> Dict[str, Any]:
        history: List[Dict[str, Any]] = []
        cumulative_dataset: List[pd.DataFrame] = []

        for r in range(1, rounds + 1):
            # Adversary increases stealth & difficulty per round
            difficulty = 1.0 + (r - 1) * 0.35
            cur_mutation_rate = min(0.65, base_mutation_rate + (r - 1) * 0.08)

            # Red Team generates batch
            red_batch = self.generator.generate_dataset(
                n_samples=samples_per_round,
                fraud_ratio=fraud_ratio,
                attack_family_filter=attack_family,
                difficulty_modifier=difficulty
            )

            # Execute adversarial cycle & gap analysis
            cycle_result = self.mutator.execute_adversarial_cycle(
                red_batch,
                mutation_rate=cur_mutation_rate,
                strategy=f"ADAPTIVE_ROUND_{r}_EVASION"
            )

            round_eval = cycle_result["adversarial_round_evaluation"]
            missed_count = cycle_result["initial_missed_count"]
            mutated_count = cycle_result["mutated_sample_count"]

            history.append({
                "round": r,
                "difficulty_level": round(difficulty, 2),
                "mutation_rate": round(cur_mutation_rate, 2),
                "samples_evaluated": samples_per_round,
                "initial_missed": missed_count,
                "mutated_samples": mutated_count,
                "precision": round_eval.get("precision", 0.0),
                "recall": round_eval.get("recall", 0.0),
                "f1_score": round_eval.get("f1_score", 0.0),
                "roc_auc": round_eval.get("roc_auc", 0.0),
                "pr_auc": round_eval.get("pr_auc", 0.0),
                "false_positive_rate": round_eval.get("false_positive_rate", 0.0),
                "confusion_matrix": round_eval.get("confusion_matrix", {}),
                "primary_evasion_vector": cycle_result["blindspots_analysis"].get("primary_evasion_vector", "None")
            })

            # If retraining is enabled, Blue Team ingests the adversarial batch into its defense model
            if retrain_between_rounds:
                cumulative_dataset.append(cycle_result["mutated_dataset"])
                full_train_set = pd.concat(cumulative_dataset, ignore_index=True)
                self.ensemble.train(full_train_set)

        # Calculate adaptation delta
        first_r = history[0]
        last_r = history[-1]
        delta_recall = round(last_r["recall"] - first_r["recall"], 4)
        delta_f1 = round(last_r["f1_score"] - first_r["f1_score"], 4)

        return {
            "total_rounds": rounds,
            "rounds_history": history,
            "net_adaptation_summary": {
                "initial_recall": first_r["recall"],
                "final_recall": last_r["recall"],
                "delta_recall": delta_recall,
                "initial_f1": first_r["f1_score"],
                "final_f1": last_r["f1_score"],
                "delta_f1": delta_f1,
                "co_evolution_status": "DEFENSE_HARDENING_CONFIRMED" if last_r["recall"] >= first_r["recall"] else "ADVERSARY_FRONTIER_ADVANCED"
            }
        }
