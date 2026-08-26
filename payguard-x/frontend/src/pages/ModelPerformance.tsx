import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Activity, Award, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ConfusionMatrixView } from '../components/ConfusionMatrixView';
import { api } from '../services/api';
import { ModelMetric } from '../types';

export const ModelPerformance: React.FC = () => {
  const [comparison, setComparison] = useState<ModelMetric[]>([]);
  const [featureImportance, setFeatureImportance] = useState<{ feature: string; importance: number }[]>([]);
  const [ensembleEval, setEnsembleEval] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<string>('PAYGUARD-X Ensemble');
  const [loading, setLoading] = useState<boolean>(true);
  const [curveView, setCurveView] = useState<'ROC' | 'PR'>('ROC');

  useEffect(() => {
    loadPerformance();
  }, []);

  const loadPerformance = async () => {
    setLoading(true);
    try {
      const data = await api.getModelPerformance();
      setComparison(data.comparison || []);
      setFeatureImportance(data.feature_importance || []);
      setEnsembleEval(data.ensemble_evaluation || null);
    } catch (err) {
      console.error('Failed to load model performance:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeModelMetric = comparison.find((m) => m.model === selectedModel) || comparison[comparison.length - 1];

  const rocData = ensembleEval?.roc_curve || [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.02, tpr: 0.88 },
    { fpr: 0.05, tpr: 0.95 },
    { fpr: 0.1, tpr: 0.98 },
    { fpr: 1.0, tpr: 1.0 }
  ];

  const prData = ensembleEval?.pr_curve || [
    { recall: 0.0, precision: 1.0 },
    { recall: 0.88, precision: 0.98 },
    { recall: 0.95, precision: 0.95 },
    { recall: 0.98, precision: 0.90 },
    { recall: 1.0, precision: 0.15 }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-cyan-950/40 via-[#070c18] to-purple-950/40 border border-cyan-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 rounded-full shadow-neon-cyan">
              SCIENTIFIC BENCHMARKING
            </span>
            <span className="text-xs text-slate-400 font-mono">5 ARCHITECTURES EVALUATED</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            Multi-Model Comparative Benchmarks
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Evaluates baseline algorithms against the PAYGUARD-X Stacking Arbiter across Precision, Recall, F1-Score, ROC-AUC, PR-AUC, and False Positive Rates on identical test splits without data leakage.
          </p>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 shadow-glass-card backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Award className="h-4 w-4 text-cyan-400" />
            <span>Comparative Architecture Matrix</span>
          </h2>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
            TEST SET METRICS
          </span>
        </div>

        <div className="overflow-x-auto border border-white/10 rounded-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#030712] text-slate-400 uppercase text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5">Architecture</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">Precision</th>
                <th className="p-3.5">Recall</th>
                <th className="p-3.5">F1-Score</th>
                <th className="p-3.5">ROC-AUC</th>
                <th className="p-3.5">PR-AUC</th>
                <th className="p-3.5 text-right">False Positive Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparison.map((m) => {
                const isSelected = selectedModel === m.model;
                const isEnsemble = m.model.includes('Ensemble');
                return (
                  <tr
                    key={m.model}
                    onClick={() => setSelectedModel(m.model)}
                    className={`cursor-pointer transition-colors ${
                      isEnsemble
                        ? 'bg-gradient-to-r from-cyan-950/40 to-[#071326]/60 text-cyan-300 font-bold border-l-2 border-cyan-400'
                        : isSelected
                        ? 'bg-white/[0.04]'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="p-3.5 flex items-center gap-2">
                      {isEnsemble && <Sparkles className="h-3.5 w-3.5 text-cyan-400" />}
                      <span className={isEnsemble ? 'text-cyan-300 font-black' : 'text-white'}>{m.model}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-emerald-400 font-bold">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-cyan-400 font-bold">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-purple-400 font-bold">{(m.f1_score * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-slate-300">{m.roc_auc.toFixed(4)}</td>
                    <td className="p-3.5 text-slate-300">{m.pr_auc.toFixed(4)}</td>
                    <td className="p-3.5 text-right font-bold text-red-400">{(m.false_positive_rate * 100).toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout: Curve Visualizer & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ROC / PR Curve Chart */}
        <div className="lg:col-span-7 p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 shadow-glass-card backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                {curveView === 'ROC' ? 'Receiver Operating Characteristic (ROC-AUC)' : 'Precision-Recall Curve (PR-AUC)'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Threshold trade-off curves evaluated on full test split</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#030712] rounded-xl border border-white/10 font-mono text-xs">
              <button
                onClick={() => setCurveView('ROC')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  curveView === 'ROC' ? 'bg-cyan-500 text-slate-950 shadow-neon-cyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                ROC Curve
              </button>
              <button
                onClick={() => setCurveView('PR')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  curveView === 'PR' ? 'bg-purple-500 text-slate-950 shadow-neon-purple' : 'text-slate-400 hover:text-white'
                }`}
              >
                PR Curve
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {curveView === 'ROC' ? (
                <LineChart data={rocData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="fpr" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <YAxis domain={[0, 1.05]} stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070c18',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono'
                    }}
                  />
                  <Line type="monotone" dataKey="tpr" stroke="#00F0FF" strokeWidth={3} name="True Positive Rate" />
                </LineChart>
              ) : (
                <LineChart data={prData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="recall" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <YAxis domain={[0, 1.05]} stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070c18',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono'
                    }}
                  />
                  <Line type="monotone" dataKey="precision" stroke="#8B5CF6" strokeWidth={3} name="Precision" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Model Confusion Matrix View */}
        <div className="lg:col-span-5">
          {activeModelMetric ? (
            <ConfusionMatrixView
              matrix={activeModelMetric.confusion_matrix}
              title={`${activeModelMetric.model} Confusion Matrix`}
            />
          ) : (
            <div className="p-8 bg-[#070c18] border border-white/10 rounded-3xl text-center text-slate-500 font-mono text-xs">
              Loading confusion matrix...
            </div>
          )}
        </div>
      </div>

      {/* Global Feature Importance Ranking Card */}
      {featureImportance.length > 0 && (
        <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 shadow-glass-card backdrop-blur-xl">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Global Gini / Gain Feature Importance Ranking
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureImportance.slice(0, 8)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#64748b"
                  width={160}
                  tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070c18',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '1rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono'
                  }}
                />
                <Bar dataKey="importance" fill="#00F0FF" radius={[0, 8, 8, 0]} name="Gain Importance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
