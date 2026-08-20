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
  weeklyChange?: number; // e.g. +28 or -16 LP
  rankShift?: number; // e.g. +2 (moved up 2 places) or -1
  streak?: string;
  isPlayer?: boolean;
}

export const FAMOUS_PLAYERS: { name: string; tag: string; main: string; region: string; baseLP: number }[] = [
  { name: 'Hide on bush', tag: 'T1', main: 'Azir', region: 'KR', baseLP: 1780 }, // Faker
  { name: 'Chovy', tag: 'GEN', main: 'Yone', region: 'KR', baseLP: 1740 },
  { name: 'ShowMaker', tag: 'DK', main: 'Syndra', region: 'KR', baseLP: 1690 },
  { name: 'Canyon', tag: 'GEN', main: 'Nidalee', region: 'KR', baseLP: 1660 },
  { name: 'Viper', tag: 'HLE', main: 'Zeri', region: 'KR', baseLP: 1620 },
  { name: 'Ruler', tag: 'JDG', main: 'Kaisa', region: 'CN', baseLP: 1590 },
  { name: 'Knight', tag: 'BLG', main: 'Hwei', region: 'CN', baseLP: 1560 },
  { name: 'Bin', tag: 'BLG', main: 'Jax', region: 'CN', baseLP: 1530 },
  { name: 'Zeus', tag: 'HLE', main: 'Aatrox', region: 'KR', baseLP: 1510 },
  { name: 'Gumayusi', tag: 'T1', main: 'Varus', region: 'KR', baseLP: 1480 },
  { name: 'Keria', tag: 'T1', main: 'Thresh', region: 'KR', baseLP: 1460 },
  { name: 'Caps', tag: 'G2', main: 'Leblanc', region: 'EUW', baseLP: 1430 },
  { name: '369', tag: 'TES', main: 'KSante', region: 'CN', baseLP: 1410 },
  { name: 'Elk', tag: 'BLG', main: 'Kalista', region: 'CN', baseLP: 1390 },
  { name: 'ON', tag: 'BLG', main: 'Rakan', region: 'CN', baseLP: 1370 },
  { name: 'Elyoya', tag: 'MDK', main: 'LeeSin', region: 'EUW', baseLP: 1350 },
  { name: 'Rekkles', tag: 'T1', main: 'Janna', region: 'KR', baseLP: 1330 },
  { name: 'Jankos', tag: 'TH', main: 'Sejuani', region: 'EUW', baseLP: 1310 },
  { name: 'Caliste', tag: 'KC', main: 'Draven', region: 'EUW', baseLP: 1290 },
  { name: 'Bo', tag: 'FNC', main: 'Graves', region: 'EUW', baseLP: 1270 },
  { name: 'Dopa', tag: 'KR', main: 'Orianna', region: 'KR', baseLP: 1250 },
  { name: 'TheShy', tag: 'WBG', main: 'Fiora', region: 'CN', baseLP: 1230 },
  { name: 'Rookie', tag: 'NIP', main: 'Jayce', region: 'CN', baseLP: 1210 },
  { name: 'Scout', tag: 'LNG', main: 'Viktor', region: 'CN', baseLP: 1190 },
  { name: 'JackeyLove', tag: 'TES', main: 'Lucian', region: 'CN', baseLP: 1170 },
  { name: 'Meiko', tag: 'TES', main: 'Nautilus', region: 'CN', baseLP: 1150 },
  { name: 'Tarzan', tag: 'WBG', main: 'JarvanIV', region: 'CN', baseLP: 1130 },
  { name: 'Kanavi', tag: 'JDG', main: 'Viego', region: 'CN', baseLP: 1110 },
  { name: 'BeryL', tag: 'KT', main: 'Bard', region: 'KR', baseLP: 1090 },
  { name: 'Peanut', tag: 'HLE', main: 'Poppy', region: 'KR', baseLP: 1070 },
  { name: 'Doran', tag: 'T1', main: 'Gnar', region: 'KR', baseLP: 1050 },
  { name: 'Peyz', tag: 'GEN', main: 'Jinx', region: 'KR', baseLP: 1030 },
  { name: 'Lehends', tag: 'GEN', main: 'Blitzcrank', region: 'KR', baseLP: 1010 },
  { name: 'Kiin', tag: 'GEN', main: 'Renekton', region: 'KR', baseLP: 990 },
  { name: 'Zeka', tag: 'HLE', main: 'Akali', region: 'KR', baseLP: 970 },
  { name: 'Kingen', tag: 'DK', main: 'Ornn', region: 'KR', baseLP: 950 },
  { name: 'Pyosik', tag: 'KT', main: 'Kindred', region: 'KR', baseLP: 930 },
  { name: 'Deft', tag: 'KT', main: 'Ezreal', region: 'KR', baseLP: 910 },
  { name: 'Bdd', tag: 'KT', main: 'Sylas', region: 'KR', baseLP: 890 },
  { name: 'Inspired', tag: 'FLY', main: 'XinZhao', region: 'NA', baseLP: 870 },
  { name: 'Bwipo', tag: 'FLY', main: 'Olaf', region: 'NA', baseLP: 850 },
  { name: 'Jojopyun', tag: 'C9', main: 'Ahri', region: 'NA', baseLP: 830 },
  { name: 'Jensen', tag: 'FLY', main: 'Anivia', region: 'NA', baseLP: 810 },
  { name: 'Blaber', tag: 'C9', main: 'Nocturne', region: 'NA', baseLP: 790 },
  { name: 'Hans Sama', tag: 'G2', main: 'Xayah', region: 'EUW', baseLP: 780 },
  { name: 'Mikyx', tag: 'G2', main: 'Renata', region: 'EUW', baseLP: 770 },
  { name: 'BrokenBlade', tag: 'G2', main: 'Rumble', region: 'EUW', baseLP: 760 },
  { name: 'Razork', tag: 'FNC', main: 'Viego', region: 'EUW', baseLP: 750 },
  { name: 'Humanoid', tag: 'FNC', main: 'Azir', region: 'EUW', baseLP: 740 },
  { name: 'Agurin', tag: 'EUW', main: 'JarvanIV', region: 'EUW', baseLP: 730 },
  { name: 'Nemesis', tag: 'KR', main: 'Kayle', region: 'KR', baseLP: 720 },
  { name: 'Noway4u', tag: 'VN', main: 'Tristana', region: 'VN', baseLP: 710 },
  { name: 'Supa', tag: 'MDK', main: 'Aphelios', region: 'EUW', baseLP: 700 },
  { name: 'Vetheo', tag: 'VIT', main: 'Zoe', region: 'EUW', baseLP: 690 },
  { name: 'MagiFelix', tag: 'EUW', main: 'Kassadin', region: 'EUW', baseLP: 680 },
];

