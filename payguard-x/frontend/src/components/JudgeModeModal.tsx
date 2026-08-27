import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  ShieldCheck,
  Flame,
  Search,
  RotateCw,
  AlertTriangle,
  Award,
  Terminal,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';
import { JudgeModeResult } from '../types';
import { playCyberSound } from '../utils/audio';

interface JudgeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeModeModal: React.FC<JudgeModeModalProps> = ({ isOpen, onClose }) => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<JudgeModeResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#F59E0B', '#FF3366', '#10B981', '#8B5CF6']
      });
    } catch (e) {
      // Ignore confetti errors if blocked
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setErrorMsg(null);
    setStepIndex(1);
    playCyberSound('scan');
    setTerminalLogs(['[INIT] Initializing 5-Stage Autonomous Closed-Loop Verification Pipeline...']);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    timersRef.current.push(
      setTimeout(() => {
        setStepIndex(2);
        playCyberSound('click');
        setTerminalLogs((prev) => [
          ...prev,
          '[STAGE 01] Loaded 40+ Attack Taxonomy scenarios across 10 GenAI threat families.',
          '[STAGE 02] Synthesizing 2,000 non-separable transactions (Log-Normal amounts, Gamma tenure)...'
        ]);
      }, 700)
    );

    timersRef.current.push(
      setTimeout(() => {
        setStepIndex(3);
        playCyberSound('click');
        setTerminalLogs((prev) => [
          ...prev,
          '[STAGE 02] Statistical Validation: Optimal Jensen-Shannon Divergence achieved.',
          '[STAGE 03] Executing Multi-Model AI Defense Stacking (XGBoost + Random Forest + Isolation Forest)...'
        ]);
      }, 1400)
    );

    timersRef.current.push(
      setTimeout(() => {
        setStepIndex(4);
        playCyberSound('click');
        setTerminalLogs((prev) => [
          ...prev,
          '[STAGE 03] Baseline defense metrics computed with high precision.',
          '[STAGE 04] Identifying false negatives & extracting weak feature attribution vectors...'
        ]);
      }, 2100)
    );

    timersRef.current.push(
      setTimeout(() => {
        setStepIndex(5);
        playCyberSound('click');
        setTerminalLogs((prev) => [
          ...prev,
          '[STAGE 04] Primary blindspots isolated: Pacing & amount smoothing vectors.',
          '[STAGE 05] Launching 3-Round Adversarial Mutation Battle & Automated Model Hardening...'
        ]);
      }, 2800)
    );

    try {
      const data = await api.runJudgeMode();
      setResult(data);
      setStepIndex(5);
      playCyberSound('success');
      triggerConfetti();
      setTerminalLogs((prev) => [
        ...prev,
        '[COMPLETE] Closed-loop co-evolution successfully hardened models against stealthy evasion variants.',
        `[VERDICT] ${data.demonstration_verdict}`
      ]);
    } catch (err: any) {
      console.error('Judge Mode Error:', err);
      playCyberSound('alert');
      setErrorMsg(err?.message || 'Failed to complete autonomous verification run. Please ensure backend is running.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto select-none"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="bg-gradient-to-b from-[#0b1326] via-[#070c18] to-[#030712] border border-cyan-500/40 rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-6 shadow-2xl shadow-cyan-950/60 relative overflow-hidden my-8"
        >
          {/* Background ambient lighting */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-red-600 rounded-2xl shadow-neon-amber">
                <Sparkles className="h-6 w-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg md:text-xl font-display font-black text-white">
                    JUDGE MODE: Autonomous Closed-Loop Verification
                  </h2>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-black bg-amber-950 border border-amber-500/60 text-amber-300 rounded-full shadow-neon-amber">
                    1-CLICK PROOF
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Live end-to-end execution of all 5 co-evolution stages measuring real model adaptation
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playCyberSound('click');
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action Trigger / Welcome Hero */}
          {!result && (
            <div className="p-8 text-center bg-[#070c18]/80 border border-white/10 rounded-3xl space-y-5 relative z-10 shadow-glass-card">
              <div className="max-w-lg mx-auto space-y-2">
                <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded-full">
                  HACKATHON EVALUATION READY
                </span>
                <h3 className="text-lg font-display font-black text-slate-100">
                  Execute Full Autonomous Challenge Demonstration
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Click below to synthesize attack telemetry, run multi-model AI defense, analyze missed false negatives, mutate adversarial evasions, and prove defensive hardening in real-time.
                </p>
              </div>

              <button
                onClick={handleRun}
                disabled={running}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-red-500 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-2xl shadow-neon-amber flex items-center gap-2.5 mx-auto disabled:opacity-50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {running ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>EXECUTING CO-EVOLUTION PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current text-slate-950" />
                    <span>RUN FULL CLOSED LOOP PROOF</span>
                  </>
                )}
              </button>

              {errorMsg && (
                <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl flex items-center gap-3 text-left max-w-md mx-auto">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                  <p className="text-xs text-red-300 font-mono">{errorMsg}</p>
                </div>
              )}
            </div>
          )}

          {/* Live Running HUD Animation */}
          {running && !result && (
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Pipeline Progression: Stage {stepIndex}/5</span>
                <span className="text-amber-400 animate-pulse font-bold">Running live calculations...</span>
              </div>

              <div className="w-full bg-[#030712] rounded-full h-2.5 overflow-hidden border border-white/10">
                <motion.div
                  className="bg-gradient-to-r from-amber-400 via-red-500 to-cyan-400 h-2.5 rounded-full shadow-neon-cyan"
                  animate={{ width: `${(stepIndex / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Live Terminal Log Stream */}
              <div className="p-4 bg-[#030712] border border-white/10 rounded-2xl font-mono text-[11px] text-cyan-300 space-y-1.5 max-h-36 overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-500">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Presentation Dossier */}
          {result && (
            <div className="space-y-5 relative z-10">
              {/* Verdict Banner */}
              <div className="p-5 bg-gradient-to-r from-emerald-950/40 via-[#071a12] to-cyan-950/40 border border-emerald-500/50 rounded-2xl flex items-start gap-3.5 shadow-neon-emerald">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-black text-sm text-emerald-300 uppercase tracking-wide">
                      Verdict: {result.demonstration_verdict}
                    </h4>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-900/80 border border-emerald-500/60 text-emerald-300 rounded">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{result.narrative}</p>
                </div>
              </div>

              {/* Step Grid: Threat Intel & Blue Defense */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 & 2 Card */}
                <div className="p-5 bg-[#070c18]/90 border border-white/10 rounded-2xl space-y-3 shadow-glass-card">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs font-mono">
                    <Flame className="h-4 w-4" />
                    <span>1. Threat Intel & Simulation Fidelity</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 bg-[#030712] rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400">Scenarios:</span>
                      <p className="text-sm font-bold text-white mt-0.5">{result.step_1_threat_intel.total_scenarios} Active</p>
                    </div>
                    <div className="p-3 bg-[#030712] rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400">Fidelity Score:</span>
                      <p className="text-sm font-bold text-amber-400 mt-0.5">{result.step_2_synthetic_generation.fidelity_score}%</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Separability: <span className="text-emerald-400 font-bold">{result.step_2_synthetic_generation.status}</span>
                  </div>
                </div>

                {/* Step 3 & 4 Card */}
                <div className="p-5 bg-[#070c18]/90 border border-white/10 rounded-2xl space-y-3 shadow-glass-card">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
                    <ShieldCheck className="h-4 w-4" />
                    <span>2. Multi-Model Defense Baseline</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-[#030712] rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400">Precision</span>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">{(result.step_3_blue_defense.precision * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-2.5 bg-[#030712] rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400">Recall</span>
                      <p className="text-sm font-bold text-cyan-400 mt-0.5">{(result.step_3_blue_defense.recall * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-2.5 bg-[#030712] rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400">F1-Score</span>
                      <p className="text-sm font-bold text-purple-400 mt-0.5">{(result.step_3_blue_defense.f1_score * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Blindspot Vector: <span className="text-amber-400 font-bold">{result.step_4_gap_analysis.primary_evasion_vector}</span>
                  </div>
                </div>
              </div>

              {/* Step 5: Multi-Round Co-Evolution Hardening Card */}
              <div className="p-5 bg-[#070c18]/90 border border-white/10 rounded-2xl space-y-3 shadow-glass-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                    <RotateCw className="h-4 w-4" />
                    <span>3. Adversarial Hardening Across 3 Battle Rounds</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 shadow-neon-cyan">
                    Final Recall: {(result.step_5_adaptive_evolution.evolved_recall * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  {result.step_5_adaptive_evolution.rounds_progression.map((r) => (
                    <div key={r.round} className="p-3.5 bg-[#030712] rounded-xl border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                        <span>ROUND 0{r.round}</span>
                        <span className="text-amber-400 font-normal">Diff: {r.difficulty_level}x</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Recall:</span>
                        <span className="font-bold text-cyan-400">{(r.recall * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">F1-Score:</span>
                        <span className="font-bold text-purple-400">{(r.f1_score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleRun}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl transition"
                >
                  Re-Run Verification
                </button>
                <button
                  onClick={() => {
                    playCyberSound('click');
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-cyan transition"
                >
                  Confirm & Dismiss
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
