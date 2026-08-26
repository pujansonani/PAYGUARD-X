import React, { useState, useEffect } from 'react';
import { RotateCw, Search, ArrowRight, ShieldCheck, Flame, Sliders, AlertTriangle, CheckCircle, Sparkles, Layers } from 'lucide-react';
import { LoopFlowDiagram } from '../components/LoopFlowDiagram';
import { api } from '../services/api';

export const FeedbackLoop: React.FC = () => {
  const [adversarialHistory, setAdversarialHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getAdversarialResults();
      setAdversarialHistory(data.history);
    } catch (err) {
      console.error('Failed to load feedback history:', err);
    }
  };

  const mutationVectors = [
    {
      name: 'Amount Distribution Smoothing',
      target: 'amount & amount_deviation',
      strategy: 'Scales transaction value into legitimate customer 30-day baseline distribution (0.75x - 0.95x) to evade fixed threshold AML rules.',
      effect: 'Forces model to rely on subtle cross-feature interactions rather than simple amount cutoffs.'
    },
    {
      name: 'Behavioral Deviation Dampening',
      target: 'behavioural_deviation',
      strategy: 'Mitigates mouse jitter and click cadence extremes, simulating human hesitation patterns.',
      effect: 'Hardens behavioral biometrics models against synthetic pacing algorithms.'
    },
    {
      name: 'Velocity Pacing & Gap Expansion',
      target: 'transaction_velocity & previous_transaction_gap',
      strategy: 'Disperses transactions over wider exponential time intervals to stay below sliding window burst counters.',
      effect: 'Strengthens sequence-aware feature embeddings.'
    },
    {
      name: 'Device-Fingerprint Masking Jitter',
      target: 'device_change & location_change',
      strategy: 'Injects low-frequency benign hardware fingerprints into synthetic fraud batches.',
      effect: 'Eliminates model over-reliance on single boolean device flags.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-purple-950/40 via-[#070c18] to-emerald-950/40 border border-purple-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-purple-950/80 border border-purple-500/50 text-purple-400 rounded-full shadow-neon-purple">
              STAGE 04 & 05 — GAP ANALYSIS & ADAPTATION
            </span>
            <span className="text-xs text-slate-400 font-mono">CLOSED-LOOP CO-EVOLUTION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            Adversarial Mutation & Blindspot Attribution
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Every false negative is a learning signal. PAYGUARD-X identifies the weak feature combinations that allowed an attack to evade detection and synthesizes harder variations to eliminate the vulnerability.
          </p>
        </div>
      </div>

      {/* Visual Workflow Flow */}
      <LoopFlowDiagram activeStage={4} />

      {/* Mutation Strategy Catalog */}
      <div className="p-6 md:p-8 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-5 shadow-glass-card backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Safe Telemetry Mutation Vectors
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Parametric synthetic transformations designed to probe model boundary resilience
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800">
            4 ACTIVE STRATEGIES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mutationVectors.map((mv, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#030712] border border-white/10 rounded-2xl space-y-2.5 hover:border-white/20 transition group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                  {mv.name}
                </h3>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                  {mv.target}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{mv.strategy}</p>
              <div className="pt-2 border-t border-white/5 text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Hardening Impact: {mv.effect}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
