import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { StatBar } from '../components/ui/StatBar';
import { Card } from '../components/ui/Card';
import type { Role, Region, Playstyle, GameMode, MetaPatch } from '../types/game';
import { ROLE_STATS_PREVIEW } from '../utils/characterStats';
import { getChampionsByRole, getChampIconUrl, TIER_PRIORITY, generateMetaPatch } from '../data/champions';

const ROLES: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];
const REGIONS: Region[] = ['LCK', 'LPL', 'LEC', 'LTA_N', 'LTA_S', 'LCP'];
const PLAYSTYLES: Playstyle[] = ['mechanical', 'strategic', 'leader'];

const ROLE_ICONS: Record<Role, string> = {
  top: '🛡️', jungle: '🌲', mid: '⚡', adc: '🏹', support: '💛',
};

const PLAYSTYLE_ICONS: Record<Playstyle, string> = {
  mechanical: '⚔️', strategic: '🧠', leader: '📣',
};

import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function CharacterCreationScreen() {
  const { t } = useTranslation();
  const startNewCareerExtended = useGameStore(s => s.startNewCareerExtended);
  const setPhase = useGameStore(s => s.setPhase);

  // Dynamic patch generated for this career run so every new draft has fresh meta!
  const [initialPatch] = useState<MetaPatch>(() => {
    const randomMinor = Math.floor(Math.random() * 8) + 1;
    return generateMetaPatch(`15.${randomMinor}`, 15);
  });

  const [step, setStep] = useState<'mode' | 'basics' | 'role' | 'region' | 'playstyle' | 'champions'>('mode');
  const [mode, setMode] = useState<GameMode>('prodigy');
  const [name, setName] = useState('');
  const [gameName, setGameName] = useState('');
  const [role, setRole] = useState<Role>('mid');
  const [region, setRegion] = useState<Region>('LCK');
  const [playstyle, setPlaystyle] = useState<Playstyle>('mechanical');
  const [selectedChamps, setSelectedChamps] = useState<string[]>([]);
  const [tierError, setTierError] = useState<string | null>(null);

  const getChampTier = (champId: string): 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' => {
    return initialPatch.tiers[champId]?.tier || 'A';
  };

  const getChampWinRate = (champId: string): number => {
    return initialPatch.tiers[champId]?.winRate || 50.0;
  };

  // Get and sort role champions dynamically by their current patch tier
  const roleChamps = getChampionsByRole(role).sort(
    (a, b) => TIER_PRIORITY[getChampTier(a.id)] - TIER_PRIORITY[getChampTier(b.id)]
  );

  // Auto-fill balanced 6 champions when role changes (max 2 S/S+ tiers, 4 A/B tiers)
  function handleSelectRole(r: Role) {
    setRole(r);
    const sorted = getChampionsByRole(r).sort(
      (a, b) => TIER_PRIORITY[getChampTier(a.id)] - TIER_PRIORITY[getChampTier(b.id)]
    );
    const sChamps = sorted.filter(c => getChampTier(c.id) === 'S+' || getChampTier(c.id) === 'S').slice(0, 2);
    const otherChamps = sorted.filter(c => getChampTier(c.id) !== 'S+' && getChampTier(c.id) !== 'S').slice(0, 4);
    setSelectedChamps([...sChamps, ...otherChamps].map(c => c.id));
  }

  const previewStats = ROLE_STATS_PREVIEW(role, playstyle);

  // Check how many S/S+ tier champions are selected in current patch
  const sTierCount = selectedChamps.filter(id => {
    const tier = getChampTier(id);
    return tier === 'S+' || tier === 'S';
  }).length;

  function toggleChampion(champId: string) {
    setTierError(null);
    const tier = getChampTier(champId);
    const isSTier = tier === 'S+' || tier === 'S';

    if (selectedChamps.includes(champId)) {
      if (selectedChamps.length > 1) {
        setSelectedChamps(prev => prev.filter(id => id !== champId));
      }
    } else {
      if (selectedChamps.length >= 6) {
        setTierError(t('create.champ_limit_6' as any) || 'You can only choose 6 main champions!');
        return;
      }
      if (isSTier && sTierCount >= 2) {
        setTierError(t('create.s_tier_limit' as any) || 'Starting pool allows max 2 S/S+ tier champions for balance! (Rest must be A/B/C tier)');
        return;
      }
      setSelectedChamps(prev => [...prev, champId]);
    }
  }

  function handleStart() {
    startNewCareerExtended(
      mode,
      name.trim() || 'Player',
      gameName.trim() || 'Rookie',
      role,
      region,
      playstyle,
      selectedChamps,
      initialPatch
    );
  }

  return (
    <div className="screen-bg min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header with Back and Language Switcher */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setPhase('MENU')} className="text-slate-400 hover:text-white text-xl">←</button>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide uppercase font-heading">
                {t('create.title')}
              </h1>
              <p className="text-xs text-slate-400 font-mono">FÁZE: {step.toUpperCase()}</p>
            </div>
          </div>
          <LanguageSwitcher size="sm" />
        </motion.div>

        <AnimatePresence mode="wait">

          {/* STEP 1: CAREER MODE */}
          {step === 'mode' && (
            <motion.div key="mode" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="space-y-3">
                {/* Prodigy Mode */}
                <div
                  onClick={() => setMode('prodigy')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    mode === 'prodigy'
                      ? 'border-gold-400 bg-gold-950/30 shadow-lg shadow-gold-500/20'
                      : 'border-rift-border bg-rift-card hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">👶</span>
                      <div>
                        <h3 className="font-bold text-white text-base">Prodigy Journey (Doporučeno)</h3>
                        <p className="text-xs text-gold-400 font-semibold">Start ve 14 letech v Bronze IV bez týmu</p>
                      </div>
                    </div>
                    {mode === 'prodigy' && <span className="text-gold-400 font-black text-xl">✓</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Začni jako neznámý kluk ve svém pokoji. Grinduj SoloQ, choď na brigády pro peníze, sestav si champion pool a počkej na nabídky od skautů v 16–18 letech!
                  </p>
                </div>

                {/* Pro Debut Mode */}
                <div
                  onClick={() => setMode('pro_debut')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    mode === 'pro_debut'
                      ? 'border-gold-400 bg-gold-950/30 shadow-lg shadow-gold-500/20'
                      : 'border-rift-border bg-rift-card hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🏆</span>
                      <div>
                        <h3 className="font-bold text-white text-base">Tier 1 Profi Debut</h3>
                        <p className="text-xs text-purple-400 font-semibold">Start v 18 letech přímo s týmovou smlouvou</p>
                      </div>
                    </div>
                    {mode === 'pro_debut' && <span className="text-gold-400 font-black text-xl">✓</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Přeskoč amatérskou SoloQ dráhu a skoč rovnou do oficiální ligy (LCK, LPL, LEC, LTA) jako podepsaný rookie.
                  </p>
                </div>
              </div>

              <Button variant="gold" size="lg" fullWidth onClick={() => setStep('basics')}>
                Pokračovat →
              </Button>
            </motion.div>
          )}

          {/* STEP 2: BASICS */}
          {step === 'basics' && (
            <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <Card className="p-6 space-y-4 border-gold-600/30">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-semibold">{t('create.name')}</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t('create.name.placeholder')}
                    className="w-full bg-rift-surface border border-rift-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-semibold">{t('create.gamename')}</label>
                  <input
                    value={gameName}
                    onChange={e => setGameName(e.target.value)}
                    placeholder={t('create.gamename.placeholder')}
                    className="w-full bg-rift-surface border border-rift-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400 font-mono font-bold"
                  />
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('mode')}>← Zpět</Button>
                <Button variant="gold" size="lg" fullWidth disabled={name.trim().length < 2 || gameName.trim().length < 2} onClick={() => setStep('role')}>
                  Pokračovat →
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ROLE */}
          {step === 'role' && (
            <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-slate-400 font-medium">{t('create.role')}</p>
              <div className="space-y-2.5">
                {ROLES.map(r => (
                  <div
                    key={r}
                    onClick={() => handleSelectRole(r)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      role === r
                        ? 'border-gold-400 bg-gold-950/40 shadow-lg shadow-gold-500/20'
                        : 'border-rift-border bg-rift-card hover:border-slate-500'
                    }`}
                  >
                    <span className="text-2xl">{ROLE_ICONS[r]}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-base">{t(`role.${r}` as any)}</p>
                    </div>
                    {role === r && <span className="text-gold-400 font-black text-xl">✓</span>}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('basics')}>← Zpět</Button>
                <Button variant="gold" size="lg" fullWidth onClick={() => setStep('region')}>Pokračovat →</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REGION */}
          {step === 'region' && (
            <motion.div key="region" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-slate-400 font-medium">{t('create.region')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REGIONS.map(r => (
                  <div
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      region === r
                        ? 'border-gold-400 bg-gold-950/40 shadow-lg shadow-gold-500/20'
                        : 'border-rift-border bg-rift-card hover:border-slate-500'
                    }`}
                  >
                    <p className="font-bold text-white text-sm">{t(`region.${r}` as any)}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('role')}>← Zpět</Button>
                <Button variant="gold" size="lg" fullWidth onClick={() => setStep('playstyle')}>Pokračovat →</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: PLAYSTYLE */}
          {step === 'playstyle' && (
            <motion.div key="playstyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-slate-400 font-medium">{t('create.playstyle')}</p>
              <div className="space-y-3">
                {PLAYSTYLES.map(p => (
                  <div
                    key={p}
                    onClick={() => setPlaystyle(p)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      playstyle === p
                        ? 'border-gold-400 bg-gold-950/40'
                        : 'border-rift-border bg-rift-card hover:border-slate-500'
                    }`}
                  >
                    <span className="text-2xl">{PLAYSTYLE_ICONS[p]}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{t(`create.playstyle.${p}` as any)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{t(`create.playstyle.${p}.desc` as any)}</p>
                    </div>
                    {playstyle === p && <span className="text-gold-400 font-bold">✓</span>}
                  </div>
                ))}
              </div>

              {/* Stats Preview */}
              <Card className="p-5 space-y-3 border-gold-600/30">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {t('create.starting_stats')}
                </p>
                {Object.entries(previewStats).map(([key, val]) => (
                  <StatBar key={key} label={t(`stat.${key}` as any)} value={val} />
                ))}
              </Card>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('region')}>← Zpět</Button>
                <Button variant="gold" size="lg" fullWidth onClick={() => setStep('champions')}>
                  Vybrat 6 Main Championů →
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: CHAMPION POOL (6 MAINS - DYNAMICALLY ORDERED BY CURRENT PATCH META) */}
          {step === 'champions' && (
            <motion.div key="champions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-rift-card p-3.5 rounded-xl border border-rift-border">
                <div>
                  <h3 className="font-bold text-white text-base font-heading uppercase tracking-wide">
                    Vyber 6 Main Championů ({selectedChamps.length}/6)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Seřazeno podle Tier Listu (Max 2 S/S+ tier pro startovní balanc: <strong className="text-gold-400">{sTierCount}/2</strong>)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Aktuální Meta:</span>
                  <span className="text-xs font-black text-gold-400 bg-rift-surface px-2.5 py-1 rounded-lg border border-gold-600/30 font-mono">
                    📋 Patch {initialPatch.patchVersion}
                  </span>
                </div>
              </div>

              {/* Error banner */}
              {tierError && (
                <div className="p-3 bg-red-950/70 border border-red-700 rounded-xl text-xs text-red-300 font-semibold">
                  ⚠️ {tierError}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {roleChamps.map((champ) => {
                  const isSelected = selectedChamps.includes(champ.id);
                  const dynamicTier = getChampTier(champ.id);
                  const winRate = getChampWinRate(champ.id);

                  return (
                    <div
                      key={champ.id}
                      onClick={() => toggleChampion(champ.id)}
                      className={`relative overflow-hidden rounded-xl border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold-400 bg-gold-950/40 shadow-md shadow-gold-500/20 ring-1 ring-gold-400/50'
                          : 'border-rift-border bg-rift-card hover:border-slate-500 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getChampIconUrl(champ.id)}
                          alt={champ.name}
                          className="w-10 h-10 rounded-lg border border-slate-700 object-cover shrink-0"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-bold text-white text-xs truncate">{champ.name}</p>
                            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded shrink-0 ${
                              dynamicTier === 'S+' ? 'bg-amber-400 text-black font-extrabold shadow-sm shadow-amber-500/50' :
                              dynamicTier === 'S' ? 'bg-purple-600 text-white font-bold' :
                              dynamicTier === 'A' ? 'bg-blue-600 text-white font-bold' :
                              dynamicTier === 'B' ? 'bg-slate-700 text-slate-300' : 'bg-red-950 text-red-400'
                            }`}>
                              {dynamicTier}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                            <span>{champ.playstyle}</span>
                            <span className="font-mono text-slate-300 font-semibold">{winRate}% WR</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-gold-400 rounded-full flex items-center justify-center text-black font-extrabold text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="lg" onClick={() => setStep('playstyle')}>← Zpět</Button>
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={selectedChamps.length !== 6}
                  onClick={handleStart}
                >
                  🚀 {mode === 'prodigy' ? 'Spustit Prodigy Cestu (14 Let)' : 'Spustit Profi Kariéru (18 Let)'}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
