import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { getChampIconUrl, getChampSplashUrl } from '../../data/champions';
import type { ChampionData } from '../../data/champions';
import { ALL_CHAMPIONS } from '../../data/champions';
import type { TacticalChoice, MatchPhaseStep, StatKey } from '../../types/game';

const LANING_CHOICES: TacticalChoice[] = [
  {
    id: 'lane_aggressive',
    titleKey: 'match.lane_aggressive.title',
    descriptionKey: 'match.lane_aggressive.desc',
    statKey: 'mechanics',
    difficulty: 55,
    risk: 'High',
    successEffect: { scoreDelta: 25, textKey: 'match.lane_aggressive.win' },
    failEffect: { scoreDelta: -20, textKey: 'match.lane_aggressive.loss' },
  },
  {
    id: 'lane_freeze',
    titleKey: 'match.lane_freeze.title',
    descriptionKey: 'match.lane_freeze.desc',
    statKey: 'gameKnowledge',
    difficulty: 50,
    risk: 'Low',
    successEffect: { scoreDelta: 15, textKey: 'match.lane_freeze.win' },
    failEffect: { scoreDelta: -10, textKey: 'match.lane_freeze.loss' },
  },
  {
    id: 'lane_roam',
    titleKey: 'match.lane_roam.title',
    descriptionKey: 'match.lane_roam.desc',
    statKey: 'communication',
    difficulty: 52,
    risk: 'Medium',
    successEffect: { scoreDelta: 20, textKey: 'match.lane_roam.win' },
    failEffect: { scoreDelta: -15, textKey: 'match.lane_roam.loss' },
  },
];

const MID_CHOICES: TacticalChoice[] = [
  {
    id: 'mid_dragon_engage',
    titleKey: 'match.mid_dragon_engage.title',
    descriptionKey: 'match.mid_dragon_engage.desc',
    statKey: 'mechanics',
    difficulty: 60,
    risk: 'High',
    successEffect: { scoreDelta: 30, textKey: 'match.mid_dragon_engage.win' },
    failEffect: { scoreDelta: -25, textKey: 'match.mid_dragon_engage.loss' },
  },
  {
    id: 'mid_vision_trap',
    titleKey: 'match.mid_vision_trap.title',
    descriptionKey: 'match.mid_vision_trap.desc',
    statKey: 'gameKnowledge',
    difficulty: 55,
    risk: 'Medium',
    successEffect: { scoreDelta: 20, textKey: 'match.mid_vision_trap.win' },
    failEffect: { scoreDelta: -15, textKey: 'match.mid_vision_trap.loss' },
  },
  {
    id: 'mid_cross_map',
    titleKey: 'match.mid_cross_map.title',
    descriptionKey: 'match.mid_cross_map.desc',
    statKey: 'adaptability',
    difficulty: 52,
    risk: 'Low',
    successEffect: { scoreDelta: 15, textKey: 'match.mid_cross_map.win' },
    failEffect: { scoreDelta: -10, textKey: 'match.mid_cross_map.loss' },
  },
];

const LATE_CHOICES: TacticalChoice[] = [
  {
    id: 'late_flash_engage',
    titleKey: 'match.late_flash_engage.title',
    descriptionKey: 'match.late_flash_engage.desc',
    statKey: 'mechanics',
    difficulty: 65,
    risk: 'High',
    successEffect: { scoreDelta: 35, textKey: 'match.late_flash_engage.win' },
    failEffect: { scoreDelta: -30, textKey: 'match.late_flash_engage.loss' },
  },
  {
    id: 'late_front_to_back',
    titleKey: 'match.late_front_to_back.title',
    descriptionKey: 'match.late_front_to_back.desc',
    statKey: 'mental',
    difficulty: 58,
    risk: 'Medium',
    successEffect: { scoreDelta: 25, textKey: 'match.late_front_to_back.win' },
    failEffect: { scoreDelta: -18, textKey: 'match.late_front_to_back.loss' },
  },
  {
    id: 'late_baron_bait',
    titleKey: 'match.late_baron_bait.title',
    descriptionKey: 'match.late_baron_bait.desc',
    statKey: 'communication',
    difficulty: 60,
    risk: 'High',
    successEffect: { scoreDelta: 30, textKey: 'match.late_baron_bait.win' },
    failEffect: { scoreDelta: -25, textKey: 'match.late_baron_bait.loss' },
  },
];

