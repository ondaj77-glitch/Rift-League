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
  
  // Single unified 0-100% Tug-of-War momentum (Player vs Opponent always equals 100%)
  const [momentum, setMomentum] = useState(50);
  const [logs, setLogs] = useState<Array<{ phase: string; text: string; success: boolean; scoreDelta: number }>>([]);
  const [resolving, setResolving] = useState(false);

  // Dynamic presentation mode: switches dynamically or via user toggle
  const [viewMode, setViewMode] = useState<'map' | 'cards'>(() => (Math.random() < 0.5 ? 'map' : 'cards'));

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

  // Keep last match state in state so during AnimatePresence exit transitions it doesn't flash
  const [cachedMatch, setCachedMatch] = useState(interactiveMatch);
  if (interactiveMatch && interactiveMatch !== cachedMatch) {
    setCachedMatch(interactiveMatch);
  }

  const matchToRender = interactiveMatch || cachedMatch;

  if (!career || !matchToRender) {
    return null;
  }

  const activeScenario =
    step === 'laning' ? scenarios.laning :
    step === 'mid_game' ? scenarios.midGame :
    step === 'late_game' ? scenarios.lateGame : null;

  function handleConfirmChamp() {
    setMomentum(Math.max(35, Math.min(65, 50 + matchup.scoreBonus)));
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
    const tierBonus = champTier === 'S+' ? 6 : champTier === 'S' ? 4 : champTier === 'A' ? 2 : champTier === 'B' ? 0 : -4;
    const mastery = career?.masteries?.[selectedChamp]?.masteryLevel || 1;
    const masteryBonus = Math.min(6, mastery) * 1.5;

    // Check synergy with champion playstyle (rewarded moderately +6, not auto-win)
    const isSynergy = choice.synergyRequired && currentChampObj.playstyle.toLowerCase().includes(choice.synergyRequired.toLowerCase());
    const synergyBonus = isSynergy ? 6 : 0;

    // Matchup modifier (+6 to -6)
    const matchupBonus = matchup.scoreBonus > 0 ? 6 : matchup.scoreBonus < 0 ? -6 : 0;

    // Tactical Check DC adjusted by Rank Tier Elo Requirement (higher elo requires higher stats!)
    const eloPenalty = Math.max(-5, Math.min(18, Math.floor((eloInfo.targetStat - eloInfo.playerAvg) * 0.4)));
    const finalDC = choice.difficulty + eloPenalty;

    // Roll with balanced variance
    const roll = statVal + tierBonus + masteryBonus + synergyBonus + matchupBonus + (Math.random() * 20 - 10);
    const success = roll >= finalDC;
    const scoreDelta = success ? choice.scoreGain : choice.scoreLoss;

    // Shift unified 0-100% momentum
    const shift = success ? Math.round(choice.scoreGain * 0.5) : Math.round(choice.scoreLoss * 0.5);
    const newMomentum = Math.max(8, Math.min(92, momentum + shift));

    setTimeout(() => {
      setMomentum(newMomentum);
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

  const isWon = momentum >= 50;

  return (
    <div className="screen-bg min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-5">

        {/* Top Controls: Mode Switcher & Language */}
        <div className="flex justify-between items-center">
          {/* Mode Switcher */}
          {step !== 'champion_select' && step !== 'summary' ? (
            <div className="flex bg-slate-900/90 border border-slate-700 p-1 rounded-xl gap-1 text-xs">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'map' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🗺️ {isCs ? 'Minimapa' : 'Map View'}
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'cards' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🃏 {isCs ? 'Taktické Karty' : 'Card View'}
              </button>
            </div>
          ) : <div />}

          <LanguageSwitcher size="sm" />
        </div>

        {/* Match Header with Live Advantage Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 border-gold-600/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{career.gameName || career.playerName}</span>
                <span className="text-xs text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full font-semibold border border-purple-800">
                  {selectedChamp}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>{step.toUpperCase().replace('_', ' ')}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300 font-bold uppercase">{matchToRender.opponentTeam?.name || 'RED TEAM'}</span>
                <span className="w-2 h-2 rounded-full bg-red-500" />
              </div>
            </div>

            {/* Live Momentum / Advantage Bar (100% Balanced Tug-of-War) */}
            <div className="space-y-1">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 ease-out rounded-l-full"
                  style={{ width: `${momentum}%` }}
                />
                <div
                  className="bg-gradient-to-r from-amber-500 to-red-600 transition-all duration-500 ease-out rounded-r-full"
                  style={{ width: `${100 - momentum}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-cyan-400 font-bold">{Math.round(momentum)}% {isCs ? 'Výhoda' : 'Advantage'}</span>
                <span className="text-red-400 font-bold">{100 - Math.round(momentum)}% {isCs ? 'Výhoda' : 'Advantage'}</span>
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

        {/* STEP 2, 3, 4: MAP OR CARDS TACTICAL PHASES */}
        {(step === 'laning' || step === 'mid_game' || step === 'late_game') && activeScenario && (
          <motion.div key={step + viewMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="p-4 sm:p-5">
              
              {/* MODE 1: TACTICAL MAP BOARD */}
              {viewMode === 'map' ? (
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
              ) : (
                /* MODE 2: CLASSIC TACTICAL DECISION CARDS */
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 p-4 rounded-2xl border border-purple-500/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-purple-300 font-heading">
                        ⚡ {isCs ? activeScenario.titleCs : activeScenario.titleEn}
                      </span>
                      <span className="text-[11px] font-mono bg-purple-950 px-2 py-0.5 rounded text-purple-200 border border-purple-700">
                        {activeScenario.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {isCs ? activeScenario.contextCs : activeScenario.contextEn}
                    </p>
                  </div>

                  {/* Tactical Option Cards */}
                  <div className="space-y-2.5">
                    {activeScenario.choices.map((choice, i) => {
                      const isSelected = selectedChoiceIdx === i;
                      return (
                        <button
                          key={choice.id}
                          onClick={() => setSelectedChoiceIdx(i)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-purple-950/70 border-gold-400 ring-2 ring-gold-500/40 shadow-xl'
                              : 'bg-rift-surface hover:bg-slate-800/80 border-rift-border'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-xs text-white">
                              {isCs ? choice.tagCs : choice.tagEn}
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-gold-300 border border-slate-700">
                              {choice.statKey.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1">
                            {isCs ? choice.descCs : choice.descEn}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                    ? (isCs ? '⏳ Vyhodnocuji taktický souboj...' : '⏳ Resolving tactical play...')
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
                  onClick={() => finishInteractiveMatch(isWon, selectedChamp)}
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
