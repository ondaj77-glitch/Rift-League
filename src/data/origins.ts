import type { PlayerOrigin, ArchetypeTrait, DailyChallenge, Role, Region } from '../types/game';

export interface OriginInfo {
  id: PlayerOrigin;
  icon: string;
  nameCs: string;
  nameEn: string;
  descCs: string;
  descEn: string;
  perksCs: string[];
  perksEn: string[];
  statModifiers: {
    mechanics?: number;
    gameKnowledge?: number;
    communication?: number;
    mental?: number;
    adaptability?: number;
    reputation?: number;
    coachTrust?: number;
    followers?: number;
    bonusLp?: number;
  };
}

export interface TraitInfo {
  id: ArchetypeTrait;
  icon: string;
  nameCs: string;
  nameEn: string;
  taglineCs: string;
  taglineEn: string;
  descCs: string;
  descEn: string;
  statModifiers: {
    mechanics?: number;
    gameKnowledge?: number;
    communication?: number;
    mental?: number;
    adaptability?: number;
  };
}

export const ORIGINS: OriginInfo[] = [
  {
    id: 'soloq_prodigy',
    icon: '⚡',
    nameCs: 'SoloQ Talent (Prodigy)',
    nameEn: 'SoloQ Prodigy',
    descCs: 'Vycházející hvězda objevená na vrcholu SoloQ ladderu. Špičková mechanika a duely.',
    descEn: 'Raw talent discovered at the top of the SoloQ ladder. Exceptional mechanics and 1v1 instinct.',
    perksCs: ['+6 Mechanika', '+100 Bonusových LP na startu', '-4 Komunikace v týmu'],
    perksEn: ['+6 Mechanics', '+100 Starting Bonus LP', '-4 Team Communication'],
    statModifiers: {
      mechanics: 6,
      communication: -4,
      bonusLp: 100,
      followers: 1200,
    },
  },
  {
    id: 'academy_graduate',
    icon: '🎓',
    nameCs: 'Esport Akademie (Academy Graduate)',
    nameEn: 'Academy Graduate',
    descCs: 'Prošel mládežnickým systémem a amatérskými turnaji. Skvělá disciplína a makro porozumění.',
    descEn: 'Trained through youth academy systems and ERL tournaments. Superior macro and discipline.',
    perksCs: ['+6 Znalost Hry & Makro', '+15 Důvěra trenéra od startu', '+4 Mentál'],
    perksEn: ['+6 Game Knowledge', '+15 Starting Coach Trust', '+4 Mental'],
    statModifiers: {
      gameKnowledge: 6,
      mental: 4,
      coachTrust: 15,
      followers: 500,
    },
  },
  {
    id: 'content_creator',
    icon: '🎬',
    nameCs: 'Streamer & Tvůrce Obsahu (Content Creator)',
    nameEn: 'Content Creator on the Side',
    descCs: 'Vybudoval si komunitu na Twitchi a YouTube. Více fanoušků a sponzoringů, ale hrozí rozptýlení.',
    descEn: 'Built a passionate fanbase on Twitch and YouTube. Higher sponsorship revenue and hype.',
    perksCs: ['+5 000 Followers na startu', '+20% Příjmy ze streamu', 'Dvojnásobný fanouškovský růst'],
    perksEn: ['+5,000 Starting Followers', '+20% Stream revenue', 'Double follower gains on win'],
    statModifiers: {
      reputation: 8,
      followers: 5000,
      communication: 4,
    },
  },
];

