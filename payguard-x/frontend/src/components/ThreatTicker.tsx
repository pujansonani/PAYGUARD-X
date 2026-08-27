import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Zap, Radio, Globe2, CreditCard } from 'lucide-react';

export const ThreatTicker: React.FC = () => {
  const events = [
    { type: 'BLOCK', text: 'ATO Session Hijack Intercepted • $4,200.00 USD (INSTANT_PAYMENT)', channel: 'RTP', rail: 'FEDNOW' },
    { type: 'ALLOW', text: 'Benign E-Commerce Auth • $142.50 USD (CARD_NOT_PRESENT)', channel: '3DS 2.3', rail: 'MASTERCARD' },
    { type: 'BLOCK', text: 'Executive Voice Deepfake Wire Prevented • $18,500.00 USD', channel: 'WIRE', rail: 'SWIFT ISO 20022' },
    { type: 'REVIEW', text: 'Synthetic Identity Mule Burst Step-Up • $890.00 USD', channel: 'P2P', rail: 'TOKENIZED' },
    { type: 'ALLOW', text: 'Verified Biometric POS Mobile Tap • $45.20 USD', channel: 'POS', rail: 'EMV CONTACTLESS' },
    { type: 'BLOCK', text: 'Automated Bot Credential Stuffing Suppressed • 120 req/s', channel: 'API GATEWAY', rail: 'WAF' }
  ];

  return (
    <div className="w-full bg-[#030712] border-b border-white/[0.08] overflow-hidden py-1.5 px-4 flex items-center gap-3 text-xs font-mono select-none">
      <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-400 font-bold text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
        <span>THREAT TICKER</span>
      </div>

      <div className="overflow-hidden relative w-full flex">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
          className="flex items-center gap-8 shrink-0 whitespace-nowrap"
        >
          {[...events, ...events].map((ev, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
              {ev.type === 'BLOCK' ? (
                <span className="px-1.5 py-0.2 text-[9px] font-black bg-red-950 text-red-400 border border-red-800 rounded">
                  BLOCKED
                </span>
              ) : ev.type === 'REVIEW' ? (
                <span className="px-1.5 py-0.2 text-[9px] font-black bg-amber-950 text-amber-400 border border-amber-800 rounded">
                  STEP-UP
                </span>
              ) : (
                <span className="px-1.5 py-0.2 text-[9px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  AUTHORIZED
                </span>
              )}

              <span>{ev.text}</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                {ev.rail}
              </span>
              <span className="text-slate-600">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
