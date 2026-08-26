import React from 'react';
import { ShieldAlert, Flame, ShieldCheck, Search, RotateCw, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoopFlowDiagramProps {
  activeStage?: number;
  onStageClick?: (stageId: string) => void;
}

export const LoopFlowDiagram: React.FC<LoopFlowDiagramProps> = ({ activeStage = 1, onStageClick }) => {
  const stages = [
    {
      id: 'attack-intelligence',
      step: 1,
      title: 'IDENTIFY',
      subtitle: '40+ GenAI Scenarios',
      icon: ShieldAlert,
      color: 'red',
      desc: 'Taxonomy of 10 threat families & evasion tactics',
      glow: 'shadow-neon-red border-red-500/60 bg-red-950/40 text-red-400'
    },
    {
      id: 'attack-generator',
      step: 2,
      title: 'GENERATE',
      subtitle: 'Synthetic Engine',
      icon: Flame,
      color: 'amber',
      desc: 'Log-Normal & Gamma distributions with boundary overlap',
      glow: 'shadow-neon-amber border-amber-500/60 bg-amber-950/40 text-amber-400'
    },
    {
      id: 'defense-center',
      step: 3,
      title: 'DEFEND',
      subtitle: 'Stacking Arbiter',
      icon: ShieldCheck,
      color: 'cyan',
      desc: 'XGBoost + RF + Isolation Forest + SHAP attribution',
      glow: 'shadow-neon-cyan border-cyan-500/60 bg-cyan-950/40 text-cyan-400'
    },
    {
      id: 'feedback-loop',
      step: 4,
      title: 'GAP ANALYSIS',
      subtitle: 'Blindspot Attribution',
      icon: Search,
      color: 'purple',
      desc: 'Pinpointing telemetry vectors in false-negative escapes',
      glow: 'shadow-neon-purple border-purple-500/60 bg-purple-950/40 text-purple-400'
    },
    {
      id: 'red-blue-arena',
      step: 5,
      title: 'ADAPT & MUTATE',
      subtitle: 'Co-Evolution Arena',
      icon: RotateCw,
      color: 'emerald',
      desc: 'Safe parametric mutations & automated defense hardening',
      glow: 'shadow-neon-emerald border-emerald-500/60 bg-emerald-950/40 text-emerald-400'
    }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-[#070c18] via-[#0b1326] to-[#070c18] border border-white/10 rounded-3xl space-y-4 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <h2 className="text-sm font-display font-black uppercase tracking-wider text-slate-100">
              Autonomous Closed-Loop Co-Evolution Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous adversarial learning cycle: Identify • Generate • Defend • Analyze • Adapt
          </p>
        </div>
        <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-black uppercase tracking-widest rounded-full shadow-neon-cyan self-start sm:self-auto">
          STAGE 0{activeStage} OF 05
        </span>
      </div>

      {/* Grid of 5 Pipeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative pt-1">
        {stages.map((st) => {
          const Icon = st.icon;
          const isSelected = activeStage === st.step;
          return (
            <div
              key={st.id}
              onClick={() => onStageClick?.(st.id)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#0e1e38] to-[#081224] border-cyan-400 shadow-neon-cyan ring-1 ring-cyan-400 scale-[1.02]'
                  : 'bg-[#0b1326]/60 border-white/10 hover:border-white/20 hover:bg-[#0e1a33]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-black/40 text-slate-400 border border-white/10">
                    STAGE 0{st.step}
                  </span>
                  <div
                    className={`p-2 rounded-xl border transition-transform duration-200 group-hover:scale-110 ${
                      isSelected ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-neon-cyan' : 'bg-slate-900/90 text-slate-400 border-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-display font-black tracking-wide text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {st.title}
                  </h4>
                  <p className="text-[11px] font-mono font-bold text-cyan-400 mt-0.5">
                    {st.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed border-t border-white/5 pt-2">
                {st.desc}
              </p>

              {isSelected && (
                <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-cyan-400 rounded-full shadow-neon-cyan"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
