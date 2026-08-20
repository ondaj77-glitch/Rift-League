import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { StatBar } from '../components/ui/StatBar';
import { Card } from '../components/ui/Card';
import type { Role, Region, Playstyle, GameMode } from '../types/game';
import { ROLE_STATS_PREVIEW } from '../utils/characterStats';
import { getChampionsByRole, getChampIconUrl, getChampSplashUrl } from '../data/champions';

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
  const { t } = useTranslation();
  const startNewCareerExtended = useGameStore(s => s.startNewCareerExtended);
  const setPhase = useGameStore(s => s.setPhase);

  const [step, setStep] = useState<'mode' | 'basics' | 'role' | 'region' | 'playstyle' | 'champions'>('mode');
  const [mode, setMode] = useState<GameMode>('prodigy');
  const [name, setName] = useState('');
  const [gameName, setGameName] = useState('');
  const [role, setRole] = useState<Role>('mid');
  const [region, setRegion] = useState<Region>('LCK');
  const [playstyle, setPlaystyle] = useState<Playstyle>('mechanical');
  const [selectedChamps, setSelectedChamps] = useState<string[]>([]);

  // Auto-fill first 6 champions when role changes
  function handleSelectRole(r: Role) {
    setRole(r);
    const champs = getChampionsByRole(r).slice(0, 6).map(c => c.id);
    setSelectedChamps(champs);
  }

  function toggleChampion(champId: string) {
    if (selectedChamps.includes(champId)) {
      if (selectedChamps.length > 1) {
        setSelectedChamps(prev => prev.filter(id => id !== champId));
      }
    } else {
      if (selectedChamps.length < 6) {
        setSelectedChamps(prev => [...prev, champId]);
      }
    }
  }

  function handleStart() {
    startNewCareerExtended(mode, name.trim() || 'Player', gameName.trim() || 'Rookie', role, region, playstyle, selectedChamps);
  }

  const roleChamps = getChampionsByRole(role);
  const previewStats = ROLE_STATS_PREVIEW(role, playstyle);

  return (
    <div className="screen-bg min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <button onClick={() => setPhase('MENU')} className="text-slate-400 hover:text-white text-xl">←</button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
              {t('create.title')}
            </h1>
            <p className="text-xs text-slate-400">Step: {step.toUpperCase()}</p>
          </div>
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
                        <h3 className="font-bold text-white text-base">Prodigy Journey (Recommended)</h3>
                        <p className="text-xs text-gold-400 font-semibold">Start at Age 14 in Bronze IV Elo</p>
                      </div>
                    </div>
                    {mode === 'prodigy' && <span className="text-gold-400 font-black text-xl">✓</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Begin as an unknown teenager in your bedroom with no salary. Grind SoloQ, work part-time jobs, build your champion pool, and get scouted by Academy/Pro teams as you reach 16–18 years old!
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
                        <h3 className="font-bold text-white text-base">Tier 1 Pro Debut</h3>
                        <p className="text-xs text-purple-400 font-semibold">Start at Age 18 Signed with a Pro Team</p>
                      </div>
                    </div>
                    {mode === 'pro_debut' && <span className="text-gold-400 font-black text-xl">✓</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Skip the early amateur grind and jump directly into the pro league (LCK, LPL, LEC, LTA) with a full starting contract.
                  </p>
                </div>
              </div>

              <Button variant="gold" size="lg" fullWidth onClick={() => setStep('basics')}>
                Continue →
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
                    placeholder="e.g. Jan Novák"
                    className="w-full bg-rift-surface border border-rift-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 font-semibold">{t('create.gamename')}</label>
                  <input
                    value={gameName}
                    onChange={e => setGameName(e.target.value)}
                    placeholder="e.g. Faker / Chovy / Viper"
                    className="w-full bg-rift-surface border border-rift-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-400 font-mono font-bold"
                  />
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('mode')}>← Back</Button>
                <Button variant="gold" size="lg" fullWidth disabled={name.trim().length < 2 || gameName.trim().length < 2} onClick={() => setStep('role')}>
                  Continue →
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
                <Button variant="secondary" size="lg" onClick={() => setStep('basics')}>← Back</Button>
                <Button variant="gold" size="lg" fullWidth onClick={() => setStep('region')}>Continue →</Button>
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
                <Button variant="secondary" size="lg" onClick={() => setStep('role')}>← Back</Button>
                <Button variant="gold" size="lg" fullWidth onClick={() => setStep('playstyle')}>Continue →</Button>
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
                <Button variant="secondary" size="lg" onClick={() => setStep('region')}>← Back</Button>
                <Button variant="gold" size="lg" fullWidth onClick={() => setStep('champions')}>
                  Pick 6 Main Champions →
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: CHAMPION POOL (6 MAINS) */}
          {step === 'champions' && (
            <motion.div key="champions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base" style={{ fontFamily: 'Cinzel, serif' }}>
                    Select Your 6 Signature Mains ({selectedChamps.length}/6)
                  </h3>
                  <p className="text-xs text-slate-400">These will be your go-to champions in SoloQ and matches</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {roleChamps.map((champ) => {
                  const isSelected = selectedChamps.includes(champ.id);
                  return (
                    <div
                      key={champ.id}
                      onClick={() => toggleChampion(champ.id)}
                      className={`relative overflow-hidden rounded-xl border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold-400 bg-gold-950/40 shadow-md shadow-gold-500/20'
                          : 'border-rift-border bg-rift-card hover:border-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getChampIconUrl(champ.id)}
                          alt={champ.name}
                          className="w-10 h-10 rounded-lg border border-slate-700 object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-xs truncate">{champ.name}</p>
                          <p className="text-[10px] text-slate-400">{champ.playstyle}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-gold-400 rounded-full flex items-center justify-center text-black font-extrabold text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="lg" onClick={() => setStep('playstyle')}>← Back</Button>
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={selectedChamps.length !== 6}
                  onClick={handleStart}
                >
                  🚀 Launch Career ({mode === 'prodigy' ? 'Age 14 Prodigy' : 'Age 18 Pro'})
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
