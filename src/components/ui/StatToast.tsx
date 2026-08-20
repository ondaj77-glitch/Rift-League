import { motion, AnimatePresence } from 'framer-motion';

export interface StatNotification {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral' | 'gold';
  icon: string;
}

interface StatToastProps {
  notifications: StatNotification[];
}

export function StatToast({ notifications }: StatToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-xl backdrop-blur-md text-xs font-bold ${
              n.type === 'positive' ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300 shadow-emerald-950/50' :
              n.type === 'negative' ? 'bg-red-950/90 border-red-500/60 text-red-300 shadow-red-950/50' :
              n.type === 'gold' ? 'bg-amber-950/90 border-amber-500/60 text-amber-300 shadow-amber-950/50' :
              'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <span className="text-base">{n.icon}</span>
            <span>{n.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
