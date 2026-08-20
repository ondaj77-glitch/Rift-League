import type { Career, Team, MatchResult } from '../types/game';

export function simulateMatch(career: Career, opponent: Team): MatchResult {
  // Player contribution (weighted average of relevant stats)
  const playerContrib = (
    career.stats.mechanics * 0.35 +
    career.stats.gameKnowledge * 0.25 +
    career.stats.mental * 0.20 +
    career.stats.adaptability * 0.10 +
    career.stats.communication * 0.10
  ) / 100;

  // Team strength factor (0–1)
  const teamFactor = career.teamStrength / 100;
  const opponentFactor = opponent.strength / 100;

  // Combined score with some randomness (±15%)
  const playerScore = playerContrib * 0.5 + teamFactor * 0.5;
  const noise = (Math.random() - 0.5) * 0.3;
  const winChance = clamp01(playerScore - opponentFactor * 0.5 + 0.5 + noise);

  const won = Math.random() < winChance;
  const isBo5 = Math.random() < 0.3; // 30% chance of BO5 (playoffs-feel)

  // Generate score
  let score: string;
  if (isBo5) {
    if (won) {
      const opponentWins = Math.random() < 0.4 ? (Math.random() < 0.5 ? 1 : 2) : 0;
      score = `3-${opponentWins}`;
    } else {
      const playerWins = Math.random() < 0.4 ? (Math.random() < 0.5 ? 1 : 2) : 0;
      score = `${playerWins}-3`;
    }
  } else {
    score = won ? '2-0' : '0-2';
    if (Math.random() < 0.4) score = won ? '2-1' : '1-2';
  }

  const mvp = won && Math.random() < 0.25;

  // Generate highlights
  const highlights = generateHighlights(career, won, mvp);

  return {
    opponentTeam: opponent,
    playerScore: Math.round(playerContrib * 100),
    teamScore: Math.round(winChance * 100),
    won,
    score,
    mvp,
    highlights,
  };
}

function clamp01(v: number): number {
  return Math.max(0.05, Math.min(0.95, v));
}

function generateHighlights(career: Career, won: boolean, mvp: boolean): string[] {
  const roleHighlights: Record<string, string[]> = {
    top: [
      'Split pushed the side lane perfectly, drawing two opponents',
      'Found a crucial teleport to turn the teamfight',
      'Held the 1v2 in the toplane for 3 minutes',
      'Hit a game-changing ultimate in the Baron pit',
    ],
    jungle: [
      'Secured all four Dragons for the Soul',
      'Perfectly timed Baron steal at 50% HP',
      'Set up the winning engage with a vision-denied gank',
      'Counter-jungled the opponent\'s entire red side',
    ],
    mid: [
      'Roamed bottom at the perfect moment for a double kill',
      'Wave-managed perfectly to deny the opponent\'s TP',
      'Hit the crucial skillshot that started the ace',
      'Controlled the Herald side for the entire early game',
    ],
    adc: [
      'Positioned perfectly to kite the entire fight',
      'Outplayed a 1v2 dive with flawless movement',
      'Ended with a 10/1 KDA for the series',
      'Called the critical peel from the support at the right time',
    ],
    support: [
      'Vision control was perfect all game',
      'Saved the carry three times from certain death',
      'Set up the baron with a blind engage',
      'Roam timing was pinpoint, creating advantages everywhere',
    ],
  };

  const genericBad = [
    'Got caught out in the early laning phase',
    'Struggled to find impact in the mid game',
    'Draft disadvantage was difficult to overcome',
  ];

  const role = career.role;
  const pool = roleHighlights[role] || roleHighlights.mid;

  if (!won) {
    return [genericBad[Math.floor(Math.random() * genericBad.length)]];
  }

  const count = mvp ? 2 : 1;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Calculate team standings for a full split
export function generateStandings(
  playerTeam: Team | null,
  region: string,
  wins: number,
  losses: number,
  allTeams: Team[]
): Array<{ team: Team; wins: number; losses: number; isPlayer: boolean }> {
  const total = Math.max(1, wins + losses);
  const dummyTeam: Team = playerTeam || {
    id: 'soloq_prodigy',
    name: 'SoloQ Prodigy',
    shortName: 'PROD',
    region: region as any,
    strength: 50,
    prestige: 10,
    salaryRange: [0, 0],
    color: '#a855f7',
  };

  const regionTeams = allTeams.filter(t => t.region === region && t.id !== dummyTeam.id).slice(0, 7);

  const standings = regionTeams.map(team => {
    const strength = team.strength / 100;
    const teamWins = Math.round(total * strength * (0.8 + Math.random() * 0.4));
    return {
      team,
      wins: Math.min(teamWins, total),
      losses: total - Math.min(teamWins, total),
      isPlayer: false,
    };
  });

  standings.push({ team: dummyTeam, wins, losses, isPlayer: true });
  standings.sort((a, b) => b.wins - a.wins);

  return standings;
}
