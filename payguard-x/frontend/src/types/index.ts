export type PaymentChannel =
  | 'CARD_NOT_PRESENT'
  | 'INSTANT_PAYMENT'
  | 'WIRE'
  | 'P2P'
  | 'QR_PAYMENT'
  | 'POS'
  | 'WEB_GATEWAY';

export type MerchantCategory =
  | 'RETAIL'
  | 'TRAVEL'
  | 'GAMING'
  | 'CRYPTO'
  | 'LUXURY'
  | 'GROCERY'
  | 'UTILITIES'
  | 'FINANCIAL_SERVICES';

export interface AttackScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  payment_channels: PaymentChannel[];
  attack_surface: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  novelty_score: number;
  difficulty: number;
  observable_signals: string[];
  simulation_parameters: Record<string, any>;
  detection_features: string[];
  blindspot_profile?: string;
}

export interface FeatureContribution {
  feature: string;
  raw_feature?: string;
  contribution_points: number;
  impact_direction?: string;
  value: number;
}

export interface TransactionPrediction {
  transaction_id: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommended_action: 'ALLOW' | 'REVIEW' | 'BLOCK';
  top_contributing_features: FeatureContribution[];
  model_timestamp?: string;
}

export interface SyntheticTransaction {
  transaction_id: string;
  timestamp: string;
  amount: number;
  currency: string;
  payment_channel: PaymentChannel;
  merchant_category: MerchantCategory;
  merchant_risk_score: number;
  customer_risk_score: number;
  account_age_days: number;
  device_age_days: number;
  device_change: number;
  location_change: number;
  transaction_velocity: number;
  average_transaction_amount: number;
  amount_deviation: number;
  behavioural_deviation: number;
  hour_of_day: number;
  previous_transaction_gap: number;
  attack_family: string;
  attack_intensity?: number;
  fraud_label: number;
  risk_score?: number;
  prediction?: string;
}

export interface FidelityFeatureMetric {
  wasserstein_distance: number;
  jensen_shannon_div: number;
  legit_mean: number;
  fraud_mean: number;
  legit_std: number;
  fraud_std: number;
}

export interface FidelityReport {
  overall_fidelity_score: number;
  average_jensen_shannon: number;
  non_separability_status: string;
  feature_metrics: Record<string, FidelityFeatureMetric>;
  sample_counts: {
    legitimate: number;
    fraud: number;
  };
  statistical_overlap_summary?: string;
}

export interface ConfusionMatrix {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}

export interface ModelMetric {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  false_positive_rate: number;
  confusion_matrix: ConfusionMatrix;
}

export interface ArenaRound {
  round: number;
  difficulty_level: number;
  mutation_rate: number;
  samples_evaluated: number;
  initial_missed: number;
  mutated_samples: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  false_positive_rate: number;
  confusion_matrix: ConfusionMatrix;
  primary_evasion_vector: string;
}

export interface ArenaBattleResult {
  total_rounds: number;
  rounds_history: ArenaRound[];
  net_adaptation_summary: {
    initial_recall: number;
    final_recall: number;
    delta_recall: number;
    initial_f1: number;
    final_f1: number;
    delta_f1: number;
    co_evolution_status: string;
  };
}

export interface Experiment {
  experiment_id: string;
  timestamp: string;
  name: string;
  dataset_size: number;
  attack_family: string;
  model: string;
  parameters: Record<string, any>;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
  false_positive_rate: number;
  notes?: string;
}

export interface GlobalMetrics {
  total_attack_scenarios: number;
  active_attack_families: number;
  synthetic_dataset_size: number;
  fidelity_score: number;
  average_jensen_shannon: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  false_positive_rate: number;
  confusion_matrix: ConfusionMatrix;
}

export interface SystemSettings {
  thresholds: {
    low_medium: number;
    medium_high: number;
  };
  weights: {
    xgb: number;
    rf: number;
    iso: number;
  };
  active_features: string[];
}

export interface JudgeModeResult {
  judge_mode_id: string;
  timestamp: string;
  step_1_threat_intel: {
    title: string;
    total_scenarios: number;
    families_count: number;
    sample_scenario: string;
  };
  step_2_synthetic_generation: {
    title: string;
    samples_generated: number;
    fidelity_score: number;
    jensen_shannon_div: number;
    status: string;
  };
  step_3_blue_defense: {
    title: string;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    fpr: number;
  };
  step_4_gap_analysis: {
    title: string;
    missed_count: number;
    primary_evasion_vector: string;
    weak_features: {
      feature: string;
      missed_mean: number;
      detected_mean: number;
      evasion_gap: number;
    }[];
  };
  step_5_adaptive_evolution: {
    title: string;
    rounds_executed: number;
    initial_recall: number;
    evolved_recall: number;
    evolved_f1: number;
    rounds_progression: ArenaRound[];
    net_adaptation: {
      initial_recall: number;
      final_recall: number;
      delta_recall: number;
      initial_f1: number;
      final_f1: number;
      delta_f1: number;
      co_evolution_status: string;
    };
  };
  demonstration_verdict: string;
  narrative: string;
}