export function InteractiveMatch() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const interactiveMatch = useGameStore(s => s.interactiveMatch);
  const finishInteractiveMatch = useGameStore(s => s.finishInteractiveMatch);

  const [selectedChamp, setSelectedChamp] = useState<string>(career?.championPool[0] || 'Aatrox');
  const [step, setStep] = useState<MatchPhaseStep>('champion_select');
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [playerScore, setPlayerScore] = useState(50);
  const [opponentScore, setOpponentScore] = useState(50);
  const [logs, setLogs] = useState<Array<{ phase: string; text: string; success: boolean; scoreDelta: number }>>([]);
  const [resolving, setResolving] = useState(false);

  if (!career || !interactiveMatch) return null;

  const currentPatch = career.currentPatch;
  const poolChamps = ALL_CHAMPIONS.filter(c => career.championPool.includes(c.id));

  // Determine current choices
  const currentChoices =
    step === 'laning' ? LANING_CHOICES :
    step === 'mid_game' ? MID_CHOICES :
    step === 'late_game' ? LATE_CHOICES : [];

  function handleConfirmChamp() {
    setStep('laning');
    setSelectedChoiceIdx(null);
  }

  function handleConfirmTacticalChoice() {
    if (selectedChoiceIdx === null) return;
    const choice = currentChoices[selectedChoiceIdx];
    setResolving(true);

    // Roll based on stat + champion mastery + meta tier
    const statVal = career!.stats[choice.statKey];
    const champTier = currentPatch.tiers[selectedChamp]?.tier || 'A';
    const tierBonus = champTier === 'S+' ? 12 : champTier === 'S' ? 8 : champTier === 'A' ? 4 : champTier === 'B' ? 0 : -6;
    const mastery = career!.masteries[selectedChamp]?.masteryLevel || 1;
    const masteryBonus = mastery * 2;

    const totalScore = statVal + tierBonus + masteryBonus + (Math.random() * 26 - 13);
    const success = totalScore >= choice.difficulty;
    const effect = success ? choice.successEffect : choice.failEffect;

    const newPScore = Math.max(0, Math.min(100, playerScore + (success ? effect.scoreDelta : 0)));
    const newOScore = Math.max(0, Math.min(100, opponentScore + (!success ? Math.abs(effect.scoreDelta) : 0)));

    setTimeout(() => {
      setPlayerScore(newPScore);
      setOpponentScore(newOScore);
      setLogs(prev => [
        ...prev,
        {
          phase: step.toUpperCase().replace('_', ' '),
          text: t(effect.textKey as any),
          success,
          scoreDelta: effect.scoreDelta,
        },
      ]);
      setResolving(false);
      setSelectedChoiceIdx(null);

      // Advance to next step
      if (step === 'laning') setStep('mid_game');
      else if (step === 'mid_game') setStep('late_game');
      else if (step === 'late_game') setStep('summary');
    }, 600);
  }

  const isWon = playerScore >= opponentScore;

  return (
    <div className="screen-bg min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-5">

        {/* Match Header with Live Advantage Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 border-gold-600/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{career.gameName}</span>
                <span className="text-xs text-rift-purple bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  {selectedChamp}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400">
                {step === 'champion_select' ? 'DRAFT PHASE' : step.toUpperCase().replace('_', ' ')}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200 text-sm">{interactiveMatch.opponentTeam.shortName}</span>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: interactiveMatch.opponentTeam.color }} />
              </div>
            </div>

            {/* Tug-of-war Advantage Bar */}
            {step !== 'champion_select' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span className="text-blue-400">{playerScore}% Advantage</span>
                  <span className="text-red-400">{opponentScore}% Advantage</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-rift-border">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                    animate={{ width: `${(playerScore / (playerScore + opponentScore)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="h-full bg-gradient-to-l from-red-600 to-orange-500"
                    animate={{ width: `${(opponentScore / (playerScore + opponentScore)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* STEP 1: CHAMPION SELECT */}
          {step === 'champion_select' && (
            <motion.div
              key="champ_select"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                  {t('match.select_champ_title')}
                </h2>
                <p className="text-xs text-slate-400">
                  {t('match.select_champ_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {poolChamps.map(champ => {
                  const meta = currentPatch.tiers[champ.id] || { tier: 'A', winRate: 50.0 };
                  const mastery = career.masteries[champ.id]?.masteryLevel || 1;
                  const isSelected = selectedChamp === champ.id;

                  return (
                    <motion.div
                      key={champ.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedChamp(champ.id)}
                      className={`relative overflow-hidden rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-gold-400 bg-gold-950/30 shadow-lg shadow-gold-500/20'
                          : 'border-rift-border bg-rift-card hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getChampIconUrl(champ.id)}
                          alt={champ.name}
                          className="w-12 h-12 rounded-lg border border-slate-700 object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">{champ.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-xs font-black px-1.5 py-0.2 rounded ${
                              meta.tier === 'S+' ? 'bg-amber-400 text-black font-extrabold' :
                              meta.tier === 'S' ? 'bg-purple-600 text-white' :
                              meta.tier === 'A' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {meta.tier}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {meta.winRate}% WR
                            </span>
                          </div>
                          <p className="text-[10px] text-gold-400 font-semibold mt-0.5">
                            Mastery M{mastery}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-gold-400 rounded-full flex items-center justify-center text-black font-bold text-xs">
                          ✓
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Confirm Champion Button */}
              <div className="pt-2">
                <Button variant="gold" size="lg" fullWidth onClick={handleConfirmChamp}>
                  ⚔️ {t('match.confirm_champion')}: {selectedChamp}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2, 3, 4: TACTICAL PHASES */}
          {(step === 'laning' || step === 'mid_game' || step === 'late_game') && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                    {step === 'laning' ? t('match.phase_laning') :
                     step === 'mid_game' ? t('match.phase_mid') : t('match.phase_late')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('match.select_tactical_action')}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-rift-card px-3 py-1.5 rounded-lg border border-rift-border">
                  <img src={getChampIconUrl(selectedChamp)} className="w-5 h-5 rounded" alt="" />
                  <span className="text-xs font-bold text-gold-400">{selectedChamp}</span>
                </div>
              </div>

              <div className="space-y-3">
                {currentChoices.map((choice, i) => {
                  const isSelected = selectedChoiceIdx === i;
                  const statValue = career.stats[choice.statKey];

                  return (
                    <motion.div
                      key={choice.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => !resolving && setSelectedChoiceIdx(i)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-rift-purple bg-purple-950/40 shadow-lg shadow-purple-900/30'
                          : 'border-rift-border bg-rift-card hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{t(choice.titleKey as any)}</p>
                          <p className="text-xs text-slate-300">{t(choice.descriptionKey as any)}</p>
                        </div>
                        {isSelected && <span className="text-rift-purple font-black text-base">✓</span>}
                      </div>

                      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-rift-border/60 text-xs">
                        <span className="text-slate-400 font-medium">
                          Tests: <strong className="text-slate-200">{t(`stat.${choice.statKey}` as any)} ({statValue})</strong>
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                          choice.risk === 'High' ? 'bg-red-950/70 text-red-400 border border-red-800' :
                          choice.risk === 'Medium' ? 'bg-yellow-950/70 text-yellow-400 border border-yellow-800' :
                          'bg-green-950/70 text-green-400 border border-green-800'
                        }`}>
                          {choice.risk} Risk
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Logs */}
              {logs.length > 0 && (
                <div className="bg-rift-surface rounded-lg p-3 border border-rift-border space-y-1 text-xs">
                  {logs.map((log, idx) => (
                    <p key={idx} className={log.success ? 'text-green-400' : 'text-red-400'}>
                      <strong>[{log.phase}]:</strong> {log.text}
                    </p>
                  ))}
                </div>
              )}

              {/* Confirm Decision Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={selectedChoiceIdx === null || resolving}
                  onClick={handleConfirmTacticalChoice}
                >
                  {resolving ? '⚔️ Executing Play...' : `⚡ ${t('match.confirm_decision')}`}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: MATCH SUMMARY */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center"
            >
              <div className={`p-6 rounded-2xl border ${
                isWon
                  ? 'bg-gradient-to-b from-green-950/50 to-rift-card border-green-700/50'
                  : 'bg-gradient-to-b from-red-950/40 to-rift-card border-red-800/40'
              }`}>
                <div className="text-6xl mb-2">{isWon ? '🏆' : '💀'}</div>
                <h2
                  className={`text-3xl font-black ${isWon ? 'text-green-400' : 'text-red-400'}`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {isWon ? t('match.victory_title') : t('match.defeat_title')}
                </h2>
                <p className="text-slate-300 text-sm mt-1 font-medium">
                  {isWon ? t('match.victory_desc') : t('match.defeat_desc')}
                </p>

                <div className="mt-4 pt-4 border-t border-rift-border grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Played Champion</span>
                    <p className="text-white font-bold">{selectedChamp}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Mastery EXP</span>
                    <p className="text-gold-400 font-bold">+250 PTS</p>
                  </div>
                </div>
              </div>

              {/* Combat Recap */}
              <Card className="p-4 text-left space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Match Breakdown</p>
                <div className="space-y-1 text-xs">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={log.success ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                        {log.success ? '✓' : '✗'}
                      </span>
                      <span className="text-slate-300">{log.text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={() => finishInteractiveMatch(isWon, selectedChamp)}
              >
                {t('match.continue_career')} →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
