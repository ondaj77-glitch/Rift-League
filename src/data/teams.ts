import type { Team } from '../types/game';

export const TEAMS: Team[] = [
  // ── LCK (Korea) ────────────────────────────────────────────────────────
  { id: 't1', name: 'T1', shortName: 'T1', region: 'LCK', strength: 96, prestige: 100, salaryRange: [250000, 2500000], color: '#e84057' },
  { id: 'geng', name: 'Gen.G', shortName: 'GEN', region: 'LCK', strength: 93, prestige: 92, salaryRange: [200000, 2000000], color: '#b8952a' },
  { id: 'hle', name: 'Hanwha Life Esports', shortName: 'HLE', region: 'LCK', strength: 89, prestige: 85, salaryRange: [180000, 1800000], color: '#ff6b35' },
  { id: 'dk', name: 'Dplus KIA', shortName: 'DK', region: 'LCK', strength: 84, prestige: 86, salaryRange: [120000, 1000000], color: '#0072ce' },
  { id: 'kt', name: 'KT Rolster', shortName: 'KT', region: 'LCK', strength: 82, prestige: 88, salaryRange: [110000, 900000], color: '#e84057' },
  { id: 'kdf', name: 'Kwangdong Freecs', shortName: 'KDF', region: 'LCK', strength: 76, prestige: 70, salaryRange: [85000, 650000], color: '#e32528' },
  { id: 'drx', name: 'DRX', shortName: 'DRX', region: 'LCK', strength: 75, prestige: 78, salaryRange: [80000, 600000], color: '#00aeef' },
  { id: 'bnk', name: 'BNK FearX', shortName: 'BFX', region: 'LCK', strength: 72, prestige: 65, salaryRange: [70000, 500000], color: '#ff5c00' },
  { id: 'ns', name: 'Nongshim RedForce', shortName: 'NS', region: 'LCK', strength: 68, prestige: 60, salaryRange: [60000, 400000], color: '#e31e24' },
  { id: 'bro', name: 'OKSavingsBank BRION', shortName: 'BRO', region: 'LCK', strength: 64, prestige: 55, salaryRange: [50000, 350000], color: '#004c28' },

  // ── LPL (China) ────────────────────────────────────────────────────────
  { id: 'blg', name: 'Bilibili Gaming', shortName: 'BLG', region: 'LPL', strength: 95, prestige: 92, salaryRange: [250000, 3200000], color: '#00a1d6' },
  { id: 'tes', name: 'Top Esports', shortName: 'TES', region: 'LPL', strength: 90, prestige: 89, salaryRange: [200000, 2500000], color: '#d4a843' },
  { id: 'jdg', name: 'JDG Intel Esports Club', shortName: 'JDG', region: 'LPL', strength: 88, prestige: 90, salaryRange: [180000, 2400000], color: '#000000' },
  { id: 'weibo', name: 'Weibo Gaming', shortName: 'WBG', region: 'LPL', strength: 85, prestige: 84, salaryRange: [160000, 2000000], color: '#ff8200' },
  { id: 'lng', name: 'LNG Esports', shortName: 'LNG', region: 'LPL', strength: 82, prestige: 80, salaryRange: [140000, 1600000], color: '#7b2d8b' },
  { id: 'edg', name: 'Edward Gaming', shortName: 'EDG', region: 'LPL', strength: 78, prestige: 85, salaryRange: [120000, 1300000], color: '#00529b' },
  { id: 'fpx', name: 'FunPlus Phoenix', shortName: 'FPX', region: 'LPL', strength: 76, prestige: 80, salaryRange: [100000, 1100000], color: '#ff1414' },
  { id: 'nip', name: 'Ninjas in Pyjamas', shortName: 'NIP', region: 'LPL', strength: 75, prestige: 74, salaryRange: [95000, 950000], color: '#32e875' },
  { id: 'rng', name: 'Royal Never Give Up', shortName: 'RNG', region: 'LPL', strength: 73, prestige: 88, salaryRange: [90000, 900000], color: '#b9975b' },
  { id: 'imt', name: 'Invictus Gaming', shortName: 'IG', region: 'LPL', strength: 72, prestige: 82, salaryRange: [85000, 850000], color: '#003087' },
  { id: 'omg', name: 'Oh My God', shortName: 'OMG', region: 'LPL', strength: 70, prestige: 68, salaryRange: [75000, 700000], color: '#00b2a9' },
  { id: 'we', name: 'Team WE', shortName: 'WE', region: 'LPL', strength: 68, prestige: 75, salaryRange: [70000, 650000], color: '#dc2626' },

  // ── LEC (Europe) ───────────────────────────────────────────────────────
  { id: 'g2', name: 'G2 Esports', shortName: 'G2', region: 'LEC', strength: 91, prestige: 95, salaryRange: [180000, 1200000], color: '#ffffff' },
  { id: 'fnc', name: 'Fnatic', shortName: 'FNC', region: 'LEC', strength: 84, prestige: 90, salaryRange: [140000, 900000], color: '#ff5900' },
  { id: 'kc', name: 'Karmine Corp', shortName: 'KC', region: 'LEC', strength: 80, prestige: 85, salaryRange: [120000, 800000], color: '#00b4ff' },
  { id: 'bds', name: 'Team BDS', shortName: 'BDS', region: 'LEC', strength: 78, prestige: 75, salaryRange: [100000, 700000], color: '#ff2d55' },
  { id: 'mad', name: 'MAD Lions KOI', shortName: 'MDK', region: 'LEC', strength: 77, prestige: 80, salaryRange: [95000, 650000], color: '#00d1ff' },
  { id: 'vit', name: 'Team Vitality', shortName: 'VIT', region: 'LEC', strength: 76, prestige: 78, salaryRange: [90000, 650000], color: '#f4c430' },
  { id: 'hr', name: 'Team Heretics', shortName: 'TH', region: 'LEC', strength: 74, prestige: 72, salaryRange: [85000, 550000], color: '#ff3838' },
  { id: 'sk', name: 'SK Gaming', shortName: 'SK', region: 'LEC', strength: 72, prestige: 70, salaryRange: [80000, 500000], color: '#ff6600' },
  { id: 'gx', name: 'GIANTX', shortName: 'GX', region: 'LEC', strength: 68, prestige: 65, salaryRange: [70000, 450000], color: '#6366f1' },
  { id: 'rge', name: 'Rogue', shortName: 'RGE', region: 'LEC', strength: 66, prestige: 70, salaryRange: [65000, 400000], color: '#0ea5e9' },

  // ── LTA North / LCS (Americas North) ──────────────────────────────────
  { id: 'fly', name: 'FlyQuest', shortName: 'FLY', region: 'LTA_N', strength: 85, prestige: 82, salaryRange: [150000, 950000], color: '#00a651' },
  { id: 'tl', name: 'Team Liquid', shortName: 'TL', region: 'LTA_N', strength: 84, prestige: 90, salaryRange: [140000, 900000], color: '#26a69a' },
  { id: 'c9', name: 'Cloud9', shortName: 'C9', region: 'LTA_N', strength: 82, prestige: 90, salaryRange: [130000, 850000], color: '#0066cc' },
  { id: '100t', name: '100 Thieves', shortName: '100', region: 'LTA_N', strength: 76, prestige: 80, salaryRange: [100000, 700000], color: '#e8001c' },
  { id: 'sr', name: 'Shopify Rebellion', shortName: 'SR', region: 'LTA_N', strength: 72, prestige: 68, salaryRange: [80000, 550000], color: '#9333ea' },
  { id: 'dig', name: 'Dignitas', shortName: 'DIG', region: 'LTA_N', strength: 67, prestige: 70, salaryRange: [70000, 450000], color: '#ff6b00' },
  { id: 'dsg', name: 'Disguised', shortName: 'DSG', region: 'LTA_N', strength: 65, prestige: 66, salaryRange: [60000, 400000], color: '#eab308' },

  // ── LTA South / CBLOL (Americas South) ─────────────────────────────────
  { id: 'pain', name: 'paiN Gaming', shortName: 'PNG', region: 'LTA_S', strength: 80, prestige: 85, salaryRange: [80000, 500000], color: '#ff0000' },
  { id: 'loud', name: 'LOUD', shortName: 'LOUD', region: 'LTA_S', strength: 79, prestige: 88, salaryRange: [80000, 500000], color: '#00ff00' },
  { id: 'red', name: 'RED Canids', shortName: 'RED', region: 'LTA_S', strength: 75, prestige: 76, salaryRange: [65000, 400000], color: '#dc2626' },
  { id: 'vks', name: 'Vivo Keyd Stars', shortName: 'VKS', region: 'LTA_S', strength: 73, prestige: 72, salaryRange: [60000, 380000], color: '#84cc16' },
  { id: 'fluxo', name: 'Fluxo', shortName: 'FLX', region: 'LTA_S', strength: 70, prestige: 70, salaryRange: [55000, 350000], color: '#ff4500' },
  { id: 'fur', name: 'FURIA', shortName: 'FUR', region: 'LTA_S', strength: 68, prestige: 75, salaryRange: [50000, 320000], color: '#ffffff' },
  { id: 'isurus', name: 'Isurus', shortName: 'ISU', region: 'LTA_S', strength: 67, prestige: 68, salaryRange: [45000, 300000], color: '#00cfdd' },

  // ── LCP / APAC (Asia-Pacific) ──────────────────────────────────────────
  { id: 'psg', name: 'PSG Talon', shortName: 'PSG', region: 'LCP', strength: 80, prestige: 82, salaryRange: [90000, 600000], color: '#004170' },
  { id: 'gam', name: 'GAM Esports', shortName: 'GAM', region: 'LCP', strength: 76, prestige: 78, salaryRange: [70000, 450000], color: '#f59e0b' },
  { id: 'cfo', name: 'CTBC Flying Oyster', shortName: 'CFO', region: 'LCP', strength: 74, prestige: 72, salaryRange: [65000, 400000], color: '#0284c7' },
  { id: 'shg', name: 'Fukuoka SoftBank HAWKS', shortName: 'SHG', region: 'LCP', strength: 71, prestige: 68, salaryRange: [60000, 380000], color: '#eab308' },
  { id: 'chiefs', name: 'Chiefs Esports Club', shortName: 'CHF', region: 'LCP', strength: 66, prestige: 64, salaryRange: [50000, 300000], color: '#ffd700' },
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

// Starting teams for new players (mid/lower-tier)
export const STARTER_TEAMS: Record<import('../types/game').Region, string[]> = {
  LCK: ['ns', 'bnk', 'drx', 'bro'],
  LPL: ['lng', 'imt', 'omg', 'we'],
  LEC: ['gx', 'hr', 'kc', 'sk', 'rge'],
  LTA_N: ['dig', 'dsg', 'sr', '100t'],
  LTA_S: ['isurus', 'pain', 'fluxo', 'fur'],
  LCP: ['chiefs', 'gam', 'shg', 'cfo'],
};

export const REGION_LABELS: Record<import('../types/game').Region, string> = {
  LCK: '🇰🇷 LCK (Korea)',
  LPL: '🇨🇳 LPL (China)',
  LEC: '🇪🇺 LEC (Europe)',
  LTA_N: '🇺🇸 LTA North (Americas)',
  LTA_S: '🌎 LTA South (CBLOL/LLA)',
  LCP: '🌏 LCP (Asia-Pacific)',
};

export const REGION_FLAGS: Record<import('../types/game').Region, string> = {
  LCK: '🇰🇷',
  LPL: '🇨🇳',
  LEC: '🇪🇺',
  LTA_N: '🇺🇸',
  LTA_S: '🌎',
  LCP: '🌏',
};
