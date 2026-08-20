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
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {delta !== undefined && delta !== 0 && (
            <span className={`font-bold text-xs ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
          {showValue && (
            <span className="text-slate-200 font-semibold tabular-nums">{clampedValue}</span>
          )}
        </div>
      </div>
      <div className="stat-bar-bg">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
