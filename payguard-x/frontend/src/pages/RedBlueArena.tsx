import React, { useState } from 'react';
import {
  Swords,
  RotateCw,
  ShieldCheck,
  Flame,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
  Award,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { api } from '../services/api';
import { ArenaBattleResult, ArenaRound } from '../types';

export const RedBlueArena: React.FC = () => {
  const [rounds, setRounds] = useState<number>(3);
  const [samplesPerRound, setSamplesPerRound] = useState<number>(1000);
  const [mutationRate, setMutationRate] = useState<number>(0.35);
  const [attackFamily, setAttackFamily] = useState<string>('ALL');
  const [retrain, setRetrain] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [battleResult, setBattleResult] = useState<ArenaBattleResult | null>(null);

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

  const handleRunArena = async () => {
    setLoading(true);
    try {
      const res = await api.runAdversarialLoop({
        rounds: rounds,
        samples_per_round: samplesPerRound,
        mutation_rate: mutationRate,
        attack_family: attackFamily === 'ALL' ? undefined : attackFamily,
        retrain_between_rounds: retrain
      });
      setBattleResult(res);
    } catch (err) {
      console.error('Arena battle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    battleResult?.rounds_history.map((r) => ({
      round: `Round 0${r.round}`,
      recall: Number((r.recall * 100).toFixed(1)),
      f1_score: Number((r.f1_score * 100).toFixed(1)),
      precision: Number((r.precision * 100).toFixed(1)),
      fpr: Number((r.false_positive_rate * 100).toFixed(2)),
      missed: r.initial_missed
    })) || [];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-red-950/50 via-[#070c18] to-cyan-950/50 border border-cyan-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-gradient-to-r from-red-500 to-cyan-400 text-slate-950 rounded-full shadow-neon-cyan">
              RED VS BLUE ARENA
            </span>
            <span className="text-xs text-slate-400 font-mono">ADVERSARIAL CO-EVOLUTION BATTLEGROUND</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            Adversarial Hardening & Defense Evolution
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Red Team generates synthetic attack variants; Blue Team detects and scores them; missed detections are automatically mutated into stealthier telemetry vectors, forcing the defense to continuously evolve.
          </p>
        </div>
      </div>

      {/* Red vs Blue Visual Combatants Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Red Team Card */}
        <div className="p-6 bg-gradient-to-br from-red-950/40 via-[#1a070e] to-[#070c18] border border-red-500/30 rounded-3xl flex items-center justify-between shadow-glass-card">
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs">
              <Flame className="h-4 w-4" />
              <span>RED TEAM: ADVERSARIAL MUTATOR</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Probes decision boundaries via safe parametric mutations: amount smoothing, velocity dispersion, timing jumps, and device jitter.
            </p>
          </div>
          <div className="p-3.5 bg-red-950/80 rounded-2xl border border-red-500/50 text-red-400 font-mono text-center font-black text-xs shadow-neon-red">
            MUTATOR
          </div>
        </div>

        {/* Blue Team Card */}
        <div className="p-6 bg-gradient-to-br from-cyan-950/40 via-[#071526] to-[#070c18] border border-cyan-500/30 rounded-3xl flex items-center justify-between shadow-glass-card">
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>BLUE TEAM: AI ENSEMBLE ARBITER</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Stacking meta-classifier combining gradient boosted trees (XGBoost), bagged random forest, and unsupervised anomaly scoring (Isolation Forest).
            </p>
          </div>
          <div className="p-3.5 bg-cyan-950/80 rounded-2xl border border-cyan-500/50 text-cyan-400 font-mono text-center font-black text-xs shadow-neon-cyan">
            DEFENSE
          </div>
        </div>
      </div>

      {/* Arena Configuration Controls Bar */}
      <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-5 backdrop-blur-xl shadow-glass-card">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Swords className="h-4 w-4 text-amber-400" />
            <span>Battleground Parameters</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-500">Autonomous Execution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">ROUNDS:</span>
              <span className="text-cyan-400 font-black">{rounds} Rounds</span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">SAMPLES/ROUND:</span>
              <span className="text-white font-black">{samplesPerRound.toLocaleString()} TX</span>
            </div>
            <input
              type="range"
              min={500}
              max={3000}
              step={100}
              value={samplesPerRound}
              onChange={(e) => setSamplesPerRound(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">BASE MUTATION RATE:</span>
              <span className="text-amber-400 font-black">{(mutationRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.6}
              step={0.05}
              value={mutationRate}
              onChange={(e) => setMutationRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold text-slate-400">THREAT FAMILY:</span>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
          <label className="flex items-center gap-2.5 text-xs font-mono text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={retrain}
              onChange={(e) => setRetrain(e.target.checked)}
              className="rounded bg-slate-950 border-white/20 text-cyan-400 focus:ring-0"
            />
            <span className="font-bold text-cyan-300">Automated Inter-Round Defensive Retraining (Closed-Loop)</span>
          </label>

          <button
            onClick={handleRunArena}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 via-amber-500 to-cyan-500 hover:from-red-500 hover:to-cyan-400 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-amber flex items-center justify-center gap-2.5 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>SIMULATING ADVERSARIAL BATTLE...</span>
              </>
            ) : (
              <>
                <Swords className="h-4 w-4 fill-current text-slate-950" />
                <span>COMMENCE CO-EVOLUTION BATTLE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Battle Results Visualizer */}
      {battleResult && (
        <div className="space-y-6">
          {/* Net Adaptation Summary Dossier */}
          <div className="p-6 bg-[#070c18]/95 border border-emerald-500/40 rounded-3xl space-y-4 shadow-neon-emerald backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                <CheckCircle2 className="h-4 w-4" />
                <span>Co-Evolution Verification Verdict</span>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/50 rounded-full font-mono text-xs font-black">
                {battleResult.net_adaptation_summary.co_evolution_status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 bg-[#030712] rounded-2xl border border-white/5">
                <span className="text-[10px] text-slate-400">Baseline Recall</span>
                <p className="text-xl font-black text-slate-200 mt-0.5">
                  {(battleResult.net_adaptation_summary.initial_recall * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3.5 bg-[#030712] rounded-2xl border border-white/5">
                <span className="text-[10px] text-slate-400">Hardened Final Recall</span>
                <p className="text-xl font-black text-cyan-400 mt-0.5">
                  {(battleResult.net_adaptation_summary.final_recall * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3.5 bg-[#030712] rounded-2xl border border-white/5">
                <span className="text-[10px] text-slate-400">Recall Adaptation Delta</span>
                <p className="text-xl font-black text-emerald-400 mt-0.5">
                  +{(battleResult.net_adaptation_summary.delta_recall * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3.5 bg-[#030712] rounded-2xl border border-white/5">
                <span className="text-[10px] text-slate-400">F1 Improvement</span>
                <p className="text-xl font-black text-purple-400 mt-0.5">
                  +{(battleResult.net_adaptation_summary.delta_f1 * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Performance Progression Chart */}
          <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 shadow-glass-card backdrop-blur-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Metric Trajectory Across Adversarial Rounds
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="round" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
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
                  <Legend />
                  <Line type="monotone" dataKey="recall" stroke="#00F0FF" strokeWidth={3} name="Recall (%)" />
                  <Line type="monotone" dataKey="f1_score" stroke="#8B5CF6" strokeWidth={3} name="F1-Score (%)" />
                  <Line type="monotone" dataKey="precision" stroke="#10B981" strokeWidth={2} name="Precision (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Round Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
            {battleResult.rounds_history.map((r) => (
              <div key={r.round} className="p-5 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-3 shadow-glass-card">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-black text-cyan-400">ROUND 0{r.round}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    Difficulty: {r.difficulty_level}x
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Missed Intrusions:</span>
                    <span className="text-red-400 font-bold">{r.initial_missed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mutated Evasions:</span>
                    <span className="text-purple-400 font-bold">{r.mutated_samples}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Round Recall:</span>
                    <span className="text-cyan-400 font-bold">{(r.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Evasion Vector:</span>
                    <span className="text-amber-300 truncate max-w-[140px]">{r.primary_evasion_vector}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
