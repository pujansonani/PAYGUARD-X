import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, ShieldCheck, Copy, Check, FileJson, Activity, Layers, ArrowRight, ExternalLink } from 'lucide-react';
import { SyntheticTransaction } from '../types';
import { playCyberSound } from '../utils/audio';

interface TransactionDrawerProps {
  transaction: SyntheticTransaction | null;
  onClose: () => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({ transaction, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'json' | 'signals'>('overview');
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(transaction, null, 2));
    setCopied(true);
    playCyberSound('click');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end select-none"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-gradient-to-b from-[#0e172a] via-[#070c18] to-[#030712] border-l border-cyan-500/40 h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl shadow-cyan-950/80"
        >
          <div className="space-y-6">
            {/* Top Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {transaction.transaction_id}
                  </span>
                  {transaction.fraud_label === 1 ? (
                    <span className="px-2 py-0.5 text-[9px] font-mono font-black bg-red-950 text-red-400 border border-red-800 rounded">
                      SYNTHETIC FRAUD INCIDENT
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-mono font-black bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                      BENIGN TRANSACTION
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-display font-black text-white mt-1.5 font-mono">
                  ${transaction.amount.toFixed(2)} {transaction.currency || 'USD'}
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  {transaction.attack_family} • {transaction.payment_channel}
                </p>
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

            {/* Sliding Tab Navigation */}
            <div className="flex items-center gap-1.5 p-1 bg-[#030712] rounded-xl border border-white/10 font-mono text-xs">
              {(['overview', 'json', 'signals'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    playCyberSound('click');
                    setActiveTab(tab);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold uppercase text-[10px] tracking-wider transition relative ${
                    activeTab === tab ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="drawerActiveTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-lg shadow-neon-cyan"
                      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs font-mono">
                {/* Risk Card */}
                <div className="p-4 bg-[#030712] rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">STACKING ARBITER SCORE</span>
                    <p className="text-2xl font-black text-cyan-400 mt-0.5">
                      {transaction.risk_score ? transaction.risk_score.toFixed(1) : '85.4'} / 100
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-black rounded-xl border ${
                      transaction.prediction === 'BLOCK'
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : transaction.prediction === 'REVIEW'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}
                  >
                    DECISION: {transaction.prediction || 'BLOCK'}
                  </span>
                </div>

                {/* Telemetry Key-Value Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#030712] rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500">Merchant Category</span>
                    <p className="text-white font-bold mt-0.5">{transaction.merchant_category}</p>
                  </div>
                  <div className="p-3 bg-[#030712] rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500">Burst Velocity</span>
                    <p className="text-white font-bold mt-0.5">{transaction.transaction_velocity} tx/hr</p>
                  </div>
                  <div className="p-3 bg-[#030712] rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500">Behavioral Deviation</span>
                    <p className="text-amber-400 font-bold mt-0.5">
                      {transaction.behavioural_deviation?.toFixed(1) || '78.2'} / 100
                    </p>
                  </div>
                  <div className="p-3 bg-[#030712] rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500">Device Hardware</span>
                    <p className="text-white font-bold mt-0.5">
                      {transaction.device_change === 1 ? 'NEW_HARDWARE' : 'TRUSTED'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>ISO 8583 / JSON Payload</span>
                  <button
                    onClick={copyJSON}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[#030712] rounded-2xl border border-white/10 overflow-x-auto text-[11px] font-mono text-cyan-300 max-h-80 leading-relaxed">
                  {JSON.stringify(transaction, null, 2)}
                </pre>
              </div>
            )}

            {activeTab === 'signals' && (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[10px] text-slate-400 uppercase">Tree Attribution Signal Weights</span>
                <div className="space-y-2">
                  {[
                    { feature: 'behavioural_deviation', points: '+28.4 pts', impact: 'HIGH' },
                    { feature: 'amount_vs_historical_avg', points: '+22.1 pts', impact: 'HIGH' },
                    { feature: 'transaction_velocity_1h', points: '+18.5 pts', impact: 'MED' },
                    { feature: 'device_fingerprint_change', points: '+12.0 pts', impact: 'MED' }
                  ].map((sig, i) => (
                    <div key={i} className="p-3 bg-[#030712] rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-slate-300">{sig.feature}</span>
                      <span className="text-red-400 font-bold">{sig.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-cyan mt-6 transition"
          >
            Close Inspector
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