export function getRankDisplay(rank: RankInfo): string {
  if (rank.tier === 'MASTER' || rank.tier === 'GRANDMASTER' || rank.tier === 'CHALLENGER') {
    return `${rank.tier} (${rank.lp} LP)`;
  }
  return `${rank.tier} ${rank.division || 'IV'} (${rank.lp} LP)`;
}

export function calculateGlobalRank(tier: Tier, lp: number): number {
  if (tier === 'CHALLENGER') {
    if (lp >= 1600) return Math.max(1, Math.floor(5 - (lp - 1600) / 40));
    if (lp >= 1200) return Math.max(6, Math.floor(25 - (lp - 1200) / 20));
    if (lp >= 800)  return Math.max(26, Math.floor(55 - (lp - 800) / 15));
    return Math.max(56, Math.floor(150 - (lp - 500) / 5));
  }
  if (tier === 'GRANDMASTER') {
    return Math.floor(250 + (700 - lp));
  }
  if (tier === 'MASTER') {
    return Math.floor(1200 + (500 - lp) * 4);
  }
  if (tier === 'DIAMOND') return Math.floor(15000 + (400 - lp) * 20);
  if (tier === 'EMERALD') return Math.floor(60000 + (400 - lp) * 50);
  if (tier === 'PLATINUM') return Math.floor(180000 + (400 - lp) * 100);
  if (tier === 'GOLD') return Math.floor(450000 + (400 - lp) * 200);
  if (tier === 'SILVER') return Math.floor(950000 + (400 - lp) * 400);
  if (tier === 'BRONZE') return Math.floor(2000000 + (400 - lp) * 1000);
  return 3500000;
}

export function generateLeaderboard(
  playerRank: RankInfo,
  playerName: string,
  week = 1,
  season = 15,
  playerMainChamp = 'Aatrox',
  playerWinRate = 58
): LeaderboardPlayer[] {
  const list: LeaderboardPlayer[] = [];

  FAMOUS_PLAYERS.forEach((pro, i) => {
    // Dynamic weekly shift based on sinusoidal curves per week
    const weekShift = Math.floor(Math.sin(i * 7 + week * 3 + season * 5) * 55);
    const weeklyChange = Math.floor(Math.sin(i * 11 + week * 4) * 35);
    const rankShift = (weekShift > 15) ? 2 : (weekShift > 0) ? 1 : (weekShift < -15) ? -2 : (weekShift < 0) ? -1 : 0;
    const finalLP = Math.max(500, pro.baseLP + weekShift);
    const winRate = Math.round(64 - (i * 0.15) + (Math.sin(i + week) * 2));
    const streak = weeklyChange > 15 ? '🔥 4W' : weeklyChange > 0 ? '🔥 2W' : weeklyChange < -15 ? '❄️ 3L' : '⚡ 1W';

    list.push({
      rank: 0,
      name: pro.name,
      tag: pro.tag,
      tier: 'CHALLENGER',
      lp: finalLP,
      winRate: Math.max(50, Math.min(75, winRate)),
      mainChamp: pro.main,
      weeklyChange,
      rankShift,
      streak,
    });
  });

  // If player is in Challenger / Grandmaster with high LP, insert player into ladder
  if (playerRank.tier === 'CHALLENGER' || (playerRank.tier === 'GRANDMASTER' && playerRank.lp >= 400)) {
    list.push({
      rank: 0,
      name: playerName,
      tag: 'YOU',
      tier: playerRank.tier,
      lp: playerRank.lp,
      winRate: playerWinRate,
      mainChamp: playerMainChamp,
      weeklyChange: 25,
      rankShift: 1,
      streak: '🔥 YOU',
      isPlayer: true,
    });
  }

  // Sort strictly by LP descending
  list.sort((a, b) => b.lp - a.lp);

  // Assign live ranks
  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  return list.slice(0, 50);
}
