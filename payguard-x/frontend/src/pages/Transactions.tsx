import React, { useState, useEffect } from 'react';
import { ReceiptText, Search, Filter, Download, FileSpreadsheet, CheckCircle2, AlertCircle, ShieldAlert, Zap } from 'lucide-react';
import { api } from '../services/api';
import { SyntheticTransaction } from '../types';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<SyntheticTransaction[]>([]);
  const [search, setSearch] = useState('');
  const [fraudOnly, setFraudOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [fraudOnly, selectedCategory]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.getTransactions({
        limit: 200,
        fraud_only: fraudOnly,
        category: selectedCategory === 'ALL' ? undefined : selectedCategory
      });
      setTransactions(res.transactions);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter((tx) => {
    const s = search.toLowerCase();
    return (
      tx.transaction_id.toLowerCase().includes(s) ||
      tx.merchant_category.toLowerCase().includes(s) ||
      tx.attack_family.toLowerCase().includes(s) ||
      tx.payment_channel.toLowerCase().includes(s)
    );
  });

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = Object.keys(filtered[0]).join(',');
    const rows = filtered.map((tx) => Object.values(tx).join(','));
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `transactions_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-cyan-950/40 via-[#070c18] to-slate-950 border border-cyan-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 rounded-full shadow-neon-cyan">
              LIVE TELEMETRY LEDGER
            </span>
            <span className="text-xs text-slate-400 font-mono">SANDBOX TELEMETRY STREAM</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            Payment Transaction Ledger Explorer
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Search, filter, and audit live synthetic transactions with ground truth labels, AI multi-model predictions, calibrated risk scores, and decision states.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-5 py-3 bg-[#030712] border border-white/10 hover:border-emerald-500/50 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition shadow-glass-card hover:scale-105 active:scale-95"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="p-4 bg-[#070c18]/90 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-glass-card backdrop-blur-xl">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <Search className="h-4 w-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search by Transaction ID, Merchant, Vector, or Rail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 w-full focus:outline-none focus:border-cyan-500 font-mono transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer p-2 bg-[#030712] rounded-xl border border-white/10">
            <input
              type="checkbox"
              checked={fraudOnly}
              onChange={(e) => setFraudOnly(e.target.checked)}
              className="rounded bg-slate-950 border-white/20 text-red-500 focus:ring-0"
            />
            <span className="font-bold text-red-400">Fraud Only</span>
          </label>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#030712] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Categories</option>
            <option value="Social Engineering">Social Engineering</option>
            <option value="Phishing / Smishing">Phishing / Smishing</option>
            <option value="Voice / Deepfake">Voice / Deepfake</option>
            <option value="Account Takeover">Account Takeover</option>
            <option value="Synthetic Identity">Synthetic Identity</option>
            <option value="Transaction Manipulation">Transaction Manipulation</option>
            <option value="Digital Payment">Digital Payment</option>
            <option value="Automated Fraud">Automated Fraud</option>
            <option value="Network Fraud">Network Fraud</option>
            <option value="Cross-Channel">Cross-Channel</option>
          </select>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-3.5 shadow-glass-card backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Displaying {filtered.length} Transaction Records</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{loading ? 'Refreshing ledger...' : 'Live Synced'}</span>
          </span>
        </div>

        <div className="overflow-x-auto border border-white/10 rounded-2xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#030712] text-slate-400 uppercase text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5">TX ID</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Merchant</th>
                <th className="p-3.5">Threat Vector</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Decision</th>
                <th className="p-3.5 text-right">Ground Truth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((tx) => {
                const isFN = tx.fraud_label === 1 && tx.prediction !== 'BLOCK';
                return (
                  <tr
                    key={tx.transaction_id}
                    className={`transition-colors ${isFN ? 'bg-amber-950/20 hover:bg-amber-950/30' : 'hover:bg-white/[0.03]'}`}
                  >
                    <td className="p-3.5 font-bold text-slate-300 truncate max-w-[140px]">{tx.transaction_id}</td>
                    <td className="p-3.5 text-white font-bold">${tx.amount.toFixed(2)}</td>
                    <td className="p-3.5 text-slate-400">{tx.payment_channel}</td>
                    <td className="p-3.5 text-slate-400">{tx.merchant_category}</td>
                    <td className="p-3.5 text-amber-300 font-sans font-medium">{tx.attack_family}</td>
                    <td className="p-3.5 font-bold text-cyan-400">{tx.risk_score?.toFixed(1) || 'N/A'}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.prediction === 'BLOCK'
                            ? 'bg-red-950 text-red-400 border border-red-800 shadow-neon-red'
                            : tx.prediction === 'REVIEW'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {tx.prediction || 'ALLOW'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {tx.fraud_label === 1 ? (
                        <span className="px-2 py-0.5 bg-red-950/90 text-red-400 border border-red-500/50 rounded text-[10px] font-black shadow-neon-red">
                          FRAUD
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 rounded text-[10px] font-black shadow-neon-emerald">
                          LEGIT
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
