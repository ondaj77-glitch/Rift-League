import type { Tier, Division, RankInfo } from '../data/ranks';

export type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support';
export type Region = 'LCK' | 'LPL' | 'LEC' | 'LTA_N' | 'LTA_S' | 'LCP';
export type Playstyle = 'mechanical' | 'strategic' | 'leader';
export type Language = 'en' | 'cs';
export type GameMode = 'prodigy' | 'pro_debut' | 'daily';

export type GamePhase =
  | 'LANGUAGE_SELECT'
  | 'MENU'
  | 'CHARACTER_CREATION'
  | 'CAREER_HUB'
  | 'EVENT'
  | 'INTERACTIVE_MATCH'
  | 'MATCH'
  | 'SEASON_SUMMARY'
  | 'PLAYOFF_BRACKET'
  | 'INTERNATIONAL'
  | 'WORLDS_BRACKET'
  | 'RETIREMENT'
  | 'DAILY_CHALLENGE';

export type HubTab = 'overview' | 'soloq' | 'champions' | 'lifestyle' | 'transfers';

export type SplitName = 'Winter' | 'Spring' | 'Summer';
export type RosterStatus = 'starter' | 'benched' | 'sub' | 'free_agent';
export type Housing = 'parents_home' | 'budget_room' | 'gaming_house' | 'luxury_apt';

// ─── Player Stats ─────────────────────────────────────────────────────────────

export interface PlayerStats {
  mechanics: number;       // Mikro – kombos, skillshoty, kiting
  gameKnowledge: number;   // Makro – vize, rotace, objectives
  communication: number;   // Týmová práce, callování
  mental: number;          // Odolnost vůči tilt a tlaku
  adaptability: number;    // Schopnost přizpůsobit se meta
  reputation: number;      // Jak tě vnímá scéna
}

export type StatKey = keyof PlayerStats;

// ─── Finances & Lifestyle ─────────────────────────────────────────────────────

export interface Finances {
  salary: number;          // Roční plat v USD (0 if free agent)
  savings: number;         // Naspořeno celkem
  monthlyExpenses: number; // Měsíční výdaje (nájem, jídlo, internet)
  streamingIncome: number; // Měsíční příjem ze streamování
}

export interface Lifestyle {
  housing: Housing;
  pcLevel: number;         // 1: Potato PC, 2: 144Hz Rig, 3: Pro Esport 360Hz Beast
  energy: number;          // 0–100 energy per week
  maxEnergy: number;
  coachTrust: number;      // 0–100 (if < 25 => benched, if 0 => fired)
  rosterStatus: RosterStatus;
}

// ─── Champion Pool & Meta ─────────────────────────────────────────────────────

export interface ChampionMastery {
  championId: string;
  masteryLevel: number;    // 1 to 7
  gamesPlayed: number;
  wins: number;
}

export interface PatchChampionChange {
  championId: string;
  changeType: 'buff' | 'nerf';
  oldTier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  newTier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  summary: string;
}

export interface MetaPatch {
  patchVersion: string;
  season: number;
  headline: string;
  systemChanges: string[];
  buffs: PatchChampionChange[];
  nerfs: PatchChampionChange[];
  tiers: Record<string, {
    tier: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
    winRate: number;
    note: string;
  }>;
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  shortName: string;
  region: Region;
  strength: number;        // 0–100, síla týmu
  prestige: number;        // 0–100, prestíž org
  salaryRange: [number, number]; // [min, max] USD/rok
  color: string;           // Hlavní barva týmu (hex)
  minAgeRequired?: number; // Tier 1 leagues require 18+ (or 17 for academy)
}

// ─── Career ───────────────────────────────────────────────────────────────────

export interface Career {
  mode: GameMode;
  playerName: string;
  gameName: string;
  role: Role;
  startRegion: Region;
  playstyle: Playstyle;

  // Progression
  age: number;
  birthYear: number;
  year: number;
  month: number;           // 1 to 12
  split: SplitName;
  splitNumber: number;     // 1 = Winter, 2 = Spring, 3 = Summer
  week: number;            // 1–9 in split / month

  // Rank & SoloQ
  rank: RankInfo;
  soloqWins: number;
  soloqLosses: number;
  mmr: number;

  // Champion Mastery & Pool (6 mains)
  championPool: string[];  // 6 champion IDs
  masteries: Record<string, ChampionMastery>;
  currentPatch: MetaPatch;
  swapsRemainingThisSplit: number; // Max 2 swaps per split, costs 30 energy

  // Stream & Social Audience
  streamFollowers: number;
  streamViewers: number;

