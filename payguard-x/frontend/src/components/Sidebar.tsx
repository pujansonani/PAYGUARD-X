import React from 'react';
import {
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
  Cpu,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export const navGroups = [
  {
    category: 'COMMAND',
    items: [
      { id: 'dashboard', label: 'SOC Command Center', icon: LayoutDashboard, badge: 'LIVE' },
    ]
  },
  {
    category: 'RED TEAM SIMULATION',
    items: [
      { id: 'attack-intelligence', label: 'Attack Taxonomy (40+)', icon: ShieldAlert },
      { id: 'attack-generator', label: 'Synthetic Engine', icon: Flame },
      { id: 'simulation-lab', label: 'Statistical Fidelity Lab', icon: FlaskConical },
    ]
  },
  {
    category: 'BLUE TEAM & BATTLE',
    items: [
      { id: 'defense-center', label: 'Multi-Model Defense', icon: ShieldCheck },
      { id: 'red-blue-arena', label: 'Red vs Blue Arena', icon: Swords, badge: 'CO-EVOLVE' },
      { id: 'feedback-loop', label: 'Blindspot Adaptation', icon: RotateCw },
    ]
  },
  {
    category: 'ANALYTICS & TELEMETRY',
    items: [
      { id: 'model-performance', label: 'Model Benchmarks', icon: BarChart3 },
      { id: 'transactions', label: 'Transaction Ledger', icon: ReceiptText },
      { id: 'experiments', label: 'MLOps Experiments', icon: Sliders },
      { id: 'reports', label: 'Intelligence Dossier', icon: FileSpreadsheet },
    ]
  },
  {
    category: 'SYSTEM CONFIG',
    items: [
      { id: 'settings', label: 'Policies & Thresholds', icon: SettingsIcon },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  return (
    <aside className="w-72 border-r border-white/10 bg-[#070c18]/95 backdrop-blur-2xl flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-5rem)] shadow-2xl">
      <div className="space-y-6 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.category} className="space-y-1.5">
            <div className="px-3 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase flex items-center justify-between">
              <span>{group.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 via-[#0b1b36] to-[#071326] border border-cyan-500/50 text-cyan-300 font-bold shadow-neon-cyan'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate tracking-tight">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-mono font-extrabold rounded-md ${
                          item.badge === 'LIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-neon-cyan"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Telemetry HUD Box */}
      <div className="mt-4 p-3.5 bg-gradient-to-br from-[#0b1326] to-[#030712] border border-white/10 rounded-2xl space-y-2.5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-bold text-[11px] font-mono">Arbiter Stacking</span>
          </div>
          <span className="text-cyan-400 font-mono font-bold text-[10px] bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
            XGB+RF+ISO
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Co-Evolution State</span>
            <span className="text-emerald-400 font-bold">100% ONLINE</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/10">
            <div className="bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500 h-1.5 rounded-full w-full animate-shimmer"></div>
          </div>
        </div>

        <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span>Non-Separability Guard</span>
          <span className="text-cyan-400 font-bold">ACTIVE</span>
        </div>
      </div>
    </aside>
  );
};