export const TRAITS: TraitInfo[] = [
  {
    id: 'hypercarry',
    icon: '⚔️',
    nameCs: 'Agresivní Carry (Hypercarry)',
    nameEn: 'Aggressive Hypercarry',
    taglineCs: '+6 Mechanika · -4 Mentál',
    taglineEn: '+6 Mechanics · -4 Mental',
    descCs: 'Hledáš duelové příležitosti a all-in playe. Tým se může spolehnout na tvé mechanické vyústění.',
    descEn: 'Always looking for outplay angles and all-in kills. High mechanical ceiling under pressure.',
    statModifiers: {
      mechanics: 6,
      mental: -4,
    },
  },
  {
    id: 'shotcaller',
    icon: '🧠',
    nameCs: 'Týmový Lídr & Shotcaller',
    nameEn: 'Shotcaller & Strategist',
    taglineCs: '+6 Znalost Hry & Komunikace · -4 Mechanika',
    taglineEn: '+6 Knowledge & Comm · -4 Mechanics',
    descCs: 'Čteš mapu, hlídáš tempo po zabití barona a řídíš rotace týmu k vítězství.',
    descEn: 'Master of map tempo, wave states, and teamfight calls that win crucial games.',
    statModifiers: {
      gameKnowledge: 6,
      communication: 6,
      mechanics: -4,
    },
  },
  {
    id: 'meta_abuser',
    icon: '🎮',
    nameCs: 'Patch & Meta Abuser',
    nameEn: 'Patch & Meta Abuser',
    taglineCs: '+6 Adaptabilita · Bonus na S+ tieru',
    taglineEn: '+6 Adaptability · Meta Power',
    descCs: 'Okamžitě přepínáš na nově buffnuté šampióny a využíváš slabin soupeřova draftu.',
    descEn: 'Quickly adapts to meta patches and punishes opponents with high-tier power picks.',
    statModifiers: {
      adaptability: 6,
      mechanics: 2,
    },
  },
  {
    id: 'team_first',
    icon: '🛡️',
    nameCs: 'Spolehlivý Týmový Hráč (Team-First)',
    nameEn: 'Team-First Anchor',
    taglineCs: '+6 Mentál · +5 Týmová Morálka',
    taglineEn: '+6 Mental · High Team Morale',
    descCs: 'Držíš tým pohromadě v těžkých momentech. Nikdy netiltuješ a ustupuješ pro dobro týmu.',
    descEn: 'Rock-solid mental fortitude. Anchors the team during high-stakes playoff series.',
    statModifiers: {
      mental: 6,
      communication: 4,
    },
  },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'daily_jungle_msi',
    role: 'jungle',
    region: 'EUW',
    titleCs: 'Mladý Jungle Šampion',
    titleEn: 'Prodigy Jungle Breakthrough',
    objectiveCs: 'Postup na turnaj MSI před dovršením 21 let',
    objectiveEn: 'Play an MSI before you turn 21',
    targetAge: 21,
    targetEvent: 'MSI',
  },
  {
    id: 'daily_mid_challenger',
    role: 'mid',
    region: 'KR',
    titleCs: 'Korejský Král Midu',
    titleEn: 'Korean Mid Dominance',
    objectiveCs: 'Dosáhni Challangera a vyhraj LCK Split',
    objectiveEn: 'Reach Challenger and win LCK Split Championship',
    targetAge: 20,
    targetEvent: 'Challenger',
  },
  {
    id: 'daily_adc_worlds',
    role: 'adc',
    region: 'EUW',
    titleCs: 'Cesta na Světový Šampionát',
    titleEn: 'Road to Worlds Glory',
    objectiveCs: 'Kvalifikuj se na Worlds a vyhraj trofej do 22 let',
    objectiveEn: 'Qualify and win the Worlds trophy before age 22',
    targetAge: 22,
    targetEvent: 'Worlds',
  },
  {
    id: 'daily_top_split',
    role: 'top',
    region: 'LPL',
    titleCs: 'Vládce Horní Linky',
    titleEn: 'LPL Top Lane Raid',
    objectiveCs: 'Ovládni ligu a získej Split Title v Tier 1 týmu',
    objectiveEn: 'Win Split Championship with a Tier 1 team',
    targetAge: 21,
    targetEvent: 'SplitTitle',
  },
];

export function getTodayChallenge(): DailyChallenge {
  // Deterministic daily challenge based on current date
  const now = new Date();
  const dayIndex = (now.getFullYear() * 365 + now.getMonth() * 31 + now.getDate()) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[dayIndex];
}
