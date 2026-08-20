import type { Role } from '../types/game';

export interface ChampionData {
  id: string;          // e.g. "Aatrox", "LeeSin", "Kaisa"
  name: string;        // Display name
  title: string;       // e.g. "the Darkin Blade"
  role: Role;
  secondaryRole?: Role;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  playstyle: 'Aggressive' | 'Scaling' | 'Utility' | 'Assassin' | 'Tank';
  baseTier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
}

export const CHAMPION_CDN_VERSION = '14.24.1';

export function getChampIconUrl(champId: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${CHAMPION_CDN_VERSION}/img/champion/${champId}.png`;
}

export function getChampSplashUrl(champId: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_0.jpg`;
}

export const ALL_CHAMPIONS: ChampionData[] = [
  // ── TOP LANE ─────────────────────────────────────────────────────────────
  { id: 'Aatrox', name: 'Aatrox', title: 'the Darkin Blade', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S' },
  { id: 'Jax', name: 'Jax', title: 'Grandmaster at Arms', role: 'top', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S+' },
  { id: 'Fiora', name: 'Fiora', title: 'the Grand Duelist', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S' },
  { id: 'Renekton', name: 'Renekton', title: 'the Butcher of the Sands', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A' },
  { id: 'Camille', name: 'Camille', title: 'the Steel Shadow', role: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S' },
  { id: 'K尽nte', name: "K'Sante", title: 'the Pride of Nazumah', role: 'top', difficulty: 'Hard', playstyle: 'Tank', baseTier: 'S+' },
  { id: 'Jayce', name: 'Jayce', title: 'the Defender of Tomorrow', role: 'top', secondaryRole: 'mid', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A' },
  { id: 'Gnar', name: 'Gnar', title: 'the Missing Link', role: 'top', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A' },
  { id: 'Ornn', name: 'Ornn', title: 'The Fire below the Mountain', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A' },
  { id: 'Gwen', name: 'Gwen', title: 'The Hallowed Seamstress', role: 'top', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S' },
  { id: 'Darius', name: 'Darius', title: 'the Hand of Noxus', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B' },
  { id: 'Sion', name: 'Sion', title: 'The Undead Juggernaut', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'B' },

  // ── JUNGLE ───────────────────────────────────────────────────────────────
  { id: 'LeeSin', name: 'Lee Sin', title: 'the Blind Monk', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S+' },
  { id: 'Viego', name: 'Viego', title: 'The Ruined King', role: 'jungle', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S' },
  { id: 'JarvanIV', name: 'Jarvan IV', title: 'the Exemplar of Demacia', role: 'jungle', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A' },
  { id: 'Sejuani', name: 'Sejuani', title: 'Fury of the North', role: 'jungle', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A' },
  { id: 'Nidalee', name: 'Nidalee', title: 'the Bestial Huntress', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S' },
  { id: 'Vi', name: 'Vi', title: 'the Piltover Enforcer', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A' },
  { id: 'XinZhao', name: 'Xin Zhao', title: 'the Seneschal of Demacia', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B' },
  { id: 'Graves', name: 'Graves', title: 'the Outlaw', role: 'jungle', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S' },
  { id: 'Poppy', name: 'Poppy', title: 'Keeper of the Hammer', role: 'jungle', secondaryRole: 'top', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'A' },
  { id: 'Nocturne', name: 'Nocturne', title: 'the Eternal Nightmare', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A' },
  { id: 'Kindred', name: 'Kindred', title: 'The Eternal Hunters', role: 'jungle', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S' },
  { id: 'Elise', name: 'Elise', title: 'the Spider Queen', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B' },

  // ── MID LANE ─────────────────────────────────────────────────────────────
  { id: 'Ahri', name: 'Ahri', title: 'the Nine-Tailed Fox', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S' },
  { id: 'Azir', name: 'Azir', title: 'the Emperor of the Sands', role: 'mid', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+' },
  { id: 'Orianna', name: 'Orianna', title: 'the Lady of Clockwork', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S' },
  { id: 'Syndra', name: 'Syndra', title: 'the Dark Sovereign', role: 'mid', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'S' },
  { id: 'Sylas', name: 'Sylas', title: 'the Unshackled', role: 'mid', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S' },
  { id: 'Akali', name: 'Akali', title: 'the Rogue Assassin', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'A' },
  { id: 'Yone', name: 'Yone', title: 'the Unforgotten', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+' },
  { id: 'LeBlanc', name: 'LeBlanc', title: 'the Deceiver', role: 'mid', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'A' },
  { id: 'Taliyah', name: 'Taliyah', title: 'the Stoneweaver', role: 'mid', secondaryRole: 'jungle', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A' },
  { id: 'Hwei', name: 'Hwei', title: 'the Visionary', role: 'mid', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'S' },
  { id: 'Viktor', name: 'Viktor', title: 'the Machine Herald', role: 'mid', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'A' },
  { id: 'Zed', name: 'Zed', title: 'the Master of Shadows', role: 'mid', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'B' },

  // ── ADC / BOT ────────────────────────────────────────────────────────────
  { id: 'Kaisa', name: "Kai'Sa", title: 'Daughter of the Void', role: 'adc', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S+' },
  { id: 'Jinx', name: 'Jinx', title: 'the Loose Cannon', role: 'adc', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'S' },
  { id: 'Ezreal', name: 'Ezreal', title: 'the Prodigal Explorer', role: 'adc', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S' },
  { id: 'Varus', name: 'Varus', title: 'the Arrow of Retribution', role: 'adc', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'A' },
  { id: 'Lucian', name: 'Lucian', title: 'the Purifier', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S' },
  { id: 'Xayah', name: 'Xayah', title: 'the Rebel', role: 'adc', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'A' },
  { id: 'Ashe', name: 'Ashe', title: 'the Frost Archer', role: 'adc', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A' },
  { id: 'Zeri', name: 'Zeri', title: 'The Spark of Zaun', role: 'adc', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+' },
  { id: 'Caitlyn', name: 'Caitlyn', title: 'the Sheriff of Piltover', role: 'adc', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B' },
  { id: 'Aphelios', name: 'Aphelios', title: 'the Weapon of the Faithful', role: 'adc', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S' },
  { id: 'Kalista', name: 'Kalista', title: 'the Spear of Vengeance', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S' },
  { id: 'Draven', name: 'Draven', title: 'the Glorious Executioner', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A' },

  // ── SUPPORT ──────────────────────────────────────────────────────────────
  { id: 'Thresh', name: 'Thresh', title: 'the Chain Warden', role: 'support', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'S+' },
  { id: 'Nautilus', name: 'Nautilus', title: 'the Titan of the Depths', role: 'support', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'S' },
  { id: 'Rell', name: 'Rell', title: 'the Iron Maiden', role: 'support', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'S' },
  { id: 'Leona', name: 'Leona', title: 'the Radiant Dawn', role: 'support', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A' },
  { id: 'Rakan', name: 'Rakan', title: 'The Charmer', role: 'support', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S' },
  { id: 'Lulu', name: 'Lulu', title: 'the Fae Sorceress', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A' },
  { id: 'Nami', name: 'Nami', title: 'the Tidecaller', role: 'support', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A' },
  { id: 'Braum', name: 'Braum', title: 'the Heart of the Freljord', role: 'support', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A' },
  { id: 'Blitzcrank', name: 'Blitzcrank', title: 'the Great Steam Golem', role: 'support', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B' },
  { id: 'Renata', name: 'Renata Glasc', title: 'the Chem-Baroness', role: 'support', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'A' },
  { id: 'Pyke', name: 'Pyke', title: 'the Bloodharbor Ripper', role: 'support', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'B' },
  { id: 'Bard', name: 'Bard', title: 'the Wandering Caretaker', role: 'support', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'A' },
];

export function getChampionsByRole(role: Role): ChampionData[] {
  return ALL_CHAMPIONS.filter(c => c.role === role || c.secondaryRole === role);
}

// Generate dynamic meta tier list per patch
export function generateMetaPatch(patchNumber: string): Record<string, { tier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'; winRate: number; note: string }> {
  const tiers: ('S+' | 'S' | 'A' | 'B' | 'C' | 'D')[] = ['S+', 'S', 'S', 'A', 'A', 'A', 'B', 'B', 'C', 'D'];
  const notes = [
    'Buffed base AD & Q cooldown reduced',
    'Core items got cheaper this patch',
    'Minor nerfs to base HP, still strong',
    'Untouched, solid comfort pick in meta',
    'Hard nerfed in pro play patch',
    'New item synergy discovered by KR soloq',
    'Slight scaling buff to ultimate',
    'Direct counters buffed, tier dropped',
  ];

  const meta: Record<string, { tier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'; winRate: number; note: string }> = {};

  ALL_CHAMPIONS.forEach((champ, idx) => {
    // Seeded random per champion and patch
    const hash = (champ.id + patchNumber).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const tierIdx = (hash + idx) % tiers.length;
    const tier = tiers[tierIdx];
    const baseWinRate = tier === 'S+' ? 53.5 : tier === 'S' ? 51.8 : tier === 'A' ? 50.2 : tier === 'B' ? 48.5 : tier === 'C' ? 46.8 : 44.5;
    const winRate = Number((baseWinRate + (Math.sin(hash) * 1.5)).toFixed(1));
    const note = notes[hash % notes.length];

    meta[champ.id] = { tier, winRate, note };
  });

  return meta;
}
