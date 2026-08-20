export type Tier =
  | 'IRON'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'EMERALD'
  | 'DIAMOND'
  | 'MASTER'
  | 'GRANDMASTER'
  | 'CHALLENGER';

export type Division = 'IV' | 'III' | 'II' | 'I';

export interface RankInfo {
  tier: Tier;
  division?: Division;
  lp: number;
  globalRank?: number; // e.g. #48 in Challenger
}

export const TIER_ORDER: Tier[] = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
];

export const TIER_COLORS: Record<Tier, { text: string; bg: string; border: string; glow: string }> = {
  IRON: { text: 'text-zinc-400', bg: 'bg-zinc-900/60', border: 'border-zinc-700', glow: 'shadow-zinc-800/50' },
  BRONZE: { text: 'text-amber-700', bg: 'bg-amber-950/60', border: 'border-amber-800', glow: 'shadow-amber-900/50' },
  SILVER: { text: 'text-slate-300', bg: 'bg-slate-900/60', border: 'border-slate-600', glow: 'shadow-slate-500/30' },
  GOLD: { text: 'text-yellow-400', bg: 'bg-yellow-950/60', border: 'border-yellow-600', glow: 'shadow-yellow-500/40' },
  PLATINUM: { text: 'text-emerald-400', bg: 'bg-emerald-950/60', border: 'border-emerald-700', glow: 'shadow-emerald-500/40' },
  EMERALD: { text: 'text-teal-400', bg: 'bg-teal-950/60', border: 'border-teal-600', glow: 'shadow-teal-500/40' },
  DIAMOND: { text: 'text-cyan-400', bg: 'bg-cyan-950/60', border: 'border-cyan-600', glow: 'shadow-cyan-500/40' },
  MASTER: { text: 'text-purple-400', bg: 'bg-purple-950/60', border: 'border-purple-600', glow: 'shadow-purple-500/50' },
  GRANDMASTER: { text: 'text-red-400', bg: 'bg-red-950/60', border: 'border-red-600', glow: 'shadow-red-500/50' },
  CHALLENGER: { text: 'text-amber-300 font-extrabold', bg: 'bg-gradient-to-r from-amber-950/80 to-yellow-950/80', border: 'border-amber-400', glow: 'shadow-amber-400/60' },
};

export const TIER_ICONS: Record<Tier, string> = {
  IRON: '⚙️',
  BRONZE: '🥉',
  SILVER: '🥈',
  GOLD: '🥇',
  PLATINUM: '💎',
  EMERALD: '❇️',
  DIAMOND: '🔷',
  MASTER: '🔮',
  GRANDMASTER: '🔥',
  CHALLENGER: '👑',
};

export interface LeaderboardPlayer {
  rank: number;
  name: string;
  tag: string;
  tier: Tier;
  lp: number;
  winRate: number;
  mainChamp: string;
  isPlayer?: boolean;
}

export const FAMOUS_PLAYERS: { name: string; tag: string; main: string }[] = [
  { name: 'Hide on bush', tag: 'KR1', main: 'Azir' }, // Faker
  { name: 'Chovy', tag: 'KR2', main: 'Yone' },
  { name: 'ShowMaker', tag: 'DK', main: 'Syndra' },
  { name: 'Caps', tag: 'EUW', main: 'Ahri' },
  { name: 'Gumayusi', tag: 'T1', main: 'Varus' },
  { name: 'Ruler', tag: 'LPL', main: 'Kaisa' },
  { name: 'Keria', tag: 'SUP', main: 'Thresh' },
  { name: 'Zeus', tag: 'TOP', main: 'Aatrox' },
  { name: 'Bin', tag: 'BLG', main: 'Jax' },
  { name: 'Knight', tag: 'LPL', main: 'Hwei' },
  { name: 'Viper', tag: 'HLE', main: 'Zeri' },
  { name: 'Canyon', tag: 'GEN', main: 'Nidalee' },
  { name: 'Agurin', tag: 'EUW', main: 'JarvanIV' },
  { name: 'Dopa', tag: 'KR', main: 'Orianna' },
  { name: 'Tarzan', tag: 'LPL', main: 'LeeSin' },
  { name: 'Jojopyun', tag: 'NA1', main: 'Sylas' },
  { name: 'Hans Sama', tag: 'G2', main: 'Draven' },
  { name: 'BeryL', tag: 'LCK', main: 'Rakan' },
];

export function getRankDisplay(rank: RankInfo): string {
  if (rank.tier === 'MASTER' || rank.tier === 'GRANDMASTER' || rank.tier === 'CHALLENGER') {
    return `${rank.tier} (${rank.lp} LP)`;
  }
  return `${rank.tier} ${rank.division || 'IV'} (${rank.lp} LP)`;
}

export function calculateGlobalRank(tier: Tier, lp: number): number {
  if (tier === 'CHALLENGER') {
    // 1000+ LP can be top 50
    if (lp >= 1400) return Math.max(1, Math.floor(10 - (lp - 1400) / 50));
    if (lp >= 1000) return Math.max(11, Math.floor(50 - (lp - 1000) / 10));
    return Math.max(51, Math.floor(200 - (lp - 600) / 3));
  }
  if (tier === 'GRANDMASTER') {
    return Math.floor(300 + (700 - lp));
  }
  if (tier === 'MASTER') {
    return Math.floor(1500 + (500 - lp) * 5);
  }
  if (tier === 'DIAMOND') return Math.floor(15000 + (400 - lp) * 20);
  if (tier === 'EMERALD') return Math.floor(60000 + (400 - lp) * 50);
  if (tier === 'PLATINUM') return Math.floor(180000 + (400 - lp) * 100);
  if (tier === 'GOLD') return Math.floor(450000 + (400 - lp) * 200);
  if (tier === 'SILVER') return Math.floor(950000 + (400 - lp) * 400);
  if (tier === 'BRONZE') return Math.floor(2000000 + (400 - lp) * 1000);
  return 3500000;
}

export function generateLeaderboard(playerRank: RankInfo, playerName: string): LeaderboardPlayer[] {
  const list: LeaderboardPlayer[] = [];
  const startLP = 1650;

  FAMOUS_PLAYERS.forEach((pro, i) => {
    list.push({
      rank: i + 1,
      name: pro.name,
      tag: pro.tag,
      tier: 'CHALLENGER',
      lp: startLP - i * 45 + Math.floor(Math.sin(i) * 20),
      winRate: Math.round(62 - i * 0.4),
      mainChamp: pro.main,
    });
  });

  // If player is in Challenger or high GM, place player on leaderboard
  if (playerRank.tier === 'CHALLENGER' || (playerRank.tier === 'GRANDMASTER' && playerRank.lp > 500)) {
    const playerGlobal = calculateGlobalRank(playerRank.tier, playerRank.lp);
    const pEntry: LeaderboardPlayer = {
      rank: playerGlobal,
      name: playerName,
      tag: 'YOU',
      tier: playerRank.tier,
      lp: playerRank.lp,
      winRate: 64,
      mainChamp: 'Aatrox',
      isPlayer: true,
    };

    if (playerGlobal <= list.length) {
      list.splice(playerGlobal - 1, 0, pEntry);
    } else {
      list.push(pEntry);
    }
  }

  return list.slice(0, 15);
}
