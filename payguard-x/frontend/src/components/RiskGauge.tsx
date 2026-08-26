import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  action: 'ALLOW' | 'REVIEW' | 'BLOCK';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, action }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const config =
    action === 'BLOCK'
      ? {
          stroke: '#FF3366',
          glow: 'rgba(255, 51, 102, 0.4)',
          badge: 'bg-red-950/90 border-red-500/60 text-red-300 shadow-neon-red',
          textColor: 'text-red-400',
          Icon: ShieldAlert,
          grade: 'CRITICAL',
        }
      : action === 'REVIEW'
      ? {
          stroke: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.4)',
          badge: 'bg-amber-950/90 border-amber-500/60 text-amber-300 shadow-neon-amber',
          textColor: 'text-amber-400',
          Icon: AlertTriangle,
          grade: 'ELEVATED',
        }
      : {
          stroke: '#10B981',
          glow: 'rgba(16, 185, 129, 0.4)',
          badge: 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300 shadow-neon-emerald',
          textColor: 'text-emerald-400',
          Icon: ShieldCheck,
          grade: 'BENIGN',
        };

  const { Icon } = config;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Radar sweep ambient background */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none"></div>

      {/* SVG Circular Dial */}
      <div className="relative flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#0f172a"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Decorative tick dashed circle */}
          <circle
            cx="80"
            cy="80"
            r={radius - 12}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="transparent"
          />
          {/* Dynamic Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={config.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 10px ${config.glow})`,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>

        {/* Center Digital Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl md:text-4xl font-black font-mono tracking-tighter ${config.textColor} drop-shadow-md`}>
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            RISK PROB
          </span>
        </div>
      </div>

      {/* Action Verdict HUD Pill */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        <div className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest ${config.badge} transition-all duration-300`}>
          <Icon className="h-4 w-4" />
          <span>DECISION: {action}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 font-medium">
          Threat Rating: <strong className={config.textColor}>{config.grade}</strong> ({level} RISK)
        </span>
      </div>
    </div>
  );
};
