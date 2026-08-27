import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Activity, Terminal, Cpu, Radio, Zap, Volume2, VolumeX, Search, Command } from 'lucide-react';
import { toggleSound, isSoundEnabled, playCyberSound } from '../utils/audio';

interface NavbarProps {
  onOpenJudgeMode: () => void;
  onOpenCommandPalette: () => void;
  datasetSize?: number;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenJudgeMode,
  onOpenCommandPalette,
  datasetSize,
  activeView
}) => {
  const [ping, setPing] = useState(12);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(10 + Math.random() * 6));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const state = toggleSound();
    setSoundOn(state);
  };

  return (
    <header className="h-20 border-b border-white/[0.08] bg-[#070c18]/90 backdrop-blur-2xl px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-2xl">
      {/* Left Brand Identity */}
      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer" onClick={onOpenCommandPalette}>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative p-2.5 bg-[#030712] rounded-xl border border-white/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-display font-black text-xl md:text-2xl tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              PAYGUARD<span className="text-red-500">-X</span>
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 rounded-full shadow-neon-cyan">
              v1.0 AI LAB
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
            Mastercard Innovation Challenge • Autonomous GenAI Defense & Co-Evolution
          </p>
        </div>
      </div>

      {/* Center Search / Command Trigger */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={() => {
            playCyberSound('click');
            onOpenCommandPalette();
          }}
          className="flex items-center gap-3 px-4 py-2 bg-[#030712]/90 border border-white/10 hover:border-cyan-500/50 rounded-2xl text-xs font-mono text-slate-400 hover:text-slate-200 transition shadow-sm group"
        >
          <Search className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Quick command / search...</span>
          <span className="px-1.5 py-0.5 rounded bg-[#0b1326] border border-white/10 text-[10px] font-bold text-slate-400">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right Telemetry & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* DEFCON Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1326]/80 border border-red-500/30 text-xs font-mono">
          <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse" />
          <span className="text-slate-400">DEFENSE:</span>
          <span className="font-black text-red-400 tracking-wider">ACTIVE (DEFCON 2)</span>
        </div>

        {/* Live Ping */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1326]/80 border border-white/10 text-xs font-mono">
          <Zap className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">LATENCY:</span>
          <span className="font-bold text-emerald-400">{ping}ms</span>
        </div>

        {/* Cyber Audio Synth Toggle */}
        <button
          onClick={handleSoundToggle}
          title={soundOn ? 'Mute Cyber Audio Synth' : 'Enable Cyber Audio Synth'}
          className={`p-2.5 rounded-xl border transition ${
            soundOn
              ? 'bg-[#0b1326] border-cyan-500/40 text-cyan-400 shadow-neon-cyan'
              : 'bg-[#030712] border-white/10 text-slate-500 hover:text-slate-300'
          }`}
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        {/* 1-Click Judge Mode Trigger */}
        <button
          onClick={() => {
            playCyberSound('click');
            onOpenJudgeMode();
          }}
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
