import type { Role, MetaPatch, PatchChampionChange } from '../types/game';

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
  { id: 'Mordekaiser', name: 'Mordekaiser', title: 'the Iron Revenant', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'S+', counterTags: ['Death Realm', 'Magic Damage'] },
  { id: 'Fiora', name: 'Fiora', title: 'the Grand Duelist', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Tank Shredder', 'Duelist'] },
  { id: 'Camille', name: 'Camille', title: 'the Steel Shadow', role: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Pickoff', 'Dive'] },
  { id: 'Gwen', name: 'Gwen', title: 'The Hallowed Seamstress', role: 'top', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Anti-Tank', 'Immunity'] },
  { id: 'Irelia', name: 'Irelia', title: 'the Blade Dancer', role: 'top', secondaryRole: 'mid', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Blade Surge', 'Dashes'] },
  { id: 'Gangplank', name: 'Gangplank', title: 'the Saltwater Scourge', role: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Barrels', 'Global Ult'] },
  { id: 'Renekton', name: 'Renekton', title: 'the Butcher of the Sands', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Early Bully', 'Stun'] },
  { id: 'Jayce', name: 'Jayce', title: 'the Defender of Tomorrow', role: 'top', secondaryRole: 'mid', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Poke', 'Early Tempo'] },
  { id: 'Gnar', name: 'Gnar', title: 'the Missing Link', role: 'top', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A', counterTags: ['Ranged Poke', 'Teamfight Engage'] },
  { id: 'Ornn', name: 'Ornn', title: 'The Fire below the Mountain', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A', counterTags: ['Frontline', 'Item Upgrades'] },
  { id: 'Rumble', name: 'Rumble', title: 'the Mechanized Menace', role: 'top', secondaryRole: 'mid', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Equalizer', 'Magic Damage'] },
  { id: 'Riven', name: 'Riven', title: 'the Exile', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Animation Cancel', 'Shields'] },
  { id: 'Ambessa', name: 'Ambessa', title: 'Matriarch of War', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Dashes', 'Noxian Stance'] },
  { id: 'Kennen', name: 'Kennen', title: 'the Heart of the Tempest', role: 'top', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Slicing Maelstrom', 'Stuns'] },
  { id: 'Sett', name: 'Sett', title: 'the Boss', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Brawler', 'Anti-Dive'] },
  { id: 'Darius', name: 'Darius', title: 'the Hand of Noxus', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Bleed', 'Juggernaut'] },
  { id: 'Illaoi', name: 'Illaoi', title: 'the Kraken Priestess', role: 'top', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Tentacles', 'Zone Control'] },
  { id: 'Volibear', name: 'Volibear', title: 'the Relentless Storm', role: 'top', secondaryRole: 'jungle', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'B', counterTags: ['Tower Disable', 'Lightning'] },
  { id: 'Urgot', name: 'Urgot', title: 'the Dreadnought', role: 'top', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Machine Gun', 'Execute'] },
  { id: 'Kled', name: 'Kled', title: 'the Cantankerous Cavalier', role: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Charge', 'Mount Remount'] },
  { id: 'Shen', name: 'Shen', title: 'the Eye of Twilight', role: 'top', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'B', counterTags: ['Global Shield', 'Taunt'] },
  { id: 'DrMundo', name: 'Dr. Mundo', title: 'the Madman of Zaun', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'B', counterTags: ['Health Regen', 'CC Immunity'] },
  { id: 'Nasus', name: 'Nasus', title: 'the Curator of the Sands', role: 'top', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Siphoning Strike', 'Wither'] },
  { id: 'Kayle', name: 'Kayle', title: 'the Righteous', role: 'top', secondaryRole: 'mid', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Level 16 Ascend', 'Immunity'] },
  { id: 'Sion', name: 'Sion', title: 'The Undead Juggernaut', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Waveclear', 'Global Roam'] },
  { id: 'Malphite', name: 'Malphite', title: 'Shard of the Monolith', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Armor Stack', 'Hard Engage'] },
  { id: 'Chogath', name: "Cho'Gath", title: 'the Terror of the Void', role: 'top', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Feast Stacks', 'Knockup'] },
  { id: 'Teemo', name: 'Teemo', title: 'the Swift Scout', role: 'top', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'C', counterTags: ['Mushrooms', 'Blind'] },
  { id: 'Tryndamere', name: 'Tryndamere', title: 'the Barbarian King', role: 'top', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'C', counterTags: ['Undying Rage', 'Spin'] },
  { id: 'Yorick', name: 'Yorick', title: 'Shepherd of Souls', role: 'top', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'C', counterTags: ['Maiden', 'Splitpush'] },
  { id: 'Singed', name: 'Singed', title: 'the Mad Chemist', role: 'top', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'D', counterTags: ['Poison Trail', 'Proxy'] },

  // ── JUNGLE ───────────────────────────────────────────────────────────────
  { id: 'LeeSin', name: 'Lee Sin', title: 'the Blind Monk', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S+', counterTags: ['Early Ganks', 'Insec Kick'] },
  { id: 'Viego', name: 'Viego', title: 'The Ruined King', role: 'jungle', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Possession', 'Reset'] },
  { id: 'Belveth', name: "Bel'Veth", title: 'the Empress of the Void', role: 'jungle', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Attack Speed', 'True Damage'] },
  { id: 'Nidalee', name: 'Nidalee', title: 'the Bestial Huntress', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Invade', 'Fast Clear'] },
  { id: 'Graves', name: 'Graves', title: 'the Outlaw', role: 'jungle', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Powerfarm', 'Burst'] },
  { id: 'Kindred', name: 'Kindred', title: 'The Eternal Hunters', role: 'jungle', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Invulnerability', 'Marks'] },
  { id: 'Briar', name: 'Briar', title: 'the Restrained Hunger', role: 'jungle', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Bleed', 'Frenzy'] },
  { id: 'Khazix', name: "Kha'Zix", title: 'the Voidreaver', role: 'jungle', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Isolation', 'Invis'] },
  { id: 'Kayn', name: 'Kayn', title: 'the Shadow Reaper', role: 'jungle', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'S', counterTags: ['Form Shift', 'Wall Walk'] },
  { id: 'JarvanIV', name: 'Jarvan IV', title: 'the Exemplar of Demacia', role: 'jungle', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A', counterTags: ['Cataclysm', 'Gank Setup'] },
  { id: 'Sejuani', name: 'Sejuani', title: 'Fury of the North', role: 'jungle', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'A', counterTags: ['Melee Synergy', 'Chain CC'] },
  { id: 'Vi', name: 'Vi', title: 'the Piltover Enforcer', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Point and Click', 'Lockdown'] },
  { id: 'Nocturne', name: 'Nocturne', title: 'the Eternal Nightmare', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Nearsight', 'Paranoia'] },
  { id: 'Poppy', name: 'Poppy', title: 'Keeper of the Hammer', role: 'jungle', secondaryRole: 'top', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'A', counterTags: ['Anti-Dash', 'Peel'] },
  { id: 'Lillia', name: 'Lillia', title: 'the Bashful Bloom', role: 'jungle', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'A', counterTags: ['Speed', 'Global Sleep'] },
  { id: 'Ekko', name: 'Ekko', title: 'the Boy Who Shattered Time', role: 'jungle', secondaryRole: 'mid', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Chronobreak', 'Burst'] },
  { id: 'Diana', name: 'Diana', title: 'Scorn of the Moon', role: 'jungle', secondaryRole: 'mid', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Moonlight', 'Pull In'] },
  { id: 'XinZhao', name: 'Xin Zhao', title: 'the Seneschal of Demacia', role: 'jungle', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Duelist', 'Missile Block'] },
  { id: 'Hecarim', name: 'Hecarim', title: 'the Shadow of War', role: 'jungle', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Speed', 'Fear'] },
  { id: 'Elise', name: 'Elise', title: 'the Spider Queen', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Tower Dives', 'Cocoon'] },
  { id: 'Evelynn', name: 'Evelynn', title: 'Agony\'s Embrace', role: 'jungle', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Invis Camo', 'Charm'] },
  { id: 'Rengar', name: 'Rengar', title: 'the Pridestalker', role: 'jungle', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Bush Leap', 'Ferocity'] },
  { id: 'Shaco', name: 'Shaco', title: 'the Demon Jester', role: 'jungle', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Boxes', 'Deceive'] },
  { id: 'MasterYi', name: 'Master Yi', title: 'the Wuju Bladesman', role: 'jungle', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Alpha Strike', 'Highlander'] },
  { id: 'Zac', name: 'Zac', title: 'the Secret Weapon', role: 'jungle', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'C', counterTags: ['Long Range Engage', 'Revive'] },
  { id: 'Amumu', name: 'Amumu', title: 'the Sad Mummy', role: 'jungle', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Curse AoE', 'Bandage Toss'] },
  { id: 'Rammus', name: 'Rammus', title: 'the Armordillo', role: 'jungle', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Taunt', 'Anti-AD'] },
  { id: 'Nunu', name: 'Nunu & Willump', title: 'the Boy and His Yeti', role: 'jungle', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Snowball', 'Consume Objective'] },
  { id: 'Fiddlesticks', name: 'Fiddlesticks', title: 'the Ancient Fear', role: 'jungle', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'C', counterTags: ['Crowstorm', 'Fear'] },
  { id: 'Ivern', name: 'Ivern', title: 'the Green Father', role: 'jungle', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'D', counterTags: ['Daisy', 'Shield Support'] },

  // ── MID LANE ─────────────────────────────────────────────────────────────
  { id: 'Azir', name: 'Azir', title: 'the Emperor of the Sands', role: 'mid', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Shurima Shuffle', 'Late Game'] },
  { id: 'Yone', name: 'Yone', title: 'the Unforgotten', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'S+', counterTags: ['Mixed Damage', 'AoE Knockup'] },
  { id: 'Yasuo', name: 'Yasuo', title: 'the Unforgiven', role: 'mid', secondaryRole: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S+', counterTags: ['Windwall', 'Steel Tempest'] },
  { id: 'Ahri', name: 'Ahri', title: 'the Nine-Tailed Fox', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S', counterTags: ['Mobility', 'Charm'] },
  { id: 'Orianna', name: 'Orianna', title: 'the Lady of Clockwork', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'S', counterTags: ['Shockwave', 'Zone Control'] },
  { id: 'Syndra', name: 'Syndra', title: 'the Dark Sovereign', role: 'mid', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Single Target Burst', 'Stun'] },
  { id: 'Sylas', name: 'Sylas', title: 'the Unshackled', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'S', counterTags: ['Ultimate Steal', 'Healing'] },
  { id: 'Hwei', name: 'Hwei', title: 'the Visionary', role: 'mid', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'S', counterTags: ['Spellbook', 'Teamfight Poke'] },
  { id: 'Akali', name: 'Akali', title: 'the Rogue Assassin', role: 'mid', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'A', counterTags: ['Shroud', 'Flank'] },
  { id: 'Leblanc', name: 'LeBlanc', title: 'the Deceiver', role: 'mid', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'A', counterTags: ['Distortion', 'Chains'] },
  { id: 'Taliyah', name: 'Taliyah', title: 'the Stoneweaver', role: 'mid', secondaryRole: 'jungle', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'A', counterTags: ['Roam Wall', 'Anti-Dash'] },
  { id: 'Viktor', name: 'Viktor', title: 'the Machine Herald', role: 'mid', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'A', counterTags: ['Chaos Storm', 'Waveclear'] },
  { id: 'Kassadin', name: 'Kassadin', title: 'the Void Walker', role: 'mid', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'A', counterTags: ['Riftwalk', 'Late Game Monster'] },
  { id: 'Tristana', name: 'Tristana', title: 'the Yordle Gunner', role: 'mid', secondaryRole: 'adc', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Tower Destruction', 'Jump Reset'] },
  { id: 'Zed', name: 'Zed', title: 'the Master of Shadows', role: 'mid', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'B', counterTags: ['Death Mark', 'Shadows'] },
  { id: 'Katarina', name: 'Katarina', title: 'the Sinister Blade', role: 'mid', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'B', counterTags: ['Daggers', 'Resets'] },
  { id: 'Fizz', name: 'Fizz', title: 'the Tidal Trickster', role: 'mid', difficulty: 'Medium', playstyle: 'Assassin', baseTier: 'B', counterTags: ['Playful Trickster', 'Chum the Waters'] },
  { id: 'TwistedFate', name: 'Twisted Fate', title: 'the Card Master', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'B', counterTags: ['Destiny Teleport', 'Gold Card'] },
  { id: 'Zoe', name: 'Zoe', title: 'the Aspect of Twilight', role: 'mid', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Paddle Star', 'Sleepy Trouble'] },
  { id: 'Vex', name: 'Vex', title: 'the Gloomist', role: 'mid', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'B', counterTags: ['Anti-Dash Fear', 'Shadow Surge'] },
  { id: 'Naafiri', name: 'Naafiri', title: 'the Hound of a Hundred Bites', role: 'mid', difficulty: 'Easy', playstyle: 'Assassin', baseTier: 'B', counterTags: ['Pack Daggers', 'Bleed'] },
  { id: 'Cassiopeia', name: 'Cassiopeia', title: 'the Serpent\'s Embrace', role: 'mid', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Twin Fang', 'Petrifying Gaze'] },
  { id: 'Vladimir', name: 'Vladimir', title: 'the Crimson Reaper', role: 'mid', secondaryRole: 'top', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Blood Pool', 'Hemoplague'] },
  { id: 'Galio', name: 'Galio', title: 'the Colossus', role: 'mid', difficulty: 'Easy', playstyle: 'Tank', baseTier: 'C', counterTags: ['Global Shield', 'Taunt'] },
  { id: 'Anivia', name: 'Anivia', title: 'the Cryophoenix', role: 'mid', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'C', counterTags: ['Glacial Storm', 'Egg'] },
  { id: 'Veigar', name: 'Veigar', title: 'the Tiny Master of Evil', role: 'mid', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'C', counterTags: ['Event Horizon', 'Infinite AP'] },
  { id: 'Malzahar', name: 'Malzahar', title: 'the Prophet of the Void', role: 'mid', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'C', counterTags: ['Suppression', 'Voidlings'] },
  { id: 'AurelionSol', name: 'Aurelion Sol', title: 'The Star Forger', role: 'mid', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'C', counterTags: ['Stardust', 'Black Hole'] },

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
  { id: 'Samira', name: 'Samira', title: 'the Desert Rose', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'A', counterTags: ['Inferno Trigger', 'Blade Whirl'] },
  { id: 'Vayne', name: 'Vayne', title: 'the Night Hunter', role: 'adc', secondaryRole: 'top', difficulty: 'Hard', playstyle: 'Scaling', baseTier: 'A', counterTags: ['Silver Bolts', 'Tumble'] },
  { id: 'Smolder', name: 'Smolder', title: 'the Fiery Fledgling', role: 'adc', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'A', counterTags: ['Dragon Stacks', 'Execute Wave'] },
  { id: 'Jhin', name: 'Jhin', title: 'the Virtuoso', role: 'adc', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'B', counterTags: ['4th Shot', 'Curtain\'s Call'] },
  { id: 'Caitlyn', name: 'Caitlyn', title: 'the Sheriff of Piltover', role: 'adc', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Traps', 'Range Bully'] },
  { id: 'Twitch', name: 'Twitch', title: 'the Plague Rat', role: 'adc', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Stealth Spray', 'Poison'] },
  { id: 'Sivir', name: 'Sivir', title: 'the Battle Mistress', role: 'adc', difficulty: 'Easy', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Ricochet', 'On The Hunt'] },
  { id: 'Nilah', name: 'Nilah', title: 'the Joy Unbound', role: 'adc', difficulty: 'Hard', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Exp Share', 'Whip Blade'] },
  { id: 'KogMaw', name: "Kog'Maw", title: 'the Mouth of the Abyss', role: 'adc', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Bio-Arcane', 'Artillery'] },
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
  { id: 'Milio', name: 'Milio', title: 'the Gentle Flame', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'A', counterTags: ['Cleanse Ult', 'Range Buff'] },
  { id: 'Blitzcrank', name: 'Blitzcrank', title: 'the Great Steam Golem', role: 'support', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'B', counterTags: ['Rocket Grab', 'Silence'] },
  { id: 'Pyke', name: 'Pyke', title: 'the Bloodharbor Ripper', role: 'support', difficulty: 'Hard', playstyle: 'Assassin', baseTier: 'B', counterTags: ['Death From Below', 'Gold Share'] },
  { id: 'Bard', name: 'Bard', title: 'the Wandering Caretaker', role: 'support', difficulty: 'Hard', playstyle: 'Utility', baseTier: 'B', counterTags: ['Tempered Fate', 'Magical Journey'] },
  { id: 'Karma', name: 'Karma', title: 'the Enlightened One', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'B', counterTags: ['Mantra Shield', 'Q Poke'] },
  { id: 'Senna', name: 'Senna', title: 'the Redeemer', role: 'support', secondaryRole: 'adc', difficulty: 'Medium', playstyle: 'Scaling', baseTier: 'B', counterTags: ['Mist Stacks', 'Global Beam'] },
  { id: 'Alistar', name: 'Alistar', title: 'the Minotaur', role: 'support', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'C', counterTags: ['Headbutt Pulverize', 'Unbreakable'] },
  { id: 'Morgana', name: 'Morgana', title: 'the Fallen', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'C', counterTags: ['Black Shield', 'Dark Binding'] },
  { id: 'Lux', name: 'Lux', title: 'the Lady of Luminosity', role: 'support', secondaryRole: 'mid', difficulty: 'Easy', playstyle: 'Aggressive', baseTier: 'C', counterTags: ['Final Spark', 'Light Binding'] },
  { id: 'Janna', name: 'Janna', title: 'the Storm\'s Fury', role: 'support', difficulty: 'Medium', playstyle: 'Utility', baseTier: 'C', counterTags: ['Monsoon', 'Tornado Knockup'] },
  { id: 'Soraka', name: 'Soraka', title: 'the Starchild', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'C', counterTags: ['Wish Global', 'Healing'] },
  { id: 'Sona', name: 'Sona', title: 'Maven of the Strings', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'C', counterTags: ['Crescendo', 'Auras'] },
  { id: 'Taric', name: 'Taric', title: 'the Shield of Valoran', role: 'support', difficulty: 'Medium', playstyle: 'Tank', baseTier: 'C', counterTags: ['Cosmic Radiance', 'Dazzle'] },
  { id: 'Zyra', name: 'Zyra', title: 'Rise of the Thorns', role: 'support', difficulty: 'Medium', playstyle: 'Aggressive', baseTier: 'C', counterTags: ['Plants', 'Stranglethorns'] },
  { id: 'Yuumi', name: 'Yuumi', title: 'the Magical Cat', role: 'support', difficulty: 'Easy', playstyle: 'Utility', baseTier: 'D', counterTags: ['Attach Untargetable', 'Zoomies'] },
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

// Generate dynamic meta tier list & rich patch notes per patch
export function generateMetaPatch(patchNumber: string, seasonNumber = 15): MetaPatch {
  const tiers: Record<string, { tier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'; winRate: number; note: string }> = {};
  const buffs: PatchChampionChange[] = [];
  const nerfs: PatchChampionChange[] = [];

  const patchNotesBuff = [
    'Zvýšen základní AD o +4 a snížen cooldown na Q o 1.5s',
    'Nové mytické itemy perfektně synergují s kitem v korejské SoloQ',
    'Zvýšeno AP škálování na ultimate abilitě o +15%',
    'Snížena cena core itemů o 250 goldů, rychlejší powerspike',
    'Zvýšen základní armor a léčení v rané fázi hry',
  ];

  const patchNotesNerf = [
    'Sníženo základní HP o -45 a oslaben pasivní damage',
    'Zvýšen cooldown na únikové abilitě po dominanci v pro playi',
    'Klíčový item dostal těžký nerf na AD a attack speed',
    'Oslaben base damage na spellu pro snížení lane dominance',
    'Zvýšena cena core itemu o 300 goldů pro zpomalení snowballu',
  ];

  const systemChangesPool = [
    '🐉 Chemtech & Infernal Dragon Soul damage zvýšen o +8%',
    '⚔️ Lethality & Armor Penetration itemy upraveny pro agresivnější skirmishe',
    '🛡️ Gold bounty z věžových plátů (Turret Plating) zvýšena o 25g',
    '👾 Voidgrub spawn čas upraven pro podporu soubojů na top lince',
    '💨 Cloud Drake bonus k rychlosti pohybu zvýšen na všech serverech',
    '🏰 Baron Nashor buff dává více AD/AP pro rychlejší ukončování her',
  ];

  const headlinesPool = [
    'Velký Meta Shift: Rework itemů a návrat agresivních hypercarry',
    'Mid-Season Shakeup: Nadvláda AP mágů a úpravy na mapě',
    'Worlds Meta Patch: Návrat tanků a engage supportů',
    'Split Launch: Úpravy draků a optimalizace run pro SoloQ',
  ];

  const patchSeed = patchNumber.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const headline = headlinesPool[patchSeed % headlinesPool.length];
  const systemChanges = [
    systemChangesPool[patchSeed % systemChangesPool.length],
    systemChangesPool[(patchSeed + 2) % systemChangesPool.length],
  ];

  const tierMap: Record<number, 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'> = {
    1: 'S+', 2: 'S', 3: 'A', 4: 'B', 5: 'C', 6: 'D',
  };

  ALL_CHAMPIONS.forEach((champ, idx) => {
    const hash = (champ.id + patchNumber).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shift = (hash % 3) - 1; // -1, 0, or 1
    const basePrio = TIER_PRIORITY[champ.baseTier];
    const newPrio = Math.max(1, Math.min(6, basePrio + shift));
    const newTier = tierMap[newPrio];

    const baseWinRate = newTier === 'S+' ? 53.5 : newTier === 'S' ? 51.8 : newTier === 'A' ? 50.2 : newTier === 'B' ? 48.5 : newTier === 'C' ? 46.8 : 44.5;
    const winRate = Number((baseWinRate + (Math.sin(hash + idx) * 1.2)).toFixed(1));

    let note = 'Stabilní pick v aktuální metě';
    if (newPrio < basePrio) {
      // Buffed
      note = patchNotesBuff[hash % patchNotesBuff.length];
      if (buffs.length < 4) {
        buffs.push({
          championId: champ.id,
          changeType: 'buff',
          oldTier: champ.baseTier,
          newTier,
          summary: note,
        });
      }
    } else if (newPrio > basePrio) {
      // Nerfed
      note = patchNotesNerf[hash % patchNotesNerf.length];
      if (nerfs.length < 4) {
        nerfs.push({
          championId: champ.id,
          changeType: 'nerf',
          oldTier: champ.baseTier,
          newTier,
          summary: note,
        });
      }
    }

    tiers[champ.id] = { tier: newTier, winRate, note };
  });

  return {
    patchVersion: patchNumber,
    season: seasonNumber,
    headline,
    systemChanges,
    buffs,
    nerfs,
    tiers,
  };
}
