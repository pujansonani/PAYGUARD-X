import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Cpu, Activity, Zap, Radio } from 'lucide-react';

interface CyberLoadingScreenProps {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

const statusPhrases = [
  'Synthesizing High-Fidelity Attack Telemetry...',
  'Evaluating Multi-Model Ensemble Stacking Arbiter...',
  'Extracting SHAP Tree Kernel Attributions...',
  'Analyzing False-Negative Blindspot Feature Vectors...',
  'Probing Adversarial Mutation Bounds & Decision Thresholds...',
  'Synchronizing Mastercard 3DS 2.3 & ISO 20022 Telemetry Rails...'
];

export const CyberLoadingScreen: React.FC<CyberLoadingScreenProps> = ({
  isLoading,
  message = 'PAYGUARD-X DEFENSE ENGINE ACTIVE',
  subMessage,
  fullScreen = true
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isLoading) return;
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % statusPhrases.length);
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 25 : prev + Math.floor(Math.random() * 12) + 4));
    }, 400);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className={
            fullScreen
              ? 'fixed inset-0 z-50 bg-[#030712]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 select-none overflow-hidden'
              : 'relative w-full py-16 flex flex-col items-center justify-center select-none overflow-hidden'
          }
        >
          {/* Ambient Background Grid and Glows */}
          <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1.2s' }}></div>

          {/* Central Gyroscope Radar Scanner */}
          <div className="relative flex items-center justify-center w-48 h-48 mb-8">
            {/* Outer Ring 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40"
            />

            {/* Middle Ring 2 with Accent Notches */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-3 rounded-full border border-white/10 border-t-cyan-400 border-b-red-500 shadow-neon-cyan"
            />

            {/* Inner Ring 3 with Radar Sweep */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-7 rounded-full border border-cyan-400/30 overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-tr from-cyan-500/20 via-transparent to-transparent"></div>
            </motion.div>

            {/* Hexagonal Center Core */}
            <motion.div
              animate={{ scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative p-4 rounded-2xl bg-gradient-to-br from-[#0b1b36] via-[#070c18] to-[#1a070e] border border-cyan-400/60 shadow-neon-cyan flex items-center justify-center"
            >
              <Shield className="h-8 w-8 text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
            </motion.div>

            {/* Orbiting Satellite Particle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 flex items-start justify-center"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-neon-amber -mt-1.5 animate-ping"></div>
            </motion.div>
          </div>

          {/* Status Typography & Live Feed */}
          <div className="text-center space-y-3 max-w-md relative z-10 px-4">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
              <h3 className="font-display font-black text-sm uppercase tracking-widest text-white">
                {message}
              </h3>
            </div>

            {/* Dynamic Changing Status Text */}
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-mono text-cyan-300 tracking-tight min-h-[1.5rem]"
            >
              &gt; {subMessage || statusPhrases[phraseIndex]}
            </motion.p>

            {/* Shimmering Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="w-64 h-1.5 mx-auto bg-slate-900 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500 rounded-full shadow-neon-cyan"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between w-64 mx-auto text-[10px] font-mono text-slate-500">
                <span>AI ENGINE LATENCY: 12ms</span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
