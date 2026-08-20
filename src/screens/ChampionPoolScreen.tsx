import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ALL_CHAMPIONS, getChampIconUrl, getChampSplashUrl, getChampionsByRole } from '../data/champions';

export function ChampionPoolScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const swapPoolChampion = useGameStore(s => s.swapPoolChampion);
  const setShowPatchNotesModal = useGameStore(s => s.setShowPatchNotesModal);

  const [selectedPoolChamp, setSelectedPoolChamp] = useState<string | null>(null);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [newChampToSelect, setNewChampToSelect] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);

  if (!career) return null;

  const currentPatch = career.currentPatch;
  const poolChamps = ALL_CHAMPIONS.filter(c => career.championPool.includes(c.id));
  const roleChamps = getChampionsByRole(career.role).sort(
    (a, b) =>
      TIER_PRIORITY[currentPatch.tiers[a.id]?.tier || 'A'] -
      TIER_PRIORITY[currentPatch.tiers[b.id]?.tier || 'A']
  );
  const energy = career.lifestyle.energy;
  const remainingSwaps = career.swapsRemainingThisSplit ?? 2;

  function handleOpenSwap(oldChampId: string) {
    setSwapError(null);
    if (remainingSwaps <= 0) {
      setSwapError(t('champs.no_swaps_left' as any) || 'Vyčerpal jsi limit výměn (max 2x za split)!');
      return;
    }
    if (energy < 30) {
      setSwapError(t('champs.no_energy_swap' as any) || 'Nemáš dostatek energie! Výměna vyžaduje 30⚡.');
      return;
    }
    setSelectedPoolChamp(oldChampId);
    setNewChampToSelect(null);
    setSwapModalOpen(true);
  }

  function handleConfirmSwap() {
    if (selectedPoolChamp && newChampToSelect) {
      swapPoolChampion(selectedPoolChamp, newChampToSelect);
      setSwapModalOpen(false);
      setSelectedPoolChamp(null);
      setNewChampToSelect(null);
    }
  }

  return (
    <div className="space-y-6">

      {/* Header with current patch info and swap limits */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rift-card p-4 rounded-xl border border-rift-border">
        <div>
          <h2 className="text-lg font-bold text-white uppercase font-heading tracking-wide">
            {t('champs.my_pool_title')} (6 Mainů)
          </h2>
          <p className="text-xs text-slate-400">
            {t('champs.my_pool_desc')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-amber-950/50 px-3 py-1.5 rounded-lg border border-amber-800/40 text-xs font-bold text-amber-300">
            🔄 Výměny: {remainingSwaps}/2 tento split (30⚡)
          </div>
          <button
            onClick={() => setShowPatchNotesModal(true)}
            className="flex items-center gap-2 bg-rift-surface hover:bg-gold-950/40 px-3 py-1.5 rounded-lg border border-rift-border hover:border-gold-500/50 transition-all text-xs cursor-pointer group shadow-sm"
            title="Klikni pro detailní přehled Patch Notes a změn"
          >
            <span className="text-slate-400 group-hover:text-slate-200">📋 Patch:</span>
            <span className="font-black text-gold-400 font-mono">v{currentPatch.patchVersion}</span>
          </button>
        </div>
      </div>

      {/* Error banner */}
      {swapError && (
        <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-300 font-semibold">
          ⚠️ {swapError}
        </div>
      )}

      {/* 6 Main Champions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {poolChamps.map((champ) => {
          const meta = currentPatch.tiers[champ.id] || { tier: 'A', winRate: 50.0, note: 'Stabilní pick' };
          const mastery = career.masteries[champ.id] || { masteryLevel: 1, gamesPlayed: 0, wins: 0 };

          return (
            <motion.div
              key={champ.id}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-xl border border-rift-border bg-rift-card p-4 space-y-3"
            >
              {/* Background splash */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
                style={{ backgroundImage: `url(${getChampSplashUrl(champ.id)})` }}
              />

              <div className="flex items-center gap-3 relative z-10">
                <img
                  src={getChampIconUrl(champ.id)}
                  alt={champ.name}
                  className="w-14 h-14 rounded-xl border-2 border-slate-700 object-cover shadow-md"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base truncate">{champ.name}</h3>
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${
                      meta.tier === 'S+' ? 'bg-amber-400 text-black font-extrabold' :
                      meta.tier === 'S' ? 'bg-purple-600 text-white font-bold' :
                      meta.tier === 'A' ? 'bg-blue-600 text-white font-bold' :
                      meta.tier === 'B' ? 'bg-slate-700 text-slate-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {meta.tier} TIER
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{champ.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{meta.winRate}% Patch Win Rate</p>
                </div>
              </div>

              {/* Mastery Level */}
              <div className="space-y-1 relative z-10">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gold-400">Mastery Level {mastery.masteryLevel}</span>
                  <span className="text-slate-400 font-mono">{mastery.gamesPlayed} her ({mastery.wins}V)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                    style={{ width: `${(mastery.masteryLevel / 7) * 100}%` }}
                  />
                </div>
              </div>

              {/* Patch Note */}
              <p className="text-[11px] text-slate-300 italic bg-rift-surface/90 p-2 rounded border border-rift-border/50 relative z-10">
                "{meta.note}"
              </p>

              {/* Swap Button */}
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                disabled={remainingSwaps <= 0 || energy < 30}
                className="relative z-10"
                onClick={() => handleOpenSwap(champ.id)}
              >
                🔄 {t('champs.swap_champ_btn')} (-30⚡)
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Role Meta Tier List */}
      <Card className="p-5 space-y-4">
        <div className="border-b border-rift-border pb-3">
          <h3 className="text-base font-bold text-white uppercase font-heading tracking-wide">
            📊 {career.role.toUpperCase()} {t('champs.meta_tier_list_title')} (Patch {currentPatch.patchVersion})
          </h3>
          <p className="text-xs text-slate-400">
            {t('champs.meta_tier_list_desc')}
          </p>
        </div>

        <div className="space-y-2">
          {roleChamps.map((champ) => {
            const meta = currentPatch.tiers[champ.id] || { tier: 'A', winRate: 50.0, note: 'Stabilní' };
            const isInPool = career.championPool.includes(champ.id);

            return (
              <div
                key={champ.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  isInPool ? 'bg-purple-950/30 border-purple-700/50' : 'bg-rift-surface border-rift-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 text-center text-xs font-black px-1.5 py-0.5 rounded ${
                    meta.tier === 'S+' ? 'bg-amber-400 text-black font-extrabold' :
                    meta.tier === 'S' ? 'bg-purple-600 text-white font-bold' :
                    meta.tier === 'A' ? 'bg-blue-600 text-white font-bold' :
                    meta.tier === 'B' ? 'bg-slate-700 text-slate-300' : 'bg-red-950 text-red-400'
                  }`}>
                    {meta.tier}
                  </span>
                  <img
                    src={getChampIconUrl(champ.id)}
                    alt=""
                    className="w-8 h-8 rounded-lg border border-slate-700 object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <span className="font-bold text-white text-sm">{champ.name}</span>
                    <span className="text-slate-400 text-xs ml-2 font-medium">({champ.playstyle})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <span className="text-xs font-mono text-slate-300">{meta.winRate}% WR</span>
                  {isInPool && (
                    <span className="text-[11px] bg-rift-purple text-white px-2 py-0.5 rounded font-bold">
                      V POOLU
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* SWAP CHAMPION MODAL */}
      <AnimatePresence>
        {swapModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-rift-card border border-rift-border rounded-2xl p-6 max-w-lg w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-rift-border pb-3">
                <h3 className="font-bold text-white text-base">
                  Vyměnit {selectedPoolChamp} za nového championa
                </h3>
                <button
                  onClick={() => setSwapModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Vyber nového championa ze své linky. Stojí <strong>30⚡ energie</strong> (Zbývá {remainingSwaps}/2 výměn):
              </p>

              <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                {roleChamps
                  .filter(c => !career.championPool.includes(c.id))
                  .map((champ) => {
                    const isSelected = newChampToSelect === champ.id;
                    const meta = currentPatch.tiers[champ.id] || { tier: 'A', winRate: 50.0 };

                    return (
                      <div
                        key={champ.id}
                        onClick={() => setNewChampToSelect(champ.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-gold-400 bg-gold-950/40'
                            : 'border-rift-border bg-rift-surface hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={getChampIconUrl(champ.id)} className="w-10 h-10 rounded-lg border border-slate-700" alt="" />
                          <div>
                            <p className="font-bold text-white text-sm">{champ.name}</p>
                            <p className="text-xs text-slate-400">{champ.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-300">{meta.tier} Tier</span>
                          {isSelected && <span className="text-gold-400 font-bold text-lg">✓</span>}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Confirm Swap Button */}
              <div className="pt-3 border-t border-rift-border flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setSwapModalOpen(false)}>
                  Zrušit
                </Button>
                <Button
                  variant="gold"
                  fullWidth
                  disabled={!newChampToSelect}
                  onClick={handleConfirmSwap}
                >
                  Potvrdit Výměnu (-30⚡)
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
