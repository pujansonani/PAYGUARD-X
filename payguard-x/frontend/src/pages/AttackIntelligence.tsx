import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Filter, AlertTriangle, Eye, ChevronRight, Zap, Target, Crosshair, Radio, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { AttackScenario } from '../types';

export const AttackIntelligence: React.FC = () => {
  const [scenarios, setScenarios] = useState<AttackScenario[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeScenario, setActiveScenario] = useState<AttackScenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttacks();
  }, []);

  const loadAttacks = async () => {
    setLoading(true);
    try {
      const data = await api.getAttacks();
      setScenarios(data.scenarios);
      setCategories(data.categories);
      if (data.scenarios.length > 0) {
        setActiveScenario(data.scenarios[0]);
      }
    } catch (err) {
      console.error('Failed to load attack taxonomy:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = scenarios.filter((sc) => {
    const matchCat = selectedCategory === 'ALL' || sc.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSev = selectedSeverity === 'ALL' || sc.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchSearch =
      sc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSev && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-red-950/40 via-[#070c18] to-slate-950 border border-red-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-red-950/80 border border-red-500/50 text-red-400 rounded-full shadow-neon-red">
              STAGE 01 — IDENTIFY
            </span>
            <span className="text-xs text-slate-400 font-mono">GENAI ATTACK TAXONOMY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            GenAI Payment Attack Taxonomy Matrix
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            A comprehensive MITRE-style catalog of 40+ granular GenAI-enabled payment fraud vectors structured across 10 attack families, mapping observables, simulation parameters, and defensive blindspots.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-4 bg-[#070c18]/90 border border-white/10 rounded-2xl text-center min-w-[120px] shadow-glass-card">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Catalog</span>
            <p className="text-2xl font-black text-red-400 font-mono drop-shadow">{scenarios.length}</p>
          </div>
          <div className="p-4 bg-[#070c18]/90 border border-white/10 rounded-2xl text-center min-w-[120px] shadow-glass-card">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Threat Families</span>
            <p className="text-2xl font-black text-amber-400 font-mono drop-shadow">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-[#070c18]/90 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-glass-card backdrop-blur-xl">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <Search className="h-4 w-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search scenarios by ID (e.g. SE-001), keywords, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 w-full focus:outline-none focus:border-cyan-500 font-mono transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All 10 Families ({scenarios.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      {/* Grid: Scenario List & Detailed Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Displaying {filtered.length} Threat Vectors</span>
            <span>Click to inspect telemetry</span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filtered.map((sc) => {
              const isSelected = activeScenario?.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setActiveScenario(sc)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-950/80 via-[#1a0c16] to-[#070c18] border-red-500/60 shadow-neon-red ring-1 ring-red-500/50 scale-[1.01]'
                      : 'bg-[#070c18]/80 border-white/10 hover:border-white/20 hover:bg-[#0b1326]'
                  }`}
                >
                  <div className="space-y-1.5 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#030712] font-mono text-[10px] font-black text-red-400 border border-white/10">
                        {sc.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                          sc.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-800 shadow-neon-red'
                            : sc.severity === 'HIGH'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-blue-950 text-blue-400 border border-blue-800'
                        }`}
                      >
                        {sc.severity}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{sc.category}</span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sc.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">{sc.description}</p>
                  </div>

                  <ChevronRight
                    className={`h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 ${
                      isSelected ? 'text-red-400' : 'text-slate-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Telemetry Inspector Drawer */}
        <div className="lg:col-span-5">
          {activeScenario ? (
            <div className="p-6 bg-[#070c18]/95 border border-white/10 rounded-3xl space-y-4 sticky top-24 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                    {activeScenario.id}
                  </span>
                  <h2 className="text-sm md:text-base font-display font-black text-white mt-1.5">
                    {activeScenario.name}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">{activeScenario.category}</span>
                </div>
                <span className="px-3 py-1 text-xs font-mono font-black bg-red-950 border border-red-500/50 text-red-400 rounded-xl shadow-neon-red">
                  {activeScenario.severity}
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Threat Description</span>
                  <p className="text-slate-300 mt-1 leading-relaxed font-sans">{activeScenario.description}</p>
                </div>

                {/* Quantitative Metric Scores */}
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-3 bg-[#030712] rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-400">Novelty Rating</span>
                    <p className="text-base font-black text-amber-400 mt-0.5">
                      {(activeScenario.novelty_score * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="p-3 bg-[#030712] rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-400">Evasion Difficulty</span>
                    <p className="text-base font-black text-purple-400 mt-0.5">
                      {(activeScenario.difficulty * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Target Payment Channels */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Target Rails & Channels</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {activeScenario.payment_channels.map((ch) => (
                      <span key={ch} className="px-2.5 py-1 bg-[#030712] border border-cyan-500/30 text-cyan-300 rounded-lg font-mono text-[10px] font-bold">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Observable Signals */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Observable Signals</span>
                  <ul className="mt-1.5 space-y-1.5 text-slate-300">
                    {activeScenario.observable_signals.map((sig, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] p-2 bg-[#030712]/60 rounded-xl border border-white/5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 shadow-neon-red"></span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Known Defense Blindspot Profile */}
                {activeScenario.blindspot_profile && (
                  <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-1 shadow-neon-amber">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[10px] uppercase">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Known Defense Blindspot Profile</span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
                      {activeScenario.blindspot_profile}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[#070c18] border border-white/10 rounded-3xl text-center text-slate-500 text-xs font-mono">
              Select an attack scenario to view full intelligence telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
