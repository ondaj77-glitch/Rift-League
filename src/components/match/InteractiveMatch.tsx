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

type TacticalKeystone = 'conqueror' | 'fleet' | 'first_strike';

const KEYSTONES: Array<{
  id: TacticalKeystone;
  icon: string;
  nameCs: string;
  nameEn: string;
  descCs: string;
  descEn: string;
  statBonus: 'mechanics' | 'gameKnowledge' | 'communication';
}> = [
  {
    id: 'conqueror',
    icon: '⚡',
    nameCs: 'Dobyvatel (Conqueror All-In)',
    nameEn: 'Conqueror (Aggressive All-In)',
    descCs: '+8 Mechanika v duelech · +5% výhoda z all-in akcí',
    descEn: '+8 Mechanics in trades · +5% bonus on all-in moves',
    statBonus: 'mechanics',
  },
  {
    id: 'fleet',
    icon: '🛡️',
    nameCs: 'Hbité Nohy (Fleet Scaling & Wave)',
    nameEn: 'Fleet Footwork (Wave & Sustain)',
    descCs: '+8 Znalost Hry · Menší penalizace při chybách',
    descEn: '+8 Game Knowledge · Reduced penalties on failed checks',
    statBonus: 'gameKnowledge',
  },
  {
    id: 'first_strike',
    icon: '🚀',
    nameCs: 'První Úder (First Strike & Roam)',
    nameEn: 'First Strike (Roam & Tempo)',
    descCs: '+8 Komunikace · +$150 Extra bounty gold při výhře',
    descEn: '+8 Communication · +$150 extra bounty cash on win',
    statBonus: 'communication',
  },
];

const CHAT_COMMENTS_WIN = [
  'POGGERS WHAT A PLAY 🔥🔥',
  'FAKER IS THAT YOU?! 👑',
  'SHEESH 200 YEARS OF GAME DESIGN',
  'CLEAN FLASH CC COMBO! ⚡',
  'SMITE GOD IN THE CHAT',
  'THIS DUDE IS SMURFING IN SOLOQ',
  'LET HIM COOK 👨‍🍳🔥',
  'W GAMEPLAY EZ WIN',
];

const CHAT_COMMENTS_LOSS = [
  'NA FLASH OMEGALUL 💀',
  'REPORT JUNGLE PLEASE',
  'FF 15 WE GO NEXT 😭',
  'MY EYES WHAT WAS THAT MISCLICK',
  'UNLUCKY COINFLIP LMAO',
  'HE GOT GREEDY FOR THE CANNON',
];

