import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { StatBar } from '../components/ui/StatBar';
import { Card, CardHeader } from '../components/ui/Card';
import { RoleBadge } from '../components/ui/RoleBadge';
import { REGION_FLAGS } from '../data/teams';
import { TIER_ICONS } from '../data/ranks';
import { SoloQScreen } from './SoloQScreen';
import { ChampionPoolScreen } from './ChampionPoolScreen';
import { LifestyleScreen } from './LifestyleScreen';
import { TransferMarketScreen } from './TransferMarketScreen';
import type { StatKey, HubTab } from '../types/game';

const STATS: StatKey[] = ['mechanics', 'gameKnowledge', 'communication', 'mental', 'adaptability', 'reputation'];

const SPLIT_ICONS: Record<string, string> = {
  Winter: '❄️', Spring: '🌸', Summer: '☀️',
};

export function CareerHubScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const currentTab = useGameStore(s => s.currentTab);
  const setCurrentTab = useGameStore(s => s.setCurrentTab);
  const advanceWeek = useGameStore(s => s.advanceWeek);
  const setPhase = useGameStore(s => s.setPhase);
  const currentEvent = useGameStore(s => s.currentEvent);

  if (!career) return null;

  const yearsLeft = Math.max(0, 30 - career.age);
  const rankIcon = TIER_ICONS[career.rank.tier];

  function handleContinue() {
    if (currentEvent) {
      setPhase('EVENT');
    } else {
      advanceWeek();
    }
  }

  return (
    <div className="screen-bg min-h-screen py-6 px-4 pb-16">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Top Hextech Nav Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rift-card border border-gold-600/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
        >
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="text-3xl bg-rift-surface p-2 rounded-xl border border-rift-border">
              {rankIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                  {career.gameName}
                </h1>
                <RoleBadge role={career.role} size="sm" />
                <span className="text-xs text-slate-400 font-bold">
                  {REGION_FLAGS[career.region]} {career.region}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Age {career.age} · {career.rank.tier} {career.rank.division || ''} ({career.rank.lp} LP) · #{career.rank.globalRank?.toLocaleString() || '1.5M'} World
              </p>
            </div>
          </div>

          {/* Season Time & Money */}
          <div className="flex items-center gap-4 text-left sm:text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-rift-border">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {SPLIT_ICONS[career.split]} {career.split} {career.year}
              </p>
              <p className="text-sm font-bold text-gold-400">
                Week {career.week} / 9
              </p>
            </div>
            <div className="border-l border-rift-border pl-4">
              <p className="text-xs text-slate-400 font-medium">Bank Balance</p>
              <p className="text-sm font-black text-green-400 font-mono">
                ${career.finances.savings.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto gap-2 border-b border-rift-border pb-2 text-sm font-bold scrollbar-none">
          {[
            { id: 'overview', label: '🏠 Overview & Career', icon: '' },
            { id: 'soloq', label: '⚔️ SoloQ Ladder', icon: '' },
            { id: 'champions', label: '🧙 Champion Pool', icon: '' },
            { id: 'lifestyle', label: '⚡ Lifestyle & Energy', icon: '' },
            { id: 'transfers', label: '🤝 Team & Scouting', icon: '' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as HubTab)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                currentTab === tab.id
                  ? 'bg-gradient-to-r from-purple-900/80 to-rift-purple text-white shadow-lg border border-purple-500/40'
                  : 'bg-rift-card text-slate-400 hover:text-white border border-rift-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {currentTab === 'overview' && (
          <div className="space-y-5">

            {/* Team or SoloQ Status Banner */}
            <Card className="p-4 border-gold-600/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Active Status</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {career.currentTeam ? (
                      <>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: career.currentTeam.color }} />
                        <span className="font-bold text-white text-base">{career.currentTeam.name}</span>
                        <span className="text-xs text-slate-400">({career.lifestyle.rosterStatus.toUpperCase()})</span>
                      </>
                    ) : (
                      <span className="font-bold text-amber-400 text-base">
                        Unsigned SoloQ Grinder {career.age < 18 ? `(Age ${career.age} Prodigy)` : '(Free Agent)'}
                      </span>
                    )}
                  </div>
                </div>

                {career.currentTeam && (
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-green-400">{career.wins} Wins</span>
                    <span className="text-red-400">{career.losses} Losses</span>
                    <span className="text-gold-400">Strength {career.teamStrength}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Player Stats */}
            <Card>
              <CardHeader title={t('hub.stats')} icon="📊" subtitle="Attributes affect your performance in SoloQ and pro matches" />
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STATS.map(stat => (
                  <StatBar
                    key={stat}
                    label={t(`stat.${stat}` as any)}
                    value={career.stats[stat]}
                  />
                ))}
              </div>
            </Card>

            {/* Career Milestones / Goal */}
            <Card gold className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t('hub.career_goal')}</p>
                  <p className="text-gold-400 font-bold text-sm">
                    {career.worldsWins > 0 ? `🏆 ${career.worldsWins}x World Champion` : t('hub.goal.worlds')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gold-400 font-mono">{yearsLeft}</p>
                  <p className="text-[11px] text-slate-400">{t('hub.until_retirement')}</p>
                </div>
              </div>
            </Card>

            {/* Main Action Button */}
            <div className="pt-2">
              <Button
                variant={currentEvent ? 'gold' : 'primary'}
                size="lg"
                fullWidth
                onClick={handleContinue}
              >
                {currentEvent
                  ? `📋 ${t('event.week')} ${career.week} Event →`
                  : `📅 ${t('hub.continue')} (Advance to Week ${career.week + 1})`}
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: SOLOQ */}
        {currentTab === 'soloq' && <SoloQScreen />}

        {/* TAB 3: CHAMPIONS */}
        {currentTab === 'champions' && <ChampionPoolScreen />}

        {/* TAB 4: LIFESTYLE */}
        {currentTab === 'lifestyle' && <LifestyleScreen />}

        {/* TAB 5: TRANSFERS */}
        {currentTab === 'transfers' && <TransferMarketScreen />}

      </div>
    </div>
  );
}
