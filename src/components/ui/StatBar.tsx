import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number;
  delta?: number;
  color?: string;
  showValue?: boolean;
}

const STAT_COLORS: Record<number, string> = {
  0: 'from-red-600 to-red-500',
  30: 'from-orange-600 to-orange-500',
  50: 'from-yellow-600 to-yellow-500',
  70: 'from-green-600 to-green-500',
  85: 'from-emerald-500 to-teal-400',
};

function getStatColor(value: number): string {
  const thresholds = Object.keys(STAT_COLORS).map(Number).sort((a, b) => b - a);
  for (const t of thresholds) {
    if (value >= t) return STAT_COLORS[t];
  }
  return STAT_COLORS[0];
}

export function StatBar({ label, value, delta, showValue = true }: StatBarProps) {
  const color = getStatColor(value);
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-1 group">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{label}</span>
        <div className="flex items-center gap-2">
          {delta !== undefined && delta !== 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`font-black text-xs ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {delta > 0 ? `+${delta}` : delta}
            </motion.span>
          )}
          {showValue && (
            <motion.span
              key={clampedValue}
              initial={{ scale: 1.2, color: '#f59e0b' }}
              animate={{ scale: 1, color: '#e2e8f0' }}
              transition={{ duration: 0.3 }}
              className="font-bold tabular-nums font-mono text-xs"
            >
              {clampedValue}
            </motion.span>
          )}
        </div>
      </div>
      <div className="stat-bar-bg relative overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color} shadow-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
