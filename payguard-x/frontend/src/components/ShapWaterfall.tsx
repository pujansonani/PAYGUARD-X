import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { FeatureContribution } from '../types';
import { Sparkles, Activity } from 'lucide-react';

interface ShapWaterfallProps {
  contributions: FeatureContribution[];
  title?: string;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  contributions,
  title = 'SHAP Signal Attribution & Feature Contributions'
}) => {
  return (
    <div className="p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-glass-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Marginal risk score offset points computed from XGBoost & Random Forest gradient trees
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/60 self-start sm:self-auto">
          FEATURE IMPORTANCE
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={contributions} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis
              type="number"
              stroke="#475569"
              tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
              domain={[0, 'dataMax + 5']}
            />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="#475569"
              width={160}
              tick={{ fontSize: 11, fill: '#e2e8f0', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#070c18',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '1rem',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                fontFamily: 'JetBrains Mono'
              }}
              formatter={(val: any, name: any, item: any) => [
                `+${val} pts (Observed Value: ${item.payload.value})`,
                'Risk Attribution'
              ]}
            />
            <Bar dataKey="contribution_points" radius={[0, 8, 8, 0]}>
              {contributions.map((entry, index) => {
                const fill =
                  entry.contribution_points > 15
                    ? '#FF3366'
                    : entry.contribution_points > 5
                    ? '#F59E0B'
                    : '#00F0FF';
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-[10px] text-slate-400 font-mono pt-3 border-t border-white/5">
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-lg bg-red-950/30 border border-red-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-neon-red"></span>
          <span className="text-red-300 font-bold">Critical Outlier (&gt;15 pts)</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-lg bg-amber-950/30 border border-amber-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-neon-amber"></span>
          <span className="text-amber-300 font-bold">Moderate Shift (5-15 pts)</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-neon-cyan"></span>
          <span className="text-cyan-300 font-bold">Baseline Pacing (&lt;5 pts)</span>
        </div>
      </div>
    </div>
  );
};
