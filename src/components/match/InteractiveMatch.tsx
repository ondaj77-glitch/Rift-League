import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ALL_CHAMPIONS, getChampionsByRole, getChampIconUrl } from '../../data/champions';
import { getMatchupAdvantage } from '../../data/matchups';
import { calculateEloDifficulty } from '../../data/ranks';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { TacticalMapBoard } from './TacticalMapBoard';
import { generateTacticalScenarios } from '../../data/mapScenarios';

export function InteractiveMatch() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const interactiveMatch = useGameStore(s => s.interactiveMatch);
  const finishInteractiveMatch = useGameStore(s => s.finishInteractiveMatch);

  const [selectedChamp, setSelectedChamp] = useState<string>(career?.championPool?.[0] || 'Aatrox');
  const [step, setStep] = useState<'champion_select' | 'laning' | 'mid_game' | 'late_game' | 'summary'>('champion_select');
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [playerScore, setPlayerScore] = useState(50);
  const [opponentScore, setOpponentScore] = useState(50);
  const [logs, setLogs] = useState<Array<{ phase: string; text: string; success: boolean; scoreDelta: number }>>([]);
  const [resolving, setResolving] = useState(false);

  const currentPatch = career?.currentPatch || { patchVersion: '15.1', season: 15, tiers: {} };
  const champPool = career?.championPool || [];
  const poolChamps = ALL_CHAMPIONS.filter(c => champPool.includes(c.id));
  const roleChamps = getChampionsByRole(career?.role || 'top');
  
  // Pick opponent champion for the lane from match state
  const enemyChampId = interactiveMatch?.enemyChampion || roleChamps.find(c => !champPool.includes(c.id))?.id || roleChamps[0].id;
  const enemyChamp = ALL_CHAMPIONS.find(c => c.id === enemyChampId) || roleChamps[0];

  const matchup = getMatchupAdvantage(selectedChamp, enemyChamp.id);
  const eloInfo = calculateEloDifficulty(career?.rank?.tier || 'BRONZE', career?.stats || { mechanics: 50, gameKnowledge: 50, communication: 50, mental: 50, adaptability: 50, reputation: 20 });
  const currentChampObj = ALL_CHAMPIONS.find(c => c.id === selectedChamp) || ALL_CHAMPIONS[0];

  // Dynamic 5v5 map scenarios generated per match (Hooks called unconditionally at top)
  const scenarios = useMemo(() => {
    return generateTacticalScenarios(selectedChamp, enemyChamp.id, career?.role || 'top');
  }, [selectedChamp, enemyChamp.id, career?.role]);

  if (!career || !interactiveMatch) {
    return (
      <div className="screen-bg min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 text-center space-y-4 max-w-sm border-gold-600/30">
          <p className="text-white font-bold">{isCs ? 'Zápas nebyl nalezen' : 'Match not found'}</p>
          <Button variant="primary" fullWidth onClick={() => useGameStore.getState().setPhase('CAREER_HUB')}>
            {isCs ? 'Kariérní Centrum' : 'Career Hub'}
          </Button>
        </Card>
      </div>
    );
  }

  const activeScenario =
    step === 'laning' ? scenarios.laning :
    step === 'mid_game' ? scenarios.midGame :
    step === 'late_game' ? scenarios.lateGame : null;

  function handleConfirmChamp() {
    setPlayerScore(Math.max(20, Math.min(80, 50 + matchup.scoreBonus)));
    setOpponentScore(50);
    setStep('laning');
    setSelectedChoiceIdx(null);
  }

  function handleConfirmTacticalChoice() {
    if (selectedChoiceIdx === null || !activeScenario) return;
    const choice = activeScenario.choices[selectedChoiceIdx];
    setResolving(true);

    const stats = career?.stats || { mechanics: 50, gameKnowledge: 50, communication: 50, mental: 50, adaptability: 50, reputation: 20 };
    const statVal = stats[choice.statKey] ?? 50;
    const champTier = currentPatch.tiers[selectedChamp]?.tier || 'A';
    const tierBonus = champTier === 'S+' ? 10 : champTier === 'S' ? 6 : champTier === 'A' ? 3 : champTier === 'B' ? 0 : -5;
    const mastery = career?.masteries?.[selectedChamp]?.masteryLevel || 1;
    const masteryBonus = mastery * 2;

    // Check synergy with champion playstyle
    const isSynergy = choice.synergyRequired && currentChampObj.playstyle.toLowerCase().includes(choice.synergyRequired.toLowerCase());
    const synergyBonus = isSynergy ? 18 : 0;

    // Matchup modifier
    const matchupBonus = matchup.scoreBonus > 0 ? 8 : matchup.scoreBonus < 0 ? -8 : 0;

    // Tactical Check DC adjusted by Champion Counter Matchup & Rank Tier Elo Requirement
    const eloPenalty = Math.max(-8, Math.min(15, Math.floor((eloInfo.targetStat - eloInfo.playerAvg) * 0.35)));
    const finalDC = choice.difficulty + eloPenalty;

    const totalScore = statVal + tierBonus + masteryBonus + synergyBonus + matchupBonus + (Math.random() * 24 - 12);
    const success = totalScore >= finalDC;
    const scoreDelta = success ? choice.scoreGain : choice.scoreLoss;

    const newPScore = Math.max(0, Math.min(100, playerScore + (success ? scoreDelta : 0)));
    const newOScore = Math.max(0, Math.min(100, opponentScore + (!success ? Math.abs(scoreDelta) : 0)));

    setTimeout(() => {
      setPlayerScore(newPScore);
      setOpponentScore(newOScore);
      setLogs(prev => [
        ...prev,
        {
          phase: step.toUpperCase().replace('_', ' '),
          text: isCs
            ? (success ? choice.winTextCs : choice.lossTextCs)
            : (success ? choice.winTextEn : choice.lossTextEn),
          success,
          scoreDelta,
        },
      ]);
      setResolving(false);
      setSelectedChoiceIdx(null);

      // Direct seamless flow from Laning ➔ Mid Game (Dragon) ➔ Late Game (Baron) ➔ Summary
      if (step === 'laning') setStep('mid_game');
      else if (step === 'mid_game') setStep('late_game');
      else if (step === 'late_game') setStep('summary');
    }, 600);
  }

  const isWon = playerScore >= opponentScore;

  return (
    <div className="screen-bg min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-5">

        {/* Language Switcher Bar */}
        <div className="flex justify-end">
          <LanguageSwitcher size="sm" />
        </div>

        {/* Match Header with Live Advantage Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 border-gold-600/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{career.summonerName}</span>
                <span className="text-xs text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full font-semibold border border-purple-800">
                  {selectedChamp}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>{step.toUpperCase().replace('_', ' ')}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300 font-bold uppercase">{interactiveMatch.opponentTeamName || 'ENEMY'}</span>
                <span className="w-2 h-2 rounded-full bg-red-500" />
              </div>
            </div>

            {/* Live Momentum / Advantage Bar */}
            <div className="space-y-1">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 ease-out rounded-l-full"
                  style={{ width: `${playerScore}%` }}
                />
                <div
                  className="bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-500 ease-out rounded-r-full"
                  style={{ width: `${100 - playerScore}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-cyan-400 font-bold">{playerScore}% {isCs ? 'Výhoda' : 'Advantage'}</span>
                <span className="text-red-400 font-bold">{opponentScore}% {isCs ? 'Výhoda' : 'Advantage'}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* STEP 1: CHAMPION DRAFT SELECTION */}
        {step === 'champion_select' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Card className="p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  {isCs ? 'Fáze Draftu: Vyber svého Championa' : 'Draft Phase: Pick Your Champion'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isCs
                    ? `Soupeř na lince locknul ${enemyChamp.name}. Vyber ze svého poolu šampióna s nejlepším match-upem.`
                    : `Opponent locked ${enemyChamp.name}. Select the best counter from your champion pool.`}
                </p>
              </div>

              {/* Enemy Pick Reveal */}
              <div className="flex items-center gap-3 bg-red-950/40 border border-red-800/60 p-3 rounded-xl">
                <img
                  src={getChampIconUrl(enemyChamp.id)}
                  alt={enemyChamp.name}
                  className="w-12 h-12 rounded-lg border-2 border-red-500 object-cover"
                />
                <div>
                  <span className="text-xs text-red-400 uppercase font-semibold">{isCs ? 'Soupeř v lajně' : 'Lane Opponent'}</span>
                  <p className="text-sm font-bold text-white">{enemyChamp.name}</p>
                  <p className="text-[11px] text-slate-400">{enemyChamp.title}</p>
                </div>
              </div>

              {/* User Champion Pool Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {poolChamps.map(champ => {
                  const isSelected = selectedChamp === champ.id;
                  const adv = getMatchupAdvantage(champ.id, enemyChamp.id);
                  const tier = currentPatch.tiers[champ.id]?.tier || 'A';
                  const mastery = career.masteries?.[champ.id]?.masteryLevel || 1;

                  return (
                    <button
                      key={champ.id}
                      onClick={() => setSelectedChamp(champ.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/50 shadow-lg'
                          : 'bg-rift-surface hover:bg-slate-800/70 border-rift-border'
                      }`}
                    >
                      <img
                        src={getChampIconUrl(champ.id)}
                        alt={champ.name}
                        className="w-10 h-10 rounded-lg border border-slate-600 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">{champ.name}</span>
                          <span className="text-[10px] font-mono font-bold text-gold-400">{tier}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400">M{mastery}</span>
                          {adv.scoreBonus > 0 && (
                            <span className="text-[10px] text-green-400 font-bold">+{adv.scoreBonus}% Counter</span>
                          )}
                          {adv.scoreBonus < 0 && (
                            <span className="text-[10px] text-red-400 font-bold">{adv.scoreBonus}% Disadv</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Confirm Lock-in Button */}
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={handleConfirmChamp}
              >
                🔒 {isCs ? `Zamknout ${selectedChamp} a Vstoupit do Zápasu` : `Lock in ${selectedChamp} & Enter Match`}
              </Button>
            </Card>
          </motion.div>
        )}

        {/* STEP 2, 3, 4: MAP TACTICAL PHASES */}
        {(step === 'laning' || step === 'mid_game' || step === 'late_game') && activeScenario && (
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="p-4 sm:p-5">
              <TacticalMapBoard
                playerChampId={selectedChamp}
                enemyChampId={enemyChamp.id}
                playerRole={career.role || 'top'}
                scenario={activeScenario}
                onSelectChoice={idx => setSelectedChoiceIdx(idx)}
                selectedChoiceIdx={selectedChoiceIdx}
                resolving={resolving}
                lang={language}
              />

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={selectedChoiceIdx === null || resolving}
                  onClick={handleConfirmTacticalChoice}
                >
                  {resolving
                    ? (isCs ? '⏳ Vyhodnocuji taktický souboj na mapě...' : '⏳ Resolving tactical play on map...')
                    : (isCs ? '⚡ Provést Taktický Tah' : '⚡ Execute Tactical Play')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* STEP 5: MATCH SUMMARY & RESULTS */}
        {step === 'summary' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Card className={`p-6 text-center border-2 ${
              isWon ? 'border-green-500/60 bg-green-950/20' : 'border-red-500/60 bg-red-950/20'
            }`}>
              <div className="text-5xl select-none mb-2">
                {isWon ? '🏆' : '💀'}
              </div>
              <h2 className={`text-3xl font-black uppercase font-heading ${isWon ? 'text-green-400' : 'text-red-400'}`}>
                {isWon ? (isCs ? 'VÍTĚZSTVÍ' : 'VICTORY') : (isCs ? 'PORÁŽKA' : 'DEFEAT')}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {isWon
                  ? (isCs ? 'Vynikající taktické vedení rozhodlo zápas ve váš prospěch!' : 'Outstanding tactical shotcalling secured the match!')
                  : (isCs ? 'Chyby v klíčových momentech vedly ke ztrátě Nexusu.' : 'Crucial tactical mistakes led to Nexus destruction.')}
              </p>

              {/* Combat Log Breakdown */}
              <div className="mt-5 text-left bg-rift-surface p-4 rounded-xl border border-rift-border space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  📜 {isCs ? 'Průběh Zápasu & Rozhodující Momenty' : 'Match Breakdown & Tactical Log'}
                </h4>
                <div className="space-y-2 text-xs">
                  {logs.map((l, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-200 border-b border-slate-800 pb-1.5 last:border-0">
                      <span className={l.success ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                        {l.success ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">{l.phase}</span>
                        <p>{l.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finish Match Button */}
              <div className="pt-5">
                <Button
                  variant={isWon ? 'gold' : 'primary'}
                  size="lg"
                  fullWidth
                  onClick={() => finishInteractiveMatch(isWon)}
                >
                  {isCs ? 'Ukončit Zápas a Zapsat Výsledek →' : 'Finish Match & Save Results →'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
}
