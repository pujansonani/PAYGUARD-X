import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, CheckCircle2, Sliders, Shield, Layers, Cpu } from 'lucide-react';
import { api } from '../services/api';
import { SystemSettings } from '../types';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [lowMed, setLowMed] = useState(30.0);
  const [medHigh, setMedHigh] = useState(70.0);
  const [wXgb, setWXgb] = useState(0.50);
  const [wRf, setWRf] = useState(0.35);
  const [wIso, setWIso] = useState(0.15);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
      setLowMed(data.thresholds.low_medium);
      setMedHigh(data.thresholds.medium_high);
      setWXgb(data.weights.xgb);
      setWRf(data.weights.rf);
      setWIso(data.weights.iso);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updateSettings({
        threshold_low_medium: lowMed,
        threshold_medium_high: medHigh,
        weight_xgb: wXgb,
        weight_rf: wRf,
        weight_iso: wIso
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDefaults = () => {
    setLowMed(30.0);
    setMedHigh(70.0);
    setWXgb(0.50);
    setWRf(0.35);
    setWIso(0.15);
  };

  const totalW = wXgb + wRf + wIso || 1.0;
  const pctXgb = ((wXgb / totalW) * 100).toFixed(0);
  const pctRf = ((wRf / totalW) * 100).toFixed(0);
  const pctIso = ((wIso / totalW) * 100).toFixed(0);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-[#070c18] to-cyan-950/40 border border-cyan-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 rounded-full shadow-neon-cyan">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs text-slate-400 font-mono">POLICY & ARBITER WEIGHTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            Risk Thresholds & Stacking Policies
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Customize decision boundaries (ALLOW, REVIEW, BLOCK) and tune stacking meta-classifier weights between supervised gradients (XGBoost/RF) and unsupervised anomaly scoring (Isolation Forest).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-[#030712] border border-white/10 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-cyan flex items-center gap-2 transition"
          >
            {saved ? <CheckCircle2 className="h-4 w-4 text-slate-950" /> : <Save className="h-4 w-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Policies'}</span>
          </button>
        </div>
      </div>

      {/* Threshold Sliders Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decision Boundaries */}
        <div className="p-6 md:p-8 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-6 shadow-glass-card backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Decision Threshold Policies</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-500">Tiered Actions</span>
          </div>

          <div className="space-y-6">
            {/* Low to Medium (ALLOW -> REVIEW) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">ALLOW &rarr; REVIEW THRESHOLD:</span>
                <span className="text-amber-400 font-black">{lowMed.toFixed(1)} / 100</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={1}
                value={lowMed}
                onChange={(e) => setLowMed(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <p className="text-[10px] text-slate-500 font-mono">
                Transactions scoring below {lowMed} are automatically authorized.
              </p>
            </div>

            {/* Medium to High (REVIEW -> BLOCK) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">REVIEW &rarr; BLOCK THRESHOLD:</span>
                <span className="text-red-400 font-black">{medHigh.toFixed(1)} / 100</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                step={1}
                value={medHigh}
                onChange={(e) => setMedHigh(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <p className="text-[10px] text-slate-500 font-mono">
                Transactions scoring at or above {medHigh} are intercepted and blocked immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Ensemble Stacking Weights */}
        <div className="p-6 md:p-8 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-6 shadow-glass-card backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-400" />
              <span>Arbiter Stacking Weights</span>
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">XGB: {pctXgb}% | RF: {pctRf}% | ISO: {pctIso}%</span>
          </div>

          <div className="space-y-5">
            {/* Visual Weight Balance Bar */}
            <div className="w-full bg-[#030712] rounded-full h-3 overflow-hidden flex border border-white/10">
              <div className="bg-cyan-400 h-full" style={{ width: `${pctXgb}%` }}></div>
              <div className="bg-purple-500 h-full" style={{ width: `${pctRf}%` }}></div>
              <div className="bg-amber-400 h-full" style={{ width: `${pctIso}%` }}></div>
            </div>

            {/* XGBoost Weight */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">XGBoost Classifier:</span>
                <span className="text-white font-black">{wXgb.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={wXgb}
                onChange={(e) => setWXgb(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Random Forest Weight */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-purple-400 font-bold">Random Forest:</span>
                <span className="text-white font-black">{wRf.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={wRf}
                onChange={(e) => setWRf(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Isolation Forest Weight */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">Isolation Forest (Unsupervised):</span>
                <span className="text-white font-black">{wIso.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.05}
                value={wIso}
                onChange={(e) => setWIso(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
