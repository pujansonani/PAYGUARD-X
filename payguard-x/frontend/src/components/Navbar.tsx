import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Activity, Terminal, Cpu, Radio, Zap, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenJudgeMode: () => void;
  datasetSize?: number;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJudgeMode, datasetSize, activeView }) => {
  const [ping, setPing] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(10 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 border-b border-white/10 bg-[#070c18]/90 backdrop-blur-xl px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-2xl">
      {/* Left Brand Identity */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-red-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative p-2.5 bg-[#030712] rounded-xl border border-white/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-black text-xl md:text-2xl tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              PAYGUARD<span className="text-red-500">-X</span>
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 rounded-full shadow-neon-cyan">
              v1.0 AI LAB
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
            Mastercard Innovation Challenge • Autonomous GenAI Defense & Co-Evolution
          </p>
        </div>
      </div>

      {/* Middle/Right Telemetry Pills */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* DEFCON Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1326]/80 border border-red-500/30 text-xs font-mono">
          <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
          <span className="text-slate-400">STATUS:</span>
          <span className="font-black text-red-400 tracking-wider">DEFCON 2 ACTIVE</span>
        </div>

        {/* Live Engine Ping */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1326]/80 border border-white/10 text-xs font-mono">
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">LATENCY:</span>
          <span className="font-bold text-emerald-400">{ping}ms</span>
        </div>

        {/* Live Telemetry Stream Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1326]/90 border border-cyan-500/30 text-xs font-mono shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-slate-400 hidden md:inline">STREAM:</span>
          <span className="font-black text-cyan-300 font-mono">
            {datasetSize ? `${datasetSize.toLocaleString()} TX` : '3,000 TX'}
          </span>
        </div>

        {/* 1-Click Judge Mode Trigger Button */}
        <button
          onClick={onOpenJudgeMode}
          className="relative group p-[1px] rounded-xl overflow-hidden shadow-neon-amber focus:outline-none transition-transform active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-red-500 to-cyan-400 group-hover:scale-105 transition-transform duration-300 animate-shimmer"></div>
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#070c18] group-hover:bg-[#0b1326] rounded-xl transition duration-200">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-cyber font-black text-xs uppercase tracking-wider text-amber-300">
              JUDGE MODE
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-950/80 border border-amber-500/60 text-amber-400 rounded">
              1-CLICK
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
