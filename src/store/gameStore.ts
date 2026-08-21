import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState, GamePhase, Career, PlayerStats, Role, Region, Playstyle,
  Language, GameEvent, Team, DailyChallenge, SplitName, HubTab, GameMode,
  TeamOffer, ChampionMastery, MetaPatch,
} from '../types/game';
import { TEAMS, STARTER_TEAMS } from '../data/teams';
import { EVENTS, getWeeklyEvent } from '../data/events';
import { getDailyChallenge } from '../utils/dailyChallenge';
import { simulateMatch } from '../utils/simulation';
import { generateMetaPatch, ALL_CHAMPIONS, getChampionsByRole } from '../data/champions';
import { calculateGlobalRank, TIER_ORDER, calculateEloDifficulty } from '../data/ranks';
import { getMatchupAdvantage } from '../data/matchups';
import type { Tier, Division } from '../data/ranks';

// ─── Stat Templates ─────────────────────────────────────────────────────────

const ROLE_STATS: Record<Role, Partial<PlayerStats>> = {
  top:     { mechanics: 60, gameKnowledge: 50, communication: 40, mental: 55, adaptability: 50, reputation: 20 },
  jungle:  { mechanics: 50, gameKnowledge: 65, communication: 60, mental: 50, adaptability: 55, reputation: 20 },
  mid:     { mechanics: 65, gameKnowledge: 60, communication: 50, mental: 55, adaptability: 50, reputation: 20 },
  adc:     { mechanics: 70, gameKnowledge: 45, communication: 45, mental: 50, adaptability: 45, reputation: 20 },
  support: { mechanics: 45, gameKnowledge: 55, communication: 70, mental: 50, adaptability: 55, reputation: 20 },
};

const PLAYSTYLE_BONUS: Record<Playstyle, Partial<PlayerStats>> = {
  mechanical: { mechanics: 10, mental: 5 },
  strategic:  { gameKnowledge: 10, adaptability: 5 },
  leader:     { communication: 10, reputation: 10 },
};

interface GameStore extends GameState {
  setLanguage: (lang: Language) => void;
  setPhase: (phase: GamePhase) => void;
  setCurrentTab: (tab: HubTab) => void;

  startNewCareerExtended: (
    mode: GameMode,
    name: string,
    gameName: string,
    role: Role,
    region: Region,
    playstyle: Playstyle,
    championPool: string[],
    customPatch?: MetaPatch
  ) => void;

  startDailyChallenge: () => void;
  advanceWeek: () => void;
  resolveEvent: (event: GameEvent, choiceIndex: number) => void;

  // SoloQ & Match
  startSoloQMatch: () => void;
  grindSoloQFast: () => void;
  finishInteractiveMatch: (won: boolean, championId: string) => void;
  resolveMatch: (won: boolean) => void;

  // Champions & Lifestyle
  swapPoolChampion: (oldChampId: string, newChampId: string) => void;
  performWeeklyAction: (action: 'job' | 'stream' | 'vod' | 'gym') => void;
  upgradePC: () => void;
  changeHousing: (housing: Housing) => void;
  setNutritionPlan: (nutrition: NutritionPlan) => void;

  // Transfers & Contracts
  searchForTeamOffers: () => void;
  acceptTeamOffer: (offer: TeamOffer) => void;
  leaveTeam: () => void;

  nextSplit: () => void;
  retire: () => void;
  resetGame: () => void;
  loadDailyChallenge: () => void;
  addNotification: (text: string, type?: 'positive' | 'negative' | 'neutral' | 'gold', icon?: string) => void;
  setShowPatchNotesModal: (show: boolean) => void;
}

