import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { RoleBadge } from '../components/ui/RoleBadge';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { REGION_FLAGS } from '../data/teams';
import { TIER_ICONS } from '../data/ranks';

export function MenuScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const dailyChallenge = useGameStore(s => s.dailyChallenge);
  const setPhase = useGameStore(s => s.setPhase);
  const resetGame = useGameStore(s => s.resetGame);
  const loadDailyChallenge = useGameStore(s => s.loadDailyChallenge);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  const bestScore = career?.careerScore ?? 0;
  const careerNameKey = getCareerNameKey(bestScore);

  function getCareerNameKey(score: number): string {
    const thresholds = [90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
    for (const t of thresholds) {
      if (score >= t) return `career_name.${t}`;
    }
    return 'career_name.0';
  }

  function handleStartNewCareer() {
    if (career) {
      setConfirmResetOpen(true);
    } else {
      setPhase('CHARACTER_CREATION');
    }
  }

  function handleConfirmReset() {
    resetGame();
    setConfirmResetOpen(false);
    setPhase('CHARACTER_CREATION');
  }

  return (
    <div className="screen-bg min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-lg px-4 space-y-6">

        {/* Top Header with Side-by-Side Glowing Language Switcher */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">v15.2 · League Esports Simulator</span>
          <LanguageSwitcher />
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl trophy-glow select-none"
          >
            🏆
          </motion.div>

          <div>
            <h1 className="text-5xl font-black tracking-tight leading-none uppercase font-heading">
              <span className="text-white">RIFT </span>
              <span className="text-gold-400 animate-glow">LEGACY</span>
            </h1>
            <p className="text-slate-400 text-xs mt-3 max-w-xs mx-auto leading-relaxed font-medium">
              {t('menu.tagline')}
            </p>
          </div>

          {/* Region logos */}
          <div className="flex justify-center gap-2 text-xl opacity-60">
            {['🇰🇷', '🇨🇳', '🇪🇺', '🇺🇸', '🌎', '🌏'].map((flag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {flag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {career && (
            <Button
              variant="gold"
              size="lg"
              fullWidth
              onClick={() => setPhase('CAREER_HUB')}
            >
              ▶ {t('menu.resume')} ({career.gameName} · Věk {career.age})
            </Button>
          )}

          <Button
            variant={career ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={handleStartNewCareer}
          >
            🚀 {career ? 'Začít novou kariéru' : t('menu.new')}
          </Button>
        </motion.div>

        {/* Current Saved Run Card */}
        {career && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-rift-card border border-gold-600/30 rounded-xl p-4 space-y-2 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gold-400 uppercase tracking-widest font-bold">
                Aktuální Uložený Run
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Opravdu chceš smazat uloženou hru?')) {
                    resetGame();
                  }
                }}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                🗑️ Smazat save
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-1.5 bg-rift-surface rounded-lg border border-rift-border">
                  {TIER_ICONS[career.rank.tier] || '⚔️'}
                </span>
                <div>
                  <p className="text-white font-bold text-sm">{career.gameName}</p>
                  <p className="text-slate-400 text-xs">
                    {career.rank.tier} {career.rank.division || ''} ({career.rank.lp} LP) · Věk {career.age}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <RoleBadge role={career.role} size="sm" />
                  <span className="text-slate-300 text-xs font-bold">{REGION_FLAGS[career.region]}</span>
                </div>
                <p className="text-green-400 font-mono text-xs font-bold mt-0.5">${career.finances.savings.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Challenge Card (Single, Non-Duplicated) */}
        {dailyChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-rift-card border border-rift-border rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
                📅 {t('daily.title')}
              </p>
              <span className="text-xs bg-purple-900/60 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded-full font-semibold">
                {t('daily.new')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">{t('menu.daily.role')}</p>
                <RoleBadge role={dailyChallenge.role} size="md" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">{t('menu.daily.region')}</p>
                <span className="text-white text-sm font-medium">
                  {REGION_FLAGS[dailyChallenge.region]} {dailyChallenge.region}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">{t('menu.daily.objective')}</p>
              <p className="text-white text-sm font-bold">
                {t(dailyChallenge.objectiveKey as any, dailyChallenge.objectiveTarget)}
              </p>
            </div>

            <Button variant="secondary" fullWidth onClick={() => setPhase('DAILY_CHALLENGE')}>
              {t('menu.daily.play')}
            </Button>
          </motion.div>
        )}

        <p className="text-center text-slate-500 text-xs">{t('menu.not_affiliated')}</p>
      </div>

      {/* CONFIRM START NEW CAREER MODAL */}
      <AnimatePresence>
        {confirmResetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-rift-card border border-gold-600/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center"
            >
              <div className="text-5xl mb-2">🚀</div>
              <h3 className="text-xl font-bold text-white font-heading">
                Začít zbrusu novou kariéru?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Máš rozehranou kariéru za <strong>{career?.gameName}</strong> (Věk {career?.age}, {career?.rank.tier}). Spuštěním nové kariéry se stará hra přepíše.
              </p>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" fullWidth onClick={() => setConfirmResetOpen(false)}>
                  Zrušit
                </Button>
                <Button variant="gold" fullWidth onClick={handleConfirmReset}>
                  Ano, nová hra
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
