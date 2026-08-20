import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { RoleBadge } from '../components/ui/RoleBadge';
import { REGION_FLAGS } from '../data/teams';

export function MenuScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const dailyChallenge = useGameStore(s => s.dailyChallenge);
  const setPhase = useGameStore(s => s.setPhase);
  const loadDailyChallenge = useGameStore(s => s.loadDailyChallenge);
  const setLanguage = useGameStore(s => s.setLanguage);
  const language = useGameStore(s => s.language);

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

  return (
    <div className="screen-bg min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-lg px-4 space-y-6">

        {/* Language Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'cs' : 'en')}
            className="text-xs text-slate-500 hover:text-slate-300 border border-rift-border px-2 py-1 rounded transition-colors"
          >
            {language === 'en' ? '🇨🇿 CS' : '🇬🇧 EN'}
          </button>
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
            <h1 className="text-5xl font-black tracking-tight leading-none" style={{ fontFamily: 'Cinzel, serif' }}>
              <span className="text-white">RIFT </span>
              <span className="text-gold-400 animate-glow">LEGACY</span>
            </h1>
            <p className="text-slate-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
              {t('menu.tagline')}
            </p>
          </div>

          {/* Region logos */}
          <div className="flex justify-center gap-2 text-xl opacity-40">
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

        {/* Main Buttons */}
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
              ▶ {t('menu.resume')}
            </Button>
          )}

          <Button
            variant={career ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            onClick={() => setPhase('CHARACTER_CREATION')}
          >
            {career ? '+ ' : '▶ '}{t('menu.new')}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => setPhase('DAILY_CHALLENGE')}
          >
            📅 {t('menu.daily')}
          </Button>
        </motion.div>

        {/* Best Career Card */}
        {career && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-rift-card border border-gold-600/20 rounded-xl p-4 space-y-2"
          >
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
              {t('menu.best_career')}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💀</span>
                <div>
                  <p className="text-white font-semibold text-sm">{career.gameName}</p>
                  <p className="text-slate-400 text-xs">
                    {t(careerNameKey as any)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gold-400 font-black text-2xl">{bestScore}</p>
                <div className="flex items-center gap-1 justify-end">
                  <RoleBadge role={career.role} size="sm" />
                  <span className="text-slate-500 text-xs">{REGION_FLAGS[career.region]}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Challenge Preview */}
        {dailyChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-rift-card border border-rift-border rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                {t('daily.title')}
              </p>
              <span className="text-xs bg-purple-900/60 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded-full font-semibold">
                {t('daily.new')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('menu.daily.role')}</p>
                <RoleBadge role={dailyChallenge.role} size="md" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('menu.daily.region')}</p>
                <span className="text-white text-sm font-medium">
                  {REGION_FLAGS[dailyChallenge.region]} {dailyChallenge.region}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">{t('menu.daily.objective')}</p>
              <p className="text-white text-sm font-medium">
                {t(dailyChallenge.objectiveKey as any, dailyChallenge.objectiveTarget)}
              </p>
            </div>

            <Button variant="secondary" fullWidth onClick={() => setPhase('DAILY_CHALLENGE')}>
              {t('menu.daily.play')}
            </Button>
          </motion.div>
        )}

        <p className="text-center text-slate-600 text-xs">{t('menu.not_affiliated')}</p>
      </div>
    </div>
  );
}
