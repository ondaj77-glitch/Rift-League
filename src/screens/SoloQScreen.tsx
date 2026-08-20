import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TIER_COLORS, TIER_ICONS, generateLeaderboard } from '../data/ranks';
import { getChampIconUrl } from '../data/champions';

export function SoloQScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const startSoloQMatch = useGameStore(s => s.startSoloQMatch);
  const grindSoloQFast = useGameStore(s => s.grindSoloQFast);

  const [activeTab, setActiveTab] = useState<'hub' | 'leaderboard'>('hub');

  if (!career) return null;

  const rank = career.rank;
  const colors = TIER_COLORS[rank.tier] || TIER_COLORS.BRONZE;
  const icon = TIER_ICONS[rank.tier] || '🥉';
  const winRate = career.soloqWins + career.soloqLosses > 0
    ? Math.round((career.soloqWins / (career.soloqWins + career.soloqLosses)) * 100)
    : 50;
  const playerMainChamp = career.championPool?.[0] || 'Aatrox';
  const leaderboard = generateLeaderboard(rank, career.gameName, career.week, career.year, playerMainChamp, winRate);

  return (
    <div className="space-y-6">

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-rift-border pb-3">
        <button
          onClick={() => setActiveTab('hub')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'hub'
              ? 'bg-rift-purple text-white shadow-lg shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-rift-card'
          }`}
        >
          🎮 SoloQ Hub & Rank
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-rift-purple text-white shadow-lg shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-rift-card'
          }`}
        >
          👑 {t('soloq.leaderboard_title')} (Top 50)
        </button>
      </div>

      {activeTab === 'hub' && (
        <div className="space-y-5">
          {/* Main Rank Card */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`p-6 rounded-2xl border ${colors.bg} ${colors.border} ${colors.glow} shadow-lg relative overflow-hidden`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl select-none">{icon}</div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Current Ranked Tier
                    </span>
                    <h2 className={`text-2xl sm:text-3xl font-black uppercase font-heading tracking-wide ${colors.text}`}>
                      {rank.tier} {rank.division || ''}
                    </h2>
                    <p className="text-slate-300 text-sm font-bold mt-0.5">
                      {rank.lp} <span className="text-xs text-slate-400 font-normal">LP</span>
                    </p>
                  </div>
                </div>

                {/* Global World Rank position */}
                <div className="text-center sm:text-right bg-rift-card/60 px-4 py-3 rounded-xl border border-rift-border/50">
                  <p className="text-xs text-slate-400 font-medium">{t('soloq.global_ranking')}</p>
                  <p className="text-2xl font-black text-gold-400 font-mono">
                    #{rank.globalRank?.toLocaleString() || '1,520,400'}
                  </p>
                  <p className="text-[11px] text-slate-500">World Rank</p>
                </div>
              </div>

              {/* LP Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Progress to Next Rank</span>
                  <span>{rank.tier === 'CHALLENGER' ? `${rank.lp} LP` : `${rank.lp} / 100 LP`}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-gold-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, rank.lp)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats & Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-2xl font-black text-green-400">{career.soloqWins}</p>
              <p className="text-xs text-slate-400 mt-1">SoloQ Wins</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-black text-red-400">{career.soloqLosses}</p>
              <p className="text-xs text-slate-400 mt-1">SoloQ Losses</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-black text-gold-400">{winRate}%</p>
              <p className="text-xs text-slate-400 mt-1">SoloQ Win Rate</p>
            </Card>
          </div>

          {/* SoloQ Play Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              variant="gold"
              size="lg"
              fullWidth
              disabled={career.lifestyle.energy < 20}
              onClick={startSoloQMatch}
            >
              ⚔️ {t('soloq.play_interactive_match')} (-20⚡)
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              disabled={career.lifestyle.energy < 15}
              onClick={grindSoloQFast}
            >
              ⚡ {t('soloq.quick_grind_match')} (-15⚡)
            </Button>
          </div>
        </div>
      )}

      {/* Leaderboard Tab (Top 50 Global) */}
      {activeTab === 'leaderboard' && (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-rift-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-base font-heading uppercase tracking-wide">
                👑 {t('soloq.leaderboard_title')} – Top 50 Svět
              </h3>
              <p className="text-xs text-slate-400">Dynamický Korean / World Super Server žebříček · Týden {career.week}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-950/60 text-amber-400 border border-amber-700/50 px-2.5 py-1 rounded-full font-bold font-mono">
                ⚡ Týdenní posuny aktivní
              </span>
              <span className="text-xs bg-gold-950/60 text-gold-400 border border-gold-700/50 px-2.5 py-1 rounded-full font-bold">
                Split {career.splitNumber}
              </span>
            </div>
          </div>

          <div className="divide-y divide-rift-border/50 max-h-[65vh] overflow-y-auto pr-1">
            {leaderboard.map((player) => (
              <div
                key={player.rank + player.name}
                className={`flex items-center px-4 sm:px-5 py-3 transition-colors ${
                  player.isPlayer ? 'bg-purple-950/50 border-l-4 border-l-gold-400 shadow-md' : 'hover:bg-white/5'
                }`}
              >
                {/* Rank Number & Shift */}
                <div className="flex items-center gap-1.5 w-14 shrink-0">
                  <span className={`font-black text-sm font-mono ${
                    player.rank === 1 ? 'text-amber-300 font-extrabold text-base' :
                    player.rank === 2 ? 'text-slate-300 font-bold' :
                    player.rank === 3 ? 'text-amber-600 font-bold' : 'text-slate-400'
                  }`}>
                    #{player.rank}
                  </span>
                  {player.rankShift !== undefined && (
                    <span className={`text-[10px] font-bold ${
                      player.rankShift > 0 ? 'text-green-400' :
                      player.rankShift < 0 ? 'text-red-400' : 'text-slate-600'
                    }`}>
                      {player.rankShift > 0 ? `▲${player.rankShift}` : player.rankShift < 0 ? `▼${Math.abs(player.rankShift)}` : '—'}
                    </span>
                  )}
                </div>

                {/* Main Champion Icon */}
                <img
                  src={getChampIconUrl(player.mainChamp)}
                  alt=""
                  className="w-8 h-8 rounded-lg border border-slate-700 mx-2 shrink-0 object-cover"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />

                {/* Player Name, Tag & Streak */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold truncate ${player.isPlayer ? 'text-gold-400 font-extrabold' : 'text-white'}`}>
                      {player.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">#{player.tag}</span>
                    {player.streak && (
                      <span className="text-[10px] bg-rift-surface text-amber-300 px-1.5 py-0.2 rounded border border-rift-border/60 hidden sm:inline-block">
                        {player.streak}
                      </span>
                    )}
                    {player.isPlayer && (
                      <span className="text-[10px] bg-gold-400 text-black px-1.5 py-0.2 rounded font-black">
                        TY (HRÁČ)
                      </span>
                    )}
                  </div>
                </div>

                {/* LP & WinRate & Weekly Change */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-sm font-black text-white font-mono">{player.lp} LP</span>
                    {player.weeklyChange !== undefined && (
                      <span className={`text-[10px] font-bold ${player.weeklyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({player.weeklyChange >= 0 ? '+' : ''}{player.weeklyChange})
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-emerald-400 font-semibold">{player.winRate}% WR</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
