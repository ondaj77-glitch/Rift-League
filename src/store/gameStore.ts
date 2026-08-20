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
import { generateMetaPatch, ALL_CHAMPIONS } from '../data/champions';
import { calculateGlobalRank, TIER_ORDER } from '../data/ranks';
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

        const stats: PlayerStats = {
          mechanics:     clamp((base.mechanics || 50) + (bonus.mechanics || 0) - (isProdigy ? 15 : 0)),
          gameKnowledge: clamp((base.gameKnowledge || 50) + (bonus.gameKnowledge || 0) - (isProdigy ? 15 : 0)),
          communication: clamp((base.communication || 50) + (bonus.communication || 0) - (isProdigy ? 15 : 0)),
          mental:        clamp((base.mental || 50) + (bonus.mental || 0)),
          adaptability:  clamp((base.adaptability || 50) + (bonus.adaptability || 0)),
          reputation:    isProdigy ? 5 : clamp((base.reputation || 20) + (bonus.reputation || 0)),
        };

        // Masteries init
        const masteries: Record<string, ChampionMastery> = {};
        championPool.forEach(id => {
          masteries[id] = { championId: id, masteryLevel: 1, gamesPlayed: 0, wins: 0 };
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
          soloqWins: 0,
          soloqLosses: 0,
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
            housing: isProdigy ? 'parents_home' : 'budget_room',
            pcLevel: 1,
            energy: 100,
            maxEnergy: 100,
            coachTrust: startTeam ? 75 : 0,
            rosterStatus: startTeam ? 'starter' : 'free_agent',
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
        if (!career || career.lifestyle.energy < 20) return;

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

        set(state => ({
          career: {
            ...state.career!,
            lifestyle: { ...state.career!.lifestyle, energy: state.career!.lifestyle.energy - 20 },
          },
          interactiveMatch: {
            opponentTeam: mockOpponent,
            selectedChampion: state.career!.championPool[0] || 'Aatrox',
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
        if (!career || career.lifestyle.energy < 15) return;

        const winChance = (career.stats.mechanics * 0.4 + career.stats.gameKnowledge * 0.3 + career.stats.mental * 0.3) / 100;
        const won = Math.random() < Math.max(0.2, Math.min(0.85, winChance + (Math.random() * 0.2 - 0.1)));

        // Select random champ from pool to gain exp
        const champId = career.championPool[Math.floor(Math.random() * career.championPool.length)];
        const prevMastery = career.masteries[champId] || { championId: champId, masteryLevel: 1, gamesPlayed: 0, wins: 0 };
        const newMastery = {
          ...prevMastery,
          gamesPlayed: prevMastery.gamesPlayed + 1,
          wins: won ? prevMastery.wins + 1 : prevMastery.wins,
          masteryLevel: Math.min(7, Math.floor((prevMastery.gamesPlayed + 1) / 8) + 1),
        };

        const newRank = calculateRankProgression(career.rank, won);

        if (won) {
          addNotification(`+24 LP Výhra v SoloQ (${champId})!`, 'positive', '⚔️');
        } else {
          addNotification(`-18 LP Prohra v SoloQ (-1 Mentál)`, 'negative', '💀');
        }

        set(state => ({
          career: {
            ...state.career!,
            lifestyle: { ...state.career!.lifestyle, energy: state.career!.lifestyle.energy - 15 },
            soloqWins: won ? state.career!.soloqWins + 1 : state.career!.soloqWins,
            soloqLosses: won ? state.career!.soloqLosses : state.career!.soloqLosses + 1,
            rank: newRank,
            masteries: { ...state.career!.masteries, [champId]: newMastery },
            stats: {
              ...state.career!.stats,
              mechanics: clamp(state.career!.stats.mechanics + (won ? 1 : 0)),
              mental: clamp(state.career!.stats.mental + (won ? 0 : -1)),
            },
          },
        }));
      },

      finishInteractiveMatch: (won, championId) => {
        const { career, interactiveMatch, addNotification } = get();
        if (!career || !interactiveMatch) return;

        const prevMastery = career.masteries[championId] || { championId, masteryLevel: 1, gamesPlayed: 0, wins: 0 };
        const newMastery = {
          ...prevMastery,
          gamesPlayed: prevMastery.gamesPlayed + 1,
          wins: won ? prevMastery.wins + 1 : prevMastery.wins,
          masteryLevel: Math.min(7, Math.floor((prevMastery.gamesPlayed + 1) / 6) + 1),
        };

        if (interactiveMatch.isSoloQ) {
          const newRank = calculateRankProgression(career.rank, won);
          if (won) {
            addNotification(`SoloQ Vítězství! +24 LP & +1 Mechanika`, 'gold', '🏆');
          } else {
            addNotification(`SoloQ Porážka! -18 LP & -1 Mentál`, 'negative', '💔');
          }
          set(state => ({
            career: {
              ...state.career!,
              soloqWins: won ? state.career!.soloqWins + 1 : state.career!.soloqWins,
              soloqLosses: won ? state.career!.soloqLosses : state.career!.soloqLosses + 1,
              rank: newRank,
              masteries: { ...state.career!.masteries, [championId]: newMastery },
              stats: {
                ...state.career!.stats,
                mechanics: clamp(state.career!.stats.mechanics + (won ? 1 : 0)),
                mental: clamp(state.career!.stats.mental + (won ? 0 : -1)),
              },
            },
            interactiveMatch: null,
            phase: 'CAREER_HUB',
          }));
        } else {
          // Official team match
          const newTrust = won
            ? clamp(career.lifestyle.coachTrust + 6)
            : clamp(career.lifestyle.coachTrust - 8);

          if (won) {
            addNotification(`Týmové Vítězství! +6 Důvěra trenéra`, 'gold', '🏆');
          } else {
            addNotification(`Týmová Prohra! -8 Důvěra trenéra`, 'negative', '⚠️');
          }

          set(state => ({
            career: {
              ...state.career!,
              wins: won ? state.career!.wins + 1 : state.career!.wins,
              losses: won ? state.career!.losses : state.career!.losses + 1,
              masteries: { ...state.career!.masteries, [championId]: newMastery },
              lifestyle: { ...state.career!.lifestyle, coachTrust: newTrust },
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
        if (remaining <= 0 || career.lifestyle.energy < 30) return;

        const newPool = career.championPool.map(id => id === oldChampId ? newChampId : id);
        const masteries = { ...career.masteries };
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
              ...state.career!.lifestyle,
              energy: state.career!.lifestyle.energy - 30,
            },
          },
        }));
      },

      performWeeklyAction: (action) => {
        const { career, addNotification } = get();
        if (!career) return;

        if (action === 'job' && career.lifestyle.energy >= 30) {
          addNotification(`+$450 Výdělek z brigády (-30⚡)`, 'positive', '💼');
          set(state => ({
            career: {
              ...state.career!,
              lifestyle: { ...state.career!.lifestyle, energy: state.career!.lifestyle.energy - 30 },
              finances: { ...state.career!.finances, savings: state.career!.finances.savings + 450 },
              stats: { ...state.career!.stats, mental: clamp(state.career!.stats.mental - 3) },
            },
          }));
        } else if (action === 'stream' && career.lifestyle.energy >= 25) {
          const currentFollowers = career.streamFollowers ?? 100;
          const gainedFollowers = 250 + Math.floor(career.stats.reputation * 15) + Math.floor(Math.random() * 100);
          const newFollowers = currentFollowers + gainedFollowers;
          const newViewers = Math.max(10, Math.floor(newFollowers * 0.08));
          const streamCash = 200 + Math.floor(newViewers * 1.5) + Math.floor(career.stats.reputation * 4);

          addNotification(`+${gainedFollowers} Followerů & +$${streamCash} z darů!`, 'gold', '🎥');

          set(state => ({
            career: {
              ...state.career!,
              streamFollowers: newFollowers,
              streamViewers: newViewers,
              lifestyle: { ...state.career!.lifestyle, energy: state.career!.lifestyle.energy - 25 },
              finances: { ...state.career!.finances, savings: state.career!.finances.savings + streamCash },
              stats: { ...state.career!.stats, reputation: clamp(state.career!.stats.reputation + 2) },
            },
          }));
        } else if (action === 'vod' && career.lifestyle.energy >= 20) {
          addNotification(`+3 Znalost hry · +2 Přizpůsobivost (-20⚡)`, 'positive', '🧠');
          set(state => ({
            career: {
              ...state.career!,
              lifestyle: { ...state.career!.lifestyle, energy: state.career!.lifestyle.energy - 20 },
              stats: {
                ...state.career!.stats,
                gameKnowledge: clamp(state.career!.stats.gameKnowledge + 3),
                adaptability: clamp(state.career!.stats.adaptability + 2),
              },
            },
          }));
        } else if (action === 'gym' && career.lifestyle.energy >= 20) {
          addNotification(`+8 Mentál · Tilt vymazán (-20⚡)`, 'positive', '🏋️');
          set(state => ({
            career: {
              ...state.career!,
              lifestyle: { ...state.career!.lifestyle, energy: state.career!.lifestyle.energy - 20 },
              stats: { ...state.career!.stats, mental: clamp(state.career!.stats.mental + 8) },
            },
          }));
        }
      },

      upgradePC: () => {
        const { career, addNotification } = get();
        if (!career) return;
        const costs = [0, 1500, 5000];
        const nextCost = costs[career.lifestyle.pcLevel] || 99999;
        if (career.finances.savings >= nextCost) {
          addNotification(`🖥️ Nový PC Setup zakoupen! (+4 Mechanika)`, 'gold', '⚡');
          set(state => ({
            career: {
              ...state.career!,
              finances: { ...state.career!.finances, savings: state.career!.finances.savings - nextCost },
              lifestyle: { ...state.career!.lifestyle, pcLevel: state.career!.lifestyle.pcLevel + 1 },
              stats: {
                ...state.career!.stats,
                mechanics: clamp(state.career!.stats.mechanics + 4),
              },
            },
          }));
        }
      },

      searchForTeamOffers: () => {
        const { career } = get();
        if (!career) return;

        const rankOrder = TIER_ORDER.indexOf(career.rank.tier);
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
        const { career } = get();
        if (!career) return;

        set(state => ({
          career: {
            ...state.career!,
            currentTeam: offer.team,
            teamStrength: offer.team.strength,
            finances: {
              ...state.career!.finances,
              salary: offer.salary,
            },
            lifestyle: {
              ...state.career!.lifestyle,
              rosterStatus: offer.role === 'Starter' ? 'starter' : 'sub',
              coachTrust: 75,
              housing: 'gaming_house',
            },
          },
          pendingOffers: [],
        }));
      },

      leaveTeam: () => {
        const { career } = get();
        if (!career) return;

        set(state => ({
          career: {
            ...state.career!,
            currentTeam: null,
            teamStrength: 0,
            finances: { ...state.career!.finances, salary: 0 },
            lifestyle: {
              ...state.career!.lifestyle,
              rosterStatus: 'free_agent',
              coachTrust: 0,
              housing: 'budget_room',
            },
          },
        }));
      },

      advanceWeek: () => {
        const { career } = get();
        if (!career) return;

        const WEEKS_PER_SPLIT = 9;

        // Reset weekly energy
        const newEnergy = 100;

        // Charge weekly living costs
        const expenses = career.finances?.monthlyExpenses ?? 0;
        const currentSavings = career.finances?.savings ?? 300;
        const weeklyRent = Math.floor(expenses / 4);
        const newSavings = Math.max(0, currentSavings - weeklyRent);

        // Check coach trust & benching (if in team)
        const lifestyle = career.lifestyle || {
          energy: 100,
          maxEnergy: 100,
          housing: 'parents_home',
          pcLevel: 1,
          coachTrust: 50,
          rosterStatus: career.currentTeam ? 'starter' : 'free_agent',
        };

        let rosterStatus = lifestyle.rosterStatus;
        let currentTeam = career.currentTeam;

        if (currentTeam) {
          if ((lifestyle.coachTrust ?? 50) <= 0) {
            // Fired from team!
            rosterStatus = 'free_agent';
            currentTeam = null;
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
            reputation: career.stats?.reputation ?? 10,
            inInternational: Boolean(career.inInternational),
            hasTeam: currentTeam !== null,
          },
          usedIds,
        );

        // If on a team & starter & match week (every 3 weeks) -> prompt match!
        if (currentTeam && rosterStatus === 'starter' && career.week % 3 === 0) {
          const opponentTeams = TEAMS.filter(t => t.region === career.region && t.id !== currentTeam?.id);
          const opponent = opponentTeams[Math.floor(Math.random() * opponentTeams.length)] || TEAMS[0];

          set(state => ({
            career: {
              ...state.career!,
              week: state.career!.week + 1,
              currentTeam,
              finances: { ...(state.career!.finances || { savings: 300, salary: 0, monthlyExpenses: 0 }), savings: newSavings },
              lifestyle: { ...lifestyle, energy: newEnergy, rosterStatus },
            },
            interactiveMatch: {
              opponentTeam: opponent,
              selectedChampion: state.career!.championPool?.[0] || 'Aatrox',
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
              finances: { ...(state.career!.finances || { savings: 300, salary: 0, monthlyExpenses: 0 }), savings: newSavings },
              lifestyle: { ...lifestyle, energy: newEnergy, rosterStatus },
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
        const effects = choice.effects;

        const newStats = {
          mechanics:     clamp(career.stats.mechanics     + (effects.mechanics || 0)),
          gameKnowledge: clamp(career.stats.gameKnowledge + (effects.gameKnowledge || 0)),
          communication: clamp(career.stats.communication + (effects.communication || 0)),
          mental:        clamp(career.stats.mental        + (effects.mental || 0)),
          adaptability:  clamp(career.stats.adaptability  + (effects.adaptability || 0)),
          reputation:    clamp(career.stats.reputation    + (effects.reputation || 0)),
        };

        const newTrust = clamp(career.lifestyle.coachTrust + (effects.coachTrust || 0));

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
              ...state.career!.finances,
              salary: Math.max(0, state.career!.finances.salary + (effects.salary || 0)),
              savings: Math.max(0, state.career!.finances.savings + (effects.savings || 0)),
            },
            lifestyle: {
              ...state.career!.lifestyle,
              coachTrust: newTrust,
            },
            eventHistory: [
              ...state.career!.eventHistory,
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
        const splitEarnings = Math.floor(career.finances.salary / 3);
        const newSavings = career.finances.savings + splitEarnings;

        const winRate = career.wins / Math.max(1, career.wins + career.losses);
        const qualifiedIntl = winRate >= 0.6 && career.stats.reputation >= 60 && career.currentTeam !== null;
        const qualifiedPlayoffs = (winRate >= 0.5 || career.wins >= 5) && career.currentTeam !== null;

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
              finances: { ...state.career!.finances, savings: newSavings },
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
              finances: { ...state.career!.finances, savings: newSavings },
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
              finances: { ...state.career!.finances, savings: newSavings },
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

function calculateRankProgression(currentRank: import('../data/ranks').RankInfo, won: boolean): import('../data/ranks').RankInfo {
  const lpDelta = won ? 24 : -18;
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
