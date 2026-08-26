import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  colorTheme: 'cyan' | 'red' | 'emerald' | 'purple' | 'amber';
  trend?: string;
  isPositiveTrend?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  colorTheme,
  trend,
  isPositiveTrend = true
}) => {
  const colorMap = {
    cyan: {
      bg: 'from-cyan-950/30 via-[#071326]/60 to-[#030712]',
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      text: 'text-cyan-300',
      iconBox: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40 shadow-neon-cyan',
      glow: 'bg-cyan-500/10',
      bracket: 'border-cyan-500'
    },
    red: {
      bg: 'from-red-950/30 via-[#1f0b12]/60 to-[#030712]',
      border: 'border-red-500/30 hover:border-red-500/60',
      text: 'text-red-400',
      iconBox: 'bg-red-950/80 text-red-400 border-red-500/40 shadow-neon-red',
      glow: 'bg-red-500/10',
      bracket: 'border-red-500'
    },
    emerald: {
      bg: 'from-emerald-950/30 via-[#0b1f16]/60 to-[#030712]',
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      text: 'text-emerald-300',
      iconBox: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-neon-emerald',
      glow: 'bg-emerald-500/10',
      bracket: 'border-emerald-500'
    },
    purple: {
      bg: 'from-purple-950/30 via-[#160b24]/60 to-[#030712]',
      border: 'border-purple-500/30 hover:border-purple-500/60',
      text: 'text-purple-300',
      iconBox: 'bg-purple-950/80 text-purple-400 border-purple-500/40 shadow-neon-purple',
      glow: 'bg-purple-500/10',
      bracket: 'border-purple-500'
    },
    amber: {
      bg: 'from-amber-950/30 via-[#241708]/60 to-[#030712]',
      border: 'border-amber-500/30 hover:border-amber-500/60',
      text: 'text-amber-300',
      iconBox: 'bg-amber-950/80 text-amber-400 border-amber-500/40 shadow-neon-amber',
      glow: 'bg-amber-500/10',
      bracket: 'border-amber-500'
    }
  };

  const theme = colorMap[colorTheme];

  return (
    <div
      className={`p-5 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} backdrop-blur-xl shadow-glass-card space-y-3 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
    >
      {/* Ambient background glow */}
      <div className={`absolute -top-10 -right-10 w-28 h-28 ${theme.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}></div>

      {/* Top HUD Row */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${theme.iconBox} transition-transform group-hover:rotate-6 duration-300`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Value Readout */}
      <div className="relative z-10">
        <p className={`text-2xl md:text-3xl font-black tracking-tight ${theme.text} font-mono drop-shadow-md`}>
          {value}
        </p>

        {(subValue || trend) && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 pt-2 border-t border-white/5">
            <span className="truncate max-w-[160px]">{subValue}</span>
            {trend && (
              <span className={`font-mono font-bold flex items-center gap-0.5 ${isPositiveTrend ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositiveTrend ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                {trend}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