const INITIAL_STATE: GameState = {
  phase: 'LANGUAGE_SELECT',
  currentTab: 'overview',
  language: 'cs',
  career: null,
  currentEvent: null,
  currentMatch: null,
  interactiveMatch: null,
  pendingOffers: [],
  dailyChallenge: null,
  notifications: [],
  showPatchNotesModal: false,
  setShowPatchNotesModal: () => {},
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setShowPatchNotesModal: (show) => set({ showPatchNotesModal: show }),

      addNotification: (text, type = 'positive', icon = '✨') => {
        const id = Math.random().toString(36).substring(2, 9);
        set(state => ({
          notifications: [...(state.notifications || []).slice(-3), { id, text, type, icon }],
        }));
        setTimeout(() => {
          set(state => ({
            notifications: (state.notifications || []).filter(n => n.id !== id),
          }));
        }, 3000);
      },

      setLanguage: (lang) => set({ language: lang }),
      setPhase: (phase) => set({ phase }),
      setCurrentTab: (tab) => set({ currentTab: tab }),

      loadDailyChallenge: () => {
        const daily = getDailyChallenge();
        set({ dailyChallenge: daily });
      },

      startNewCareerExtended: (mode, name, gameName, role, region, playstyle, championPool, customPatch) => {
        const base = ROLE_STATS[role];
        const bonus = PLAYSTYLE_BONUS[playstyle];

        const isProdigy = mode === 'prodigy';
        const startAge = isProdigy ? 14 : 18;

        // Calibrated starting stats:
        // Prodigy starts at ~35-40 (Bronze elo, raw diamond in rough)
        // Pro Debut starts at ~72-78 (Diamond I elo, battle-tested competitive starter)
        const stats: PlayerStats = {
          mechanics:     clamp((base.mechanics || 50) + (bonus.mechanics || 0) + (isProdigy ? -15 : 22)),
          gameKnowledge: clamp((base.gameKnowledge || 50) + (bonus.gameKnowledge || 0) + (isProdigy ? -15 : 20)),
          communication: clamp((base.communication || 50) + (bonus.communication || 0) + (isProdigy ? -15 : 20)),
          mental:        clamp((base.mental || 50) + (bonus.mental || 0) + (isProdigy ? 0 : 16)),
          adaptability:  clamp((base.adaptability || 50) + (bonus.adaptability || 0) + (isProdigy ? 0 : 16)),
          reputation:    isProdigy ? 5 : clamp((base.reputation || 20) + (bonus.reputation || 0) + 15),
        };

        // Masteries init
        const masteries: Record<string, ChampionMastery> = {};
        championPool.forEach(id => {
          masteries[id] = {
            championId: id,
            masteryLevel: isProdigy ? 1 : 3,
            gamesPlayed: isProdigy ? 0 : 25,
            wins: isProdigy ? 0 : 15,
          };
        });

        // Patch init with full rich details
        const initialPatch = customPatch || generateMetaPatch('15.1', 15);

        // Starting rank: Bronze IV (if Prodigy) or Diamond I / Master (if Pro Debut)
        const startTier: Tier = isProdigy ? 'BRONZE' : 'DIAMOND';
        const startDiv: Division = isProdigy ? 'IV' : 'I';
        const startLP = isProdigy ? 0 : 50;

        let startTeam: Team | null = null;
        if (!isProdigy) {
          const starterIds = STARTER_TEAMS[region];
          const teamId = starterIds[Math.floor(Math.random() * starterIds.length)];
          startTeam = TEAMS.find(t => t.id === teamId) || TEAMS[0];
        }

        const salary = startTeam ? startTeam.salaryRange[0] : 0;

        const career: Career = {
          mode,
          playerName: name,
          gameName,
          role,
          startRegion: region,
          playstyle,
          age: startAge,
          birthYear: 2025 - startAge,
          year: 2025,
          month: 1,
          split: 'Winter',
          splitNumber: 1,
          week: 1,
          rank: {
            tier: startTier,
            division: startDiv,
            lp: startLP,
            globalRank: calculateGlobalRank(startTier, startLP),
          },
          soloqWins: isProdigy ? 0 : 35,
          soloqLosses: isProdigy ? 0 : 18,
          mmr: isProdigy ? 800 : 2200,
          championPool,
          masteries,
          currentPatch: initialPatch,
          swapsRemainingThisSplit: 2,
          streamFollowers: isProdigy ? 120 : 3500,
          streamViewers: isProdigy ? 12 : 240,
          currentTeam: startTeam,
          region,
          stats,
          finances: {
            salary,
            savings: isProdigy ? 300 : 5000,
            monthlyExpenses: isProdigy ? 0 : 600,
            streamingIncome: 0,
          },
          lifestyle: {
            housing: isProdigy ? 'parents_home' : (startTeam ? 'gaming_house' : 'budget_room'),
            pcLevel: isProdigy ? 1 : 2, // Starts with 144Hz Rig if already in a pro team
            energy: 100,
            maxEnergy: isProdigy ? 100 : 115,
            coachTrust: startTeam ? 75 : 0,
            rosterStatus: startTeam ? 'starter' : 'free_agent',
            nutrition: isProdigy ? 'home_cooked' : (startTeam ? 'chef_meals' : 'groceries'),
          },
          teamStrength: startTeam ? startTeam.strength : 0,
          wins: 0,
          losses: 0,
          inPlayoffs: false,
          inInternational: false,
          internationalEvent: null,
          achievements: [],
          worldsWins: 0,
          msiWins: 0,
          fstWins: 0,
          splitTitles: 0,
          mvpCount: 0,
          careerScore: 0,
          eventHistory: [],
          isDailyChallenge: false,
          dailyCompleted: false,
        };

        set({
          career,
          phase: 'CAREER_HUB',
          currentTab: 'overview',
          currentEvent: null,
          currentMatch: null,
          interactiveMatch: null,
          pendingOffers: [],
          showPatchNotesModal: true,
        });
      },

      startDailyChallenge: () => {
        const daily = get().dailyChallenge || getDailyChallenge();
        const { role, region, seed } = daily;

        const seededRandom = (offset: number) => {
          const x = Math.sin(seed + offset) * 10000;
          return x - Math.floor(x);
        };

        const base = ROLE_STATS[role];
        const stats: PlayerStats = {
          mechanics:     clamp((base.mechanics || 50) + Math.floor(seededRandom(1) * 15)),
          gameKnowledge: clamp((base.gameKnowledge || 50) + Math.floor(seededRandom(2) * 15)),
          communication: clamp((base.communication || 50) + Math.floor(seededRandom(3) * 15)),
          mental:        clamp((base.mental || 50) + Math.floor(seededRandom(4) * 15)),
          adaptability:  clamp((base.adaptability || 50) + Math.floor(seededRandom(5) * 15)),
          reputation:    clamp((base.reputation || 20) + Math.floor(seededRandom(6) * 10)),
        };

        const pool = ALL_CHAMPIONS.filter(c => c.role === role).slice(0, 6).map(c => c.id);
        const masteries: Record<string, ChampionMastery> = {};
        pool.forEach(id => { masteries[id] = { championId: id, masteryLevel: 3, gamesPlayed: 25, wins: 15 }; });

        const starterIds = STARTER_TEAMS[region];
        const teamId = starterIds[Math.floor(seededRandom(7) * starterIds.length)];
        const team = TEAMS.find(t => t.id === teamId) || TEAMS[0];

        const career: Career = {
          mode: 'daily',
          playerName: 'Daily Challenger',
          gameName: 'DailyPro',
          role,
          startRegion: region,
          playstyle: 'mechanical',
          age: 18,
          birthYear: 2007,
          year: 2025,
          month: 1,
          split: 'Winter',
          splitNumber: 1,
          week: 1,
          rank: { tier: 'MASTER', lp: 120, globalRank: 1800 },
          soloqWins: 45,
          soloqLosses: 20,
          mmr: 2500,
          championPool: pool,
          masteries,
          currentPatch: generateMetaPatch('15.1', 15),
          currentTeam: team,
          region,
          stats,
          finances: { salary: 60000, savings: 5000, monthlyExpenses: 500, streamingIncome: 0 },
          lifestyle: { housing: 'budget_room', pcLevel: 2, energy: 100, maxEnergy: 100, coachTrust: 80, rosterStatus: 'starter' },
          teamStrength: team.strength,
          wins: 0,
          losses: 0,
          inPlayoffs: false,
          inInternational: false,
          internationalEvent: null,
          achievements: [],
          worldsWins: 0,
          msiWins: 0,
          fstWins: 0,
          splitTitles: 0,
          mvpCount: 0,
          careerScore: 0,
          eventHistory: [],
          isDailyChallenge: true,
          dailyCompleted: false,
        };

        set({ career, phase: 'CAREER_HUB', currentTab: 'overview', currentEvent: null, currentMatch: null });
      },

      startSoloQMatch: () => {
        const { career } = get();
        if (!career || (career.lifestyle?.energy ?? 100) < 20) return;

        // Pick random lane opponent champion
        const champPool = career.championPool || ['Aatrox'];
        const roleChamps = getChampionsByRole(career.role);
        const enemyCandidates = roleChamps.filter(c => !champPool.includes(c.id));
        const randomEnemy = enemyCandidates.length > 0
          ? enemyCandidates[Math.floor(Math.random() * enemyCandidates.length)]
          : roleChamps[0];

        // Create mock opponent team for soloq
        const mockOpponent: Team = {
          id: 'soloq_enemy',
          name: 'Enemy SoloQ Team',
          shortName: 'RED',
          region: career.region,
          strength: Math.min(95, Math.floor(career.stats.mechanics + Math.random() * 15)),
          prestige: 50,
          salaryRange: [0, 0],
          color: '#e31e24',
        };

        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };

        set(state => ({
          career: {
            ...state.career!,
            lifestyle: { ...currentLifestyle, energy: Math.max(0, currentLifestyle.energy - 20) },
          },
          interactiveMatch: {
            opponentTeam: mockOpponent,
            selectedChampion: champPool[0] || 'Aatrox',
            enemyChampion: randomEnemy.id,
            currentStep: 'champion_select',
            playerScore: 50,
            opponentScore: 50,
            combatLogs: [],
            isSoloQ: true,
          },
          phase: 'INTERACTIVE_MATCH',
        }));
      },

      grindSoloQFast: () => {
        const { career, addNotification } = get();
        if (!career || (career.lifestyle?.energy ?? 100) < 15) return;

        // Select random champ from pool
        const champPool = career.championPool || ['Aatrox'];
        const champId = champPool[Math.floor(Math.random() * champPool.length)];
        const roleChamps = getChampionsByRole(career.role);
        const enemyCandidates = roleChamps.filter(c => !champPool.includes(c.id));
        const randomEnemy = enemyCandidates.length > 0
          ? enemyCandidates[Math.floor(Math.random() * enemyCandidates.length)]
          : roleChamps[0];
        
        const matchup = getMatchupAdvantage(champId, randomEnemy.id);
        const eloInfo = calculateEloDifficulty(career.rank.tier, career.stats);

        // Win chance accurately scales with Player Stats vs Ranked Tier Elo requirement + Matchup + Meta
        const statRatio = eloInfo.playerAvg / Math.max(1, eloInfo.targetStat);
        let baseWinChance = 0.50 + (statRatio - 1.0) * 0.65;
        baseWinChance += matchup.winRateDelta / 100;
        
        const currentTier = career.currentPatch?.tiers?.[champId]?.tier || 'A';
        const metaBonus = currentTier === 'S+' ? 0.08 : currentTier === 'S' ? 0.04 : currentTier === 'A' ? 0.01 : currentTier === 'B' ? -0.03 : -0.07;
        baseWinChance += metaBonus;

        const finalWinChance = Math.max(0.12, Math.min(0.88, baseWinChance + (Math.random() * 0.16 - 0.08)));
        const won = Math.random() < finalWinChance;

        const prevMastery = career.masteries?.[champId] || { championId: champId, masteryLevel: 1, gamesPlayed: 0, wins: 0 };
        const newMastery = {
          ...prevMastery,
          gamesPlayed: prevMastery.gamesPlayed + 1,
          wins: won ? prevMastery.wins + 1 : prevMastery.wins,
          masteryLevel: Math.min(7, Math.floor((prevMastery.gamesPlayed + 1) / 8) + 1),
        };

        const currentStreak = won ? (career.winStreak ?? 0) + 1 : 0;
        const streakBonusLp = won && currentStreak >= 5 ? 12 : won && currentStreak >= 3 ? 8 : won && currentStreak >= 2 ? 4 : 0;
        const newRank = calculateRankProgression(career.rank, won, streakBonusLp);

        if (won) {
          if (currentStreak >= 2) {
            addNotification(`🔥 HOT STREAK (${currentStreak} VÝHRY V ŘADĚ)! +${24 + streakBonusLp} LP (+${streakBonusLp} Bonus)`, 'gold', '🔥');
          } else {
            addNotification(`+24 LP Výhra vs ${randomEnemy.name} (${champId})! ${matchup.advantageBadge}`, 'positive', '⚔️');
          }
        } else {
          addNotification(`-18 LP Prohra vs ${randomEnemy.name} (-1 Mentál) · Lobby: ${eloInfo.labelCs}`, 'negative', '💀');
        }

        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };

        set(state => ({
          career: {
            ...state.career!,
            lifestyle: { ...currentLifestyle, energy: Math.max(0, currentLifestyle.energy - 15) },
            soloqWins: won ? (state.career!.soloqWins ?? 0) + 1 : (state.career!.soloqWins ?? 0),
            soloqLosses: won ? (state.career!.soloqLosses ?? 0) : (state.career!.soloqLosses ?? 0) + 1,
            winStreak: currentStreak,
            rank: newRank,
            masteries: { ...(state.career!.masteries || {}), [champId]: newMastery },
            stats: {
              ...state.career!.stats,
              mechanics: clamp((state.career!.stats?.mechanics ?? 50) + (won ? 1 : 0)),
              mental: clamp((state.career!.stats?.mental ?? 50) + (won ? 0 : -1)),
            },
          },
        }));
      },

      finishInteractiveMatch: (won, championId) => {
        const { career, interactiveMatch, addNotification } = get();
        if (!career || !interactiveMatch) return;

        const masteries = career.masteries || {};
        const prevMastery = masteries[championId] || { championId, masteryLevel: 1, gamesPlayed: 0, wins: 0 };
        const newMastery = {
          ...prevMastery,
          gamesPlayed: prevMastery.gamesPlayed + 1,
          wins: won ? prevMastery.wins + 1 : prevMastery.wins,
          masteryLevel: Math.min(7, Math.floor((prevMastery.gamesPlayed + 1) / 6) + 1),
        };

        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };

        if (interactiveMatch.isSoloQ) {
          const currentStreak = won ? (career.winStreak ?? 0) + 1 : 0;
          const streakBonusLp = won && currentStreak >= 5 ? 12 : won && currentStreak >= 3 ? 8 : won && currentStreak >= 2 ? 4 : 0;
          const newRank = calculateRankProgression(career.rank, won, streakBonusLp);

          if (won) {
            if (currentStreak >= 2) {
              addNotification(`🔥 ON FIRE (${currentStreak} VÝHRY)! +${24 + streakBonusLp} LP (+${streakBonusLp} Streak Bonus) & +1 Mechanika`, 'gold', '🔥');
            } else {
              addNotification(`SoloQ Vítězství! +24 LP & +1 Mechanika`, 'gold', '🏆');
            }
          } else {
            addNotification(`SoloQ Porážka! -18 LP & -1 Mentál`, 'negative', '💔');
          }
          set(state => ({
            career: {
              ...state.career!,
              soloqWins: won ? (state.career!.soloqWins ?? 0) + 1 : (state.career!.soloqWins ?? 0),
              soloqLosses: won ? (state.career!.soloqLosses ?? 0) : (state.career!.soloqLosses ?? 0) + 1,
              winStreak: currentStreak,
              rank: newRank,
              masteries: { ...(state.career!.masteries || {}), [championId]: newMastery },
              lifestyle: currentLifestyle,
              stats: {
                ...state.career!.stats,
                mechanics: clamp((state.career!.stats?.mechanics ?? 50) + (won ? 1 : 0)),
                mental: clamp((state.career!.stats?.mental ?? 50) + (won ? 0 : -1)),
              },
            },
            interactiveMatch: null,
            phase: 'CAREER_HUB',
          }));
        } else {
          // Official team match
          const newTrust = won
            ? clamp((currentLifestyle.coachTrust ?? 50) + 6)
            : clamp((currentLifestyle.coachTrust ?? 50) - 8);

          if (won) {
            addNotification(`Týmové Vítězství! +6 Důvěra trenéra`, 'gold', '🏆');
          } else {
            addNotification(`Týmová Prohra! -8 Důvěra trenéra`, 'negative', '⚠️');
          }

          set(state => ({
            career: {
              ...state.career!,
              wins: won ? (state.career!.wins ?? 0) + 1 : (state.career!.wins ?? 0),
              losses: won ? (state.career!.losses ?? 0) : (state.career!.losses ?? 0) + 1,
              masteries: { ...(state.career!.masteries || {}), [championId]: newMastery },
              lifestyle: { ...currentLifestyle, coachTrust: newTrust },
            },
            interactiveMatch: null,
            phase: 'CAREER_HUB',
          }));
        }
      },

      swapPoolChampion: (oldChampId, newChampId) => {
        const { career, addNotification } = get();
        if (!career) return;
        const remaining = career.swapsRemainingThisSplit ?? 2;
        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };
        if (remaining <= 0 || currentLifestyle.energy < 30) return;

        const currentPool = career.championPool || ['Aatrox'];
        const newPool = currentPool.map(id => id === oldChampId ? newChampId : id);
        const masteries = { ...(career.masteries || {}) };
        if (!masteries[newChampId]) {
          masteries[newChampId] = { championId: newChampId, masteryLevel: 1, gamesPlayed: 0, wins: 0 };
        }

        addNotification(`Vyměněn ${oldChampId} ➔ ${newChampId} (-30⚡)`, 'gold', '🔄');

        set(state => ({
          career: {
            ...state.career!,
            championPool: newPool,
            masteries,
            swapsRemainingThisSplit: remaining - 1,
            lifestyle: {
              ...currentLifestyle,
              energy: Math.max(0, currentLifestyle.energy - 30),
            },
          },
        }));
      },

      performWeeklyAction: (action) => {
        const { career, addNotification } = get();
        if (!career) return;

        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };
        const currentFinances = career.finances || { salary: 0, savings: 300, monthlyExpenses: 0 };
        const currentStats = career.stats || { mechanics: 50, gameKnowledge: 50, communication: 50, mental: 50, adaptability: 50, reputation: 20 };

        if (action === 'job' && currentLifestyle.energy >= 30) {
          const earnings = 160;
          addNotification(`+$${earnings} Výdělek z brigády (-30⚡ · -3 Mentál)`, 'positive', '💼');
          set(state => ({
            career: {
              ...state.career!,
              lifestyle: { ...currentLifestyle, energy: currentLifestyle.energy - 30 },
              finances: { ...currentFinances, savings: currentFinances.savings + earnings },
              stats: { ...currentStats, mental: clamp(currentStats.mental - 3) },
            },
          }));
        } else if (action === 'stream' && currentLifestyle.energy >= 25 && currentLifestyle.pcLevel >= 2) {
          const currentFollowers = career.streamFollowers ?? 50;
          // Realistic follower gain based on reputation & PC setup
          const repBonus = Math.floor((currentStats.reputation ?? 10) * 0.4);
          const gainedFollowers = Math.floor(18 + repBonus + Math.random() * 14);
          const newFollowers = currentFollowers + gainedFollowers;
          
          // Realistic live viewership (3.5% of followers)
          const newViewers = Math.max(3, Math.floor(newFollowers * 0.035));
          
          // Realistic stream donations & subs ($25-$180)
          const pcBonus = currentLifestyle.pcLevel >= 4 ? 1.5 : currentLifestyle.pcLevel >= 3 ? 1.25 : 1.0;
          const streamCash = Math.floor((25 + newViewers * 1.3 + (currentStats.reputation ?? 10) * 0.5) * pcBonus);

          addNotification(`+${gainedFollowers} Followerů & +$${streamCash} z darů (-25⚡ · -2 Mentál)`, 'gold', '🎥');

          set(state => ({
            career: {
              ...state.career!,
              streamFollowers: newFollowers,
              streamViewers: newViewers,
              lifestyle: { ...currentLifestyle, energy: currentLifestyle.energy - 25 },
              finances: { ...currentFinances, savings: currentFinances.savings + streamCash },
              stats: {
                ...currentStats,
                reputation: clamp(currentStats.reputation + 1),
                mental: clamp(currentStats.mental - 2), // Stream fatigue
              },
            },
          }));
        } else if (action === 'vod' && currentLifestyle.energy >= 20) {
          addNotification(`+2 Znalost hry · +1 Přizpůsobivost (-20⚡)`, 'positive', '🧠');
          set(state => ({
            career: {
              ...state.career!,
              lifestyle: { ...currentLifestyle, energy: currentLifestyle.energy - 20 },
              stats: {
                ...currentStats,
                gameKnowledge: clamp(currentStats.gameKnowledge + 2),
                adaptability: clamp(currentStats.adaptability + 1),
              },
            },
          }));
        } else if (action === 'gym' && currentLifestyle.energy >= 20) {
          addNotification(`+6 Mentál · +1 Mechanika (-20⚡)`, 'positive', '🏋️');
          set(state => ({
            career: {
              ...state.career!,
              lifestyle: { ...currentLifestyle, energy: currentLifestyle.energy - 20 },
              stats: {
                ...currentStats,
                mental: clamp(currentStats.mental + 6),
                mechanics: clamp(currentStats.mechanics + 1),
              },
            },
          }));
        }
      },

      upgradePC: () => {
        const { career, addNotification } = get();
        if (!career) return;
        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };
        const currentFinances = career.finances || { salary: 0, savings: 300, monthlyExpenses: 0 };
        const currentStats = career.stats || { mechanics: 50, gameKnowledge: 50, communication: 50, mental: 50, adaptability: 50, reputation: 20 };

        const costs = [0, 2500, 6500, 15000];
        const nextCost = costs[currentLifestyle.pcLevel] || 99999;
        if (currentFinances.savings >= nextCost && currentLifestyle.pcLevel < 4) {
          const nextLevel = currentLifestyle.pcLevel + 1;
          const mechGain = nextLevel === 2 ? 3 : nextLevel === 3 ? 5 : 8;
          const mentalGain = nextLevel === 3 ? 4 : nextLevel === 4 ? 6 : 0;

          addNotification(`🖥️ Level ${nextLevel} PC Setup zakoupen! (+${mechGain} Mechanika${mentalGain > 0 ? `, +${mentalGain} Mentál` : ''})`, 'gold', '⚡');
          set(state => ({
            career: {
              ...state.career!,
              finances: { ...currentFinances, savings: currentFinances.savings - nextCost },
              lifestyle: { ...currentLifestyle, pcLevel: nextLevel },
              stats: {
                ...currentStats,
                mechanics: clamp(currentStats.mechanics + mechGain),
                mental: clamp(currentStats.mental + mentalGain),
              },
            },
          }));
        }
      },

    changeHousing: (newHousing) => {
      const { career, addNotification } = get();
      if (!career) return;
      const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };

      if (newHousing !== 'parents_home' && career.age < 18 && newHousing !== 'gaming_house') {
        addNotification('⚠️ Pro samostatné odstěhování musíš mít alespoň 18 let!', 'negative', '🔞');
        return;
      }
      if (newHousing === 'gaming_house' && !career.currentTeam) {
        addNotification('⚠️ Týmový Gaming House vyžaduje aktivní smlouvu s esportovým týmem!', 'negative', '⚠️');
        return;
      }

      const maxEnergyMap: Record<string, number> = {
        parents_home: 100,
        budget_room: 105,
        modern_apt: 110,
        gaming_house: 115,
        luxury_apt: 120,
      };

      const newMaxEnergy = maxEnergyMap[newHousing] ?? 100;
      const defaultNutrition = newHousing === 'parents_home' ? 'home_cooked' : newHousing === 'gaming_house' ? 'chef_meals' : (currentLifestyle.nutrition || 'groceries');

      addNotification(`🏠 Přestěhoval ses do nového bydlení! (Max energie: ${newMaxEnergy}⚡)`, 'gold', '📦');

      set(state => ({
        career: {
          ...state.career!,
          lifestyle: {
            ...currentLifestyle,
            housing: newHousing,
            maxEnergy: newMaxEnergy,
            nutrition: defaultNutrition,
          },
        },
      }));
    },

    setNutritionPlan: (newPlan) => {
      const { career, addNotification } = get();
      if (!career) return;
      const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };

      if (currentLifestyle.housing === 'parents_home') {
        addNotification('ℹ️ Bydlíš u rodičů – o stravu je automaticky a zdarma postaráno!', 'neutral', '🍲');
        return;
      }
      if (currentLifestyle.housing === 'gaming_house') {
        addNotification('ℹ️ V týmovém gaming housu vaří osobní šéfkuchař zdarma!', 'neutral', '👨‍🍳');
        return;
      }

      addNotification(`🥗 Změněn týdenní stravovací plán!`, 'positive', '🍱');

      set(state => ({
        career: {
          ...state.career!,
          lifestyle: {
            ...currentLifestyle,
            nutrition: newPlan,
          },
        },
      }));
    },

      searchForTeamOffers: () => {
        const { career } = get();
        if (!career) return;

        const rankOrder = TIER_ORDER.indexOf(career.rank?.tier || 'BRONZE');
        const offers: TeamOffer[] = [];

        // Check teams in player's region and others
        TEAMS.forEach(team => {
          const isEligible = (career.age >= 18) || (career.age >= 16 && team.strength <= 75);
          if (isEligible && rankOrder >= 4) { // Platinum+
            if (Math.random() < 0.35) {
              const salary = Math.floor(team.salaryRange[0] * (0.8 + (rankOrder / 10) * 0.5));
              offers.push({
                team,
                salary,
                contractYears: Math.random() > 0.5 ? 2 : 1,
                role: rankOrder >= 7 ? 'Starter' : 'Sub / Academy',
                bonuses: ['Worlds Bonus $50k', 'Stream revenue split 70%'],
                expiresWeeks: 3,
              });
            }
          }
        });

        set({ pendingOffers: offers.slice(0, 4) });
      },

      acceptTeamOffer: (offer) => {
        const { career, addNotification } = get();
        if (!career) return;

        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };
        const currentFinances = career.finances || { salary: 0, savings: 300, monthlyExpenses: 0 };

        addNotification(`✍️ Podepsána smlouva s ${offer.team.name}! ($${offer.salary.toLocaleString()}/rok)`, 'gold', '🎉');

        set(state => ({
          career: {
            ...state.career!,
            currentTeam: offer.team,
            teamStrength: offer.team.strength,
            finances: { ...currentFinances, salary: offer.salary },
            lifestyle: {
              ...currentLifestyle,
              rosterStatus: 'starter',
              coachTrust: 75,
              housing: 'gaming_house',
              nutrition: 'chef_meals',
              maxEnergy: 115,
            },
          },
          pendingOffers: [],
        }));
      },

      leaveTeam: () => {
        const { career, addNotification } = get();
        if (!career || !career.currentTeam) return;

        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };
        const currentFinances = career.finances || { salary: 0, savings: 300, monthlyExpenses: 0 };

        addNotification(`📋 Smlouva s ${career.currentTeam.name} ukončena. Jsi volný hráč.`, 'negative', '📄');

        set(state => ({
          career: {
            ...state.career!,
            currentTeam: null,
            teamStrength: 0,
            finances: { ...currentFinances, salary: 0 },
            lifestyle: {
              ...currentLifestyle,
              rosterStatus: 'free_agent',
              coachTrust: 0,
              housing: 'budget_room',
              nutrition: 'groceries',
              maxEnergy: 105,
            },
          },
        }));
      },

      advanceWeek: () => {
        const { career } = get();
        if (!career) return;

        const WEEKS_PER_SPLIT = 9;

        // Reset weekly energy based on housing max energy
        const lifestyle = career.lifestyle || {
          energy: 100,
          maxEnergy: 100,
          housing: 'parents_home',
          pcLevel: 1,
          coachTrust: 50,
          rosterStatus: career.currentTeam ? 'starter' : 'free_agent',
          nutrition: 'home_cooked',
        };

        const maxEnergyMap: Record<string, number> = {
          parents_home: 100,
          budget_room: 105,
          modern_apt: 110,
          gaming_house: 115,
          luxury_apt: 120,
        };
        const housingMaxEnergy = maxEnergyMap[lifestyle.housing ?? 'parents_home'] ?? 100;
        let newEnergy = housingMaxEnergy;

        // 1. Pro Salary weekly payout
        const weeklySalary = Math.round((career.finances?.salary ?? 0) / 52);
        let newSavings = currentSavings + weeklySalary;
        let updatedHousing = lifestyle.housing ?? 'parents_home';

        // 2. Charge weekly rent
        const housingRents: Record<string, number> = {
          parents_home: 0,
          budget_room: 450,
          modern_apt: 1200,
          gaming_house: 0,
          luxury_apt: 3200,
        };
        const monthlyRent = housingRents[updatedHousing] ?? 0;
        const weeklyRent = Math.floor(monthlyRent / 4);

        if (weeklyRent > 0) {
          newSavings -= weeklyRent;

          // If in debt and living independently, landlord evicts the player!
          if (newSavings < 0 && (updatedHousing === 'budget_room' || updatedHousing === 'modern_apt' || updatedHousing === 'luxury_apt')) {
            updatedHousing = 'parents_home';
            newEnergy = 100;
            newStats.mental = clamp(newStats.mental - 15);
            newStats.reputation = clamp((newStats.reputation ?? 10) - 2);
            get().addNotification(
              `🚨 EXEKUCE & VYHAZOV Z BYTU! Kvůli dluhu $${Math.abs(newSavings)} na nájmu tě majitel vyhodil a vyměnil zámky. Musel ses s hanbou vrátit k rodičům! (-15 Mentál)`,
              'negative',
              '📦'
            );
          }
        }

        // Housing Perks
        if (updatedHousing === 'modern_apt') {
          newStats.mental = clamp(newStats.mental + 4);
        } else if (updatedHousing === 'gaming_house') {
          newStats.communication = clamp(newStats.communication + 2);
        } else if (updatedHousing === 'luxury_apt') {
          newStats.mental = clamp(newStats.mental + 8);
          newStats.reputation = clamp((newStats.reputation ?? 10) + 2);
        }

        // Food & Nutrition Processing
        const currentNutrition = (updatedHousing === 'parents_home')
          ? 'home_cooked'
          : (updatedHousing === 'gaming_house')
          ? 'chef_meals'
          : (lifestyle.nutrition || 'groceries');

        if (currentNutrition === 'home_cooked') {
          newStats.mental = clamp(newStats.mental + 2);
        } else if (currentNutrition === 'chef_meals') {
          newStats.mental = clamp(newStats.mental + 4);
          newStats.mechanics = clamp(newStats.mechanics + 2);
        } else if (currentNutrition === 'groceries') {
          const groceryCost = 40;
          if (newSavings >= groceryCost) {
            newSavings -= groceryCost;
            newStats.mental = clamp(newStats.mental + 4);
          } else {
            newSavings -= groceryCost; // Goes deeper in debt or buys on credit
            get().addNotification('⚠️ Nákup potravin na dluh (-$40) · Napnutý rozpočet!', 'negative', '🥫');
            newStats.mental = clamp(newStats.mental - 3);
          }
        } else if (currentNutrition === 'meal_prep') {
          const mealCost = 120;
          if (newSavings >= mealCost) {
            newSavings -= mealCost;
            newStats.mental = clamp(newStats.mental + 6);
          } else {
            get().addNotification('⚠️ Zrušena krabičková dieta pro nedostatek financí!', 'negative', '🍱');
            newStats.mental = clamp(newStats.mental - 4);
            newEnergy = Math.max(50, newEnergy - 10);
          }
        } else if (currentNutrition === 'fast_food') {
          const fastFoodCost = 25;
          newSavings -= fastFoodCost;
          newStats.mental = clamp(newStats.mental - 2);
          newStats.mechanics = clamp(newStats.mechanics - 2);
        } else if (currentNutrition === 'none') {
          newStats.mental = clamp(newStats.mental - 6);
          newEnergy = Math.max(50, newEnergy - 15);
          get().addNotification('⚠️ Vynechal jsi stravu! (-15 Max Energie, -6 Mentál)', 'negative', '⚠️');
        }

        if (newSavings < 0) {
          get().addNotification(`⚠️ Účet je v mínusu: -$${Math.abs(newSavings)}! Vydělej peníze brigádou nebo streamem.`, 'negative', '💸');
        }

        // Fatigue / Burnout check if player was at 0 energy or mental < 30
        if (lifestyle.energy === 0 && newStats.mental < 35) {
          newStats.mechanics = clamp(newStats.mechanics - 1);
          newStats.mental = clamp(newStats.mental - 1);
          get().addNotification('⚠️ Vyčerpání z přepracování! (-1 Mechanika, -1 Mentál)', 'negative', '💤');
        }

        // Check coach trust & benching (if in team)
        let rosterStatus = lifestyle.rosterStatus;
        let currentTeam = career.currentTeam;

        if (currentTeam) {
          if ((lifestyle.coachTrust ?? 50) <= 0) {
            // Fired from team!
            rosterStatus = 'free_agent';
            currentTeam = null;
            get().addNotification('⚠️ Byl jsi vyhozen z týmu pro ztrátu důvěry trenéra!', 'negative', '📋');
          } else if ((lifestyle.coachTrust ?? 50) < 25) {
            rosterStatus = 'benched';
          } else {
            rosterStatus = 'starter';
          }
        } else {
          rosterStatus = 'free_agent';
        }

        if (career.week >= WEEKS_PER_SPLIT) {
          set({ phase: 'SEASON_SUMMARY' });
          return;
        }

        // Pick next event with proper hasTeam filter
        const usedIds = (career.eventHistory || []).map(e => e.eventId);
        const event = getWeeklyEvent(
          {
            age: career.age,
            reputation: newStats.reputation ?? 10,
            inInternational: Boolean(career.inInternational),
            hasTeam: currentTeam !== null && career.age >= 17,
            currentTeam: currentTeam,
            region: career.region,
            rank: career.rank,
          },
          usedIds,
        );

        // If on a team & starter & match week (every 3 weeks) -> prompt match!
        if (currentTeam && rosterStatus === 'starter' && career.week % 3 === 0) {
          const opponentTeams = TEAMS.filter(t => t.region === career.region && t.id !== currentTeam?.id);
          const opponent = opponentTeams[Math.floor(Math.random() * opponentTeams.length)] || TEAMS[0];

          const champPool = career.championPool || ['Aatrox'];
          const roleChamps = getChampionsByRole(career.role);
          const enemyCandidates = roleChamps.filter(c => !champPool.includes(c.id));
          const randomEnemy = enemyCandidates.length > 0
            ? enemyCandidates[Math.floor(Math.random() * enemyCandidates.length)]
            : roleChamps[0];

          set(state => ({
            career: {
              ...state.career!,
              week: state.career!.week + 1,
              currentTeam,
              stats: newStats,
              finances: { ...(state.career!.finances || { savings: 300, salary: 0, monthlyExpenses: 0 }), savings: newSavings },
              lifestyle: { ...lifestyle, energy: newEnergy, maxEnergy: housingMaxEnergy, housing: updatedHousing, rosterStatus },
            },
            interactiveMatch: {
              opponentTeam: opponent,
              selectedChampion: champPool[0] || 'Aatrox',
              enemyChampion: randomEnemy.id,
              currentStep: 'champion_select',
              playerScore: 50,
              opponentScore: 50,
              combatLogs: [],
              isSoloQ: false,
            },
            currentEvent: event,
            phase: 'INTERACTIVE_MATCH',
          }));
        } else {
          set(state => ({
            career: {
              ...state.career!,
              week: state.career!.week + 1,
              currentTeam,
              stats: newStats,
              finances: { ...(state.career!.finances || { savings: 300, salary: 0, monthlyExpenses: 0 }), savings: newSavings },
              lifestyle: { ...lifestyle, energy: newEnergy, maxEnergy: housingMaxEnergy, housing: updatedHousing, rosterStatus },
            },
            currentEvent: event,
            phase: 'EVENT',
          }));
        }
      },

      resolveEvent: (event, choiceIndex) => {
        const { career, addNotification } = get();
        if (!career) return;

        const choice = event.choices[choiceIndex];
        const effects = choice.effects || {};

        const currentStats = career.stats || { mechanics: 50, gameKnowledge: 50, communication: 50, mental: 50, adaptability: 50, reputation: 20 };
        const currentLifestyle = career.lifestyle || { energy: 100, maxEnergy: 100, housing: 'parents_home', pcLevel: 1, coachTrust: 50, rosterStatus: 'free_agent' };
        const currentFinances = career.finances || { salary: 0, savings: 300, monthlyExpenses: 0 };
        const currentHistory = career.eventHistory || [];

        const newStats = {
          mechanics:     clamp((currentStats.mechanics ?? 50)     + (effects.mechanics || 0)),
          gameKnowledge: clamp((currentStats.gameKnowledge ?? 50) + (effects.gameKnowledge || 0)),
          communication: clamp((currentStats.communication ?? 50) + (effects.communication || 0)),
          mental:        clamp((currentStats.mental ?? 50)        + (effects.mental || 0)),
          adaptability:  clamp((currentStats.adaptability ?? 50)  + (effects.adaptability || 0)),
          reputation:    clamp((currentStats.reputation ?? 20)    + (effects.reputation || 0)),
        };

        const newTrust = clamp((currentLifestyle.coachTrust ?? 50) + (effects.coachTrust || 0));

        // Format short toast summary of event outcomes
        const gains: string[] = [];
        if (effects.mechanics) gains.push(`${effects.mechanics > 0 ? '+' : ''}${effects.mechanics} Mech`);
        if (effects.mental) gains.push(`${effects.mental > 0 ? '+' : ''}${effects.mental} Mentál`);
        if (effects.gameKnowledge) gains.push(`${effects.gameKnowledge > 0 ? '+' : ''}${effects.gameKnowledge} Znalost`);
        if (effects.savings) gains.push(`${effects.savings > 0 ? '+$' : '-$'}${Math.abs(effects.savings)}`);
        if (effects.reputation) gains.push(`${effects.reputation > 0 ? '+' : ''}${effects.reputation} Rep`);
        if (gains.length > 0) {
          addNotification(gains.join(' · '), gains[0].startsWith('+') ? 'positive' : 'negative', '📋');
        }

        if (newStats.mental <= 0) {
          set(state => ({
            career: { ...state.career!, stats: newStats },
            phase: 'RETIREMENT',
          }));
          return;
        }

        set(state => ({
          career: {
            ...state.career!,
            stats: newStats,
            finances: {
              ...currentFinances,
              salary: Math.max(0, (currentFinances.salary ?? 0) + (effects.salary || 0)),
              savings: Math.max(0, (currentFinances.savings ?? 0) + (effects.savings || 0)),
            },
            lifestyle: {
              ...currentLifestyle,
              coachTrust: newTrust,
            },
            eventHistory: [
              ...currentHistory,
              {
                week: state.career!.week,
                split: state.career!.split,
                year: state.career!.year,
                eventId: event.id,
                choiceIndex,
                effects,
              },
            ],
          },
          currentEvent: null,
          phase: 'CAREER_HUB',
        }));
      },

      resolveMatch: (won) => {
        const { career } = get();
        if (!career) return;
        set(state => ({
          career: {
            ...state.career!,
            wins: won ? state.career!.wins + 1 : state.career!.wins,
            losses: won ? state.career!.losses : state.career!.losses + 1,
          },
          currentMatch: null,
          phase: 'CAREER_HUB',
        }));
      },

      nextSplit: () => {
        const { career } = get();
        if (!career) return;

        const SPLITS: SplitName[] = ['Winter', 'Spring', 'Summer'];
        const nextSplitIdx = career.splitNumber % 3;
        const nextSplit = SPLITS[nextSplitIdx];

        const nextYear = career.splitNumber === 3 ? career.year + 1 : career.year;
        const nextSplitNumber = career.splitNumber === 3 ? 1 : career.splitNumber + 1;
        const nextAge = nextSplitNumber === 1 ? career.age + 1 : career.age;

        // Dynamic patch generation each split
        const newPatchVersion = `15.${nextSplitNumber + 1}`;
        const newPatch = generateMetaPatch(newPatchVersion, 15);

        if (nextAge >= 31) {
          set(state => ({
            career: { ...state.career!, age: nextAge },
            phase: 'RETIREMENT',
          }));
          return;
        }

        // Salary payout if on a team
        const splitEarnings = Math.floor((career.finances?.salary ?? 0) / 3);
        const currentSavings = career.finances?.savings ?? 300;
        const newSavings = currentSavings + splitEarnings;

        const currentLifestyle = career.lifestyle || {
          energy: 100,
          maxEnergy: 100,
          housing: 'parents_home',
          pcLevel: 1,
          coachTrust: 50,
          rosterStatus: career.currentTeam ? 'starter' : 'free_agent',
        };
        const refreshedLifestyle = {
          ...currentLifestyle,
          energy: currentLifestyle.maxEnergy ?? 100,
        };

        const totalMatches = (career.wins ?? 0) + (career.losses ?? 0);
        const winRate = totalMatches > 0 ? (career.wins ?? 0) / totalMatches : 0;
        const qualifiedIntl = winRate >= 0.6 && (career.stats?.reputation ?? 0) >= 60 && career.currentTeam !== null;
        const qualifiedPlayoffs = (winRate >= 0.5 || (career.wins ?? 0) >= 5) && career.currentTeam !== null;

        // 1. Ageing reaction decay (Mechanics drop, Game Knowledge increase after age 23)
        let statsAfterSplit = { ...(career.stats || { mechanics: 50, gameKnowledge: 50, communication: 50, mental: 50, adaptability: 50, reputation: 20 }) };
        if (nextAge >= 23 && nextSplitNumber === 1) { // Annual birthday effect
          const mechLoss = nextAge >= 28 ? 3 : nextAge >= 25 ? 2 : 1;
          const knowGain = nextAge >= 28 ? 3 : nextAge >= 25 ? 2 : 1;
          statsAfterSplit.mechanics = clamp(statsAfterSplit.mechanics - mechLoss);
          statsAfterSplit.gameKnowledge = clamp(statsAfterSplit.gameKnowledge + knowGain);
          get().addNotification(`⏳ Věk ${nextAge} let: -${mechLoss} Mechanika, +${knowGain} Znalost hry`, 'negative', '⏳');
        }

        // 2. Meta Patch Shift Adaptability check
        if (statsAfterSplit.adaptability < 48) {
          statsAfterSplit.adaptability = clamp(statsAfterSplit.adaptability - 1);
          statsAfterSplit.mechanics = clamp(statsAfterSplit.mechanics - 1);
          get().addNotification(`🎮 Patch ${newPatchVersion}: Oslabený styl (-1 Mechanika, -1 Adaptabilita)`, 'negative', '⚠️');
        }

        get().addNotification('Nový Split zahájen! Energie doplněna na 100⚡', 'gold', '🔄');

        if (qualifiedIntl && nextSplitNumber === 3) {
          set(state => ({
            career: {
              ...state.career!,
              split: nextSplit,
              splitNumber: nextSplitNumber,
              year: nextYear,
              age: nextAge,
              week: 1,
              wins: 0,
              losses: 0,
              inInternational: true,
              internationalEvent: 'Worlds',
              currentPatch: newPatch,
              swapsRemainingThisSplit: 2,
              stats: statsAfterSplit,
              lifestyle: refreshedLifestyle,
              finances: { ...(state.career!.finances || { salary: 0, savings: 300, monthlyExpenses: 0 }), savings: newSavings },
            },
            showPatchNotesModal: true,
            phase: 'WORLDS_BRACKET',
          }));
        } else if (qualifiedPlayoffs) {
          set(state => ({
            career: {
              ...state.career!,
              split: nextSplit,
              splitNumber: nextSplitNumber,
              year: nextYear,
              age: nextAge,
              week: 1,
              wins: 0,
              losses: 0,
              inPlayoffs: true,
              currentPatch: newPatch,
              swapsRemainingThisSplit: 2,
              stats: statsAfterSplit,
              lifestyle: refreshedLifestyle,
              finances: { ...(state.career!.finances || { salary: 0, savings: 300, monthlyExpenses: 0 }), savings: newSavings },
            },
            showPatchNotesModal: true,
            phase: 'PLAYOFF_BRACKET',
          }));
        } else {
          set(state => ({
            career: {
              ...state.career!,
              split: nextSplit,
              splitNumber: nextSplitNumber,
              year: nextYear,
              age: nextAge,
              week: 1,
              wins: 0,
              losses: 0,
              inPlayoffs: false,
              inInternational: false,
              internationalEvent: null,
              currentPatch: newPatch,
              swapsRemainingThisSplit: 2,
              stats: statsAfterSplit,
              lifestyle: refreshedLifestyle,
              finances: { ...(state.career!.finances || { salary: 0, savings: 300, monthlyExpenses: 0 }), savings: newSavings },
            },
            showPatchNotesModal: true,
            phase: 'CAREER_HUB',
          }));
        }
      },

      retire: () => {
        const { career } = get();
        if (!career) return;
        const score = calculateScore(career);
        set(state => ({
          career: { ...state.career!, careerScore: score },
          phase: 'RETIREMENT',
        }));
      },

      resetGame: () => {
        set({ ...INITIAL_STATE, language: get().language });
      },
    }),
    {
      name: 'rift-legacy-save-v2',
      partialize: (state) => ({
        language: state.language,
        career: state.career,
        dailyChallenge: state.dailyChallenge,
        phase: state.phase === 'LANGUAGE_SELECT' ? 'LANGUAGE_SELECT' :
               state.career ? 'CAREER_HUB' : 'MENU',
      }),
    }
  )
);

