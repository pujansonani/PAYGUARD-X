import React, { useState } from 'react';
import {
  Flame,
  Download,
  Play,
  Sliders,
  CheckCircle2,
  RotateCw,
  FileSpreadsheet,
  FileJson,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { api } from '../services/api';
import { FidelityReport, SyntheticTransaction } from '../types';

interface AttackGeneratorProps {
  onNavigate: (viewId: string) => void;
}

export const AttackGenerator: React.FC<AttackGeneratorProps> = ({ onNavigate }) => {
  const [nSamples, setNSamples] = useState<number>(1500);
  const [fraudRatio, setFraudRatio] = useState<number>(0.15);
  const [attackFamily, setAttackFamily] = useState<string>('ALL');
  const [difficulty, setDifficulty] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<SyntheticTransaction[]>([]);
  const [fidelity, setFidelity] = useState<FidelityReport | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const categories = [
    'ALL',
    'Social Engineering',
    'Phishing / Smishing',
    'Voice / Deepfake',
    'Account Takeover',
    'Synthetic Identity',
    'Transaction Manipulation',
    'Digital Payment',
    'Automated Fraud',
    'Network Fraud',
    'Cross-Channel'
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateAttacks({
        n_samples: nSamples,
        fraud_ratio: fraudRatio,
        attack_family: attackFamily === 'ALL' ? undefined : attackFamily,
        difficulty: difficulty
      });
      setSummary(res);
      setFidelity(res.fidelity);
      setPreview(res.sample_preview);
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!preview.length) return;
    const headers = Object.keys(preview[0]).join(',');
    const rows = preview.map((p) => Object.values(p).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synthetic_attacks_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (!preview.length) return;
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(preview, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `synthetic_attacks_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-red-950/40 via-[#070c18] to-amber-950/40 border border-amber-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-red-950/80 border border-red-500/50 text-red-400 rounded-full shadow-neon-red">
              STAGE 02 — GENERATE
            </span>
            <span className="text-xs text-slate-400 font-mono">PARAMETRIC SYNTHETIC ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            Configurable Attack Synthesis Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Synthesizes realistic payment telemetry with parametric distributions (Log-normal amounts, Gamma customer ages, Poisson velocity bursts) calibrated with realistic non-separable boundary overlap.
          </p>
        </div>
      </div>

      {/* Generator Controls Grid */}
      <div className="p-6 md:p-8 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-6 backdrop-blur-xl shadow-glass-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sample Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">BATCH SIZE:</span>
              <span className="text-cyan-400 font-black">{nSamples.toLocaleString()} TX</span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={nSamples}
              onChange={(e) => setNSamples(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>100</span>
              <span>10,000</span>
            </div>
          </div>

          {/* Fraud Ratio Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">FRAUD RATIO:</span>
              <span className="text-red-400 font-black">{(fraudRatio * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.02}
              max={0.5}
              step={0.01}
              value={fraudRatio}
              onChange={(e) => setFraudRatio(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>2%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Difficulty Modifier */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">STEALTH / DIFFICULTY:</span>
              <span className="text-amber-400 font-black">{difficulty.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.1}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.5x (Obvious)</span>
              <span>2.5x (Stealth)</span>
            </div>
          </div>

          {/* Attack Family Filter */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400">THREAT VECTOR:</span>
            <select
              value={attackFamily}
              onChange={(e) => setAttackFamily(e.target.value)}
              className="w-full bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Computes Wasserstein distance and Jensen-Shannon divergence automatically</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-red-600 via-amber-500 to-cyan-500 hover:from-red-500 hover:to-cyan-400 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-amber flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>SYNTHESIZING TELEMETRY...</span>
              </>
            ) : (
              <>
                <Flame className="h-4 w-4 fill-current text-slate-950" />
                <span>GENERATE ATTACK BATCH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generation Summary & Statistical Fidelity */}
      {summary && fidelity && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-[#070c18]/90 border border-white/10 rounded-2xl space-y-1 shadow-glass-card">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Synthesized</span>
            <p className="text-2xl font-black font-mono text-white">{summary.generated_count.toLocaleString()} Records</p>
            <p className="text-xs font-mono text-slate-400">
              Legitimate: <strong className="text-emerald-400">{summary.legit_count}</strong> | Fraud:{' '}
              <strong className="text-red-400">{summary.fraud_count}</strong>
            </p>
          </div>

          <div className="p-5 bg-[#070c18]/90 border border-white/10 rounded-2xl space-y-1 shadow-glass-card">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Statistical Fidelity</span>
            <p className="text-2xl font-black font-mono text-amber-400">{fidelity.overall_fidelity_score}%</p>
            <p className="text-xs font-mono text-slate-400">
              Avg Jensen-Shannon: <strong className="text-cyan-400">{fidelity.average_jensen_shannon}</strong>
            </p>
          </div>

          <div className="p-5 bg-[#070c18]/90 border border-white/10 rounded-2xl space-y-1 shadow-glass-card">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Non-Separability State</span>
            <p className="text-base font-black font-mono text-emerald-400 mt-1">{fidelity.non_separability_status}</p>
            <p className="text-[11px] text-slate-400">High-fidelity boundary overlap mirroring institutional portfolios</p>
          </div>
        </div>
      )}

      {/* Preview Table & Export Actions */}
      {preview.length > 0 && (
        <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 shadow-glass-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Generated Telemetry Preview ({preview.length} Samples)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Scored by Stacking Arbiter with ground truth labels</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="px-3.5 py-1.5 bg-[#030712] border border-white/10 hover:border-emerald-500/50 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={exportJSON}
                className="px-3.5 py-1.5 bg-[#030712] border border-white/10 hover:border-cyan-500/50 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <FileJson className="h-3.5 w-3.5 text-cyan-400" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-2xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#030712] text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">TX ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Merchant</th>
                  <th className="p-3">Threat Vector</th>
                  <th className="p-3">Velocity</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3 text-right">Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {preview.map((tx) => (
                  <tr key={tx.transaction_id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-3 text-slate-300 font-bold">{tx.transaction_id}</td>
                    <td className="p-3 text-white font-bold">${tx.amount.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">{tx.payment_channel}</td>
                    <td className="p-3 text-slate-400">{tx.merchant_category}</td>
                    <td className="p-3 text-amber-300 font-sans font-medium">{tx.attack_family}</td>
                    <td className="p-3 text-slate-300">{tx.transaction_velocity}/hr</td>
                    <td className="p-3 font-bold text-cyan-400">{tx.risk_score?.toFixed(1) || 'N/A'}</td>
                    <td className="p-3 text-right">
                      {tx.fraud_label === 1 ? (
                        <span className="px-2 py-0.5 bg-red-950/90 border border-red-500/50 text-red-400 rounded text-[10px] font-black">
                          FRAUD
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 rounded text-[10px] font-black">
                          LEGIT
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
