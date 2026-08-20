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
  const colors = TIER_COLORS[rank.tier];
  const icon = TIER_ICONS[rank.tier];
  const leaderboard = generateLeaderboard(rank, career.gameName);
  const winRate = career.soloqWins + career.soloqLosses > 0
    ? Math.round((career.soloqWins / (career.soloqWins + career.soloqLosses)) * 100)
    : 50;

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
          👑 {t('soloq.leaderboard_title')}
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
                    <h2 className={`text-2xl sm:text-3xl font-black ${colors.text}`} style={{ fontFamily: 'Cinzel, serif' }}>
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

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-rift-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base" style={{ fontFamily: 'Cinzel, serif' }}>
                {t('soloq.leaderboard_title')}
              </h3>
              <p className="text-xs text-slate-500">Korea / Global Top Tier 1 Ladder</p>
            </div>
            <span className="text-xs bg-gold-950/60 text-gold-400 border border-gold-700/50 px-2.5 py-1 rounded-full font-bold">
              Season 15
            </span>
          </div>

          <div className="divide-y divide-rift-border/50">
            {leaderboard.map((player) => (
              <div
                key={player.rank + player.name}
                className={`flex items-center px-5 py-3 transition-colors ${
                  player.isPlayer ? 'bg-purple-950/40 border-l-4 border-l-rift-purple' : 'hover:bg-white/5'
                }`}
              >
                {/* Rank Number */}
                <span className={`w-8 font-black text-sm font-mono ${
                  player.rank === 1 ? 'text-amber-300' :
                  player.rank === 2 ? 'text-slate-300' :
                  player.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                }`}>
                  #{player.rank}
                </span>

                {/* Main Champion Icon */}
                <img
                  src={getChampIconUrl(player.mainChamp)}
                  alt=""
                  className="w-7 h-7 rounded-full border border-slate-700 mx-2"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />

                {/* Player Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold truncate ${player.isPlayer ? 'text-gold-400' : 'text-white'}`}>
                      {player.name}
                    </span>
                    <span className="text-[10px] text-slate-500">#{player.tag}</span>
                    {player.isPlayer && (
                      <span className="text-[10px] bg-rift-purple text-white px-1.5 py-0.2 rounded font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                </div>

                {/* LP & WinRate */}
                <div className="text-right">
                  <span className="text-sm font-bold text-white">{player.lp} LP</span>
                  <p className="text-[10px] text-green-400 font-semibold">{player.winRate}% WR</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
