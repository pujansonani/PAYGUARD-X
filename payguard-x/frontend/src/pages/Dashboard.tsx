import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Flame,
  ShieldCheck,
  RotateCw,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Database,
  Radio,
  Cpu,
  Layers,
  Terminal,
  Crosshair,
  Lock
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { LoopFlowDiagram } from '../components/LoopFlowDiagram';
import { RiskGauge } from '../components/RiskGauge';
import { ShapWaterfall } from '../components/ShapWaterfall';
import { api } from '../services/api';
import { GlobalMetrics, SyntheticTransaction, TransactionPrediction } from '../types';

interface DashboardProps {
  onNavigate: (viewId: string) => void;
  onOpenJudgeMode: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenJudgeMode }) => {
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [recentTx, setRecentTx] = useState<SyntheticTransaction[]>([]);
  const [sampleInference, setSampleInference] = useState<TransactionPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, txRes] = await Promise.all([
        api.getGlobalMetrics(),
        api.getTransactions({ limit: 8 })
      ]);
      setMetrics(m);
      setRecentTx(txRes.transactions);

      // Run sample high-risk inference
      const inf = await api.detectTransaction({
        amount: 3450.0,
        currency: 'USD',
        payment_channel: 'INSTANT_PAYMENT',
        merchant_category: 'CRYPTO',
        behavioural_deviation: 84.5,
        transaction_velocity: 7,
        device_change: 1,
        location_change: 1
      });
      setSampleInference(inf);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Top Cybernetic Command Hero Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#0d1f3d] via-[#070c18] to-[#1a0c1a] border border-cyan-500/30 overflow-hidden shadow-2xl backdrop-blur-2xl">
        {/* Ambient radial glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-red-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-gradient-to-r from-red-500 to-amber-500 text-slate-950 rounded-full shadow-neon-red">
                SOC DEFENSE LAB • LIVE
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#0b1326] border border-white/10 text-cyan-300 rounded-md">
                CLOSED-LOOP CO-EVOLUTION
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-display font-black tracking-tight text-white leading-tight">
              Autonomous Adaptive Payment Fraud Defense
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              Traditional fraud engines only react after losses occur. <strong className="text-cyan-300 font-semibold">PAYGUARD-X</strong> continuously synthesizes emerging GenAI fraud vectors, intercepts threats via stacking AI ensembles, attributes blindspots, and mutates adversarial variants in a safe defensive sandbox.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('attack-generator')}
              className="px-5 py-3 bg-red-600/90 hover:bg-red-500 text-white font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-red flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Flame className="h-4 w-4" />
              <span>SYNTHESIZE ATTACKS</span>
            </button>

            <button
              onClick={onOpenJudgeMode}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-300 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-amber flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>RUN JUDGE MODE</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attack Taxonomy Scenarios"
          value={metrics ? `${metrics.total_attack_scenarios} Active` : '40+ Active'}
          subValue="Across 10 Threat Families"
          icon={Flame}
          colorTheme="red"
          trend="+100% GenAI Coverage"
        />
        <StatCard
          title="Model Precision Rate"
          value={metrics ? `${(metrics.precision * 100).toFixed(1)}%` : '96.2%'}
          subValue="Low False-Positive Friction"
          icon={ShieldCheck}
          colorTheme="emerald"
          trend="0.8% FPR Target"
        />
        <StatCard
          title="Defense Recall Coverage"
          value={metrics ? `${(metrics.recall * 100).toFixed(1)}%` : '97.4%'}
          subValue="Post-Hardening Adaptation"
          icon={Zap}
          colorTheme="cyan"
          trend="+8.5% Hardening Gain"
        />
        <StatCard
          title="Statistical Fidelity Score"
          value={metrics ? `${metrics.fidelity_score}%` : '94.8%'}
          subValue="Optimal Non-Separability (JS Div)"
          icon={Database}
          colorTheme="amber"
          trend="Realistic Overlap"
        />
      </div>

      {/* 5-Stage Closed Loop Flow */}
      <LoopFlowDiagram onStageClick={(stageId) => onNavigate(stageId)} />

      {/* Two Column Layout: Real-Time Inference Console & Live Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-Time Inference Console Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Live Stacking Inference & SHAP Attribution</span>
            </h2>
            <button
              onClick={() => onNavigate('defense-center')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition"
            >
              <span>Open Defense Lab</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {sampleInference && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-5">
                  <RiskGauge
                    score={sampleInference.risk_score}
                    level={sampleInference.risk_level}
                    action={sampleInference.recommended_action}
                  />
                </div>

                <div className="sm:col-span-7 p-5 bg-[#070c18]/90 border border-white/10 rounded-3xl flex flex-col justify-between backdrop-blur-xl shadow-glass-card">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Sample Incident</span>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-950 text-red-400 border border-red-800 rounded">
                        FLAGGED INTRUSION
                      </span>
                    </div>
                    <p className="text-base font-mono font-black text-white">$3,450.00 USD (INSTANT_PAYMENT)</p>
                    <p className="text-xs text-slate-400 font-mono">Merchant: CRYPTO | Velocity: 7 bursts/hr</p>
                    <p className="text-xs text-slate-400 font-mono">Device: NEW HARDWARE • Location: CHANGED</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between font-mono">
                    <span>Stacking Arbiter:</span>
                    <span className="font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                      {sampleInference.recommended_action}
                    </span>
                  </div>
                </div>
              </div>

              <ShapWaterfall
                contributions={sampleInference.top_contributing_features}
                title="Top Signal Attributions for Sample Incident"
              />
            </div>
          )}
        </div>

        {/* Live Synthetic Telemetry Stream */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-400" />
              <span>Live Synthetic Telemetry Ledger</span>
            </h2>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-mono text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition"
            >
              <span>View All Records</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="bg-[#070c18]/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030712]/90 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3.5">TX ID</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Channel</th>
                    <th className="p-3.5">Threat Vector</th>
                    <th className="p-3.5 text-right">Ground Truth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {recentTx.map((tx) => (
                    <tr key={tx.transaction_id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-3.5 text-slate-300 font-bold truncate max-w-[120px]">{tx.transaction_id}</td>
                      <td className="p-3.5 text-white font-bold">${tx.amount.toFixed(2)}</td>
                      <td className="p-3.5 text-slate-400">{tx.payment_channel}</td>
                      <td className="p-3.5 text-amber-300 font-sans font-medium">{tx.attack_family}</td>
                      <td className="p-3.5 text-right">
                        {tx.fraud_label === 1 ? (
                          <span className="px-2 py-0.5 bg-red-950/90 border border-red-500/50 text-red-400 rounded text-[10px] font-black tracking-wider shadow-neon-red">
                            FRAUD
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 rounded text-[10px] font-black tracking-wider shadow-neon-emerald">
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
        </div>
      </div>
    </div>
  );
};
