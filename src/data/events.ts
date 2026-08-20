import type { GameEvent } from '../types/game';

// ─── ALL GAME EVENTS ──────────────────────────────────────────────────────────
// Each event has a unique ID, category, title/description keys (for i18n),
// and 2–4 choices with stat effects.
// Positive values = gain, negative = loss.

export const EVENTS: GameEvent[] = [

  // ══════════════════════════════════════════════════════
  //  TRAINING & DEVELOPMENT
  // ══════════════════════════════════════════════════════

  {
    id: 'training_soloq_grind',
    category: 'training',
    titleKey: 'event.training_soloq_grind.title',
    descriptionKey: 'event.training_soloq_grind.desc',
    weight: 8,
    choices: [
      {
        textKey: 'event.training_soloq_grind.a',
        effects: { mechanics: 8, mental: -6, gameKnowledge: 4 },
        nextTextKey: 'event.training_soloq_grind.a.result',
      },
      {
        textKey: 'event.training_soloq_grind.b',
        effects: { mechanics: 3, mental: 2, gameKnowledge: 5 },
        nextTextKey: 'event.training_soloq_grind.b.result',
      },
      {
        textKey: 'event.training_soloq_grind.c',
        effects: { gameKnowledge: 10, mental: 3, mechanics: -2 },
        nextTextKey: 'event.training_soloq_grind.c.result',
      },
    ],
  },

  {
    id: 'training_private_coach',
    category: 'training',
    titleKey: 'event.training_private_coach.title',
    descriptionKey: 'event.training_private_coach.desc',
    weight: 5,
    minReputation: 30,
    choices: [
      {
        textKey: 'event.training_private_coach.a',
        effects: { gameKnowledge: 12, mechanics: 5, savings: -15000 },
        nextTextKey: 'event.training_private_coach.a.result',
      },
      {
        textKey: 'event.training_private_coach.b',
        effects: { reputation: 3 },
        nextTextKey: 'event.training_private_coach.b.result',
      },
    ],
  },

  {
    id: 'training_vod_review',
    category: 'training',
    titleKey: 'event.training_vod_review.title',
    descriptionKey: 'event.training_vod_review.desc',
    weight: 7,
    choices: [
      {
        textKey: 'event.training_vod_review.a',
        effects: { gameKnowledge: 8, adaptability: 5 },
        nextTextKey: 'event.training_vod_review.a.result',
      },
      {
        textKey: 'event.training_vod_review.b',
        effects: { mechanics: 6, mental: -2 },
        nextTextKey: 'event.training_vod_review.b.result',
      },
      {
        textKey: 'event.training_vod_review.c',
        effects: { mental: 5, mechanics: 2, gameKnowledge: 2 },
        nextTextKey: 'event.training_vod_review.c.result',
      },
    ],
  },

  {
    id: 'training_champion_pool',
    category: 'training',
    titleKey: 'event.training_champion_pool.title',
    descriptionKey: 'event.training_champion_pool.desc',
    weight: 7,
    choices: [
      {
        textKey: 'event.training_champion_pool.a',
        effects: { adaptability: 10, mechanics: -4 },
        nextTextKey: 'event.training_champion_pool.a.result',
      },
      {
        textKey: 'event.training_champion_pool.b',
        effects: { mechanics: 8, adaptability: -3 },
        nextTextKey: 'event.training_champion_pool.b.result',
      },
      {
        textKey: 'event.training_champion_pool.c',
        effects: { gameKnowledge: 6, adaptability: 5, mechanics: 3 },
        nextTextKey: 'event.training_champion_pool.c.result',
      },
    ],
  },

  {
    id: 'training_korea_bootcamp',
    category: 'training',
    titleKey: 'event.training_korea_bootcamp.title',
    descriptionKey: 'event.training_korea_bootcamp.desc',
    weight: 4,
    choices: [
      {
        textKey: 'event.training_korea_bootcamp.a',
        effects: { mechanics: 10, gameKnowledge: 8, mental: -5, savings: -8000 },
        nextTextKey: 'event.training_korea_bootcamp.a.result',
      },
      {
        textKey: 'event.training_korea_bootcamp.b',
        effects: { mental: 3 },
        nextTextKey: 'event.training_korea_bootcamp.b.result',
      },
    ],
  },

  {
    id: 'training_sports_psychologist',
    category: 'training',
    titleKey: 'event.training_sports_psychologist.title',
    descriptionKey: 'event.training_sports_psychologist.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.training_sports_psychologist.a',
        effects: { mental: 15, savings: -12000 },
        nextTextKey: 'event.training_sports_psychologist.a.result',
      },
      {
        textKey: 'event.training_sports_psychologist.b',
        effects: { mental: 5 },
        nextTextKey: 'event.training_sports_psychologist.b.result',
      },
      {
        textKey: 'event.training_sports_psychologist.c',
        effects: { mental: -3, reputation: -2 },
        nextTextKey: 'event.training_sports_psychologist.c.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  META & PATCHES
  // ══════════════════════════════════════════════════════

  {
    id: 'meta_champion_nerfed',
    category: 'meta',
    titleKey: 'event.meta_champion_nerfed.title',
    descriptionKey: 'event.meta_champion_nerfed.desc',
    weight: 8,
    choices: [
      {
        textKey: 'event.meta_champion_nerfed.a',
        effects: { adaptability: 8, mechanics: -5, mental: -3 },
        nextTextKey: 'event.meta_champion_nerfed.a.result',
      },
      {
        textKey: 'event.meta_champion_nerfed.b',
        effects: { mechanics: 4, adaptability: -5, mental: -2 },
        nextTextKey: 'event.meta_champion_nerfed.b.result',
      },
      {
        textKey: 'event.meta_champion_nerfed.c',
        effects: { gameKnowledge: 8, adaptability: 5, mental: 2 },
        nextTextKey: 'event.meta_champion_nerfed.c.result',
      },
    ],
  },

  {
    id: 'meta_new_op_champ',
    category: 'meta',
    titleKey: 'event.meta_new_op_champ.title',
    descriptionKey: 'event.meta_new_op_champ.desc',
    weight: 7,
    choices: [
      {
        textKey: 'event.meta_new_op_champ.a',
        effects: { adaptability: 12, mechanics: -3 },
        nextTextKey: 'event.meta_new_op_champ.a.result',
      },
      {
        textKey: 'event.meta_new_op_champ.b',
        effects: { mechanics: 5, reputation: 5 },
        nextTextKey: 'event.meta_new_op_champ.b.result',
      },
      {
        textKey: 'event.meta_new_op_champ.c',
        effects: { gameKnowledge: 8, adaptability: 4 },
        nextTextKey: 'event.meta_new_op_champ.c.result',
      },
    ],
  },

  {
    id: 'meta_fearless_draft',
    category: 'meta',
    titleKey: 'event.meta_fearless_draft.title',
    descriptionKey: 'event.meta_fearless_draft.desc',
    weight: 6,
    choices: [
      {
        textKey: 'event.meta_fearless_draft.a',
        effects: { adaptability: 10, gameKnowledge: 5 },
        nextTextKey: 'event.meta_fearless_draft.a.result',
      },
      {
        textKey: 'event.meta_fearless_draft.b',
        effects: { mental: -5, mechanics: 3 },
        nextTextKey: 'event.meta_fearless_draft.b.result',
      },
    ],
  },

  {
    id: 'meta_shift_playstyle',
    category: 'meta',
    titleKey: 'event.meta_shift_playstyle.title',
    descriptionKey: 'event.meta_shift_playstyle.desc',
    weight: 6,
    choices: [
      {
        textKey: 'event.meta_shift_playstyle.a',
        effects: { adaptability: 12, mechanics: -4, mental: -3 },
        nextTextKey: 'event.meta_shift_playstyle.a.result',
      },
      {
        textKey: 'event.meta_shift_playstyle.b',
        effects: { reputation: -3, mental: 4 },
        nextTextKey: 'event.meta_shift_playstyle.b.result',
      },
      {
        textKey: 'event.meta_shift_playstyle.c',
        effects: { gameKnowledge: 10, communication: 5 },
        nextTextKey: 'event.meta_shift_playstyle.c.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  TEAM DYNAMICS
  // ══════════════════════════════════════════════════════

  {
    id: 'team_jungler_flame',
    category: 'team_dynamics',
    titleKey: 'event.team_jungler_flame.title',
    descriptionKey: 'event.team_jungler_flame.desc',
    weight: 8,
    choices: [
      {
        textKey: 'event.team_jungler_flame.a',
        effects: { mental: -5, communication: -3, teamStrength: -5 },
        nextTextKey: 'event.team_jungler_flame.a.result',
      },
      {
        textKey: 'event.team_jungler_flame.b',
        effects: { communication: 8, teamStrength: 5, mental: 2 },
        nextTextKey: 'event.team_jungler_flame.b.result',
      },
      {
        textKey: 'event.team_jungler_flame.c',
        effects: { reputation: 5, communication: 5, teamStrength: 8 },
        nextTextKey: 'event.team_jungler_flame.c.result',
        requiresStat: { stat: 'communication', min: 50 },
      },
    ],
  },

  {
    id: 'team_coach_replaced',
    category: 'team_dynamics',
    titleKey: 'event.team_coach_replaced.title',
    descriptionKey: 'event.team_coach_replaced.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.team_coach_replaced.a',
        effects: { communication: 5, adaptability: 5, teamStrength: 8 },
        nextTextKey: 'event.team_coach_replaced.a.result',
      },
      {
        textKey: 'event.team_coach_replaced.b',
        effects: { mental: -8, adaptability: -3, teamStrength: -5 },
        nextTextKey: 'event.team_coach_replaced.b.result',
      },
      {
        textKey: 'event.team_coach_replaced.c',
        effects: { reputation: 8, communication: 3 },
        nextTextKey: 'event.team_coach_replaced.c.result',
      },
    ],
  },

  {
    id: 'team_import_player',
    category: 'team_dynamics',
    titleKey: 'event.team_import_player.title',
    descriptionKey: 'event.team_import_player.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.team_import_player.a',
        effects: { communication: 8, gameKnowledge: 5, teamStrength: 10 },
        nextTextKey: 'event.team_import_player.a.result',
      },
      {
        textKey: 'event.team_import_player.b',
        effects: { communication: -5, teamStrength: -5, mental: -3 },
        nextTextKey: 'event.team_import_player.b.result',
      },
    ],
  },

  {
    id: 'team_strategy_leak',
    category: 'team_dynamics',
    titleKey: 'event.team_strategy_leak.title',
    descriptionKey: 'event.team_strategy_leak.desc',
    weight: 4,
    choices: [
      {
        textKey: 'event.team_strategy_leak.a',
        effects: { reputation: 10, communication: 5, teamStrength: -3 },
        nextTextKey: 'event.team_strategy_leak.a.result',
      },
      {
        textKey: 'event.team_strategy_leak.b',
        effects: { teamStrength: -12, mental: -8, reputation: -5 },
        nextTextKey: 'event.team_strategy_leak.b.result',
      },
    ],
  },

  {
    id: 'team_shotcaller_role',
    category: 'team_dynamics',
    titleKey: 'event.team_shotcaller_role.title',
    descriptionKey: 'event.team_shotcaller_role.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.team_shotcaller_role.a',
        effects: { communication: 12, mental: -5, reputation: 8 },
        nextTextKey: 'event.team_shotcaller_role.a.result',
      },
      {
        textKey: 'event.team_shotcaller_role.b',
        effects: { mechanics: 6, mental: 3 },
        nextTextKey: 'event.team_shotcaller_role.b.result',
      },
    ],
  },

  {
    id: 'team_rookie_mentor',
    category: 'team_dynamics',
    titleKey: 'event.team_rookie_mentor.title',
    descriptionKey: 'event.team_rookie_mentor.desc',
    weight: 4,
    minReputation: 55,
    choices: [
      {
        textKey: 'event.team_rookie_mentor.a',
        effects: { communication: 8, reputation: 12, mechanics: -2, teamStrength: 6 },
        nextTextKey: 'event.team_rookie_mentor.a.result',
      },
      {
        textKey: 'event.team_rookie_mentor.b',
        effects: { mechanics: 6, reputation: -3 },
        nextTextKey: 'event.team_rookie_mentor.b.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  CONTRACT & CAREER
  // ══════════════════════════════════════════════════════

  {
    id: 'contract_lpl_offer',
    category: 'contract',
    titleKey: 'event.contract_lpl_offer.title',
    descriptionKey: 'event.contract_lpl_offer.desc',
    weight: 4,
    minReputation: 60,
    choices: [
      {
        textKey: 'event.contract_lpl_offer.a',
        effects: { reputation: 5, salary: 150000, mental: -5, communication: -5, adaptability: 5 },
        nextTextKey: 'event.contract_lpl_offer.a.result',
      },
      {
        textKey: 'event.contract_lpl_offer.b',
        effects: { reputation: 8, mental: 5 },
        nextTextKey: 'event.contract_lpl_offer.b.result',
      },
    ],
  },

  {
    id: 'contract_extension',
    category: 'contract',
    titleKey: 'event.contract_extension.title',
    descriptionKey: 'event.contract_extension.desc',
    weight: 6,
    choices: [
      {
        textKey: 'event.contract_extension.a',
        effects: { reputation: 5, mental: 5, salary: 20000 },
        nextTextKey: 'event.contract_extension.a.result',
      },
      {
        textKey: 'event.contract_extension.b',
        effects: { reputation: 3, mental: -3 },
        nextTextKey: 'event.contract_extension.b.result',
      },
    ],
  },

  {
    id: 'contract_budget_cuts',
    category: 'contract',
    titleKey: 'event.contract_budget_cuts.title',
    descriptionKey: 'event.contract_budget_cuts.desc',
    weight: 4,
    choices: [
      {
        textKey: 'event.contract_budget_cuts.a',
        effects: { reputation: 8, mental: -5, salary: -20000 },
        nextTextKey: 'event.contract_budget_cuts.a.result',
      },
      {
        textKey: 'event.contract_budget_cuts.b',
        effects: { reputation: -5, mental: 3, salary: -10000, teamStrength: -8 },
        nextTextKey: 'event.contract_budget_cuts.b.result',
      },
      {
        textKey: 'event.contract_budget_cuts.c',
        effects: { reputation: -10, salary: 0, mental: -10 },
        nextTextKey: 'event.contract_budget_cuts.c.result',
      },
    ],
  },

  {
    id: 'contract_new_investor',
    category: 'contract',
    titleKey: 'event.contract_new_investor.title',
    descriptionKey: 'event.contract_new_investor.desc',
    weight: 4,
    choices: [
      {
        textKey: 'event.contract_new_investor.a',
        effects: { salary: 30000, teamStrength: 10, mental: 3 },
        nextTextKey: 'event.contract_new_investor.a.result',
      },
      {
        textKey: 'event.contract_new_investor.b',
        effects: { reputation: 8 },
        nextTextKey: 'event.contract_new_investor.b.result',
      },
    ],
  },

  {
    id: 'contract_content_creator',
    category: 'contract',
    titleKey: 'event.contract_content_creator.title',
    descriptionKey: 'event.contract_content_creator.desc',
    weight: 4,
    minReputation: 50,
    choices: [
      {
        textKey: 'event.contract_content_creator.a',
        effects: { reputation: 12, savings: 40000, mechanics: -5, mental: -3 },
        nextTextKey: 'event.contract_content_creator.a.result',
      },
      {
        textKey: 'event.contract_content_creator.b',
        effects: { mechanics: 5, mental: 3, reputation: 3 },
        nextTextKey: 'event.contract_content_creator.b.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  SOCIAL & PERSONAL
  // ══════════════════════════════════════════════════════

  {
    id: 'social_rivalry',
    category: 'social',
    titleKey: 'event.social_rivalry.title',
    descriptionKey: 'event.social_rivalry.desc',
    weight: 6,
    choices: [
      {
        textKey: 'event.social_rivalry.a',
        effects: { reputation: 10, mental: -5 },
        nextTextKey: 'event.social_rivalry.a.result',
      },
      {
        textKey: 'event.social_rivalry.b',
        effects: { reputation: 5, mental: 3 },
        nextTextKey: 'event.social_rivalry.b.result',
      },
      {
        textKey: 'event.social_rivalry.c',
        effects: { reputation: -8, mental: -8 },
        nextTextKey: 'event.social_rivalry.c.result',
      },
    ],
  },

  {
    id: 'social_stream_flame',
    category: 'social',
    titleKey: 'event.social_stream_flame.title',
    descriptionKey: 'event.social_stream_flame.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.social_stream_flame.a',
        effects: { reputation: -12, mental: -8, communication: -5 },
        nextTextKey: 'event.social_stream_flame.a.result',
      },
      {
        textKey: 'event.social_stream_flame.b',
        effects: { reputation: -5, mental: 5 },
        nextTextKey: 'event.social_stream_flame.b.result',
      },
      {
        textKey: 'event.social_stream_flame.c',
        effects: { reputation: 5, communication: 5 },
        nextTextKey: 'event.social_stream_flame.c.result',
      },
    ],
  },

  {
    id: 'social_podcast',
    category: 'social',
    titleKey: 'event.social_podcast.title',
    descriptionKey: 'event.social_podcast.desc',
    weight: 5,
    minReputation: 45,
    choices: [
      {
        textKey: 'event.social_podcast.a',
        effects: { reputation: 10, communication: 5 },
        nextTextKey: 'event.social_podcast.a.result',
      },
      {
        textKey: 'event.social_podcast.b',
        effects: { mechanics: 4 },
        nextTextKey: 'event.social_podcast.b.result',
      },
    ],
  },

  {
    id: 'social_sponsor_deal',
    category: 'social',
    titleKey: 'event.social_sponsor_deal.title',
    descriptionKey: 'event.social_sponsor_deal.desc',
    weight: 5,
    minReputation: 70,
    choices: [
      {
        textKey: 'event.social_sponsor_deal.a',
        effects: { reputation: 8, savings: 50000 },
        nextTextKey: 'event.social_sponsor_deal.a.result',
      },
      {
        textKey: 'event.social_sponsor_deal.b',
        effects: { reputation: 5 },
        nextTextKey: 'event.social_sponsor_deal.b.result',
      },
    ],
  },

  {
    id: 'social_drama_leak',
    category: 'social',
    titleKey: 'event.social_drama_leak.title',
    descriptionKey: 'event.social_drama_leak.desc',
    weight: 4,
    choices: [
      {
        textKey: 'event.social_drama_leak.a',
        effects: { reputation: -8, mental: -5, teamStrength: -5 },
        nextTextKey: 'event.social_drama_leak.a.result',
      },
      {
        textKey: 'event.social_drama_leak.b',
        effects: { reputation: 5, communication: 5, mental: 3 },
        nextTextKey: 'event.social_drama_leak.b.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  HEALTH & MENTAL
  // ══════════════════════════════════════════════════════

  {
    id: 'health_wrist_pain',
    category: 'health',
    titleKey: 'event.health_wrist_pain.title',
    descriptionKey: 'event.health_wrist_pain.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.health_wrist_pain.a',
        effects: { mechanics: -12, mental: -5, savings: -10000 },
        nextTextKey: 'event.health_wrist_pain.a.result',
      },
      {
        textKey: 'event.health_wrist_pain.b',
        effects: { mechanics: -5, mental: -8 },
        nextTextKey: 'event.health_wrist_pain.b.result',
      },
      {
        textKey: 'event.health_wrist_pain.c',
        effects: { gameKnowledge: 8, mechanics: -3, savings: -5000 },
        nextTextKey: 'event.health_wrist_pain.c.result',
      },
    ],
  },

  {
    id: 'health_slump',
    category: 'health',
    titleKey: 'event.health_slump.title',
    descriptionKey: 'event.health_slump.desc',
    weight: 7,
    choices: [
      {
        textKey: 'event.health_slump.a',
        effects: { mental: -10, mechanics: -5, reputation: -5 },
        nextTextKey: 'event.health_slump.a.result',
      },
      {
        textKey: 'event.health_slump.b',
        effects: { mental: 8, mechanics: 3 },
        nextTextKey: 'event.health_slump.b.result',
      },
      {
        textKey: 'event.health_slump.c',
        effects: { mental: 12, gameKnowledge: 5, mechanics: 2, savings: -8000 },
        nextTextKey: 'event.health_slump.c.result',
      },
    ],
  },

  {
    id: 'health_burnout',
    category: 'health',
    titleKey: 'event.health_burnout.title',
    descriptionKey: 'event.health_burnout.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.health_burnout.a',
        effects: { mental: 15, mechanics: -3 },
        nextTextKey: 'event.health_burnout.a.result',
      },
      {
        textKey: 'event.health_burnout.b',
        effects: { mental: -12, mechanics: 3, reputation: -5 },
        nextTextKey: 'event.health_burnout.b.result',
      },
    ],
  },

  {
    id: 'health_diet_sleep',
    category: 'health',
    titleKey: 'event.health_diet_sleep.title',
    descriptionKey: 'event.health_diet_sleep.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.health_diet_sleep.a',
        effects: { mental: 8, mechanics: 4, savings: -6000 },
        nextTextKey: 'event.health_diet_sleep.a.result',
      },
      {
        textKey: 'event.health_diet_sleep.b',
        effects: { mental: -5, mechanics: 3 },
        nextTextKey: 'event.health_diet_sleep.b.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  INTERNATIONAL EVENTS
  // ══════════════════════════════════════════════════════

  {
    id: 'intl_culture_shock',
    category: 'international',
    titleKey: 'event.intl_culture_shock.title',
    descriptionKey: 'event.intl_culture_shock.desc',
    weight: 7,
    requiresInternational: true,
    choices: [
      {
        textKey: 'event.intl_culture_shock.a',
        effects: { adaptability: 10, communication: 5, mental: -3 },
        nextTextKey: 'event.intl_culture_shock.a.result',
      },
      {
        textKey: 'event.intl_culture_shock.b',
        effects: { mental: -8, communication: -3 },
        nextTextKey: 'event.intl_culture_shock.b.result',
      },
    ],
  },

  {
    id: 'intl_meet_legends',
    category: 'international',
    titleKey: 'event.intl_meet_legends.title',
    descriptionKey: 'event.intl_meet_legends.desc',
    weight: 6,
    requiresInternational: true,
    choices: [
      {
        textKey: 'event.intl_meet_legends.a',
        effects: { gameKnowledge: 8, mental: 5, reputation: 5 },
        nextTextKey: 'event.intl_meet_legends.a.result',
      },
      {
        textKey: 'event.intl_meet_legends.b',
        effects: { mental: 10, reputation: 3 },
        nextTextKey: 'event.intl_meet_legends.b.result',
      },
    ],
  },

  {
    id: 'intl_scrim_top_team',
    category: 'international',
    titleKey: 'event.intl_scrim_top_team.title',
    descriptionKey: 'event.intl_scrim_top_team.desc',
    weight: 7,
    requiresInternational: true,
    choices: [
      {
        textKey: 'event.intl_scrim_top_team.a',
        effects: { gameKnowledge: 10, mechanics: 5, mental: -3 },
        nextTextKey: 'event.intl_scrim_top_team.a.result',
      },
      {
        textKey: 'event.intl_scrim_top_team.b',
        effects: { mental: 5 },
        nextTextKey: 'event.intl_scrim_top_team.b.result',
      },
      {
        textKey: 'event.intl_scrim_top_team.c',
        effects: { mechanics: 8, reputation: 8, mental: -5, gameKnowledge: 5 },
        nextTextKey: 'event.intl_scrim_top_team.c.result',
        requiresStat: { stat: 'mechanics', min: 70 },
      },
    ],
  },

  {
    id: 'intl_worlds_pressure',
    category: 'international',
    titleKey: 'event.intl_worlds_pressure.title',
    descriptionKey: 'event.intl_worlds_pressure.desc',
    weight: 8,
    requiresInternational: true,
    choices: [
      {
        textKey: 'event.intl_worlds_pressure.a',
        effects: { mental: 10, mechanics: 5 },
        nextTextKey: 'event.intl_worlds_pressure.a.result',
      },
      {
        textKey: 'event.intl_worlds_pressure.b',
        effects: { gameKnowledge: 8, adaptability: 5 },
        nextTextKey: 'event.intl_worlds_pressure.b.result',
      },
      {
        textKey: 'event.intl_worlds_pressure.c',
        effects: { mental: -8, mechanics: -3 },
        nextTextKey: 'event.intl_worlds_pressure.c.result',
      },
    ],
  },

  {
    id: 'intl_draft_mistake',
    category: 'international',
    titleKey: 'event.intl_draft_mistake.title',
    descriptionKey: 'event.intl_draft_mistake.desc',
    weight: 6,
    requiresInternational: true,
    choices: [
      {
        textKey: 'event.intl_draft_mistake.a',
        effects: { adaptability: 10, mechanics: -3, mental: 3 },
        nextTextKey: 'event.intl_draft_mistake.a.result',
      },
      {
        textKey: 'event.intl_draft_mistake.b',
        effects: { reputation: 5, communication: 5, teamStrength: 5 },
        nextTextKey: 'event.intl_draft_mistake.b.result',
      },
      {
        textKey: 'event.intl_draft_mistake.c',
        effects: { mental: -10, mechanics: -5 },
        nextTextKey: 'event.intl_draft_mistake.c.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  MATCH SCENARIOS
  // ══════════════════════════════════════════════════════

  {
    id: 'match_0_2_deficit',
    category: 'match',
    titleKey: 'event.match_0_2_deficit.title',
    descriptionKey: 'event.match_0_2_deficit.desc',
    weight: 6,
    choices: [
      {
        textKey: 'event.match_0_2_deficit.a',
        effects: { mental: 12, mechanics: 5, reputation: 8 },
        nextTextKey: 'event.match_0_2_deficit.a.result',
      },
      {
        textKey: 'event.match_0_2_deficit.b',
        effects: { gameKnowledge: 8, teamStrength: 5 },
        nextTextKey: 'event.match_0_2_deficit.b.result',
      },
      {
        textKey: 'event.match_0_2_deficit.c',
        effects: { mental: -10, reputation: -8, teamStrength: -10 },
        nextTextKey: 'event.match_0_2_deficit.c.result',
      },
    ],
  },

  {
    id: 'match_face_number_one',
    category: 'match',
    titleKey: 'event.match_face_number_one.title',
    descriptionKey: 'event.match_face_number_one.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.match_face_number_one.a',
        effects: { mental: 8, mechanics: 3 },
        nextTextKey: 'event.match_face_number_one.a.result',
      },
      {
        textKey: 'event.match_face_number_one.b',
        effects: { gameKnowledge: 8, adaptability: 5 },
        nextTextKey: 'event.match_face_number_one.b.result',
      },
      {
        textKey: 'event.match_face_number_one.c',
        effects: { reputation: 15, mechanics: 5, mental: -5 },
        nextTextKey: 'event.match_face_number_one.c.result',
        requiresStat: { stat: 'mental', min: 65 },
      },
    ],
  },

  {
    id: 'match_upset_victory',
    category: 'match',
    titleKey: 'event.match_upset_victory.title',
    descriptionKey: 'event.match_upset_victory.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.match_upset_victory.a',
        effects: { reputation: 15, mental: 10, mechanics: 3 },
        nextTextKey: 'event.match_upset_victory.a.result',
      },
      {
        textKey: 'event.match_upset_victory.b',
        effects: { gameKnowledge: 10, reputation: 5 },
        nextTextKey: 'event.match_upset_victory.b.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  CAREER MILESTONES
  // ══════════════════════════════════════════════════════

  {
    id: 'career_first_playoffs',
    category: 'career',
    titleKey: 'event.career_first_playoffs.title',
    descriptionKey: 'event.career_first_playoffs.desc',
    weight: 5,
    choices: [
      {
        textKey: 'event.career_first_playoffs.a',
        effects: { mental: 10, reputation: 8, mechanics: 3 },
        nextTextKey: 'event.career_first_playoffs.a.result',
      },
      {
        textKey: 'event.career_first_playoffs.b',
        effects: { gameKnowledge: 10, communication: 5 },
        nextTextKey: 'event.career_first_playoffs.b.result',
      },
    ],
  },

  {
    id: 'career_region_transfer',
    category: 'career',
    titleKey: 'event.career_region_transfer.title',
    descriptionKey: 'event.career_region_transfer.desc',
    weight: 4,
    minReputation: 60,
    choices: [
      {
        textKey: 'event.career_region_transfer.a',
        effects: { reputation: 5, salary: 50000, adaptability: 8, communication: -5, mental: -5 },
        nextTextKey: 'event.career_region_transfer.a.result',
      },
      {
        textKey: 'event.career_region_transfer.b',
        effects: { reputation: 8, mental: 5, teamStrength: 5 },
        nextTextKey: 'event.career_region_transfer.b.result',
      },
    ],
  },

  {
    id: 'career_veteran_advice',
    category: 'career',
    titleKey: 'event.career_veteran_advice.title',
    descriptionKey: 'event.career_veteran_advice.desc',
    weight: 5,
    minAge: 24,
    choices: [
      {
        textKey: 'event.career_veteran_advice.a',
        effects: { gameKnowledge: 12, communication: 8, mechanics: -3 },
        nextTextKey: 'event.career_veteran_advice.a.result',
      },
      {
        textKey: 'event.career_veteran_advice.b',
        effects: { mechanics: 8, mental: 5 },
        nextTextKey: 'event.career_veteran_advice.b.result',
      },
    ],
  },

  {
    id: 'career_retirement_thoughts',
    category: 'career',
    titleKey: 'event.career_retirement_thoughts.title',
    descriptionKey: 'event.career_retirement_thoughts.desc',
    weight: 5,
    minAge: 27,
    choices: [
      {
        textKey: 'event.career_retirement_thoughts.a',
        effects: { mental: 8, reputation: 5 },
        nextTextKey: 'event.career_retirement_thoughts.a.result',
      },
      {
        textKey: 'event.career_retirement_thoughts.b',
        effects: { mechanics: 5, mental: -5 },
        nextTextKey: 'event.career_retirement_thoughts.b.result',
      },
    ],
  },

  {
    id: 'career_off_role_scrims',
    category: 'career',
    titleKey: 'event.career_off_role_scrims.title',
    descriptionKey: 'event.career_off_role_scrims.desc',
    weight: 5,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.career_off_role_scrims.a',
        effects: { gameKnowledge: 10, adaptability: 8, mechanics: -5 },
        nextTextKey: 'event.career_off_role_scrims.a.result',
      },
      {
        textKey: 'event.career_off_role_scrims.b',
        effects: { mechanics: 8 },
        nextTextKey: 'event.career_off_role_scrims.b.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  PRODIGY & AMATEUR SOLOQ (AGE 14-17 / FREE AGENTS)
  // ══════════════════════════════════════════════════════

  {
    id: 'prodigy_parents_ultimatum',
    category: 'prodigy',
    titleKey: 'event.prodigy_parents.title',
    descriptionKey: 'event.prodigy_parents.desc',
    weight: 12,
    requiresFreeAgent: true,
    maxAge: 17,
    choices: [
      {
        textKey: 'event.prodigy_parents.a',
        effects: { mechanics: 8, mental: -5, savings: -50 },
        nextTextKey: 'event.prodigy_parents.a.result',
      },
      {
        textKey: 'event.prodigy_parents.b',
        effects: { mental: 8, gameKnowledge: 4, mechanics: -4 },
        nextTextKey: 'event.prodigy_parents.b.result',
      },
    ],
  },

  {
    id: 'prodigy_local_lan_clash',
    category: 'prodigy',
    titleKey: 'event.prodigy_lan.title',
    descriptionKey: 'event.prodigy_lan.desc',
    weight: 10,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_lan.a',
        effects: { reputation: 8, savings: 350, mechanics: 5 },
        nextTextKey: 'event.prodigy_lan.a.result',
      },
      {
        textKey: 'event.prodigy_lan.b',
        effects: { gameKnowledge: 6, mental: 4 },
        nextTextKey: 'event.prodigy_lan.b.result',
      },
    ],
  },

  {
    id: 'prodigy_stream_highlight_viral',
    category: 'prodigy',
    titleKey: 'event.prodigy_viral.title',
    descriptionKey: 'event.prodigy_viral.desc',
    weight: 9,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_viral.a',
        effects: { reputation: 12, savings: 400 },
        nextTextKey: 'event.prodigy_viral.a.result',
      },
      {
        textKey: 'event.prodigy_viral.b',
        effects: { mechanics: 6, reputation: 5 },
        nextTextKey: 'event.prodigy_viral.b.result',
      },
    ],
  },

  {
    id: 'prodigy_discord_academy_inquiry',
    category: 'prodigy',
    titleKey: 'event.prodigy_scout.title',
    descriptionKey: 'event.prodigy_scout.desc',
    weight: 8,
    minAge: 15,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_scout.a',
        effects: { reputation: 10, gameKnowledge: 6 },
        nextTextKey: 'event.prodigy_scout.a.result',
      },
      {
        textKey: 'event.prodigy_scout.b',
        effects: { mental: 6, mechanics: 6 },
        nextTextKey: 'event.prodigy_scout.b.result',
      },
    ],
  },

  {
    id: 'prodigy_internet_lag_rage',
    category: 'prodigy',
    titleKey: 'event.prodigy_lag.title',
    descriptionKey: 'event.prodigy_lag.desc',
    weight: 10,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_lag.a',
        effects: { savings: -120, mental: 4 },
        nextTextKey: 'event.prodigy_lag.a.result',
      },
      {
        textKey: 'event.prodigy_lag.b',
        effects: { gameKnowledge: 8, mental: -4 },
        nextTextKey: 'event.prodigy_lag.b.result',
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  EXPANDED DYNAMIC EVENTS (SOLOQ, PRO STAGE, STREAM, DRAMA)
  // ══════════════════════════════════════════════════════

  {
    id: 'soloq_faker_matchup',
    category: 'soloq',
    titleKey: 'event.soloq_faker.title',
    descriptionKey: 'event.soloq_faker.desc',
    weight: 8,
    minReputation: 25,
    choices: [
      {
        textKey: 'event.soloq_faker.a',
        effects: { mechanics: 10, reputation: 12, mental: 6 },
        nextTextKey: 'event.soloq_faker.a.result',
      },
      {
        textKey: 'event.soloq_faker.b',
        effects: { gameKnowledge: 10, mental: 4, reputation: 6 },
        nextTextKey: 'event.soloq_faker.b.result',
      },
    ],
  },

  {
    id: 'soloq_broken_mouse_tilt',
    category: 'soloq',
    titleKey: 'event.soloq_tilt.title',
    descriptionKey: 'event.soloq_tilt.desc',
    weight: 8,
    choices: [
      {
        textKey: 'event.soloq_tilt.a',
        effects: { savings: -150, mental: 6, mechanics: 4 },
        nextTextKey: 'event.soloq_tilt.a.result',
      },
      {
        textKey: 'event.soloq_tilt.b',
        effects: { mental: -8, gameKnowledge: 6 },
        nextTextKey: 'event.soloq_tilt.b.result',
      },
    ],
  },

  {
    id: 'prodigy_t1_scout_kr',
    category: 'prodigy',
    titleKey: 'event.prodigy_t1.title',
    descriptionKey: 'event.prodigy_t1.desc',
    weight: 6,
    minReputation: 40,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_t1.a',
        effects: { mechanics: 12, gameKnowledge: 10, savings: -1200, reputation: 15 },
        nextTextKey: 'event.prodigy_t1.a.result',
      },
      {
        textKey: 'event.prodigy_t1.b',
        effects: { reputation: 8, mental: 6 },
        nextTextKey: 'event.prodigy_t1.b.result',
      },
    ],
  },

  {
    id: 'prodigy_smurf_duo_girl',
    category: 'prodigy',
    titleKey: 'event.prodigy_duo.title',
    descriptionKey: 'event.prodigy_duo.desc',
    weight: 8,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_duo.a',
        effects: { mental: 8, mechanics: 4, gameKnowledge: -3 },
        nextTextKey: 'event.prodigy_duo.a.result',
      },
      {
        textKey: 'event.prodigy_duo.b',
        effects: { mechanics: 6, mental: -4 },
        nextTextKey: 'event.prodigy_duo.b.result',
      },
    ],
  },

  {
    id: 'prodigy_shady_manager',
    category: 'contract',
    titleKey: 'event.prodigy_shady.title',
    descriptionKey: 'event.prodigy_shady.desc',
    weight: 7,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_shady.a',
        effects: { savings: 800, reputation: -10, mental: -6 },
        nextTextKey: 'event.prodigy_shady.a.result',
      },
      {
        textKey: 'event.prodigy_shady.b',
        effects: { mental: 6, reputation: 8, gameKnowledge: 6 },
        nextTextKey: 'event.prodigy_shady.b.result',
      },
    ],
  },

  {
    id: 'team_toxic_adc_ragequit',
    category: 'team_dynamics',
    titleKey: 'event.team_toxic_adc.title',
    descriptionKey: 'event.team_toxic_adc.desc',
    weight: 8,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_toxic_adc.a',
        effects: { communication: 10, mental: 6, coachTrust: 15 },
        nextTextKey: 'event.team_toxic_adc.a.result',
      },
      {
        textKey: 'event.team_toxic_adc.b',
        effects: { mental: -6, teamStrength: -5, coachTrust: -10 },
        nextTextKey: 'event.team_toxic_adc.b.result',
      },
    ],
  },

  {
    id: 'team_coach_pocket_dispute',
    category: 'team_dynamics',
    titleKey: 'event.team_pocket.title',
    descriptionKey: 'event.team_pocket.desc',
    weight: 8,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_pocket.a',
        effects: { mechanics: 8, reputation: 10, coachTrust: -10 },
        nextTextKey: 'event.team_pocket.a.result',
      },
      {
        textKey: 'event.team_pocket.b',
        effects: { communication: 8, gameKnowledge: 8, coachTrust: 20 },
        nextTextKey: 'event.team_pocket.b.result',
      },
    ],
  },

  {
    id: 'team_bootcamp_seoul',
    category: 'training',
    titleKey: 'event.team_seoul.title',
    descriptionKey: 'event.team_seoul.desc',
    weight: 7,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_seoul.a',
        effects: { mechanics: 14, gameKnowledge: 12, mental: -8, teamStrength: 8 },
        nextTextKey: 'event.team_seoul.a.result',
      },
      {
        textKey: 'event.team_seoul.b',
        effects: { mental: 8, communication: 10, teamStrength: 4 },
        nextTextKey: 'event.team_seoul.b.result',
      },
    ],
  },

  {
    id: 'team_energy_drink_commercial',
    category: 'social',
    titleKey: 'event.team_ad.title',
    descriptionKey: 'event.team_ad.desc',
    weight: 7,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_ad.a',
        effects: { savings: 2500, reputation: 10, mental: -4 },
        nextTextKey: 'event.team_ad.a.result',
      },
      {
        textKey: 'event.team_ad.b',
        effects: { mechanics: 6, mental: 4 },
        nextTextKey: 'event.team_ad.b.result',
      },
    ],
  },

  {
    id: 'team_stage_jitters_panic',
    category: 'match',
    titleKey: 'event.team_jitters.title',
    descriptionKey: 'event.team_jitters.desc',
    weight: 8,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_jitters.a',
        effects: { mental: 12, communication: 8, reputation: 8 },
        nextTextKey: 'event.team_jitters.a.result',
      },
      {
        textKey: 'event.team_jitters.b',
        effects: { mechanics: 8, mental: -5 },
        nextTextKey: 'event.team_jitters.b.result',
      },
    ],
  },

  {
    id: 'team_riot_allchat_fine',
    category: 'career',
    titleKey: 'event.team_fine.title',
    descriptionKey: 'event.team_fine.desc',
    weight: 7,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_fine.a',
        effects: { savings: -1500, reputation: 12, coachTrust: -10 },
        nextTextKey: 'event.team_fine.a.result',
      },
      {
        textKey: 'event.team_fine.b',
        effects: { savings: -1500, coachTrust: 10, reputation: -4 },
        nextTextKey: 'event.team_fine.b.result',
      },
    ],
  },

  {
    id: 'team_sub_opportunity_fast',
    category: 'career',
    titleKey: 'event.team_sub_chance.title',
    descriptionKey: 'event.team_sub_chance.desc',
    weight: 8,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_sub_chance.a',
        effects: { reputation: 15, mechanics: 8, coachTrust: 25 },
        nextTextKey: 'event.team_sub_chance.a.result',
      },
      {
        textKey: 'event.team_sub_chance.b',
        effects: { mental: 8, coachTrust: -10 },
        nextTextKey: 'event.team_sub_chance.b.result',
      },
    ],
  },

  {
    id: 'team_nightclub_scandal',
    category: 'social',
    titleKey: 'event.team_club.title',
    descriptionKey: 'event.team_club.desc',
    weight: 6,
    requiresTeam: true,
    choices: [
      {
        textKey: 'event.team_club.a',
        effects: { reputation: -8, coachTrust: -20, mental: -6 },
        nextTextKey: 'event.team_club.a.result',
      },
      {
        textKey: 'event.team_club.b',
        effects: { reputation: 6, coachTrust: 10, savings: -500 },
        nextTextKey: 'event.team_club.b.result',
      },
    ],
  },

  {
    id: 'stream_ibai_megaraid',
    category: 'social',
    titleKey: 'event.stream_raid.title',
    descriptionKey: 'event.stream_raid.desc',
    weight: 7,
    choices: [
      {
        textKey: 'event.stream_raid.a',
        effects: { savings: 1800, reputation: 14, mechanics: 6 },
        nextTextKey: 'event.stream_raid.a.result',
      },
      {
        textKey: 'event.stream_raid.b',
        effects: { reputation: 8, mental: 6 },
        nextTextKey: 'event.stream_raid.b.result',
      },
    ],
  },

  {
    id: 'stream_subathon_exhaustion',
    category: 'social',
    titleKey: 'event.stream_subathon.title',
    descriptionKey: 'event.stream_subathon.desc',
    weight: 6,
    choices: [
      {
        textKey: 'event.stream_subathon.a',
        effects: { savings: 3500, reputation: 12, mental: -12, energy: -40 },
        nextTextKey: 'event.stream_subathon.a.result',
      },
      {
        textKey: 'event.stream_subathon.b',
        effects: { mental: 8, energy: 20 },
        nextTextKey: 'event.stream_subathon.b.result',
      },
    ],
  },

  {
    id: 'stream_ddos_extortion',
    category: 'social',
    titleKey: 'event.stream_ddos.title',
    descriptionKey: 'event.stream_ddos.desc',
    weight: 6,
    choices: [
      {
        textKey: 'event.stream_ddos.a',
        effects: { savings: -600, mental: 8, gameKnowledge: 4 },
        nextTextKey: 'event.stream_ddos.a.result',
      },
      {
        textKey: 'event.stream_ddos.b',
        effects: { mental: -10, lp: -25 },
        nextTextKey: 'event.stream_ddos.b.result',
      },
    ],
  },

  {
    id: 'social_podcast_interview',
    category: 'social',
    titleKey: 'event.social_podcast_interview.title',
    descriptionKey: 'event.social_podcast_interview.desc',
    weight: 7,
    minReputation: 30,
    choices: [
      {
        textKey: 'event.social_podcast_interview.a',
        effects: { reputation: 15, mental: 4, coachTrust: -5 },
        nextTextKey: 'event.social_podcast_interview.a.result',
      },
      {
        textKey: 'event.social_podcast_interview.b',
        effects: { reputation: 10, coachTrust: 15, communication: 6 },
        nextTextKey: 'event.social_podcast_interview.b.result',
      },
    ],
  },

  {
    id: 'social_hater_meme_viral',
    category: 'social',
    titleKey: 'event.social_meme.title',
    descriptionKey: 'event.social_meme.desc',
    weight: 7,
    choices: [
      {
        textKey: 'event.social_meme.a',
        effects: { mental: 10, reputation: 10, mechanics: 6 },
        nextTextKey: 'event.social_meme.a.result',
      },
      {
        textKey: 'event.social_meme.b',
        effects: { mental: -8, mechanics: 8 },
        nextTextKey: 'event.social_meme.b.result',
      },
    ],
  },

  {
    id: 'contract_lpl_megadeal',
    category: 'contract',
    titleKey: 'event.contract_lpl.title',
    descriptionKey: 'event.contract_lpl.desc',
    weight: 5,
    minReputation: 60,
    choices: [
      {
        textKey: 'event.contract_lpl.a',
        effects: { savings: 25000, adaptability: 12, reputation: 15 },
        nextTextKey: 'event.contract_lpl.a.result',
      },
      {
        textKey: 'event.contract_lpl.b',
        effects: { reputation: 10, coachTrust: 20, mental: 6 },
        nextTextKey: 'event.contract_lpl.b.result',
      },
    ],
  },

  {
    id: 'intl_korean_food_spice',
    category: 'international',
    titleKey: 'event.intl_spice.title',
    descriptionKey: 'event.intl_spice.desc',
    weight: 7,
    requiresInternational: true,
    choices: [
      {
        textKey: 'event.intl_spice.a',
        effects: { mental: -8, energy: -30 },
        nextTextKey: 'event.intl_spice.a.result',
      },
      {
        textKey: 'event.intl_spice.b',
        effects: { mental: 6, mechanics: 6 },
        nextTextKey: 'event.intl_spice.b.result',
      },
    ],
  },

  {
    id: 'intl_faker_nod_respect',
    category: 'international',
    titleKey: 'event.intl_faker_nod.title',
    descriptionKey: 'event.intl_faker_nod.desc',
    weight: 6,
    requiresInternational: true,
    choices: [
      {
        textKey: 'event.intl_faker_nod.a',
        effects: { mental: 15, reputation: 20, mechanics: 10 },
        nextTextKey: 'event.intl_faker_nod.a.result',
      },
      {
        textKey: 'event.intl_faker_nod.b',
        effects: { gameKnowledge: 14, mental: 10 },
        nextTextKey: 'event.intl_faker_nod.b.result',
      },
    ],
  },

  {
    id: 'career_burnout_warning',
    category: 'health',
    titleKey: 'event.career_burnout.title',
    descriptionKey: 'event.career_burnout.desc',
    weight: 7,
    choices: [
      {
        textKey: 'event.career_burnout.a',
        effects: { mental: 15, energy: 30, mechanics: -4 },
        nextTextKey: 'event.career_burnout.a.result',
      },
      {
        textKey: 'event.career_burnout.b',
        effects: { mechanics: 8, mental: -12, energy: -25 },
        nextTextKey: 'event.career_burnout.b.result',
      },
    ],
  },
  {
    id: 'prodigy_school_exam',
    category: 'prodigy',
    titleKey: 'event.prodigy_school_exam.title',
    descriptionKey: 'event.prodigy_school_exam.desc',
    weight: 12,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_school_exam.a',
        effects: { mental: 8, gameKnowledge: 6, mechanics: -2 },
        nextTextKey: 'event.prodigy_school_exam.a.result',
      },
      {
        textKey: 'event.prodigy_school_exam.b',
        effects: { mechanics: 8, mental: -4 },
        nextTextKey: 'event.prodigy_school_exam.b.result',
      },
    ],
  },

  {
    id: 'prodigy_broken_mouse',
    category: 'prodigy',
    titleKey: 'event.prodigy_broken_mouse.title',
    descriptionKey: 'event.prodigy_broken_mouse.desc',
    weight: 10,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_broken_mouse.a',
        effects: { mechanics: 6, adaptability: 8 },
        nextTextKey: 'event.prodigy_broken_mouse.a.result',
      },
      {
        textKey: 'event.prodigy_broken_mouse.b',
        effects: { mechanics: 8, savings: -80 },
        nextTextKey: 'event.prodigy_broken_mouse.b.result',
      },
    ],
  },

  {
    id: 'prodigy_inhouse_invite',
    category: 'prodigy',
    titleKey: 'event.prodigy_inhouse_invite.title',
    descriptionKey: 'event.prodigy_inhouse_invite.desc',
    weight: 11,
    minReputation: 20,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_inhouse_invite.a',
        effects: { reputation: 12, gameKnowledge: 8, mechanics: 6 },
        nextTextKey: 'event.prodigy_inhouse_invite.a.result',
      },
      {
        textKey: 'event.prodigy_inhouse_invite.b',
        effects: { reputation: 8, savings: 300 },
        nextTextKey: 'event.prodigy_inhouse_invite.b.result',
      },
    ],
  },

  {
    id: 'prodigy_energy_drink_offer',
    category: 'prodigy',
    titleKey: 'event.prodigy_energy_drink_offer.title',
    descriptionKey: 'event.prodigy_energy_drink_offer.desc',
    weight: 9,
    minReputation: 25,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_energy_drink_offer.a',
        effects: { savings: 350, reputation: 5 },
        nextTextKey: 'event.prodigy_energy_drink_offer.a.result',
      },
      {
        textKey: 'event.prodigy_energy_drink_offer.b',
        effects: { reputation: 8, mental: 4 },
        nextTextKey: 'event.prodigy_energy_drink_offer.b.result',
      },
    ],
  },

  {
    id: 'prodigy_ex_pro_coaching',
    category: 'prodigy',
    titleKey: 'event.prodigy_ex_pro_coaching.title',
    descriptionKey: 'event.prodigy_ex_pro_coaching.desc',
    weight: 10,
    minReputation: 30,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_ex_pro_coaching.a',
        effects: { gameKnowledge: 14, adaptability: 8 },
        nextTextKey: 'event.prodigy_ex_pro_coaching.a.result',
      },
      {
        textKey: 'event.prodigy_ex_pro_coaching.b',
        effects: { mechanics: 10, reputation: 6 },
        nextTextKey: 'event.prodigy_ex_pro_coaching.b.result',
      },
    ],
  },

  {
    id: 'prodigy_birthday_16',
    category: 'prodigy',
    titleKey: 'event.prodigy_birthday_16.title',
    descriptionKey: 'event.prodigy_birthday_16.desc',
    weight: 8,
    minAge: 16,
    maxAge: 16,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_birthday_16.a',
        effects: { mechanics: 8, mental: 6 },
        nextTextKey: 'event.prodigy_birthday_16.a.result',
      },
      {
        textKey: 'event.prodigy_birthday_16.b',
        effects: { mental: 12, energy: 20 },
        nextTextKey: 'event.prodigy_birthday_16.b.result',
      },
    ],
  },

  {
    id: 'prodigy_rank1_race',
    category: 'prodigy',
    titleKey: 'event.prodigy_rank1_race.title',
    descriptionKey: 'event.prodigy_rank1_race.desc',
    weight: 9,
    minReputation: 40,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_rank1_race.a',
        effects: { mechanics: 12, reputation: 18, mental: -6 },
        nextTextKey: 'event.prodigy_rank1_race.a.result',
      },
      {
        textKey: 'event.prodigy_rank1_race.b',
        effects: { gameKnowledge: 10, mental: 8, reputation: 10 },
        nextTextKey: 'event.prodigy_rank1_race.b.result',
      },
    ],
  },

  {
    id: 'prodigy_twitch_host',
    category: 'prodigy',
    titleKey: 'event.prodigy_twitch_host.title',
    descriptionKey: 'event.prodigy_twitch_host.desc',
    weight: 9,
    minReputation: 20,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.prodigy_twitch_host.a',
        effects: { reputation: 15, savings: 450 },
        nextTextKey: 'event.prodigy_twitch_host.a.result',
      },
      {
        textKey: 'event.prodigy_twitch_host.b',
        effects: { mental: 10, mechanics: 6 },
        nextTextKey: 'event.prodigy_twitch_host.b.result',
      },
    ],
  },

  // 10+ New SoloQ & Prodigy Events
  {
    id: 'soloq_onetrick_ban',
    category: 'soloq',
    titleKey: 'event.soloq_onetrick_ban.title',
    descriptionKey: 'event.soloq_onetrick_ban.desc',
    weight: 10,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_onetrick_ban.a',
        effects: { adaptability: 10, mechanics: 6 },
        nextTextKey: 'event.soloq_onetrick_ban.a.result',
      },
      {
        textKey: 'event.soloq_onetrick_ban.b',
        effects: { gameKnowledge: 8, mental: 6 },
        nextTextKey: 'event.soloq_onetrick_ban.b.result',
      },
    ],
  },

  {
    id: 'soloq_stream_sniper',
    category: 'soloq',
    titleKey: 'event.soloq_stream_sniper.title',
    descriptionKey: 'event.soloq_stream_sniper.desc',
    weight: 9,
    minReputation: 25,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_stream_sniper.a',
        effects: { gameKnowledge: 10, adaptability: 8 },
        nextTextKey: 'event.soloq_stream_sniper.a.result',
      },
      {
        textKey: 'event.soloq_stream_sniper.b',
        effects: { reputation: 14, savings: 350, mechanics: 4 },
        nextTextKey: 'event.soloq_stream_sniper.b.result',
      },
    ],
  },

  {
    id: 'soloq_open_mid_rage',
    category: 'soloq',
    titleKey: 'event.soloq_open_mid_rage.title',
    descriptionKey: 'event.soloq_open_mid_rage.desc',
    weight: 11,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_open_mid_rage.a',
        effects: { communication: 12, mental: 8, mechanics: 4 },
        nextTextKey: 'event.soloq_open_mid_rage.a.result',
      },
      {
        textKey: 'event.soloq_open_mid_rage.b',
        effects: { mechanics: 8, adaptability: 8 },
        nextTextKey: 'event.soloq_open_mid_rage.b.result',
      },
    ],
  },

  {
    id: 'soloq_baron_smite_god',
    category: 'soloq',
    titleKey: 'event.soloq_baron_smite_god.title',
    descriptionKey: 'event.soloq_baron_smite_god.desc',
    weight: 8,
    minReputation: 30,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_baron_smite_god.a',
        effects: { mechanics: 14, reputation: 12, mental: 6 },
        nextTextKey: 'event.soloq_baron_smite_god.a.result',
      },
      {
        textKey: 'event.soloq_baron_smite_god.b',
        effects: { gameKnowledge: 10, mental: 8 },
        nextTextKey: 'event.soloq_baron_smite_god.b.result',
      },
    ],
  },

  {
    id: 'soloq_tilt_queue_3am',
    category: 'soloq',
    titleKey: 'event.soloq_tilt_queue_3am.title',
    descriptionKey: 'event.soloq_tilt_queue_3am.desc',
    weight: 10,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_tilt_queue_3am.a',
        effects: { mental: 14, energy: 30, mechanics: -2 },
        nextTextKey: 'event.soloq_tilt_queue_3am.a.result',
      },
      {
        textKey: 'event.soloq_tilt_queue_3am.b',
        effects: { mechanics: 8, mental: -10, energy: -25 },
        nextTextKey: 'event.soloq_tilt_queue_3am.b.result',
      },
    ],
  },

  {
    id: 'soloq_pro_duo_offer',
    category: 'soloq',
    titleKey: 'event.soloq_pro_duo_offer.title',
    descriptionKey: 'event.soloq_pro_duo_offer.desc',
    weight: 8,
    minReputation: 35,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_pro_duo_offer.a',
        effects: { reputation: 16, communication: 10, mechanics: 6 },
        nextTextKey: 'event.soloq_pro_duo_offer.a.result',
      },
      {
        textKey: 'event.soloq_pro_duo_offer.b',
        effects: { mental: 10, mechanics: 8 },
        nextTextKey: 'event.soloq_pro_duo_offer.b.result',
      },
    ],
  },

  {
    id: 'soloq_hardware_boost',
    category: 'soloq',
    titleKey: 'event.soloq_hardware_boost.title',
    descriptionKey: 'event.soloq_hardware_boost.desc',
    weight: 7,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_hardware_boost.a',
        effects: { mechanics: 10, gameKnowledge: 6, savings: -350 },
        nextTextKey: 'event.soloq_hardware_boost.a.result',
      },
      {
        textKey: 'event.soloq_hardware_boost.b',
        effects: { mechanics: 8, adaptability: 6, savings: -350 },
        nextTextKey: 'event.soloq_hardware_boost.b.result',
      },
    ],
  },

  {
    id: 'soloq_mental_breakthrough',
    category: 'soloq',
    titleKey: 'event.soloq_mental_breakthrough.title',
    descriptionKey: 'event.soloq_mental_breakthrough.desc',
    weight: 8,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_mental_breakthrough.a',
        effects: { mechanics: 10, reputation: 12, mental: 8 },
        nextTextKey: 'event.soloq_mental_breakthrough.a.result',
      },
      {
        textKey: 'event.soloq_mental_breakthrough.b',
        effects: { mental: 16, adaptability: 8 },
        nextTextKey: 'event.soloq_mental_breakthrough.b.result',
      },
    ],
  },

  {
    id: 'soloq_smurf_clash',
    category: 'soloq',
    titleKey: 'event.soloq_smurf_clash.title',
    descriptionKey: 'event.soloq_smurf_clash.desc',
    weight: 9,
    minReputation: 30,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_smurf_clash.a',
        effects: { mechanics: 12, reputation: 14 },
        nextTextKey: 'event.soloq_smurf_clash.a.result',
      },
      {
        textKey: 'event.soloq_smurf_clash.b',
        effects: { gameKnowledge: 14, adaptability: 8 },
        nextTextKey: 'event.soloq_smurf_clash.b.result',
      },
    ],
  },

  {
    id: 'soloq_gatekeeper',
    category: 'soloq',
    titleKey: 'event.soloq_gatekeeper.title',
    descriptionKey: 'event.soloq_gatekeeper.desc',
    weight: 8,
    minReputation: 45,
    requiresFreeAgent: true,
    choices: [
      {
        textKey: 'event.soloq_gatekeeper.a',
        effects: { mechanics: 14, reputation: 20 },
        nextTextKey: 'event.soloq_gatekeeper.a.result',
      },
      {
        textKey: 'event.soloq_gatekeeper.b',
        effects: { gameKnowledge: 12, mental: 10, reputation: 14 },
        nextTextKey: 'event.soloq_gatekeeper.b.result',
      },
    ],
  },

  // 10+ New Pro Team Events
  {
    id: 'team_korean_import',
    category: 'team_dynamics',
    titleKey: 'event.team_korean_import.title',
    descriptionKey: 'event.team_korean_import.desc',
    weight: 8,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_korean_import.a',
        effects: { communication: 14, gameKnowledge: 6 },
        nextTextKey: 'event.team_korean_import.a.result',
      },
      {
        textKey: 'event.team_korean_import.b',
        effects: { mental: 10, communication: 8 },
        nextTextKey: 'event.team_korean_import.b.result',
      },
    ],
  },

  {
    id: 'team_patch_meta_collapse',
    category: 'team_dynamics',
    titleKey: 'event.team_patch_meta_collapse.title',
    descriptionKey: 'event.team_patch_meta_collapse.desc',
    weight: 9,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_patch_meta_collapse.a',
        effects: { adaptability: 16, mechanics: 6, mental: -4 },
        nextTextKey: 'event.team_patch_meta_collapse.a.result',
      },
      {
        textKey: 'event.team_patch_meta_collapse.b',
        effects: { communication: 10, mental: 8 },
        nextTextKey: 'event.team_patch_meta_collapse.b.result',
      },
    ],
  },

  {
    id: 'team_rivalry_trashtalk',
    category: 'team_dynamics',
    titleKey: 'event.team_rivalry_trashtalk.title',
    descriptionKey: 'event.team_rivalry_trashtalk.desc',
    weight: 8,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_rivalry_trashtalk.a',
        effects: { reputation: 18, mental: -4 },
        nextTextKey: 'event.team_rivalry_trashtalk.a.result',
      },
      {
        textKey: 'event.team_rivalry_trashtalk.b',
        effects: { mental: 10, reputation: 8 },
        nextTextKey: 'event.team_rivalry_trashtalk.b.result',
      },
    ],
  },

  {
    id: 'team_substitute_pressure',
    category: 'team_dynamics',
    titleKey: 'event.team_substitute_pressure.title',
    descriptionKey: 'event.team_substitute_pressure.desc',
    weight: 9,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_substitute_pressure.a',
        effects: { mechanics: 12, mental: 6 },
        nextTextKey: 'event.team_substitute_pressure.a.result',
      },
      {
        textKey: 'event.team_substitute_pressure.b',
        effects: { communication: 10, gameKnowledge: 8 },
        nextTextKey: 'event.team_substitute_pressure.b.result',
      },
    ],
  },

  {
    id: 'team_shotcalling_crisis',
    category: 'team_dynamics',
    titleKey: 'event.team_shotcalling_crisis.title',
    descriptionKey: 'event.team_shotcalling_crisis.desc',
    weight: 8,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_shotcalling_crisis.a',
        effects: { gameKnowledge: 14, communication: 12 },
        nextTextKey: 'event.team_shotcalling_crisis.a.result',
      },
      {
        textKey: 'event.team_shotcalling_crisis.b',
        effects: { communication: 14, adaptability: 8 },
        nextTextKey: 'event.team_shotcalling_crisis.b.result',
      },
    ],
  },

  {
    id: 'team_gaming_house_chef',
    category: 'team_dynamics',
    titleKey: 'event.team_gaming_house_chef.title',
    descriptionKey: 'event.team_gaming_house_chef.desc',
    weight: 7,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_gaming_house_chef.a',
        effects: { energy: 30, mechanics: 6 },
        nextTextKey: 'event.team_gaming_house_chef.a.result',
      },
      {
        textKey: 'event.team_gaming_house_chef.b',
        effects: { mental: 14, communication: 8 },
        nextTextKey: 'event.team_gaming_house_chef.b.result',
      },
    ],
  },

  {
    id: 'team_fan_meet',
    category: 'team_dynamics',
    titleKey: 'event.team_fan_meet.title',
    descriptionKey: 'event.team_fan_meet.desc',
    weight: 8,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_fan_meet.a',
        effects: { reputation: 18, savings: 600, energy: -20 },
        nextTextKey: 'event.team_fan_meet.a.result',
      },
      {
        textKey: 'event.team_fan_meet.b',
        effects: { mental: 10, reputation: 6 },
        nextTextKey: 'event.team_fan_meet.b.result',
      },
    ],
  },

  {
    id: 'team_contract_bonus',
    category: 'contract',
    titleKey: 'event.team_contract_bonus.title',
    descriptionKey: 'event.team_contract_bonus.desc',
    weight: 7,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_contract_bonus.a',
        effects: { mechanics: 10, reputation: 14, savings: 15000 },
        nextTextKey: 'event.team_contract_bonus.a.result',
      },
      {
        textKey: 'event.team_contract_bonus.b',
        effects: { communication: 12, savings: 15000 },
        nextTextKey: 'event.team_contract_bonus.b.result',
      },
    ],
  },

  {
    id: 'team_analyst_secret_draft',
    category: 'team_dynamics',
    titleKey: 'event.team_analyst_secret_draft.title',
    descriptionKey: 'event.team_analyst_secret_draft.desc',
    weight: 8,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_analyst_secret_draft.a',
        effects: { gameKnowledge: 14, adaptability: 10 },
        nextTextKey: 'event.team_analyst_secret_draft.a.result',
      },
      {
        textKey: 'event.team_analyst_secret_draft.b',
        effects: { reputation: 16, mechanics: 8 },
        nextTextKey: 'event.team_analyst_secret_draft.b.result',
      },
    ],
  },

  {
    id: 'team_equipment_malfunction',
    category: 'match',
    titleKey: 'event.team_equipment_malfunction.title',
    descriptionKey: 'event.team_equipment_malfunction.desc',
    weight: 8,
    requiresTeam: true,
    minAge: 17,
    choices: [
      {
        textKey: 'event.team_equipment_malfunction.a',
        effects: { mechanics: 14, adaptability: 12, mental: 8 },
        nextTextKey: 'event.team_equipment_malfunction.a.result',
      },
      {
        textKey: 'event.team_equipment_malfunction.b',
        effects: { mental: 10, communication: 8 },
        nextTextKey: 'event.team_equipment_malfunction.b.result',
      },
    ],
  },
];

