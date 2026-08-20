import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatBar } from '../components/ui/StatBar';
import { RoleBadge } from '../components/ui/RoleBadge';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { TIER_ICONS } from '../data/ranks';
import { REGION_FLAGS } from '../data/teams';
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
  const totalSoloQGames = career.soloqWins + career.soloqLosses;
  const soloQWinrate = totalSoloQGames > 0 ? Math.round((career.soloqWins / totalSoloQGames) * 100) : 0;
  const isChampion = career.worldsWins > 0;
  const rankIcon = TIER_ICONS[career.rank.tier] || '🏆';

  return (
    <div className="screen-bg min-h-screen py-8 px-4 pb-16">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Top Header with Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher size="sm" />
        </div>

        {/* Trophy / Memorial Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="text-center py-4"
        >
          <motion.div
            animate={isChampion ? { rotate: [0, -6, 6, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`text-7xl ${isChampion ? 'trophy-glow' : 'opacity-70'}`}
          >
            {isChampion ? '🏆' : '📜'}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 space-y-1"
          >
            <h1 className="text-3xl font-black text-white uppercase font-heading tracking-wide">
              {career.gameName}
            </h1>
            <p className="text-gold-400 font-bold text-lg font-heading">{t(titleKey as any)}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <RoleBadge role={career.role} size="md" />
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-300 text-sm font-semibold">{REGION_FLAGS[career.region]} {career.region}</span>
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-400 text-sm">
                {career.currentTeam ? career.currentTeam.name : 'SoloQ Talent (Bez týmu)'} · Věk {career.age}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Final Career Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card gold className="p-6 text-center shadow-2xl">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
              Celkové Skóre Běhu (Career Score)
            </p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-7xl font-black text-gold-400 font-mono tracking-tight font-heading"
            >
              {score}
            </motion.p>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Vypočteno z trofejí, SoloQ ranku, reputace a financí
            </p>
          </Card>
        </motion.div>

        {/* SoloQ & Competitive Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-rift-border pb-2">
              ⚔️ SoloQ & Herní Výsledky
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-rift-surface p-3 rounded-xl border border-rift-border">
                <div className="text-2xl mb-1">{rankIcon}</div>
                <p className="text-white font-bold text-sm">{career.rank.tier} {career.rank.division || ''}</p>
                <p className="text-[11px] text-slate-400 font-mono">{career.rank.lp} LP (#{career.rank.globalRank?.toLocaleString() || '1.5M'})</p>
              </div>

              <div className="bg-rift-surface p-3 rounded-xl border border-rift-border">
                <p className="text-xl font-black text-blue-400 font-mono">{soloQWinrate}%</p>
                <p className="text-xs font-bold text-slate-200 mt-1">SoloQ Win Rate</p>
                <p className="text-[11px] text-slate-400 font-mono">{career.soloqWins}V - {career.soloqLosses}P</p>
              </div>

              <div className="bg-rift-surface p-3 rounded-xl border border-rift-border col-span-2 sm:col-span-1">
                <p className="text-xl font-black text-purple-400 font-mono">{(career.streamFollowers ?? 0).toLocaleString()}</p>
                <p className="text-xs font-bold text-slate-200 mt-1">Twitch Followerů</p>
                <p className="text-[11px] text-slate-400">Stream audience</p>
              </div>
            </div>

            {/* Pro Titles */}
            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div className="bg-gold-950/30 p-2.5 rounded-xl border border-gold-600/30">
                <p className="text-2xl font-black text-gold-400 font-mono">{career.worldsWins}</p>
                <p className="text-[11px] text-slate-300 font-bold">🏆 Worlds</p>
              </div>
              <div className="bg-blue-950/30 p-2.5 rounded-xl border border-blue-600/30">
                <p className="text-2xl font-black text-blue-400 font-mono">{career.msiWins}</p>
                <p className="text-[11px] text-slate-300 font-bold">🌍 MSI</p>
              </div>
              <div className="bg-purple-950/30 p-2.5 rounded-xl border border-purple-600/30">
                <p className="text-2xl font-black text-purple-400 font-mono">{career.splitTitles}</p>
                <p className="text-[11px] text-slate-300 font-bold">🥇 Splity</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-rift-border flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Ušetřené Jmění:</span>
              <span className="text-green-400 font-mono font-bold">{formatMoney(career.finances.savings)}</span>
            </div>
          </Card>
        </motion.div>

        {/* Final Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 space-y-3">
            <p className="text-sm font-bold text-slate-200 border-b border-rift-border pb-2">
              📊 Konečné Atributy Hráče
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {STATS.map(stat => (
                <StatBar key={stat} label={t(`stat.${stat}` as any)} value={career.stats[stat]} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons: New Career or Return to Menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-2 space-y-3"
        >
          <Button
            variant="gold"
            size="lg"
            fullWidth
            onClick={() => {
              resetGame();
              setPhase('CHARACTER_CREATION');
            }}
          >
            🚀 Začít Nový RUN (Nová Kariéra)
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              resetGame();
              setPhase('MENU');
            }}
          >
            🏠 Zpět do Hlavního Menu
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
