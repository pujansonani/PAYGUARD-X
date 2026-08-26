import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Copy, Check, Sparkles, Printer, FileText, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const Reports: React.FC = () => {
  const [report, setReport] = useState<{ report_id: string; timestamp: string; content_markdown: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await api.generateReport();
      setReport(data);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([report.content_markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PAYGUARD_X_Report_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-950/40 via-[#070c18] to-cyan-950/40 border border-emerald-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 rounded-full shadow-neon-emerald">
              EXECUTIVE & TECHNICAL REPORT
            </span>
            <span className="text-xs text-slate-400 font-mono">AUTOMATED SECURITY ARTIFACT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            Defense Intelligence & Audit Dossier
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Exports a comprehensive structured security briefing covering threat intelligence, attack fidelity metrics, multi-model detection performance, and institutional fintech deployment feasibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2.5 bg-[#030712] border border-white/10 hover:border-cyan-500/50 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-cyan-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={downloadReport}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-emerald flex items-center gap-2 transition"
          >
            <Download className="h-4 w-4" />
            <span>Download Report (.md)</span>
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div className="p-6 md:p-8 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-6 shadow-glass-card backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 text-xs font-mono text-slate-400 gap-2">
          <div>
            Report Dossier ID: <span className="font-bold text-cyan-400">{report?.report_id || 'REP-ACTIVE'}</span>
          </div>
          <div>Generated: {report?.timestamp || new Date().toISOString()}</div>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
          <pre className="p-6 bg-[#030712] rounded-2xl border border-white/10 overflow-x-auto whitespace-pre-wrap text-slate-200 font-mono leading-relaxed text-xs">
            {report?.content_markdown || 'Generating intelligence report...'}
          </pre>
        </div>
      </div>
    </div>
  );
};