export function InteractiveMatch() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const interactiveMatch = useGameStore(s => s.interactiveMatch);
  const finishInteractiveMatch = useGameStore(s => s.finishInteractiveMatch);

  const [selectedChamp, setSelectedChamp] = useState<string>(career?.championPool?.[0] || 'Aatrox');
  const [selectedKeystone, setSelectedKeystone] = useState<TacticalKeystone>('conqueror');
  const [step, setStep] = useState<'champion_select' | 'laning' | 'mid_game' | 'late_game' | 'summary'>('champion_select');
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  
  // Single unified 0-100% Tug-of-War momentum (Player vs Opponent always equals 100%)
  const [momentum, setMomentum] = useState(50);
  const [logs, setLogs] = useState<Array<{ phase: string; text: string; success: boolean; scoreDelta: number }>>([]);
  const [liveChat, setLiveChat] = useState<Array<{ user: string; text: string; isHot?: boolean }>>([
    { user: 'RiftWatcher_99', text: 'Game is starting! GL HF' },
    { user: 'FakerFan', text: 'Lock in that carry pick 🔥' },
  ]);
  const [resolving, setResolving] = useState(false);

  // Dynamic presentation mode: switches dynamically or via user toggle
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');

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

  // Dynamic role-specific 5v5 map scenarios generated per match
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
    const keystoneBonus = selectedKeystone === 'conqueror' ? 3 : 0;
    setMomentum(Math.max(35, Math.min(65, 50 + matchup.scoreBonus + keystoneBonus)));
    setStep('laning');
    setSelectedChoiceIdx(null);
  }

  function handleConfirmTacticalChoice() {
    if (selectedChoiceIdx === null || !activeScenario) return;
    const choice = activeScenario.choices[selectedChoiceIdx];
    setResolving(true);

    const stats = career?.stats || { mechanics: 50, gameKnowledge: 50, communication: 50, mental: 50, adaptability: 50, reputation: 20 };
    const baseStatVal = stats[choice.statKey] ?? 50;
    const keystoneObj = KEYSTONES.find(k => k.id === selectedKeystone);
    const keystoneBonus = keystoneObj?.statBonus === choice.statKey ? 8 : 0;
    const statVal = baseStatVal + keystoneBonus;

    const champTier = currentPatch.tiers[selectedChamp]?.tier || 'A';
    const tierBonus = champTier === 'S+' ? 6 : champTier === 'S' ? 4 : champTier === 'A' ? 2 : champTier === 'B' ? 0 : -4;
    const mastery = career?.masteries?.[selectedChamp]?.masteryLevel || 1;
    const masteryBonus = Math.min(7, mastery) * 1.5;

    // Check synergy with champion playstyle
    const isSynergy = choice.synergyRequired && currentChampObj.playstyle.toLowerCase().includes(choice.synergyRequired.toLowerCase());
    const synergyBonus = isSynergy ? 6 : 0;

    // Matchup modifier (+6 to -6)
    const matchupBonus = matchup.scoreBonus > 0 ? 6 : matchup.scoreBonus < 0 ? -6 : 0;

    // Tactical Check DC adjusted by Rank Tier Elo Requirement
    const eloPenalty = Math.max(-5, Math.min(18, Math.floor((eloInfo.targetStat - eloInfo.playerAvg) * 0.4)));
    const finalDC = choice.difficulty + eloPenalty;

    // Roll with balanced variance
    const roll = statVal + tierBonus + masteryBonus + synergyBonus + matchupBonus + (Math.random() * 20 - 10);
    const success = roll >= finalDC;
    const scoreDelta = success ? choice.scoreGain : choice.scoreLoss;

    // Shift unified 0-100% momentum
    const shift = success ? Math.round(choice.scoreGain * 0.5) : Math.round(choice.scoreLoss * 0.5);
    const newMomentum = Math.max(8, Math.min(92, momentum + shift));

    // Simulated Chat Reaction
    const chatPool = success ? CHAT_COMMENTS_WIN : CHAT_COMMENTS_LOSS;
    const randomComment = chatPool[Math.floor(Math.random() * chatPool.length)];
    const randomUser = `Viewer_${Math.floor(100 + Math.random() * 900)}`;

    setTimeout(() => {
      setMomentum(newMomentum);
      setLiveChat(prev => [...prev.slice(-3), { user: randomUser, text: randomComment, isHot: success }]);
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
      <div className="w-full max-w-2xl space-y-4">

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
                <span className="text-cyan-400 font-bold">{Math.round(momentum)}% {isCs ? 'Výhoda (BLUE)' : 'Advantage'}</span>
                <span className="text-red-400 font-bold">{100 - Math.round(momentum)}% {isCs ? 'Výhoda (RED)' : 'Advantage'}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* STEP 1: CHAMPION DRAFT & KEYSTONE SELECTION */}
        {step === 'champion_select' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Card className="p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  {isCs ? 'Fáze Draftu: Vyber Championa & Taktickou Runu' : 'Draft Phase: Pick Champion & Tactical Keystone'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isCs
                    ? `Soupeř na lince locknul ${enemyChamp.name}. Vyber ze svého poolu šampióna a zvol herní taktiku.`
                    : `Opponent locked ${enemyChamp.name}. Select best champion counter and match intent.`}
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
                        <p className="text-[10px] text-slate-400">{adv.advantageBadge}</p>
                        <p className="text-[9px] text-purple-300 font-mono">Mastery Lvl {mastery}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Keystone / Tactical Intent Selector */}
              <div className="space-y-2 pt-2 border-t border-rift-border">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isCs ? 'Zvol Taktickou Runu / Styl Hry:' : 'Choose Tactical Keystone:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {KEYSTONES.map(keystone => {
                    const isSelected = selectedKeystone === keystone.id;
                    return (
                      <button
                        key={keystone.id}
                        onClick={() => setSelectedKeystone(keystone.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gold-950/40 border-gold-500 ring-1 ring-gold-500/50 shadow-md'
                            : 'bg-rift-surface hover:bg-slate-800 border-rift-border'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{keystone.icon}</span>
                          <span className="text-xs font-bold text-white">{isCs ? keystone.nameCs : keystone.nameEn}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{isCs ? keystone.descCs : keystone.descEn}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button variant="gold" size="lg" fullWidth onClick={handleConfirmChamp}>
                ⚔️ {isCs ? 'Potvrdit Pick & Zahájit Zápas' : 'Lock In & Start Match'}
              </Button>
            </Card>
          </motion.div>
        )}

        {/* STEP 2, 3, 4: LANING, MID-GAME, LATE-GAME (5v5 TACTICAL MAP BOARD) */}
        {(step === 'laning' || step === 'mid_game' || step === 'late_game') && activeScenario && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
            {viewMode === 'map' ? (
              <TacticalMapBoard
                playerChampId={selectedChamp}
                enemyChampId={enemyChamp.id}
                playerRole={career.role || 'top'}
                scenario={activeScenario}
                onSelectChoice={(idx) => setSelectedChoiceIdx(idx)}
                selectedChoiceIdx={selectedChoiceIdx}
                resolving={resolving}
                lang={language}
              />
            ) : (
              /* CARD VIEW FALLBACK */
              <Card className="p-5 space-y-4">
                <h3 className="text-base font-bold text-white uppercase font-heading">{isCs ? activeScenario.titleCs : activeScenario.titleEn}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{isCs ? activeScenario.contextCs : activeScenario.contextEn}</p>
                <div className="space-y-2">
                  {activeScenario.choices.map((choice, idx) => (
                    <button
                      key={choice.id}
                      onClick={() => setSelectedChoiceIdx(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                        selectedChoiceIdx === idx ? 'bg-gold-950/40 border-gold-400 ring-2 ring-gold-500/40' : 'bg-rift-surface border-rift-border'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block">{isCs ? choice.titleCs : choice.titleEn}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{isCs ? choice.descCs : choice.descEn}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Simulated Live Twitch Chat / Crowd Reaction Bar */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono flex items-center gap-2 overflow-hidden shadow-inner">
              <span className="text-purple-400 font-bold flex-shrink-0">💬 Twitch Chat:</span>
              <div className="flex gap-3 overflow-x-auto scrollbar-none whitespace-nowrap text-slate-300">
                {liveChat.map((c, i) => (
                  <span key={i} className={c.isHot ? 'text-amber-300 font-bold' : ''}>
                    <strong className="text-slate-400">{c.user}:</strong> {c.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Confirm Decision Action Button */}
            <Button
              variant="gold"
              size="lg"
              fullWidth
              disabled={selectedChoiceIdx === null || resolving}
              onClick={handleConfirmTacticalChoice}
            >
              {resolving ? '⚡ Vyhodnocuji kombo...' : '⚡ Potvrdit Taktické Rozhodnutí'}
            </Button>
          </motion.div>
        )}

        {/* STEP 5: MATCH SUMMARY & REWARDS */}
        {step === 'summary' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <Card className={`p-6 text-center space-y-4 border ${
              isWon ? 'border-green-600/60 bg-green-950/20 shadow-2xl shadow-green-950/50' : 'border-rose-600/60 bg-rose-950/20'
            }`}>
              <div className="text-6xl mb-2">{isWon ? '🏆' : '💀'}</div>
              <h2 className={`text-3xl font-black uppercase font-heading ${isWon ? 'text-green-400' : 'text-rose-400'}`}>
                {isWon ? (isCs ? 'VICTORY / VÍTĚZSTVÍ' : 'VICTORY') : (isCs ? 'DEFEAT / PORÁŽKA' : 'DEFEAT')}
              </h2>
              <p className="text-xs text-slate-300">
                {isWon
                  ? (isCs ? 'Výborné taktické rozhodování a mechanická exekuce v rozhodujících teamfightech!' : 'Exceptional tactical execution and clutch teamfighting!')
                  : (isCs ? 'Soupeř využil pozičních chyb v teamfightech a ukončil hru.' : 'Enemy exploited positioning mistakes to close out the match.')}
              </p>

              {/* Combat Log Summary */}
              <div className="space-y-2 pt-2 text-left">
                <span className="text-xs uppercase font-bold text-slate-400">Průběh klíčových momentů:</span>
                {logs.map((l, i) => (
                  <div key={i} className={`p-2.5 rounded-lg border text-xs ${
                    l.success ? 'bg-green-950/40 border-green-800 text-green-300' : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}>
                    <span className="font-bold font-mono mr-1">[{l.phase}]:</span>
                    <span>{l.text}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={isWon ? 'gold' : 'secondary'}
                size="lg"
                fullWidth
                onClick={() => finishInteractiveMatch(isWon, selectedChamp)}
              >
                {isCs ? 'Pokračovat do Kariéry →' : 'Continue to Career →'}
              </Button>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
}
