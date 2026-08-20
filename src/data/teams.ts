import type { Team } from '../types/game';

export const TEAMS: Team[] = [
  // ── LCK ──────────────────────────────────────────────────────────────
  { id: 't1', name: 'T1', shortName: 'T1', region: 'LCK', strength: 95, prestige: 100, salaryRange: [200000, 2000000], color: '#e84057' },
  { id: 'geng', name: 'Gen.G', shortName: 'GEN', region: 'LCK', strength: 90, prestige: 90, salaryRange: [150000, 1500000], color: '#b8952a' },
  { id: 'kt', name: 'KT Rolster', shortName: 'KT', region: 'LCK', strength: 82, prestige: 88, salaryRange: [100000, 800000], color: '#e84057' },
  { id: 'hle', name: 'Hanwha Life Esports', shortName: 'HLE', region: 'LCK', strength: 80, prestige: 75, salaryRange: [90000, 700000], color: '#ff6b35' },
  { id: 'dk', name: 'Dplus KIA', shortName: 'DK', region: 'LCK', strength: 78, prestige: 80, salaryRange: [90000, 700000], color: '#0072ce' },
  { id: 'drx', name: 'DRX', shortName: 'DRX', region: 'LCK', strength: 75, prestige: 72, salaryRange: [80000, 600000], color: '#00aeef' },
  { id: 'bnk', name: 'BNK FearX', shortName: 'BFX', region: 'LCK', strength: 72, prestige: 65, salaryRange: [70000, 500000], color: '#ff5c00' },
  { id: 'ns', name: 'Nongshim RedForce', shortName: 'NS', region: 'LCK', strength: 68, prestige: 60, salaryRange: [60000, 400000], color: '#e31e24' },

  // ── LPL ──────────────────────────────────────────────────────────────
  { id: 'blg', name: 'Bilibili Gaming', shortName: 'BLG', region: 'LPL', strength: 93, prestige: 90, salaryRange: [200000, 3000000], color: '#00a1d6' },
  { id: 'jdg', name: 'JDG Intel Esports Club', shortName: 'JDG', region: 'LPL', strength: 88, prestige: 88, salaryRange: [180000, 2500000], color: '#000000' },
  { id: 'tes', name: 'Top Esports', shortName: 'TES', region: 'LPL', strength: 85, prestige: 85, salaryRange: [160000, 2000000], color: '#d4a843' },
  { id: 'weibo', name: 'Weibo Gaming', shortName: 'WBG', region: 'LPL', strength: 83, prestige: 82, salaryRange: [150000, 1800000], color: '#ff8200' },
  { id: 'omg', name: 'Oh My God', shortName: 'OMG', region: 'LPL', strength: 75, prestige: 70, salaryRange: [100000, 900000], color: '#00b2a9' },
  { id: 'edg', name: 'Edward Gaming', shortName: 'EDG', region: 'LPL', strength: 78, prestige: 78, salaryRange: [120000, 1200000], color: '#00529b' },
  { id: 'lng', name: 'LNG Esports', shortName: 'LNG', region: 'LPL', strength: 74, prestige: 68, salaryRange: [100000, 900000], color: '#7b2d8b' },
  { id: 'imt', name: 'Invictus Gaming', shortName: 'IG', region: 'LPL', strength: 70, prestige: 75, salaryRange: [90000, 800000], color: '#003087' },

  // ── LEC ──────────────────────────────────────────────────────────────
  { id: 'g2', name: 'G2 Esports', shortName: 'G2', region: 'LEC', strength: 88, prestige: 92, salaryRange: [120000, 800000], color: '#ffffff' },
  { id: 'fnc', name: 'Fnatic', shortName: 'FNC', region: 'LEC', strength: 80, prestige: 85, salaryRange: [100000, 700000], color: '#ff5900' },
  { id: 'vit', name: 'Team Vitality', shortName: 'VIT', region: 'LEC', strength: 78, prestige: 78, salaryRange: [90000, 650000], color: '#f4c430' },
  { id: 'mad', name: 'MAD Lions KOI', shortName: 'MAD', region: 'LEC', strength: 76, prestige: 72, salaryRange: [80000, 500000], color: '#00d1ff' },
  { id: 'sk', name: 'SK Gaming', shortName: 'SK', region: 'LEC', strength: 72, prestige: 70, salaryRange: [70000, 450000], color: '#ff6600' },
  { id: 'kc', name: 'Karmine Corp', shortName: 'KC', region: 'LEC', strength: 70, prestige: 68, salaryRange: [65000, 400000], color: '#00b4ff' },
  { id: 'hr', name: 'HERETICS', shortName: 'TH', region: 'LEC', strength: 68, prestige: 65, salaryRange: [60000, 380000], color: '#ff3838' },
  { id: 'xl', name: 'Excel Esports', shortName: 'XL', region: 'LEC', strength: 65, prestige: 60, salaryRange: [60000, 350000], color: '#ffcc00' },

  // ── LTA North (ex-LCS) ────────────────────────────────────────────────
  { id: 'tl', name: 'Team Liquid', shortName: 'TL', region: 'LTA_N', strength: 82, prestige: 88, salaryRange: [120000, 700000], color: '#26a69a' },
  { id: 'c9', name: 'Cloud9', shortName: 'C9', region: 'LTA_N', strength: 78, prestige: 85, salaryRange: [110000, 650000], color: '#0066cc' },
  { id: 'fly', name: 'FlyQuest', shortName: 'FLY', region: 'LTA_N', strength: 75, prestige: 72, salaryRange: [90000, 500000], color: '#00a651' },
  { id: '100t', name: '100 Thieves', shortName: '100', region: 'LTA_N', strength: 73, prestige: 75, salaryRange: [90000, 550000], color: '#e8001c' },
  { id: 'eg', name: 'Evil Geniuses', shortName: 'EG', region: 'LTA_N', strength: 70, prestige: 70, salaryRange: [80000, 450000], color: '#0081c9' },
  { id: 'dig', name: 'Dignitas', shortName: 'DIG', region: 'LTA_N', strength: 65, prestige: 65, salaryRange: [70000, 400000], color: '#ff6b00' },

  // ── LTA South (ex-CBLOL + LLA) ────────────────────────────────────────
  { id: 'loud', name: 'LOUD', shortName: 'LOUD', region: 'LTA_S', strength: 78, prestige: 80, salaryRange: [60000, 350000], color: '#00ff00' },
  { id: 'fluxo', name: 'Fluxo', shortName: 'FLX', region: 'LTA_S', strength: 72, prestige: 68, salaryRange: [50000, 300000], color: '#ff4500' },
  { id: 'isurus', name: 'Isurus', shortName: 'ISU', region: 'LTA_S', strength: 68, prestige: 62, salaryRange: [45000, 280000], color: '#00cfdd' },
  { id: 'pain', name: 'paiN Gaming', shortName: 'PNG', region: 'LTA_S', strength: 70, prestige: 65, salaryRange: [50000, 290000], color: '#ff0000' },

  // ── LCP (Asia-Pacific) ───────────────────────────────────────────────
  { id: 'psg', name: 'PSG Talon', shortName: 'PSG', region: 'LCP', strength: 75, prestige: 72, salaryRange: [80000, 450000], color: '#004170' },
  { id: 'rrq', name: 'Rex Regum Qeon', shortName: 'RRQ', region: 'LCP', strength: 70, prestige: 65, salaryRange: [60000, 350000], color: '#b22222' },
  { id: 'chiefs', name: 'Chiefs Esports Club', shortName: 'CHF', region: 'LCP', strength: 65, prestige: 62, salaryRange: [50000, 280000], color: '#ffd700' },
  { id: 'gam', name: 'GAM Esports', shortName: 'GAM', region: 'LCP', strength: 68, prestige: 65, salaryRange: [55000, 320000], color: '#ff4500' },
];