// ─── Helpers ───────────────────────────────────────────────────────────────

function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

function calculateScore(career: Career): number {
  let score = 0;
  score += career.worldsWins * 35;
  score += career.msiWins * 15;
  score += career.splitTitles * 6;

  const rankBonus: Record<string, number> = {
    IRON: 2, BRONZE: 5, SILVER: 8, GOLD: 12,
    PLATINUM: 16, EMERALD: 20, DIAMOND: 25,
    MASTER: 30, GRANDMASTER: 35, CHALLENGER: 40,
  };
  score += rankBonus[career.rank.tier] || 5;

  const avgStat = (
    career.stats.mechanics + career.stats.gameKnowledge +
    career.stats.communication + career.stats.mental +
    career.stats.adaptability + career.stats.reputation
  ) / 6;
  score += Math.floor(avgStat / 5);
  score += Math.min(15, Math.floor(career.finances.savings / 15000));
  score += Math.min(10, Math.floor((career.streamFollowers ?? 0) / 1000));
  return Math.min(100, Math.max(5, score));
}

function calculateRankProgression(currentRank: import('../data/ranks').RankInfo, won: boolean, bonusLp: number = 0): import('../data/ranks').RankInfo {
  const lpDelta = won ? (24 + bonusLp) : -18;
  let newLP = currentRank.lp + lpDelta;
  let tier = currentRank.tier;
  let division = currentRank.division || 'IV';

  const divisions: Division[] = ['IV', 'III', 'II', 'I'];
  const divIdx = divisions.indexOf(division);
  const tierIdx = TIER_ORDER.indexOf(tier);

  if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER') {
    newLP = Math.max(0, newLP);
    if (newLP >= 1000) tier = 'CHALLENGER';
    else if (newLP >= 500) tier = 'GRANDMASTER';
    else tier = 'MASTER';
    return { tier, lp: newLP, globalRank: calculateGlobalRank(tier, newLP) };
  }

  if (newLP >= 100) {
    // Promo
    if (divIdx < 3) {
      division = divisions[divIdx + 1];
      newLP = newLP - 100;
    } else {
      // Tier up
      if (tierIdx < TIER_ORDER.length - 1) {
        tier = TIER_ORDER[tierIdx + 1];
        division = tier === 'MASTER' ? undefined as any : 'IV';
        newLP = 0;
      }
    }
  } else if (newLP < 0) {
    // Demotion
    if (divIdx > 0) {
      division = divisions[divIdx - 1];
      newLP = 75;
    } else {
      if (tierIdx > 0) {
        tier = TIER_ORDER[tierIdx - 1];
        division = 'I';
        newLP = 75;
      } else {
        newLP = 0;
      }
    }
  }

  return {
    tier,
    division,
    lp: Math.max(0, newLP),
    globalRank: calculateGlobalRank(tier, newLP),
  };
}
