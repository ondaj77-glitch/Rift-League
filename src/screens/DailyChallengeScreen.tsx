import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { RoleBadge } from '../components/ui/RoleBadge';
import { REGION_FLAGS } from '../data/teams';
import { motion } from 'framer-motion';

import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function DailyChallengeScreen() {
  const { t } = useTranslation();
  const daily = useGameStore(s => s.dailyChallenge);
  const startDailyChallenge = useGameStore(s => s.startDailyChallenge);
  const setPhase = useGameStore(s => s.setPhase);
  const loadDailyChallenge = useGameStore(s => s.loadDailyChallenge);

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  if (!daily) return null;

  return (
    <div className="screen-bg min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setPhase('MENU')} className="text-slate-400 hover:text-white text-xl">←</button>
            <h1 className="text-2xl font-black text-white font-heading uppercase tracking-wide">
              {t('daily.title')}
            </h1>
          </div>
          <LanguageSwitcher size="sm" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-rift-card border border-rift-border rounded-2xl p-6 space-y-5">

          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">{t('menu.daily.role')}</p>
            <RoleBadge role={daily.role} size="lg" />
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">{t('menu.daily.region')}</p>
            <p className="text-white font-semibold">{REGION_FLAGS[daily.region]} {daily.region}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">{t('daily.objective')}</p>
            <p className="text-white font-semibold">
              {t(daily.objectiveKey as any, daily.objectiveTarget)}
            </p>
          </div>

          <div className="text-xs text-slate-600 border-t border-rift-border pt-4">
            Same challenge for everyone today · {daily.date}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Button variant="gold" size="lg" fullWidth onClick={() => {
            startDailyChallenge();
          }}>
            📅 {t('menu.daily.play')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
