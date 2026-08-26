import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Play, CheckCircle2, History, RotateCw, Sparkles, X, Layers, Award } from 'lucide-react';
import { api } from '../services/api';
import { Experiment } from '../types';

export const Experiments: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('Custom Stacking Experiment');
  const [datasetSize, setDatasetSize] = useState(1500);
  const [fraudRatio, setFraudRatio] = useState(0.15);
  const [difficulty, setDifficulty] = useState(1.0);
  const [attackFamily, setAttackFamily] = useState('ALL');
  const [notes, setNotes] = useState('Testing decision tree depth & isolation forest contamination');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      const res = await api.getExperiments();
      setExperiments(res.experiments);
    } catch (err) {
      console.error('Failed to load experiments:', err);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.createExperiment({
        name,
        dataset_size: datasetSize,
        fraud_ratio: fraudRatio,
        difficulty,
        attack_family: attackFamily,
        notes
      });
      await loadExperiments();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create experiment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-purple-950/40 via-[#070c18] to-cyan-950/40 border border-purple-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-purple-950/80 border border-purple-500/50 text-purple-400 rounded-full shadow-neon-purple">
              MLOPS EXPERIMENT TRACKER
            </span>
            <span className="text-xs text-slate-400 font-mono">REPRODUCIBILITY & AUDIT LOG</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            ML Research Experiments & Hyperparameters
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Maintains a full audit trail of model training runs, hyperparameters, dataset sizes, and precision/recall tradeoffs for scientific validation.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-purple flex items-center gap-2 transition hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>NEW EXPERIMENT RUN</span>
        </button>
      </div>

      {/* Experiments Table */}
      <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 shadow-glass-card backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Recorded Experiments ({experiments.length})
          </h2>
          <span className="text-[10px] font-mono text-slate-400">Ordered by most recent</span>
        </div>

        <div className="overflow-x-auto border border-white/10 rounded-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#030712] text-slate-400 uppercase text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5">Experiment ID</th>
                <th className="p-3.5">Name / Notes</th>
                <th className="p-3.5">Dataset Size</th>
                <th className="p-3.5">Threat Vector</th>
                <th className="p-3.5">Precision</th>
                <th className="p-3.5">Recall</th>
                <th className="p-3.5">F1-Score</th>
                <th className="p-3.5 text-right">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {experiments.map((exp) => (
                <tr key={exp.experiment_id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="p-3.5 font-bold text-cyan-400">{exp.experiment_id}</td>
                  <td className="p-3.5">
                    <span className="text-white font-sans font-bold block">{exp.name}</span>
                    <span className="text-[10px] text-slate-400 font-sans block truncate max-w-xs">{exp.notes}</span>
                  </td>
                  <td className="p-3.5 text-slate-300">{exp.dataset_size.toLocaleString()} TX</td>
                  <td className="p-3.5 text-amber-300 font-sans">{exp.attack_family}</td>
                  <td className="p-3.5 text-emerald-400 font-bold">{(exp.precision * 100).toFixed(1)}%</td>
                  <td className="p-3.5 text-cyan-400 font-bold">{(exp.recall * 100).toFixed(1)}%</td>
                  <td className="p-3.5 text-purple-400 font-bold">{(exp.f1 * 100).toFixed(1)}%</td>
                  <td className="p-3.5 text-right text-slate-200 font-bold">{exp.roc_auc.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Experiment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#070c18] border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-black text-white text-base">Launch New Stacking Experiment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400">EXPERIMENT NAME:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">DATASET SIZE:</label>
                  <input
                    type="number"
                    value={datasetSize}
                    onChange={(e) => setDatasetSize(Number(e.target.value))}
                    className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">FRAUD RATIO:</label>
                  <input
                    type="number"
                    step={0.01}
                    value={fraudRatio}
                    onChange={(e) => setFraudRatio(Number(e.target.value))}
                    className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">RESEARCH NOTES:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-white h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-mono text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-cyan"
              >
                {loading ? 'Training & Evaluating...' : 'Run Experiment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
