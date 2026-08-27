import axios from 'axios';
import {
  AttackScenario,
  TransactionPrediction,
  SyntheticTransaction,
  FidelityReport,
  ModelMetric,
  ArenaBattleResult,
  Experiment,
  GlobalMetrics,
  SystemSettings,
  JudgeModeResult
} from '../types';

let rawApiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
if (rawApiUrl && !rawApiUrl.startsWith('http://') && !rawApiUrl.startsWith('https://')) {
  rawApiUrl = `https://${rawApiUrl}`;
}
const API_BASE_URL = rawApiUrl;

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // System Health
  getHealth: async (): Promise<{ status: string; system: string; dataset_size: number }> => {
    const res = await client.get('/health');
    return res.data;
  },

  // Attack Intelligence
  getAttacks: async (category?: string, severity?: string): Promise<{
    total_scenarios: number;
    filtered_count: number;
    categories: string[];
    scenarios: AttackScenario[];
  }> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (severity) params.append('severity', severity);
    const res = await client.get(`/attacks?${params.toString()}`);
    return res.data;
  },

  getAttackDetail: async (id: string): Promise<AttackScenario> => {
    const res = await client.get(`/attacks/${id}`);
    return res.data;
  },

  // Synthetic Attack Generator
  generateAttacks: async (params: {
    n_samples: number;
    fraud_ratio: number;
    attack_family?: string;
    difficulty: number;
  }): Promise<{
    simulation_id: string;
    generated_count: number;
    fraud_count: number;
    legit_count: number;
    fidelity: FidelityReport;
    sample_preview: SyntheticTransaction[];
  }> => {
    const res = await client.post('/attacks/generate', params);
    return res.data;
  },

  getSimulations: async (): Promise<{ simulations: any[] }> => {
    const res = await client.get('/simulations');
    return res.data;
  },

  // Defense Center Live Inference
  detectTransaction: async (payload: Partial<SyntheticTransaction>): Promise<TransactionPrediction> => {
    const res = await client.post('/detect', payload);
    return res.data;
  },

  // Red vs Blue Adversarial Arena
  runAdversarialLoop: async (params: {
    rounds: number;
    samples_per_round: number;
    mutation_rate: number;
    attack_family?: string;
    retrain_between_rounds?: boolean;
  }): Promise<ArenaBattleResult> => {
    const res = await client.post('/adversarial/run', params);
    return res.data;
  },

  getAdversarialResults: async (): Promise<{ history: any[] }> => {
    const res = await client.get('/adversarial/results');
    return res.data;
  },

  // Model Performance & Comparison
  getModelPerformance: async (): Promise<{
    comparison: ModelMetric[];
    feature_importance: { feature: string; importance: number }[];
    ensemble_evaluation: any;
  }> => {
    const res = await client.get('/models/performance');
    return res.data;
  },

  // Transactions Explorer
  getTransactions: async (params?: {
    limit?: number;
    fraud_only?: boolean;
    category?: string;
  }): Promise<{
    total_records: number;
    returned: number;
    transactions: SyntheticTransaction[];
  }> => {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.fraud_only !== undefined) query.append('fraud_only', params.fraud_only.toString());
    if (params?.category) query.append('category', params.category);
    const res = await client.get(`/transactions?${query.toString()}`);
    return res.data;
  },

  // Experiments
  getExperiments: async (): Promise<{ experiments: Experiment[] }> => {
    const res = await client.get('/experiments');
    return res.data;
  },

  createExperiment: async (payload: {
    name: string;
    attack_family: string;
    dataset_size: number;
    fraud_ratio: number;
    difficulty: number;
    notes?: string;
  }): Promise<{ experiment: Experiment }> => {
    const res = await client.post('/experiments', payload);
    return res.data;
  },

  // Global Metrics
  getGlobalMetrics: async (): Promise<GlobalMetrics> => {
    const res = await client.get('/metrics');
    return res.data;
  },

  // Reports
  generateReport: async (): Promise<{ report_id: string; timestamp: string; content_markdown: string }> => {
    const res = await client.post('/reports');
    return res.data;
  },

  // Settings
  getSettings: async (): Promise<SystemSettings> => {
    const res = await client.get('/settings');
    return res.data;
  },

  updateSettings: async (payload: Partial<{
    threshold_low_medium: number;
    threshold_medium_high: number;
    weight_xgb: number;
    weight_rf: number;
    weight_iso: number;
  }>): Promise<{ status: string; thresholds: any; weights: any }> => {
    const res = await client.post('/settings', payload);
    return res.data;
  },

  // 1-Click Judge Mode Demo
  runJudgeMode: async (): Promise<JudgeModeResult> => {
    const res = await client.get('/demo/judge-mode');
    return res.data;
  },
};