  // Team & Organization
  currentTeam: Team | null;
  region: Region;
  stats: PlayerStats;
  finances: Finances;
  lifestyle: Lifestyle;

  // Season Tracking
  teamStrength: number;
  wins: number;
  losses: number;
  inPlayoffs: boolean;
  inInternational: boolean;
  internationalEvent: 'FST' | 'MSI' | 'Worlds' | null;

  // History & Achievements
  achievements: Achievement[];
  worldsWins: number;
  msiWins: number;
  fstWins: number;
  splitTitles: number;
  mvpCount: number;

  // Career score
  careerScore: number;
  eventHistory: EventHistoryEntry[];

  isDailyChallenge: boolean;
  dailyCompleted: boolean;
}

// ─── Interactive Tactical Match ───────────────────────────────────────────────

export type MatchPhaseStep = 'champion_select' | 'laning' | 'mid_game' | 'late_game' | 'summary';

export interface TacticalChoice {
  id: string;
  titleKey: string;
  descriptionKey: string;
  statKey: StatKey;
  difficulty: number;      // Stat check threshold
  risk: 'Low' | 'Medium' | 'High';
  successEffect: { scoreDelta: number; textKey: string };
  failEffect: { scoreDelta: number; textKey: string };
}

export interface InteractiveMatchState {
  opponentTeam: Team;
  selectedChampion: string;
  enemyChampion?: string;
  currentStep: MatchPhaseStep;
  playerScore: number;     // 0-100
  opponentScore: number;   // 0-100
  combatLogs: Array<{ phase: string; text: string; success: boolean; scoreDelta: number }>;
  isSoloQ: boolean;
  isPlayoff?: boolean;
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  titleKey: string;
  year: number;
  split?: SplitName;
}

export interface EventHistoryEntry {
  week: number;
  split: SplitName;
  year: number;
  eventId: string;
  choiceIndex: number;
  effects: Partial<StatDelta>;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export interface StatDelta {
  mechanics: number;
  gameKnowledge: number;
  communication: number;
  mental: number;
  adaptability: number;
  reputation: number;
  salary: number;
  savings: number;
  teamStrength: number;
  coachTrust?: number;
  lp?: number;
  energy?: number;
}

export interface EventChoice {
  textKey: string;
  effects: Partial<StatDelta>;
  nextTextKey?: string;
  requiresStat?: { stat: StatKey; min: number };
}

export type EventCategory =
  | 'training'
  | 'team_dynamics'
  | 'meta'
  | 'contract'
  | 'social'
  | 'health'
  | 'match'
  | 'international'
  | 'career'
  | 'soloq'
  | 'prodigy';

export interface GameEvent {
  id: string;
  category: EventCategory;
  titleKey: string;
  descriptionKey: string;
  choices: EventChoice[];
  minAge?: number;
  maxAge?: number;
  minReputation?: number;
  maxReputation?: number;
  requiresInternational?: boolean;
  requiresFreeAgent?: boolean;
  requiresTeam?: boolean;
  regions?: Region[];
  minTier?: Tier;
  maxTier?: Tier;
  weight: number;
}

// ─── Match & Standings ────────────────────────────────────────────────────────

export interface MatchResult {
  opponentTeam: Team;
  playerScore: number;
  teamScore: number;
  won: boolean;
  score: string;
  mvp: boolean;
  highlights: string[];
}

export interface SeasonStanding {
  team: Team;
  wins: number;
  losses: number;
  isPlayer: boolean;
}

// ─── Daily Challenge ──────────────────────────────────────────────────────────

export interface DailyChallenge {
  date: string;
  role: Role;
  region: Region;
  objectiveKey: string;
  objectiveTarget: number;
  seed: number;
}

// ─── Game Store State ─────────────────────────────────────────────────────────

export interface TeamOffer {
  team: Team;
  salary: number;
  contractYears: number;
  role: 'Starter' | 'Sub / Academy';
  bonuses: string[];
  expiresWeeks: number;
}

export interface GameNotification {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral' | 'gold';
  icon: string;
}

export interface GameState {
  phase: GamePhase;
  currentTab: HubTab;
  language: Language;
  career: Career | null;
  currentEvent: GameEvent | null;
  currentMatch: MatchResult | null;
  interactiveMatch: InteractiveMatchState | null;
  pendingOffers: TeamOffer[];
  dailyChallenge: DailyChallenge | null;
  notifications: GameNotification[];
  showPatchNotesModal: boolean;
  setShowPatchNotesModal: (show: boolean) => void;
}
