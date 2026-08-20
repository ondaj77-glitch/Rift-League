import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { StatBar } from '../components/ui/StatBar';
import { Card, CardHeader } from '../components/ui/Card';
import { RoleBadge } from '../components/ui/RoleBadge';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
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
  const retire = useGameStore(s => s.retire);

  const [forfeitModalOpen, setForfeitModalOpen] = useState(false);

  if (!career) return null;

  const yearsLeft = Math.max(0, 30 - career.age);
  const rankIcon = TIER_ICONS[career.rank.tier];
  const energy = career.lifestyle.energy;
  const maxEnergy = career.lifestyle.maxEnergy;

  function handleContinue() {
    if (currentEvent) {
      setPhase('EVENT');
    } else {
      advanceWeek();
    }
  }

  function handleConfirmForfeit() {
    setForfeitModalOpen(false);
    retire();
  }

  return (
    <div className="screen-bg min-h-screen py-6 px-4 pb-16">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Top Hextech Nav Bar with Energy, Bank Balance, Language Switcher & Time */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rift-card border border-gold-600/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
        >
          {/* Identity & Rank */}
          <div className="flex items-center gap-3">
            <div className="text-3xl bg-rift-surface p-2 rounded-xl border border-rift-border">
              {rankIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white uppercase font-heading tracking-wide">
                  {career.gameName}
                </h1>
                <RoleBadge role={career.role} size="sm" />
                <span className="text-xs text-slate-300 font-bold">
                  {REGION_FLAGS[career.region]} {career.region}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {t('hub.age')} {career.age} · {career.rank.tier} {career.rank.division || ''} ({career.rank.lp} LP) · #{career.rank.globalRank?.toLocaleString() || '1.5M'} {t('soloq.global_ranking')}
              </p>
            </div>
          </div>

          {/* Season Time, Energy, Money, Language & Forfeit Button */}
          <div className="flex flex-wrap items-center gap-3 text-left sm:text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-rift-border">
            {/* Live In-Game Language Switcher */}
            <LanguageSwitcher size="sm" />

            {/* Energy */}
            <div className="bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-800/40 text-center">
              <p className="text-[10px] text-amber-300 font-bold uppercase">⚡ {t('hub.energy' as any) || 'Energie'}</p>
              <p className="text-sm font-black text-amber-400 font-mono">
                {energy} <span className="text-[11px] text-amber-600">/ {maxEnergy}</span>
              </p>
            </div>

            {/* Split & Week */}
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {SPLIT_ICONS[career.split]} {t(`hub.split.${career.split.toLowerCase()}` as any)} {career.year}
              </p>
              <p className="text-sm font-bold text-gold-400 font-mono">
                {t('hub.week')} {career.week} / 9
              </p>
            </div>

            {/* Bank Balance */}
            <div className="border-l border-rift-border pl-3">
              <p className="text-xs text-slate-400 font-medium">{t('hub.savings')}</p>
              <p className="text-sm font-black text-green-400 font-mono">
                ${career.finances.savings.toLocaleString()}
              </p>
            </div>

            {/* Forfeit / End Run Button */}
            <button
              onClick={() => setForfeitModalOpen(true)}
              title="Vzdat běh a zobrazit statistiky"
              className="text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-600 bg-rift-surface p-2 rounded-xl transition-all"
            >
              🏳️
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto gap-2 border-b border-rift-border pb-2 text-sm font-bold scrollbar-none">
          {[
            { id: 'overview', label: `🏠 ${t('tab.overview' as any) || 'Přehled & Kariéra'}` },
            { id: 'soloq', label: `⚔️ ${t('tab.soloq' as any) || 'SoloQ Žebříček'}` },
            { id: 'champions', label: `🧙 ${t('tab.champions' as any) || 'Champion Pool'}` },
            { id: 'lifestyle', label: `⚡ ${t('tab.lifestyle' as any) || 'Životní Styl & Energie'}` },
            { id: 'transfers', label: `🤝 ${t('tab.transfers' as any) || 'Tým & Skauti'}` },
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
                  <span className="text-xs text-slate-400 uppercase font-semibold">
                    {t('hub.status_title' as any) || 'Aktuální status'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {career.currentTeam ? (
                      <>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: career.currentTeam.color }} />
                        <span className="font-bold text-white text-base">{career.currentTeam.name}</span>
                        <span className="text-xs text-slate-400 font-bold">
                          ({career.lifestyle.rosterStatus === 'starter' ? 'ZÁKLADNÍ SESTAVA' : 'NÁHRADNÍK'})
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-amber-400 text-base">
                        {career.age < 18 ? `Neupsaný SoloQ Talent (${career.age} Let)` : 'Volný Hráč (Free Agent)'}
                      </span>
                    )}
                  </div>
                </div>

                {career.currentTeam && (
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-green-400">{career.wins} {t('season.wins')}</span>
                    <span className="text-red-400">{career.losses} {t('season.losses')}</span>
                    <span className="text-gold-400">Síla týmu {career.teamStrength}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Player Stats */}
            <Card>
              <CardHeader title={t('hub.stats')} icon="📊" subtitle="Atributy přímo ovlivňují výhry v SoloQ i oficiálních zápasech" />
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
                    {career.worldsWins > 0 ? `🏆 ${career.worldsWins}x Mistr Světa (Worlds Champion)` : t('hub.goal.worlds')}
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
                  ? `📋 ${t('event.week')} ${career.week} Událost →`
                  : `📅 ${t('hub.continue')} (Posunout na Týden ${career.week + 1})`}
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

      {/* FORFEIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {forfeitModalOpen && (
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
              className="bg-rift-card border border-red-800/60 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center"
            >
              <div className="text-5xl mb-2">🏳️</div>
              <h3 className="text-xl font-bold text-white font-heading">
                Vzdat a ukončit tento RUN?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ukončíš aktuální kariéru. Zobrazí se kompletní statistiky tvého běhu, dosažené skóre, rank a získáš možnost začít novou kariéru od začátku.
              </p>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" fullWidth onClick={() => setForfeitModalOpen(false)}>
                  Zpět do hry
                </Button>
                <Button variant="danger" fullWidth onClick={handleConfirmForfeit}>
                  Ano, ukončit běh
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
