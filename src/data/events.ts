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
];

// Get a random set of events for a week, filtered by career state
export function getWeeklyEvent(
  career: { age: number; reputation: number; inInternational: boolean; hasTeam?: boolean },
  usedEventIds: string[],
  seed?: number
): GameEvent {
  const isFreeAgent = career.hasTeam === false;

  const available = EVENTS.filter(e => {
    if (usedEventIds.includes(e.id)) return false;
    if (e.minAge !== undefined && career.age < e.minAge) return false;
    if (e.maxAge !== undefined && career.age > e.maxAge) return false;
    if (e.minReputation !== undefined && career.reputation < e.minReputation) return false;
    if (e.maxReputation !== undefined && career.reputation > e.maxReputation) return false;
    if (e.requiresInternational && !career.inInternational) return false;
    if (e.requiresTeam && isFreeAgent) return false;
    if (e.requiresFreeAgent && !isFreeAgent) return false;
    return true;
  });

  if (available.length === 0) {
    return EVENTS.find(e => !e.requiresTeam) || EVENTS[0];
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
