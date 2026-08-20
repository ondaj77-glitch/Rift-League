import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatBar } from '../components/ui/StatBar';
import { RoleBadge } from '../components/ui/RoleBadge';
import type { StatKey } from '../types/game';

const STATS: StatKey[] = ['mechanics', 'gameKnowledge', 'communication', 'mental', 'adaptability', 'reputation'];

function getCareerTitle(score: number): string {
  if (score >= 90) return 'career_name.90';
  if (score >= 80) return 'career_name.80';
  if (score >= 70) return 'career_name.70';
  if (score >= 60) return 'career_name.60';
  if (score >= 50) return 'career_name.50';
  if (score >= 40) return 'career_name.40';
  if (score >= 30) return 'career_name.30';
  if (score >= 20) return 'career_name.20';
  if (score >= 10) return 'career_name.10';
  return 'career_name.0';
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}

export function RetirementScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const resetGame = useGameStore(s => s.resetGame);
  const setPhase = useGameStore(s => s.setPhase);

  if (!career) return null;

  const score = career.careerScore;
  const titleKey = getCareerTitle(score);
  const yearsPlayed = career.age - 18;
  const isChampion = career.worldsWins > 0;

  return (
    <div className="screen-bg min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Trophy / Memorial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="text-center py-10"
        >
          <motion.div
            animate={isChampion ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className={`text-8xl ${isChampion ? 'trophy-glow' : 'opacity-60'}`}
          >
            {isChampion ? '🏆' : '💙'}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-2"
          >
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Cinzel, serif' }}>
              {career.gameName}
            </h1>
            <p className="text-gold-400 font-semibold text-lg">{t(titleKey as any)}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <RoleBadge role={career.role} size="md" />
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-400 text-sm">{career.startRegion}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card gold className="p-6 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{t('retire.score')}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-7xl font-black text-gold-400"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {score}
            </motion.p>
          </Card>
        </motion.div>

        {/* Career Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-black text-gold-400">{career.worldsWins}</p>
                <p className="text-xs text-slate-500 mt-1">{t('retire.worlds_wins')}</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-400">{career.msiWins}</p>
                <p className="text-xs text-slate-500 mt-1">{t('retire.msi_wins')}</p>
              </div>
              <div>
                <p className="text-3xl font-black text-purple-400">{career.splitTitles}</p>
                <p className="text-xs text-slate-500 mt-1">Split Titles</p>
              </div>
              <div>
                <p className="text-3xl font-black text-green-400">{yearsPlayed}</p>
                <p className="text-xs text-slate-500 mt-1">{t('retire.years')}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-rift-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('retire.age_retired')}</p>
                <p className="text-white font-bold">{career.age}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Savings</p>
                <p className="text-white font-bold">{formatMoney(career.finances.savings)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Final Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="px-5 py-4 border-b border-rift-border">
              <p className="text-sm font-semibold text-slate-200">{t('retire.stats_final')}</p>
            </div>
            <div className="p-5 space-y-3">
              {STATS.map(stat => (
                <StatBar key={stat} label={t(`stat.${stat}` as any)} value={career.stats[stat]} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Achievements */}
        {career.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <div className="px-5 py-4 border-b border-rift-border">
                <p className="text-sm font-semibold text-slate-200">{t('retire.achievements')}</p>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {career.achievements.map((a, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="text-xs bg-gold-600/10 border border-gold-600/30 text-gold-400 px-3 py-1.5 rounded-full"
                  >
                    {t(a.titleKey as any)} · {a.year}
                  </motion.span>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pb-8 space-y-3"
        >
          <Button variant="gold" size="lg" fullWidth onClick={() => {
            resetGame();
            setPhase('CHARACTER_CREATION');
          }}>
            🔄 {t('retire.play_again')}
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={() => {
            resetGame();
            setPhase('MENU');
          }}>
            ← {t('menu.resume').replace('Resume', 'Back to')} Menu
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
