import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { StatBar } from '../components/ui/StatBar';
import { Card, CardHeader } from '../components/ui/Card';
import { RoleBadge } from '../components/ui/RoleBadge';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { TeamLogo } from '../components/ui/TeamLogo';
import { REGION_FLAGS } from '../data/teams';
import { TIER_ICONS } from '../data/ranks';
import { SoloQScreen } from './SoloQScreen';
import { ChampionPoolScreen } from './ChampionPoolScreen';
import { LifestyleScreen } from './LifestyleScreen';
import { TransferMarketScreen } from './TransferMarketScreen';
import type { StatKey, HubTab, SplitName } from '../types/game';

const STATS: StatKey[] = ['mechanics', 'gameKnowledge', 'communication', 'mental', 'adaptability', 'reputation'];

const SPLITS: Array<{ name: SplitName; label: string; icon: string }> = [
  { name: 'Winter', label: 'WINTER', icon: '❄️' },
  { name: 'Spring', label: 'SPRING', icon: '🌸' },
  { name: 'Summer', label: 'SUMMER', icon: '☀️' },
];

export function CareerHubScreen() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const currentTab = useGameStore(s => s.currentTab);
  const setCurrentTab = useGameStore(s => s.setCurrentTab);
  const advanceWeek = useGameStore(s => s.advanceWeek);
  const setPhase = useGameStore(s => s.setPhase);
  const currentEvent = useGameStore(s => s.currentEvent);
  const retire = useGameStore(s => s.retire);
  const setShowPatchNotesModal = useGameStore(s => s.setShowPatchNotesModal);

  const [forfeitModalOpen, setForfeitModalOpen] = useState(false);

  if (!career) {
    return (
      <div className="screen-bg min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 text-center space-y-4 max-w-sm border-gold-600/30">
          <p className="text-white font-bold text-base">Kariéra nebyla nalezena</p>
          <Button variant="primary" fullWidth onClick={() => setPhase('MENU')}>
            Založit novou kariéru / Menu
          </Button>
        </Card>
      </div>
    );
  }

  const yearsLeft = Math.max(0, 30 - career.age);
  const rank = career.rank || { tier: 'BRONZE', division: 'IV', lp: 0, globalRank: 1500000 };
  const rankIcon = TIER_ICONS[rank.tier] || '🥉';
  const lifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };
  const energy = lifestyle.energy ?? 100;
  const maxEnergy = lifestyle.maxEnergy ?? 100;
  const trust = lifestyle.coachTrust ?? 50;
  const finances = career.finances || { salary: 0, savings: 300, monthlyExpenses: 0 };
  const currentPatch = career.currentPatch || { patchVersion: '15.1', season: 15, tiers: {} };

  // Calculate overall rating (OVR)
  const ovrRating = Math.round(
    career.stats.mechanics * 0.35 +
    career.stats.gameKnowledge * 0.25 +
    career.stats.mental * 0.20 +
    career.stats.communication * 0.20
  );

  const moraleScore = Math.min(100, Math.max(20, Math.round(career.stats.mental * 0.6 + trust * 0.4)));

  const teamTierTag = career.currentTeam
    ? career.currentTeam.strength >= 80 ? 'TIER 1' : 'TIER 2'
    : 'FREE AGENT';

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

        {/* ─── RIFT LEGACY STYLE HEADER BAR ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rift-card border border-gold-600/30 rounded-2xl p-5 shadow-2xl space-y-4"
        >
          {/* Top Row: Flag + Name, Age, Role, Team & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-rift-border/70">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xl">{REGION_FLAGS[career.region]}</span>
              <h1 className="text-xl font-black text-white uppercase font-heading tracking-wide">
                {career.gameName}
              </h1>
              <span className="text-xs text-slate-400 font-semibold">{career.age} yrs</span>
              <RoleBadge role={career.role} size="xs" />

              {career.currentTeam ? (
                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-700">
                  <TeamLogo team={career.currentTeam} size="xs" />
                  <span className="text-xs font-bold text-slate-200">{career.currentTeam.name}</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {teamTierTag}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase ml-2">
                  FREE AGENT
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <LanguageSwitcher size="sm" />
              <button
                onClick={() => setShowPatchNotesModal(true)}
                className="bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-600/40 px-2 py-1 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1"
                title="Patch Notes"
              >
                📋 {currentPatch.patchVersion}
              </button>
              <button
                onClick={() => setForfeitModalOpen(true)}
                title="Vzdat běh"
                className="text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-600 bg-rift-surface p-1.5 rounded-lg transition-all"
              >
                🏳️
              </button>
            </div>
          </div>

          {/* Clean 4-Card Quick Stats Grid (RFT Rating, Solo Queue, Followers, Money) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Overall Rating */}
            <div className="bg-rift-surface p-3 rounded-xl border border-rift-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RFT RATING</span>
                <div className="mt-1">
                  <span className="px-2.5 py-1 rounded-lg text-sm font-black bg-emerald-500 text-slate-950 font-mono shadow-sm">
                    {ovrRating}
                  </span>
                </div>
              </div>
              <span className="text-xl opacity-80">⚡</span>
            </div>

            {/* 2. Solo Queue Rank */}
            <div className="bg-rift-surface p-3 rounded-xl border border-rift-border">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SOLO QUEUE</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-lg leading-none">{rankIcon}</span>
                <div>
                  <p className="text-xs font-black text-white font-mono leading-none">
                    {rank.lp} LP <span className="text-[10px] text-slate-400">({rank.tier})</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">#{rank.globalRank?.toLocaleString() || '1.5M'}</p>
                </div>
              </div>
            </div>

            {/* 3. Stream Followers */}
            <div className="bg-rift-surface p-3 rounded-xl border border-rift-border">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FOLLOWERS</span>
              <p className="text-base font-black text-purple-400 font-mono mt-1">
                {(career.streamFollowers ?? 0) >= 1000
                  ? `${((career.streamFollowers ?? 0) / 1000).toFixed(1)}K`
                  : (career.streamFollowers ?? 0)}
              </p>
            </div>

            {/* 4. Money / Savings */}
            <div className={`p-3 rounded-xl border ${
              finances.savings < 0
                ? 'bg-rose-950/40 border-rose-600/80 shadow-md shadow-rose-950/40'
                : 'bg-rift-surface border-rift-border'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                finances.savings < 0 ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {finances.savings < 0 ? (isCs ? '⚠️ V DLUHU' : '⚠️ DEBT') : (isCs ? 'ÚSPORY' : 'MONEY')}
              </span>
              <p className={`text-base font-black font-mono mt-1 ${
                finances.savings < 0 ? 'text-rose-400' : 'text-green-400'
              }`}>
                {finances.savings < 0
                  ? `-$${Math.abs(finances.savings).toLocaleString()}`
                  : `$${finances.savings.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Segmented LED Bars for Team Trust & Morale */}
          {career.currentTeam && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">{isCs ? 'Důvěra Týmu' : 'TEAM TRUST'}</span>
                  <span className={trust >= 60 ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>{trust}%</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const filled = i < Math.round(trust / 5);
                    return (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-sm ${
                          filled ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">{isCs ? 'Morálka' : 'MORALE'}</span>
                  <span className="text-amber-400 font-mono">{moraleScore}%</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const filled = i < Math.round(moraleScore / 5);
                    return (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-sm ${
                          filled ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Season Stepper (Winter -> Spring -> Summer -> Off-Season) */}
          <div className="pt-2 border-t border-rift-border/60 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 font-mono">
              {career.year} SEASON
            </span>
            <div className="flex items-center gap-2">
              {SPLITS.map(split => {
                const isActive = (career.split || 'Winter') === split.name;
                return (
                  <span
                    key={split.name}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                      isActive
                        ? 'bg-purple-950 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-950/50'
                        : 'text-slate-500 bg-slate-900/40'
                    }`}
                  >
                    {split.label}
                  </span>
                );
              })}
              <span className="text-xs font-bold text-slate-600 px-2 py-1 font-mono">OFF-SEASON</span>
            </div>
            <span className="text-xs font-black text-amber-400 font-mono">
              {t('hub.week')} {career.week}/9
            </span>
          </div>
        </motion.div>

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto gap-2 border-b border-rift-border pb-2 text-sm font-bold scrollbar-none">
          {[
            { id: 'overview', label: `🏠 ${t('tab.overview' as any) || 'Přehled & Kariéra'}` },
            { id: 'soloq', label: `⚔️ ${t('tab.soloq' as any) || 'SoloQ Žebříček'}` },
            { id: 'champions', label: `🧙 ${t('tab.champions' as any) || 'Champion Pool'}` },
            { id: 'lifestyle', label: `⚡ ${t('tab.lifestyle' as any) || 'Životní Styl & Energie'}` },
            { id: 'transfers', label: `🤝 ${t('tab.transfers' as any) || 'Tým & Organizace'}` },
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

            {/* Player Stats */}
            <Card>
              <CardHeader title={t('hub.stats')} icon="📊" subtitle={t('hub.stats_subtitle' as any) || 'Player stats'} />
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
                    {career.worldsWins > 0
                      ? t('hub.worlds_champion_count' as any).replace('{count}', String(career.worldsWins))
                      : t('hub.goal.worlds')}
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
                  ? `📋 ${t('hub.event_week_btn' as any).replace('{week}', String(career.week))}`
                  : `📅 ${t('hub.advance_to_week' as any).replace('{week}', String(career.week + 1))}`}
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

        {/* TAB 5: TRANSFERS / TEAM */}
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
