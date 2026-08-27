import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  ShieldAlert,
  Flame,
  FlaskConical,
  ShieldCheck,
  Swords,
  RotateCw,
  BarChart3,
  ReceiptText,
  Sliders,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ArrowRight
} from 'lucide-react';
import { toggleSound, isSoundEnabled, playCyberSound } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string) => void;
  onOpenJudgeMode: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenJudgeMode
}) => {
  const [query, setQuery] = useState('');
  const [soundActive, setSoundActive] = useState(isSoundEnabled());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playCyberSound('click');
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allActions = [
    { id: 'judge-mode', label: 'Execute 1-Click Judge Mode Verification', icon: Sparkles, category: 'QUICK ACTION', action: onOpenJudgeMode, badge: 'PROVE' },
    { id: 'dashboard', label: 'SOC Command Center Dashboard', icon: LayoutDashboard, category: 'NAVIGATION', action: () => onNavigate('dashboard') },
    { id: 'attack-intelligence', label: 'Attack Taxonomy Matrix (40+ GenAI Scenarios)', icon: ShieldAlert, category: 'RED TEAM', action: () => onNavigate('attack-intelligence') },
    { id: 'attack-generator', label: 'Parametric Synthetic Attack Engine', icon: Flame, category: 'RED TEAM', action: () => onNavigate('attack-generator') },
    { id: 'simulation-lab', label: 'Statistical Non-Separability Lab (Wasserstein/JS)', icon: FlaskConical, category: 'RED TEAM', action: () => onNavigate('simulation-lab') },
    { id: 'defense-center', label: 'Multi-Model Real-Time Defense Center', icon: ShieldCheck, category: 'BLUE TEAM', action: () => onNavigate('defense-center') },
    { id: 'red-blue-arena', label: 'Red vs Blue Adversarial Co-Evolution Arena', icon: Swords, category: 'CO-EVOLUTION', action: () => onNavigate('red-blue-arena'), badge: 'BATTLE' },
    { id: 'feedback-loop', label: 'False-Negative Attribution & Adaptation', icon: RotateCw, category: 'CO-EVOLUTION', action: () => onNavigate('feedback-loop') },
    { id: 'model-performance', label: 'Scientific Model Benchmarks (5 Architectures)', icon: BarChart3, category: 'ANALYTICS', action: () => onNavigate('model-performance') },
    { id: 'transactions', label: 'Live Synthetic Telemetry Ledger', icon: ReceiptText, category: 'TELEMETRY', action: () => onNavigate('transactions') },
    { id: 'experiments', label: 'MLOps Experiment Tracking & Hyperparameters', icon: Sliders, category: 'MLOPS', action: () => onNavigate('experiments') },
    { id: 'reports', label: 'Security Intelligence Dossier (Export PDF/MD)', icon: FileSpreadsheet, category: 'REPORTS', action: () => onNavigate('reports') },
    { id: 'settings', label: 'Risk Threshold Policies & Stacking Weights', icon: SettingsIcon, category: 'SETTINGS', action: () => onNavigate('settings') },
    {
      id: 'toggle-sound',
      label: soundActive ? 'Disable Cybernetic Audio Synth' : 'Enable Cybernetic Audio Synth',
      icon: soundActive ? VolumeX : Volume2,
      category: 'AUDIO',
      action: () => {
        const state = toggleSound();
        setSoundActive(state);
      }
    }
  ];

  const filtered = allActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none"
        >
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-gradient-to-b from-[#0e172a] via-[#070c18] to-[#030712] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/60"
          >
            {/* Input Search Box */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 relative">
              <Search className="h-5 w-5 text-cyan-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command, page, or threat vector to navigate (e.g., 'arena', 'deepfake', 'judge')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-[10px] font-mono text-slate-400">
                  ESC to exit
                </span>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List of Results */}
            <div className="p-2 max-h-96 overflow-y-auto space-y-1">
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playCyberSound('click');
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => playCyberSound('hover')}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-cyan-950/40 hover:border-cyan-500/40 border border-transparent transition text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#030712] border border-white/10 text-cyan-400 group-hover:border-cyan-400 transition">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                          {item.label}
                        </p>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-amber-950 text-amber-400 border border-amber-800">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Hotkey Guide */}
            <div className="p-3 bg-[#030712] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 px-4">
              <span>Quick Navigate</span>
              <div className="flex items-center gap-3">
                <span><strong className="text-cyan-400">Cmd + K</strong> to toggle</span>
                <span><strong className="text-amber-400">Cmd + J</strong> for Judge Mode</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
