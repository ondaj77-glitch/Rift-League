import type { Role, Playstyle, PlayerStats } from '../types/game';

const ROLE_BASE: Record<Role, PlayerStats> = {
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

export function ROLE_STATS_PREVIEW(role: Role, playstyle: Playstyle): PlayerStats {
  const base = ROLE_BASE[role];
  const bonus = PLAYSTYLE_BONUS[playstyle];
  return {
    mechanics:     Math.min(100, base.mechanics     + (bonus.mechanics     || 0)),
    gameKnowledge: Math.min(100, base.gameKnowledge + (bonus.gameKnowledge || 0)),
    communication: Math.min(100, base.communication + (bonus.communication || 0)),
    mental:        Math.min(100, base.mental        + (bonus.mental        || 0)),
    adaptability:  Math.min(100, base.adaptability  + (bonus.adaptability  || 0)),
    reputation:    Math.min(100, base.reputation    + (bonus.reputation    || 0)),
  };
}