export function getTeamsByRegion(region: import('../types/game').Region): Team[] {
  return TEAMS.filter(t => t.region === region);
}

export function getTeamById(id: string): Team | undefined {
  return TEAMS.find(t => t.id === id);
}

export function getTopTeamsByRegion(region: import('../types/game').Region, count = 4): Team[] {
  return TEAMS
    .filter(t => t.region === region)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, count);
}

export function getRandomTeam(region?: import('../types/game').Region): Team {
  const pool = region ? TEAMS.filter(t => t.region === region) : TEAMS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Starting teams for new players (mid-tier)
export const STARTER_TEAMS: Record<import('../types/game').Region, string[]> = {
  LCK: ['ns', 'bnk', 'drx'],
  LPL: ['lng', 'imt', 'omg'],
  LEC: ['xl', 'hr', 'kc'],
  LTA_N: ['dig', 'eg', '100t'],
  LTA_S: ['isurus', 'pain', 'fluxo'],
  LCP: ['chiefs', 'gam', 'rrq'],
};

export const REGION_LABELS: Record<import('../types/game').Region, string> = {
  LCK: '🇰🇷 LCK',
  LPL: '🇨🇳 LPL',
  LEC: '🇪🇺 LEC',
  LTA_N: '🇺🇸 LTA North',
  LTA_S: '🌎 LTA South',
  LCP: '🌏 LCP',
};

export const REGION_FLAGS: Record<import('../types/game').Region, string> = {
  LCK: '🇰🇷',
  LPL: '🇨🇳',
  LEC: '🇪🇺',
  LTA_N: '🇺🇸',
  LTA_S: '🌎',
  LCP: '🌏',
};
