import type { DailyChallenge } from '../types/game';
import type { Role, Region } from '../types/game';

const ROLES: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];
const REGIONS: Region[] = ['LCK', 'LPL', 'LEC', 'LTA_N', 'LTA_S', 'LCP'];
const OBJECTIVES = [
  'objective.reach_msi',
  'objective.reach_worlds',
  'objective.win_split',
  'objective.savings_100k',
  'objective.rep_80',
  'objective.reach_playoffs',
];

function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededPick<T>(arr: T[], seed: number, offset: number): T {
  const x = Math.sin(seed + offset) * 10000;
  const rand = x - Math.floor(x);
  return arr[Math.floor(rand * arr.length)];
}

export function getDailyChallenge(): DailyChallenge {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const seed = dateSeed(dateStr);

  const role = seededPick(ROLES, seed, 1);
  const region = seededPick(REGIONS, seed, 2);
  const objectiveKey = seededPick(OBJECTIVES, seed, 3);

  // Objective target depends on type
  const objectiveTarget = objectiveKey === 'objective.reach_msi' ? 22 :
                          objectiveKey === 'objective.savings_100k' ? 100000 :
                          objectiveKey === 'objective.rep_80' ? 80 : 0;

  return {
    date: dateStr,
    role,
    region,
    objectiveKey,
    objectiveTarget,
    seed,
  };
}

export function isChallengeCompleted(daily: DailyChallenge, savedDate: string): boolean {
  return savedDate === daily.date;
}
