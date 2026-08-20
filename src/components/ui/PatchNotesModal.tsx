import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from './Button';
import { getChampIconUrl, ALL_CHAMPIONS } from '../../data/champions';

export function PatchNotesModal() {
  const { language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const showPatchNotesModal = useGameStore(s => s.showPatchNotesModal);
  const setShowPatchNotesModal = useGameStore(s => s.setShowPatchNotesModal);

  if (!career || !showPatchNotesModal) return null;

  const patch = career.currentPatch || {
    patchVersion: '15.1',
    season: 15,
    headline: 'Nová sezóna a meta posuny',
    systemChanges: ['Zvýšena odolnost věží', 'Zkrácen cooldown na vizi'],
    buffs: [],
    nerfs: [],
    tiers: {},
  };

  const userPool = career.championPool || [];
  const buffs = patch.buffs || [];
  const nerfs = patch.nerfs || [];
  const systemChanges = patch.systemChanges || [];

  // Check if player's mains are affected
  const affectedMains = [...buffs, ...nerfs].filter(c => userPool.includes(c.championId));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="bg-rift-card border-2 border-gold-500/50 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-rift-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold font-mono">
                  SEASON {patch.season || 15} · SPLIT {(career.split || 'Winter').toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-mono">PATCH {patch.patchVersion || '15.1'}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1 uppercase font-heading tracking-wide">
                📋 {isCs ? 'Oficiální Riot Patch Notes' : 'Official Riot Patch Notes'}
              </h2>
              <p className="text-gold-400 text-xs font-semibold mt-0.5">
                "{patch.headline || (isCs ? 'Balanční úpravy a posuny v metě' : 'Balance adjustments and meta shifts')}"
              </p>
            </div>

            <button
              onClick={() => setShowPatchNotesModal(false)}
              className="text-slate-400 hover:text-white text-xl p-1 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* User mains impact alert */}
          {affectedMains.length > 0 && (
            <div className="bg-purple-950/60 border border-purple-600/50 p-3.5 rounded-xl flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div className="text-xs">
                <p className="font-bold text-purple-200 uppercase tracking-wide">
                  {isCs ? 'Změny ovlivňují tvůj Champion Pool!' : 'Changes directly impact your Champion Pool!'}
                </p>
                <p className="text-slate-300 mt-0.5">
                  {affectedMains.map(m => (
                    <span key={m.championId} className="mr-2 inline-block">
                      <strong className="text-white">{m.championId}</strong>: {m.changeType === 'buff' ? '🟢 Buff' : '🔴 Nerf'} ({m.oldTier} ➔ <span className="text-gold-400 font-bold">{m.newTier}</span>)
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          {/* System Changes */}
          {systemChanges.length > 0 && (
            <div className="bg-rift-surface p-4 rounded-xl border border-rift-border space-y-2">
              <h3 className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                🗺️ {isCs ? 'Systémové změny na mapě & v džungli' : 'Systemic Map & Objective Changes'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {systemChanges.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-200">
                    <span>•</span>
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buffs & Nerfs Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* BUFFS */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-400 uppercase tracking-wider">
                <span>🟢</span>
                <span>{isCs ? 'Posílení Šampióni (Buffs)' : 'Buffed Champions'}</span>
              </div>

              <div className="space-y-2">
                {buffs.map(buff => {
                  const champ = ALL_CHAMPIONS.find(c => c.id === buff.championId);
                  const isMain = userPool.includes(buff.championId);

                  return (
                    <div
                      key={buff.championId}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                        isMain ? 'bg-green-950/30 border-green-500/60' : 'bg-rift-surface border-rift-border'
                      }`}
                    >
                      <img
                        src={getChampIconUrl(buff.championId)}
                        alt={buff.championId}
                        className="w-10 h-10 rounded-lg border border-green-600/50 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-xs truncate flex items-center gap-1">
                            {champ?.name || buff.championId}
                            {isMain && <span className="text-[10px] text-gold-400 font-bold">★ MAIN</span>}
                          </span>
                          <span className="text-[11px] font-bold text-green-400 font-mono">
                            {buff.oldTier} ➔ {buff.newTier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-tight">
                          {buff.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NERFS */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
                <span>🔴</span>
                <span>{isCs ? 'Oslabení Šampióni (Nerfs)' : 'Nerfed Champions'}</span>
              </div>

              <div className="space-y-2">
                {nerfs.map(nerf => {
                  const champ = ALL_CHAMPIONS.find(c => c.id === nerf.championId);
                  const isMain = userPool.includes(nerf.championId);

                  return (
                    <div
                      key={nerf.championId}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                        isMain ? 'bg-red-950/30 border-red-500/60' : 'bg-rift-surface border-rift-border'
                      }`}
                    >
                      <img
                        src={getChampIconUrl(nerf.championId)}
                        alt={nerf.championId}
                        className="w-10 h-10 rounded-lg border border-red-600/50 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-xs truncate flex items-center gap-1">
                            {champ?.name || nerf.championId}
                            {isMain && <span className="text-[10px] text-red-400 font-bold">★ MAIN</span>}
                          </span>
                          <span className="text-[11px] font-bold text-red-400 font-mono">
                            {nerf.oldTier} ➔ {nerf.newTier}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-tight">
                          {nerf.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              variant="gold"
              size="lg"
              fullWidth
              onClick={() => setShowPatchNotesModal(false)}
            >
              {isCs ? 'Rozumím, nastudovat novou metu (OK)' : 'Understood, analyze new meta (OK)'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
