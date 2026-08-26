import React from 'react';
import { ConfusionMatrix } from '../types';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ConfusionMatrixViewProps {
  matrix: ConfusionMatrix;
  title?: string;
}

export const ConfusionMatrixView: React.FC<ConfusionMatrixViewProps> = ({
  matrix,
  title = 'Ensemble Classification Confusion Matrix'
}) => {
  const total = matrix.tn + matrix.fp + matrix.fn + matrix.tp || 1;
  const tn = matrix.tn;
  const fp = matrix.fp;
  const fn = matrix.fn;
  const tp = matrix.tp;

  const tnPct = ((tn / total) * 100).toFixed(1);
  const fpPct = ((fp / total) * 100).toFixed(1);
  const fnPct = ((fn / total) * 100).toFixed(1);
  const tpPct = ((tp / total) * 100).toFixed(1);
  const accuracy = (((tn + tp) / total) * 100).toFixed(1);

  return (
    <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-glass-card">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">{title}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Evaluation on non-overlapping test verification split</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono">Accuracy:</span>
          <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            {accuracy}%
          </span>
        </div>
      </div>

      {/* 2x2 Grid of Confusion Matrix Quadrants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* True Negative */}
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-black text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>True Negative (TN)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-300 font-bold">{tnPct}%</span>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-300 drop-shadow-sm">
            {tn.toLocaleString()}
          </p>
          <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${tnPct}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Legitimate transactions correctly authorized</p>
        </div>

        {/* False Positive */}
        <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-black text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>False Positive (FP)</span>
            </span>
            <span className="text-[10px] font-mono text-amber-300 font-bold">{fpPct}%</span>
          </div>
          <p className="text-2xl font-black font-mono text-amber-300 drop-shadow-sm">
            {fp.toLocaleString()}
          </p>
          <div className="w-full bg-amber-950/80 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${fpPct}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">False alarms / customer friction alerts</p>
        </div>

        {/* False Negative */}
        <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-black text-red-400 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>False Negative (FN)</span>
            </span>
            <span className="text-[10px] font-mono text-red-300 font-bold">{fnPct}%</span>
          </div>
          <p className="text-2xl font-black font-mono text-red-400 drop-shadow-sm">
            {fn.toLocaleString()}
          </p>
          <div className="w-full bg-red-950/80 rounded-full h-1.5 overflow-hidden">
            <div className="bg-red-500 h-1.5 rounded-full shadow-neon-red" style={{ width: `${fnPct}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Missed attacks (Fed into Mutation Loop)</p>
        </div>

        {/* True Positive */}
        <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-black text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>True Positive (TP)</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">{tpPct}%</span>
          </div>
          <p className="text-2xl font-black font-mono text-cyan-300 drop-shadow-sm">
            {tp.toLocaleString()}
          </p>
          <div className="w-full bg-cyan-950/80 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-1.5 rounded-full shadow-neon-cyan" style={{ width: `${tpPct}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Fraud attacks intercepted & blocked</p>
        </div>
      </div>
    </div>
  );
};