// Clean dual-pool event router based strictly on team contract status
export function getWeeklyEvent(
  career: { age: number; reputation: number; inInternational: boolean; hasTeam?: boolean; currentTeam?: any },
  usedEventIds: string[],
  seed?: number
): GameEvent {
  const isFreeAgent = career.hasTeam === false || career.hasTeam === undefined || career.currentTeam === null;
  const isProdigy = career.age < 17 || isFreeAgent;

  const TEAM_CATEGORIES = ['team_dynamics', 'contract', 'match'];
  const TEAM_ONLY_IDS = new Set([
    'training_vod_review',
    'training_vod_coach',
    'training_scrim_analysis',
    'training_scrim_review',
    'training_soloq_grind',
    'training_korea_bootcamp',
    'meta_new_op_champ',
    'meta_shift_playstyle',
    'team_shotcaller_role',
    'team_rookie_mentor',
    'team_toxic_adc',
    'team_jungler_flame',
    'team_synergy_breakthrough',
    'team_gaming_house_drama',
    'team_role_swap_demand',
    'team_coach_conflict',
    'team_sponsor_event',
    'team_new_analyst',
    'team_bench_rivalry',
    'team_seoul',
    'team_pocket',
    'team_ad',
    'team_starter_threat',
    'health_wrist_pain',
    'health_slump',
    'intl_scrim_top_team',
    'match_0_2_deficit',
    'match_regular_derby',
    'match_playoff_game5',
    'match_subbed_out',
    'match_carry_performance',
    'career_off_role_scrims',
    'social_stream_flame',
    'contract_extension',
    'contract_renegotiation',
    'contract_buyout_clause',
    'contract_rival_offer',
    'contract_streamer_clause',
    'contract_bench_threat',
    'contract_salary_delay',
  ]);

  const PRODIGY_CATEGORIES = new Set(['prodigy', 'soloq', 'social', 'health']);

  const available = EVENTS.filter(e => {
    if (usedEventIds.includes(e.id)) return false;
    if (e.minAge !== undefined && career.age < e.minAge) return false;
    if (e.maxAge !== undefined && career.age > e.maxAge) return false;
    if (e.minReputation !== undefined && career.reputation < e.minReputation) return false;
    if (e.maxReputation !== undefined && career.reputation > e.maxReputation) return false;
    if (e.requiresInternational && !career.inInternational) return false;
    
    // 1. When player is NOT in a pro team (Free Agent / Prodigy):
    if (isFreeAgent) {
      if (e.requiresTeam) return false;
      if (TEAM_CATEGORIES.includes(e.category)) return false;
      if (TEAM_ONLY_IDS.has(e.id)) return false;
      if (!PRODIGY_CATEGORIES.has(e.category) && e.category !== 'training') return false;
    }

    // 2. When player IS in a pro team (Signed Contract):
    if (!isFreeAgent) {
      if (e.requiresFreeAgent) return false;
      if (e.category === 'prodigy') return false;
    }

    return true;
  });

  if (available.length === 0) {
    const prodigyFallbacks = EVENTS.filter(e => isFreeAgent
      ? (e.category === 'prodigy' || e.category === 'soloq')
      : (e.category === 'team_dynamics' || e.requiresTeam));
    return prodigyFallbacks.length > 0
      ? prodigyFallbacks[Math.floor(Math.random() * prodigyFallbacks.length)]
      : EVENTS[0];
  }

  // Weighted random selection
  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  let rand = (seed !== undefined ? seededRand(seed) : Math.random()) * totalWeight;

  for (const event of available) {
    rand -= event.weight;
    if (rand <= 0) return event;
  }

  return available[available.length - 1];
}

function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}
