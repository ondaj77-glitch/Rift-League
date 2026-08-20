import type { Role } from '../types/game';

export interface ChampionData {
  id: string;          // Riot Data Dragon ID
  name: string;        // Display Name
  title: string;       // Champion Title
  role: Role;
  secondaryRole?: Role;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  playstyle: 'Aggressive' | 'Scaling' | 'Utility' | 'Assassin' | 'Tank';
  baseTier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  counterTags: string[]; // e.g. ['Tank Shredder', 'Early Bully', 'Anti-Dive', 'Hypercarry']
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
  { id: 'Aatrox', name: 'Aatrox', title: 'the Darkin Blade', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S+', counterTags: ['Teamfight', 'Drain Tank'] },
  { id: 'Jax', name: 'Jax', title: 'Grandmaster at Arms', role: 'top', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Splitpush', 'Duelist'] },
  { id: 'KSante', name: "K'Sante", title: 'the Pride of Nazumah', role: 'top', difficulty: 'Hard', playstyle: 'Tank', baseTier: 'S+', counterTags: ['Anti-Carry', 'Tank'] },
  { id: 'Fiora', name: 'Fiora', title: 'the Grand Duelist', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Tank Shredder', 'Duelist'] },
  { id: 'Camille', name: 'Camille', title: 'the Steel Shadow', role: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Pickoff', 'Dive'] },
  { id: 'Gwen', name: 'Gwen', title: 'The Hallowed Seamstress', role: 'top', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Anti-Tank', 'Immunity'] },
  { id: 'Renekton', name: 'Renekton', title: 'the Butcher of the Sands', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Early Bully', 'Stun'] },
  { id: 'Jayce', name: 'Jayce', title: 'the Defender of Tomorrow', role: 'top', secondaryRole: 'mid', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Poke', 'Early Tempo'] },
  { id: 'Gnar', name: 'Gnar', title: 'the Missing Link', role: 'top', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A', counterTags: ['Ranged Poke', 'Teamfight Engage'] },
  { id: 'Ornn', name: 'Ornn', title: 'The Fire below the Mountain', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A', counterTags: ['Frontline', 'Item Upgrades'] },
  { id: 'Rumble', name: 'Rumble', title: 'the Mechanized Menace', role: 'top', secondaryRole: 'mid', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Equalizer', 'Magic Damage'] },
  { id: 'Sett', name: 'Sett', title: 'the Boss', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Brawler', 'Anti-Dive'] },
  { id: 'Darius', name: 'Darius', title: 'the Hand of Noxus', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Bleed', 'Juggernaut'] },
  { id: 'Sion', name: 'Sion', title: 'The Undead Juggernaut', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Waveclear', 'Global Roam'] },
  { id: 'Malphite', name: 'Malphite', title: 'Shard of the Monolith', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Armor Stack', 'Hard Engage'] },

  // ── JUNGLE ───────────────────────────────────────────────────────────────
  { id: 'LeeSin', name: 'Lee Sin', title: 'the Blind Monk', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S+', counterTags: ['Early Ganks', 'Insec Kick'] },
  { id: 'Viego', name: 'Viego', title: 'The Ruined King', role: 'jungle', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Possession', 'Reset'] },
  { id: 'Nidalee', name: 'Nidalee', title: 'the Bestial Huntress', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Invade', 'Fast Clear'] },
  { id: 'Graves', name: 'Graves', title: 'the Outlaw', role: 'jungle', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Powerfarm', 'Burst'] },
  { id: 'Kindred', name: 'Kindred', title: 'The Eternal Hunters', role: 'jungle', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Invulnerability', 'Marks'] },
  { id: 'JarvanIV', name: 'Jarvan IV', title: 'the Exemplar of Demacia', role: 'jungle', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A', counterTags: ['Cataclysm', 'Gank Setup'] },
  { id: 'Sejuani', name: 'Sejuani', title: 'Fury of the North', role: 'jungle', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A', counterTags: ['Melee Synergy', 'Chain CC'] },
  { id: 'Vi', name: 'Vi', title: 'the Piltover Enforcer', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Point and Click', 'Lockdown'] },
  { id: 'Nocturne', name: 'Nocturne', title: 'the Eternal Nightmare', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Nearsight', 'Paranoia'] },
  { id: 'Poppy', name: 'Poppy', title: 'Keeper of the Hammer', role: 'jungle', secondaryRole: 'top', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'A', counterTags: ['Anti-Dash', 'Peel'] },
  { id: 'XinZhao', name: 'Xin Zhao', title: 'the Seneschal of Demacia', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Duelist', 'Missile Block'] },
  { id: 'Hecarim', name: 'Hecarim', title: 'the Shadow of War', role: 'jungle', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Speed', 'Fear'] },
  { id: 'Elise', name: 'Elise', title: 'the Spider Queen', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Tower Dives', 'Cocoon'] },
  { id: 'Zac', name: 'Zac', title: 'the Secret Weapon', role: 'jungle', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'C', counterTags: ['Long Range Engage', 'Revive'] },

  // ── MID LANE ─────────────────────────────────────────────────────────────
  { id: 'Azir', name: 'Azir', title: 'the Emperor of the Sands', role: 'mid', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Shurima Shuffle', 'Late Game'] },
  { id: 'Yone', name: 'Yone', title: 'the Unforgotten', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Mixed Damage', 'AoE Knockup'] },
  { id: 'Ahri', name: 'Ahri', title: 'the Nine-Tailed Fox', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S', counterTags: ['Mobility', 'Charm'] },
  { id: 'Orianna', name: 'Orianna', title: 'the Lady of Clockwork', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S', counterTags: ['Shockwave', 'Zone Control'] },
  { id: 'Syndra', name: 'Syndra', title: 'the Dark Sovereign', role: 'mid', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Single Target Burst', 'Stun'] },
  { id: 'Sylas', name: 'Sylas', title: 'the Unshackled', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Ultimate Steal', 'Healing'] },
  { id: 'Hwei', name: 'Hwei', title: 'the Visionary', role: 'mid', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'S', counterTags: ['Spellbook', 'Teamfight Poke'] },
  { id: 'Akali', name: 'Akali', title: 'the Rogue Assassin', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'A', counterTags: ['Shroud', 'Flank'] },
  { id: 'LeBlanc', name: 'LeBlanc', title: 'the Deceiver', role: 'mid', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'A', counterTags: ['Distortion', 'Chains'] },
  { id: 'Taliyah', name: 'Taliyah', title: 'the Stoneweaver', role: 'mid', secondaryRole: 'jungle', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A', counterTags: ['Roam Wall', 'Anti-Dash'] },
  { id: 'Viktor', name: 'Viktor', title: 'the Machine Herald', role: 'mid', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'A', counterTags: ['Chaos Storm', 'Waveclear'] },
  { id: 'Tristana', name: 'Tristana', title: 'the Yordle Gunner', role: 'mid', secondaryRole: 'adc', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Tower Destruction', 'Jump Reset'] },
  { id: 'Zed', name: 'Zed', title: 'the Master of Shadows', role: 'mid', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'B', counterTags: ['Death Mark', 'Shadows'] },
  { id: 'Galio', name: 'Galio', title: 'the Colossus', role: 'mid', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Global Shield', 'Taunt'] },

  // ── ADC / BOT ────────────────────────────────────────────────────────────
  { id: 'Kaisa', name: "Kai'Sa", title: 'Daughter of the Void', role: 'adc', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Dive Follow-up', 'Evolve'] },
  { id: 'Zeri', name: 'Zeri', title: 'The Spark of Zaun', role: 'adc', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Lightning Speed', 'Terrain Leap'] },
  { id: 'Jinx', name: 'Jinx', title: 'the Loose Cannon', role: 'adc', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Get Excited', 'Rocket Snipes'] },
  { id: 'Ezreal', name: 'Ezreal', title: 'the Prodigal Explorer', role: 'adc', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S', counterTags: ['Blink', 'Skillshots'] },
  { id: 'Lucian', name: 'Lucian', title: 'the Purifier', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Nami Combo', 'Early Burst'] },
  { id: 'Aphelios', name: 'Aphelios', title: 'the Weapon of the Faithful', role: 'adc', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S', counterTags: ['5 Guns', 'Crescendum'] },
  { id: 'Kalista', name: 'Kalista', title: 'the Spear of Vengeance', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Rend', 'Fate\'s Call'] },
  { id: 'Varus', name: 'Varus', title: 'the Arrow of Retribution', role: 'adc', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Chain of Corruption', 'Lethality'] },
  { id: 'Xayah', name: 'Xayah', title: 'the Rebel', role: 'adc', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'A', counterTags: ['Featherstorm', 'Self Peel'] },
  { id: 'Ashe', name: 'Ashe', title: 'the Frost Archer', role: 'adc', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A', counterTags: ['Crystal Arrow', 'Hawkshot'] },
  { id: 'Draven', name: 'Draven', title: 'the Glorious Executioner', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Adoration Stacks', 'Pure Damage'] },
  { id: 'Jhin', name: 'Jhin', title: 'the Virtuoso', role: 'adc', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'B', counterTags: ['4th Shot', 'Curtain\'s Call'] },
  { id: 'Caitlyn', name: 'Caitlyn', title: 'the Sheriff of Piltover', role: 'adc', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Traps', 'Range Bully'] },
  { id: 'MissFortune', name: 'Miss Fortune', title: 'the Bounty Hunter', role: 'adc', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'C', counterTags: ['Bullet Time', 'Strut'] },

  // ── SUPPORT ──────────────────────────────────────────────────────────────
  { id: 'Thresh', name: 'Thresh', title: 'the Chain Warden', role: 'support', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'S+', counterTags: ['Lantern Save', 'Death Sentence'] },
  { id: 'Nautilus', name: 'Nautilus', title: 'the Titan of the Depths', role: 'support', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'S+', counterTags: ['Point Click Ult', 'Hook'] },
  { id: 'Rell', name: 'Rell', title: 'the Iron Maiden', role: 'support', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'S', counterTags: ['Magnet Storm', 'Flash Crash'] },
  { id: 'Rakan', name: 'Rakan', title: 'The Charmer', role: 'support', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S', counterTags: ['The Quickness', 'Grand Entrance'] },
  { id: 'Leona', name: 'Leona', title: 'the Radiant Dawn', role: 'support', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A', counterTags: ['Solar Flare', 'Sunlight'] },
  { id: 'Lulu', name: 'Lulu', title: 'the Fae Sorceress', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A', counterTags: ['Polymorph', 'Wild Growth'] },
  { id: 'Nami', name: 'Nami', title: 'the Tidecaller', role: 'support', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A', counterTags: ['Tidal Wave', 'Lucian Partner'] },
  { id: 'Braum', name: 'Braum', title: 'the Heart of the Freljord', role: 'support', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A', counterTags: ['Unbreakable Shield', 'Concussive'] },
  { id: 'Renata', name: 'Renata Glasc', title: 'the Chem-Baroness', role: 'support', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'A', counterTags: ['Hostile Takeover', 'Bailout'] },
  { id: 'Blitzcrank', name: 'Blitzcrank', title: 'the Great Steam Golem', role: 'support', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Rocket Grab', 'Silence'] },
  { id: 'Pyke', name: 'Pyke', title: 'the Bloodharbor Ripper', role: 'support', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'B', counterTags: ['Death From Below', 'Gold Share'] },
  { id: 'Bard', name: 'Bard', title: 'the Wandering Caretaker', role: 'support', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'B', counterTags: ['Tempered Fate', 'Magical Journey'] },
  { id: 'Alistar', name: 'Alistar', title: 'the Minotaur', role: 'support', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'C', counterTags: ['Headbutt Pulverize', 'Unbreakable'] },
  { id: 'Karma', name: 'Karma', title: 'the Enlightened One', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'C', counterTags: ['Mantra Shield', 'Q Poke'] },
];

export const TIER_PRIORITY: Record<'S+' | 'S' | 'A' | 'B' | 'C' | 'D', number> = {
  'S+': 1,
  'S': 2,
  'A': 3,
  'B': 4,
  'C': 5,
  'D': 6,
};

export function getChampionsByRole(role: Role): ChampionData[] {
  return ALL_CHAMPIONS
    .filter(c => c.role === role || c.secondaryRole === role)
    .sort((a, b) => TIER_PRIORITY[a.baseTier] - TIER_PRIORITY[b.baseTier]);
}

// Generate dynamic meta tier list per patch
export function generateMetaPatch(patchNumber: string): Record<string, { tier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'; winRate: number; note: string }> {
  const meta: Record<string, { tier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'; winRate: number; note: string }> = {};

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

  ALL_CHAMPIONS.forEach((champ, idx) => {
    const hash = (champ.id + patchNumber).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Dynamic shift: mostly stays close to baseTier with +/- 1 tier shift
    const shift = (hash % 3) - 1; // -1, 0, or 1
    const basePrio = TIER_PRIORITY[champ.baseTier];
    const newPrio = Math.max(1, Math.min(6, basePrio + shift));
    const tierMap: Record<number, 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'> = {
      1: 'S+', 2: 'S', 3: 'A', 4: 'B', 5: 'C', 6: 'D',
    };
    const tier = tierMap[newPrio];
    const baseWinRate = tier === 'S+' ? 53.5 : tier === 'S' ? 51.8 : tier === 'A' ? 50.2 : tier === 'B' ? 48.5 : tier === 'C' ? 46.8 : 44.5;
    const winRate = Number((baseWinRate + (Math.sin(hash + idx) * 1.2)).toFixed(1));
    const note = notes[hash % notes.length];

    meta[champ.id] = { tier, winRate, note };
  });

  return meta;
}
