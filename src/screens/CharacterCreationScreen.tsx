import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { StatBar } from '../components/ui/StatBar';
import { Card } from '../components/ui/Card';
import type { Role, Region, Playstyle, GameMode, MetaPatch, PlayerOrigin, ArchetypeTrait } from '../types/game';
import { ROLE_STATS_PREVIEW } from '../utils/characterStats';
import { getChampionsByRole, getChampIconUrl, TIER_PRIORITY, generateMetaPatch } from '../data/champions';
import { ORIGINS, TRAITS } from '../data/origins';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

const ROLES: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];
const REGIONS: Region[] = ['LCK', 'LPL', 'LEC', 'LTA_N', 'LTA_S', 'LCP'];
const PLAYSTYLES: Playstyle[] = ['mechanical', 'strategic', 'leader'];

const ROLE_ICONS: Record<Role, string> = {
  top: '🛡️', jungle: '🌲', mid: '⚡', adc: '🏹', support: '💛',
};

const PLAYSTYLE_ICONS: Record<Playstyle, string> = {
  mechanical: '⚔️', strategic: '🧠', leader: '📣',
};

export function CharacterCreationScreen() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const startNewCareerExtended = useGameStore(s => s.startNewCareerExtended);
  const setPhase = useGameStore(s => s.setPhase);

  // Dynamic patch generated for this career run so every new draft has fresh meta!
  const [initialPatch] = useState<MetaPatch>(() => {
    const randomMinor = Math.floor(Math.random() * 8) + 1;
    return generateMetaPatch(`15.${randomMinor}`, 15);
  });

  const [step, setStep] = useState<'mode' | 'origin' | 'trait' | 'basics' | 'role' | 'region' | 'playstyle' | 'champions'>('mode');
  const [mode, setMode] = useState<GameMode>('prodigy');
  const [origin, setOrigin] = useState<PlayerOrigin>('soloq_prodigy');
  const [archetypeTrait, setArchetypeTrait] = useState<ArchetypeTrait>('hypercarry');
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
      initialPatch,
      origin,
      archetypeTrait
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
                      ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/50 shadow-xl'
                      : 'border-rift-border bg-rift-surface hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🌱</span>
                      <h3 className="font-bold text-white text-base font-heading">SoloQ Prodigy (Od Nuly)</h3>
                    </div>
                    <span className="text-xs font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800 font-bold">
                      Věk 14 · Bronze IV
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Začni jako mladý talent u rodičů. Bojuj v SoloQ, buduj si stream a čekej na první nabídky z akademie a ERL lig v 16 letech.
                  </p>
                </div>

                {/* Pro Debut Mode */}
                <div
                  onClick={() => setMode('pro_debut')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    mode === 'pro_debut'
                      ? 'border-gold-500 bg-gold-950/40 ring-2 ring-gold-500/50 shadow-xl'
                      : 'border-rift-border bg-rift-surface hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🏆</span>
                      <h3 className="font-bold text-white text-base font-heading">Pro Debut (Rovnou v Týmu)</h3>
                    </div>
                    <span className="text-xs font-mono text-gold-400 bg-gold-950 px-2 py-0.5 rounded border border-gold-800 font-bold">
                      Věk 18 · Diamond I / Master
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Okamžitě naskoč do oficiální profesionální ligy (LEC, LCK, LPL). Máš podepsaný roční kontrakt a hned bojuješ o Playoffs a Worlds.
                  </p>
                </div>
              </div>

              <Button variant="primary" size="lg" fullWidth onClick={() => setStep('origin')}>
                {isCs ? 'Pokračovat k Volbě Původu →' : 'Continue to Origin →'}
              </Button>
            </motion.div>
          )}

          {/* STEP 2: PLAYER ORIGIN (SoloQ Prodigy vs Academy vs Content Creator) */}
          {step === 'origin' && (
            <motion.div key="origin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  {isCs ? 'Vyber Původ Hráče (Origin)' : 'Choose Player Origin'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isCs ? 'Odkud tvůj hráč přichází a jaké jsou jeho vrozené výhody?' : 'Where does your player come from and what perks do they start with?'}
                </p>
              </div>

              <div className="space-y-3">
                {ORIGINS.map(orig => {
                  const isSelected = origin === orig.id;
                  return (
                    <div
                      key={orig.id}
                      onClick={() => setOrigin(orig.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold-500 bg-gold-950/40 ring-2 ring-gold-500/50 shadow-lg'
                          : 'border-rift-border bg-rift-surface hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-2xl">{orig.icon}</span>
                        <h4 className="font-bold text-white text-sm">{isCs ? orig.nameCs : orig.nameEn}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                        {isCs ? orig.descCs : orig.descEn}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(isCs ? orig.perksCs : orig.perksEn).map((perk, i) => (
                          <span key={i} className="text-[10px] bg-slate-900 text-gold-300 px-2 py-0.5 rounded font-mono font-bold border border-slate-700">
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('mode')}>
                  ← Zpět
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => setStep('trait')}>
                  {isCs ? 'Pokračovat k Archetypu →' : 'Continue to Trait →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ARCHETYPE TRAIT */}
          {step === 'trait' && (
            <motion.div key="trait" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  {isCs ? 'Zvol Herní Archetyp & Silnou Stránku' : 'Select Core Archetype & Flaw'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isCs ? 'Každý esportový talent má svůj specifický playstyle a trade-off.' : 'Every pro player has a signature strength and trade-off.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAITS.map(tObj => {
                  const isSelected = archetypeTrait === tObj.id;
                  return (
                    <div
                      key={tObj.id}
                      onClick={() => setArchetypeTrait(tObj.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/50 ring-2 ring-purple-500/50 shadow-lg'
                          : 'border-rift-border bg-rift-surface hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{tObj.icon}</span>
                        <h4 className="font-bold text-white text-xs">{isCs ? tObj.nameCs : tObj.nameEn}</h4>
                      </div>
                      <span className="text-[10px] text-purple-300 font-mono font-bold block mb-1.5">
                        {isCs ? tObj.taglineCs : tObj.taglineEn}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {isCs ? tObj.descCs : tObj.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('origin')}>
                  ← Zpět
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => setStep('basics')}>
                  {isCs ? 'Pokračovat k Jménu →' : 'Continue to Name →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: BASICS */}
          {step === 'basics' && (
            <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <Card className="p-5 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    {t('create.player_name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Petr Svoboda"
                    className="w-full bg-slate-900 border border-rift-border rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    {t('create.ign')}
                  </label>
                  <input
                    type="text"
                    value={gameName}
                    onChange={e => setGameName(e.target.value)}
                    placeholder="Nightstalker"
                    className="w-full bg-slate-900 border border-rift-border rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('trait')}>
                  ← Zpět
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => setStep('role')}>
                  {isCs ? 'Pokračovat k Roli →' : 'Continue to Role →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: ROLE */}
          {step === 'role' && (
            <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">{t('create.select_role')}</h2>
                <p className="text-xs text-slate-400">{t('create.role_desc')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => handleSelectRole(r)}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      role === r
                        ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/50'
                        : 'bg-rift-surface hover:bg-slate-800/80 border-rift-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ROLE_ICONS[r]}</span>
                      <div>
                        <span className="font-bold text-sm text-white capitalize">{r}</span>
                        <p className="text-[11px] text-slate-400">{t(`role.${r}.desc` as any)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('basics')}>
                  ← Zpět
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => setStep('region')}>
                  {isCs ? 'Pokračovat k Regionu →' : 'Continue to Region →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: REGION */}
          {step === 'region' && (
            <motion.div key="region" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">{t('create.select_region')}</h2>
                <p className="text-xs text-slate-400">Domovská esportová liga tvého hráče</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {REGIONS.map(reg => (
                  <button
                    key={reg}
                    onClick={() => setRegion(reg)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      region === reg
                        ? 'bg-gold-950/50 border-gold-500 ring-2 ring-gold-500/50'
                        : 'bg-rift-surface hover:bg-slate-800 border-rift-border'
                    }`}
                  >
                    <span className="font-bold text-sm text-white">{reg}</span>
                    <p className="text-[10px] text-slate-400 mt-1">{t(`region.${reg}.desc` as any)}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('role')}>
                  ← Zpět
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => setStep('playstyle')}>
                  {isCs ? 'Pokračovat k Hernímu Stylu →' : 'Continue to Playstyle →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: PLAYSTYLE */}
          {step === 'playstyle' && (
            <motion.div key="playstyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">{t('create.select_playstyle')}</h2>
                <p className="text-xs text-slate-400">{t('create.playstyle_desc')}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {PLAYSTYLES.map(p => (
                  <button
                    key={p}
                    onClick={() => setPlaystyle(p)}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      playstyle === p
                        ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/50'
                        : 'bg-rift-surface hover:bg-slate-800 border-rift-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{PLAYSTYLE_ICONS[p]}</span>
                      <div>
                        <span className="font-bold text-sm text-white capitalize">{t(`playstyle.${p}` as any)}</span>
                        <p className="text-xs text-slate-400">{t(`playstyle.${p}.desc` as any)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('region')}>
                  ← Zpět
                </Button>
                <Button variant="primary" size="lg" fullWidth onClick={() => setStep('champions')}>
                  {isCs ? 'Pokračovat k Výběru Šampiónů →' : 'Continue to Champions →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 8: CHAMPION POOL (Patch Meta Balanced) */}
          {step === 'champions' && (
            <motion.div key="champions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  {isCs ? 'Počáteční Champion Pool (6 Šampiónů)' : 'Starting Champion Pool (6 Mains)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isCs
                    ? 'Vyber 6 šampiónů pro start kariéry. Pro balanc je povolen max 2x S/S+ tier pick.'
                    : 'Select 6 main champions. Max 2 S/S+ tiers allowed for starting balance.'}
                </p>
              </div>

              {tierError && (
                <div className="p-3 bg-red-950/80 border border-red-500 text-red-300 text-xs rounded-xl font-medium">
                  {tierError}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {roleChamps.map(champ => {
                  const isSelected = selectedChamps.includes(champ.id);
                  const tier = getChampTier(champ.id);
                  const winRate = getChampWinRate(champ.id);

                  return (
                    <button
                      key={champ.id}
                      onClick={() => toggleChampion(champ.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/50 shadow-md'
                          : 'bg-rift-surface hover:bg-slate-800 border-rift-border'
                      }`}
                    >
                      <img
                        src={getChampIconUrl(champ.id)}
                        alt={champ.name}
                        className="w-9 h-9 rounded-lg border border-slate-700 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">{champ.name}</span>
                          <span className={`text-[10px] font-black font-mono ${
                            tier === 'S+' || tier === 'S' ? 'text-gold-400' : 'text-slate-400'
                          }`}>
                            {tier}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{winRate}% WR</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('playstyle')}>
                  ← Zpět
                </Button>
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={selectedChamps.length !== 6}
                  onClick={handleStart}
                >
                  🚀 {isCs ? 'Vstoupit na Rift a Zahájit Kariéru' : 'Lock In & Start Career'}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
