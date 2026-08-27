import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 animate-pulse backdrop-blur-xl">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="h-4 bg-slate-800 rounded w-1/6"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-900 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
};
