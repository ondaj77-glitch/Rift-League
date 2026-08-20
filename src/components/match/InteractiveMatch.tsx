import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ALL_CHAMPIONS, getChampIconUrl, getChampionsByRole } from '../../data/champions';
import { getMatchupAdvantage } from '../../data/matchups';
import { calculateEloDifficulty } from '../../data/ranks';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { MinimapRadar } from './MinimapRadar';
import type { StatKey } from '../../types/game';

export interface RichTacticalChoice {
  id: string;
  tagCs: string;
  tagEn: string;
  titleCs: string;
  titleEn: string;
  descCs: string;
  descEn: string;
  statKey: StatKey;
  synergy?: string; // 'Aggressive' | 'Teamfight' | 'Splitpush' | 'Poke' | 'Drain Tank' | 'Assassin' | 'Tank'
  difficulty: number;
  risk: 'Low' | 'Medium' | 'High';
  successScore: number;
  failScore: number;
  successTextCs: string;
  successTextEn: string;
  failTextCs: string;
  failTextEn: string;
}

const LANING_SCENARIO = {
  titleCs: '⚔️ SITUACE NA LINCE: VLNA & LVL 2/3 SPIKE',
  titleEn: '⚔️ LANING SITUATION: WAVE STATE & LEVEL 2/3 SPIKE',
  descCs: 'Oponent dorazil na linku a chystá se last-hitovat 2. vlnu. Nepřátelský jungler začal na opačné straně mapy.',
  descEn: 'Opponent arrived in lane preparing to last-hit the 2nd wave. Enemy jungler started on the opposite side.',
};

const LANING_CHOICES: RichTacticalChoice[] = [
  {
    id: 'lane_allin',
    tagCs: '⚡ Mechanický All-in',
    tagEn: '⚡ Mechanical All-in',
    titleCs: 'Rychlý Push na Lvl 2 a Flash Ignite All-in',
    titleEn: 'Fast Lvl 2 Push & Flash Ignite All-in',
    descCs: 'Využij náskok úrovně a zaútoč plným kombem dřív, než oponent stihne ustoupit pod věž.',
    descEn: 'Exploit level advantage and dive with full combo before opponent retreats under turret.',
    statKey: 'mechanics',
    synergy: 'Aggressive',
    difficulty: 56,
    risk: 'High',
    successScore: 28,
    failScore: -22,
    successTextCs: '⚡ SOLO KILL! Získal jsi First Blood a kompletní kontrolu nad linkou (+28 Skóre).',
    successTextEn: '⚡ SOLO KILL! First Blood secured and total lane dominance (+28 Score).',
    failTextCs: '💀 Minul jsi klíčový skillshot, oponent přežil s 5 % HP a otočil duel (-22 Skóre).',
    failTextEn: '💀 Key skillshot missed, enemy survived with 5% HP and turned the trade (-22 Score).',
  },
  {
    id: 'lane_freeze',
    tagCs: '🧠 Dokonalý Freeze & Zónování',
    tagEn: '🧠 Wave Freeze & Zone Control',
    titleCs: 'Zmrazit vlnu před věží a zónovat oponenta z XP',
    titleEn: 'Freeze Wave before Tower & Zone from XP',
    descCs: 'Udržuj 3 nepřátelské kouzelníky na živu. Oponent musí riskovat gank nebo přijde o celou vlnu.',
    descEn: 'Keep 3 enemy casters alive. Opponent is forced to overextend or lose entire wave.',
    statKey: 'gameKnowledge',
    synergy: 'Scaling',
    difficulty: 48,
    risk: 'Low',
    successScore: 18,
    failScore: -10,
    successTextCs: '🎯 Mistrovský Freeze! Oponent ztratil 15 CS a je pod obřím psychickým tlakem (+18 Skóre).',
    successTextEn: '🎯 Flawless Freeze! Enemy starved of 15 CS and bleeding gold (+18 Score).',
    failTextCs: '⚠️ Vlna se nechtěně odrazila do soupeřovy věže a ztratil jsi tempo (-10 Skóre).',
    failTextEn: '⚠️ Wave accidentally bounced into enemy turret, lost lane tempo (-10 Score).',
  },
  {
    id: 'lane_fake_roam',
    tagCs: '🗡️ Mind Game Past v Křoví',
    tagEn: '🗡️ Mind Game Brush Trap',
    titleCs: 'Falešný odchod do řeky a přepad z nehlídaného křoví',
    titleEn: 'Fake River Roam & Ambush from Unwarded Bush',
    descCs: 'Předstírej rotaci na mid. Když soupeř začne bezstarostně pushovat, vyskoč ze zálohy.',
    descEn: 'Pretend roaming mid. When opponent steps up to fast shove, ambush with surprise burst.',
    statKey: 'mental',
    synergy: 'Assassin',
    difficulty: 52,
    risk: 'Medium',
    successScore: 22,
    failScore: -14,
    successTextCs: '💥 Překvapivý Ambush! Oponent spálil Flash a musel okamžitě dát Recall (+22 Skóre).',
    successTextEn: '💥 Surprise Ambush! Opponent burned Flash and forced to back (+22 Score).',
    failTextCs: '👀 Oponent měl v křoví wardu a tvůj přepad snadno odhalil (-14 Skóre).',
    failTextEn: '👀 Enemy had ward in brush and safely disengaged (-14 Score).',
  },
];

const MID_SCENARIO = {
  titleCs: '🐉 SITUACE V MID GAME: DRUHÝ DRAK & PRVNÍ VĚŽ',
  titleEn: '🐉 MID GAME SITUATION: 2ND DRAKE & TIER 1 TURRETS',
  descCs: 'Drak spawnul v řece a oba týmy rotují na vizi. Nepřátelské ADC pushuje boční linku.',
  descEn: 'Dragon spawned in river and both teams contesting vision. Enemy ADC pushing side lane.',
};

const MID_CHOICES: RichTacticalChoice[] = [
  {
    id: 'mid_teamfight_engage',
    tagCs: '🛡️ Týmový Front-to-Back Engage',
    tagEn: '🛡️ Front-to-Back Teamfight Engage',
    titleCs: '5v5 Týmový boj v Dračím Pitu přes CC řetězec',
    titleEn: '5v5 Dragon Pit Teamfight via CC Chain',
    descCs: 'Udržuj přední linii, zablokuj nepřátelské assassiny a umožni svým carry volně střílet.',
    descEn: 'Hold frontline, peel off enemy divers, and enable your carries to deal free damage.',
    statKey: 'communication',
    synergy: 'Teamfight',
    difficulty: 56,
    risk: 'Medium',
    successScore: 28,
    failScore: -20,
    successTextCs: '🏆 Vyhraný Teamfight! Získali jste Draka a 3 killy (+28 Skóre).',
    successTextEn: '🏆 Teamfight Won! Clean Ace, Dragon secured (+28 Score).',
    failTextCs: '💔 Nepřátelský Womboc-Combo prošel a váš tým ztratil Draka (-20 Skóre).',
    failTextEn: '💔 Enemy team landed huge AoE combo, dragon stolen (-20 Score).',
  },
  {
    id: 'mid_flank_assassinate',
    tagCs: '⚡ Hluboký Flank na Zadní Linii',
    tagEn: '⚡ Deep Flank onto Enemy Backline',
    titleCs: 'Obejít Dračí pit zezadu a vymazat nepřátelské ADC',
    titleEn: 'Flank Dragon Pit from Behind & Burst Enemy ADC',
    descCs: 'Projdi přes mlhu vize za záda soupeře a one-shotni klíčového carry hned v úvodu.',
    descEn: 'Sneak through fog of war behind enemy backline and delete their main carry instantly.',
    statKey: 'mechanics',
    synergy: 'Assassin',
    difficulty: 62,
    risk: 'High',
    successScore: 34,
    failScore: -26,
    successTextCs: '⚡ ONE-SHOT! Nepřátelské ADC padlo za 0.5s a zbytek týmu zpanikařil (+34 Skóre).',
    successTextEn: '⚡ ONE-SHOT! Enemy ADC deleted in 0.5s, fight completely broken (+34 Score).',
    failTextCs: '💀 Chytil tě nepřátelský support do Exhaustu a zemřel jsi bez killu (-26 Skóre).',
    failTextEn: '💀 Exhausted by enemy support, collapsed on and died (-26 Score).',
  },
  {
    id: 'mid_crossmap_split',
    tagCs: '🗺️ Cross-map Splitpush & Věž',
    tagEn: '🗺️ Cross-map Splitpush & Turret',
    titleCs: 'Využít chaosu na drakovi a zničit dvě věže na protější lince',
    titleEn: 'Cross-map Splitpush: Trade Drake for 2 Turrets',
    descCs: 'Tým zdrží draka na dálku pokem, zatímco ty prolomíš věže a získáš obří zlaťákový náskok.',
    descEn: 'Team stalls dragon while you crush two side lane turrets with huge gold bounty.',
    statKey: 'adaptability',
    synergy: 'Splitpush',
    difficulty: 50,
    risk: 'Low',
    successScore: 22,
    failScore: -12,
    successTextCs: '🏰 Obří Makro Tah! Zničil jsi 2 věže (+600G) a soupeř ztratil mapu (+22 Skóre).',
    successTextEn: '🏰 Macro Outplay! Crushed 2 towers, enemy map control destroyed (+22 Score).',
    failTextCs: '⚠️ Soupeř rychle zabil draka a stihl tě chytit na lince (-12 Skóre).',
    failTextEn: '⚠️ Enemy quickly finished dragon and collapsed on your lane (-12 Score).',
  },
];

const LATE_SCENARIO = {
  titleCs: '👑 ROZHODUJÍCÍ BITVA: BARON NASHOR & ELDER DRAK',
  titleEn: '👑 DECIDING CLUTCH: BARON NASHOR & ELDER DRAGON',
  descCs: '34. minuta zápasu. Jeden jediný teamfight rozhodne o vítězi celého zápasu!',
  descEn: 'Minute 34. A single clean teamfight will decide the entire match!',
};

const LATE_CHOICES: RichTacticalChoice[] = [
  {
    id: 'late_brush_trap',
    tagCs: '🧠 5-Man Death Brush Ambush',
    tagEn: '🧠 5-Man Death Brush Ambush',
    titleCs: 'Zhasnout vizi kolem Barona a počkat v Death Bushi',
    titleEn: 'Deny Baron Vision & Wait in Death Bush',
    descCs: 'Vyčistěte všechny wardy u Barona. Když soupeř půjde wardovat pit, okamžitě ho smažte.',
    descEn: 'Clear all Baron vision. When enemy facechecks to ward the pit, execute instant pick.',
    statKey: 'gameKnowledge',
    synergy: 'Teamfight',
    difficulty: 58,
    risk: 'Medium',
    successScore: 36,
    failScore: -28,
    successTextCs: '🎯 ACE! Soupeř facechecknul do 5 lidí, perfektní Ace a otevřený Nexus (+36 Skóre)!',
    successTextEn: '🎯 ACE! Enemy facechecked into 5 men, clean wipe and open Nexus (+36 Score)!',
    failTextCs: '👀 Soupeř hodil modrý trinket, odhalil vás a obklíčil v pasti (-28 Skóre).',
    failTextEn: '👀 Enemy used blue trinket, spotted the trap and counter-engaged (-28 Score).',
  },
  {
    id: 'late_heroic_clutch',
    tagCs: '🔥 Mechanický Clutch & Flash Smite',
    tagEn: '🔥 Mechanical Clutch & Flash Smite',
    titleCs: 'Flash přes stěnu, ukrást Barona a přežít přes Zhonyu',
    titleEn: 'Flash over Wall, Smite Steal Baron & Zhonya Stall',
    descCs: 'Skoč do středu pitu na 2000 HP Barona, tref Smite a aktivuj stopky, dokud nedorazí tým.',
    descEn: 'Flash into pit at 2k Baron HP, hit Smite steal and pop stopwatch until team arrives.',
    statKey: 'mechanics',
    synergy: 'Aggressive',
    difficulty: 64,
    risk: 'High',
    successScore: 42,
    failScore: -35,
    successTextCs: '👑 BARON UKRADEN! Neuvěřitelný mechanický steal roku a obrat zápasu (+42 Skóre)!',
    successTextEn: '👑 BARON STOLEN! Incredible clutch steal of the year, match turned (+42 Score)!',
    failTextCs: '💀 Minul jsi Smite o 50 HP, Baron padl soupeři a Nexus je ztracen (-35 Skóre).',
    failTextEn: '💀 Missed Smite by 50 HP, Baron secured by enemy (-35 Score).',
  },
  {
    id: 'late_peel_wall',
    tagCs: '🛡️ Ochrana Hlavního Carried',
    tagEn: '🛡️ Hypercarry Peel & Frontline Wall',
    titleCs: 'Absorbovat nepřátelské ultimátky a chránit své ADC',
    titleEn: 'Absorb Enemy Ults & Bodyguard Your ADC',
    descCs: 'Využij své staty a mentál k tomu, abys absorboval veškerý nepřátelský burst damage.',
    descEn: 'Use your defensive stats and positioning to absorb all enemy cooldowns for your ADC.',
    statKey: 'mental',
    synergy: 'Tank',
    difficulty: 54,
    risk: 'Low',
    successScore: 28,
    failScore: -16,
    successTextCs: '🛡️ Neproniknutelná Zeď! Tvé ADC přežilo s plným HP a vyčistilo bojiště (+28 Skóre)!',
    successTextEn: '🛡️ Impenetrable Wall! Your ADC survived full HP and aced the lobby (+28 Score)!',
    failTextCs: '⚠️ Nepřátelský burst byl příliš vysoký a přední linie padla (-16 Skóre).',
    failTextEn: '⚠️ Enemy burst damage overwhelmed your frontline defense (-16 Score).',
  },
];

export function InteractiveMatch() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const interactiveMatch = useGameStore(s => s.interactiveMatch);
  const finishInteractiveMatch = useGameStore(s => s.finishInteractiveMatch);

  const [selectedChamp, setSelectedChamp] = useState<string>(career?.championPool[0] || 'Aatrox');
  const [step, setStep] = useState<'champion_select' | 'laning' | 'minimap_radar' | 'mid_game' | 'late_game' | 'summary'>('champion_select');
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [playerScore, setPlayerScore] = useState(50);
  const [opponentScore, setOpponentScore] = useState(50);
  const [logs, setLogs] = useState<Array<{ phase: string; text: string; success: boolean; scoreDelta: number }>>([]);
  const [resolving, setResolving] = useState(false);

  if (!career || !interactiveMatch) {
    return (
      <div className="screen-bg min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 text-center space-y-4 max-w-sm border-gold-600/30">
          <p className="text-white font-bold">Zápas nebyl nalezen</p>
          <Button variant="primary" fullWidth onClick={() => useGameStore.getState().setPhase('CAREER_HUB')}>
            Kariérní Centrum
          </Button>
        </Card>
      </div>
    );
  }

  const currentPatch = career.currentPatch || { patchVersion: '15.1', season: 15, tiers: {} };
  const champPool = career.championPool || [];
  const poolChamps = ALL_CHAMPIONS.filter(c => champPool.includes(c.id));
  const roleChamps = getChampionsByRole(career.role);
  
  // Pick opponent champion for the lane from match state
  const enemyChampId = interactiveMatch.enemyChampion || roleChamps.find(c => !champPool.includes(c.id))?.id || roleChamps[0].id;
  const enemyChamp = ALL_CHAMPIONS.find(c => c.id === enemyChampId) || roleChamps[0];

  const matchup = getMatchupAdvantage(selectedChamp, enemyChamp.id);
  const eloInfo = calculateEloDifficulty(career.rank.tier, career.stats);
  const currentChampObj = ALL_CHAMPIONS.find(c => c.id === selectedChamp);

  const currentScenario =
    step === 'laning' ? LANING_SCENARIO :
    step === 'mid_game' ? MID_SCENARIO :
    step === 'late_game' ? LATE_SCENARIO : null;

  const currentChoices =
    step === 'laning' ? LANING_CHOICES :
    step === 'mid_game' ? MID_CHOICES :
    step === 'late_game' ? LATE_CHOICES : [];

  function handleConfirmChamp() {
    setPlayerScore(Math.max(20, Math.min(80, 50 + matchup.scoreBonus)));
    setOpponentScore(50);
    setStep('laning');
    setSelectedChoiceIdx(null);
  }

  function handleMinimapComplete(success: boolean, scoreBonus: number, logText: string) {
    if (success) {
      setPlayerScore(prev => Math.min(100, prev + scoreBonus));
    } else {
      setOpponentScore(prev => Math.min(100, prev + Math.abs(scoreBonus)));
    }

    setLogs(prev => [
      ...prev,
      {
        phase: 'MINIMAP RADAR',
        text: logText,
        success,
        scoreDelta: scoreBonus,
      },
    ]);

    setStep('mid_game');
  }

  function handleConfirmTacticalChoice() {
    if (selectedChoiceIdx === null) return;
    const choice = currentChoices[selectedChoiceIdx];
    setResolving(true);

    const statVal = career!.stats[choice.statKey];
    const champTier = currentPatch.tiers[selectedChamp]?.tier || 'A';
    const tierBonus = champTier === 'S+' ? 10 : champTier === 'S' ? 6 : champTier === 'A' ? 3 : champTier === 'B' ? 0 : -5;
    const mastery = career!.masteries?.[selectedChamp]?.masteryLevel || 1;
    const masteryBonus = mastery * 2;

    // Check synergy with champion playstyle
    const isSynergy = currentChampObj && choice.synergy && currentChampObj.playstyle.toLowerCase().includes(choice.synergy.toLowerCase());
    const synergyBonus = isSynergy ? 18 : 0;

    // Matchup modifier
    const matchupBonus = matchup.scoreBonus > 0 ? 8 : matchup.scoreBonus < 0 ? -8 : 0;

    // Tactical Check DC adjusted by Champion Counter Matchup & Rank Tier Elo Requirement
    const eloPenalty = Math.max(-8, Math.min(15, Math.floor((eloInfo.targetStat - eloInfo.playerAvg) * 0.35)));
    const finalDC = choice.difficulty + eloPenalty;

    const totalScore = statVal + tierBonus + masteryBonus + synergyBonus + matchupBonus + (Math.random() * 24 - 12);
    const success = totalScore >= finalDC;
    const scoreDelta = success ? choice.successScore : choice.failScore;

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
            ? (success ? choice.successTextCs : choice.failTextCs)
            : (success ? choice.successTextEn : choice.failTextEn),
          success,
          scoreDelta,
        },
      ]);
      setResolving(false);
      setSelectedChoiceIdx(null);

      if (step === 'laning') setStep('minimap_radar');
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
                <span className="font-bold text-white text-base uppercase font-heading">{career.gameName}</span>
                <span className="text-xs text-rift-purple bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 font-mono font-bold">
                  {selectedChamp}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400 font-heading tracking-wider uppercase">
                {step === 'champion_select' ? 'FÁZE DRAFTU' :
                 step === 'laning' ? 'EARLY GAME' :
                 step === 'minimap_radar' ? '🗺️ RADAR MINIMAPY' :
                 step === 'mid_game' ? 'MID GAME' :
                 step === 'late_game' ? 'LATE GAME' : 'VÝSLEDEK'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200 text-sm font-heading uppercase">{interactiveMatch.opponentTeam.shortName}</span>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: interactiveMatch.opponentTeam.color }} />
              </div>
            </div>

            {/* Advantage Bar */}
            {step !== 'champion_select' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span className="text-blue-400 font-bold">{playerScore}% Výhoda</span>
                  <span className="text-red-400 font-bold">{opponentScore}% Výhoda</span>
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

          {/* STEP 1: CHAMPION SELECT & ENEMY MATCHUP */}
          {step === 'champion_select' && (
            <motion.div
              key="champ_select"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {/* Enemy Lock-In Banner */}
              <div className="bg-red-950/40 border border-red-800/40 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={getChampIconUrl(enemyChamp.id)} className="w-12 h-12 rounded-lg border border-red-700 object-cover" alt="" />
                  <div>
                    <span className="text-xs text-red-400 font-bold uppercase">Soupeř zamknul na linku:</span>
                    <h3 className="text-white font-black text-base uppercase font-heading">{enemyChamp.name}</h3>
                    <p className="text-[11px] text-slate-400">Styl: {enemyChamp.playstyle} · {enemyChamp.counterTags.join(', ')}</p>
                  </div>
                </div>
                <span className="text-xs bg-red-900/60 text-red-200 px-2.5 py-1 rounded font-bold font-mono">
                  OPPONENT
                </span>
              </div>

              {/* Live Matchup Assessment Banner */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                matchup.type === 'HARD_COUNTER' ? 'bg-emerald-950/40 border-emerald-600/50' :
                matchup.type === 'ADVANTAGE' ? 'bg-green-950/40 border-green-700/40' :
                matchup.type === 'HARD_COUNTERED' ? 'bg-red-950/50 border-red-700/60' :
                'bg-rift-surface border-rift-border'
              }`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase font-heading">{matchup.advantageBadge}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({eloInfo.labelCs})</span>
                  </div>
                  <p className="text-xs text-slate-300">{matchup.reasonCs}</p>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-white font-heading uppercase tracking-wide">
                  {t('match.select_champ_title')}
                </h2>
                <p className="text-xs text-slate-400">
                  {t('match.select_champ_desc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {poolChamps.map(champ => {
                  const meta = currentPatch.tiers[champ.id] || { tier: 'A', winRate: 50.0 };
                  const mastery = career.masteries?.[champ.id]?.masteryLevel || 1;
                  const isSelected = selectedChamp === champ.id;
                  const champMatchup = getMatchupAdvantage(champ.id, enemyChamp.id);

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
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
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
                          
                          {/* Matchup Badge */}
                          <div className="mt-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              champMatchup.type === 'HARD_COUNTER' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                              champMatchup.type === 'ADVANTAGE' ? 'bg-green-950 text-green-300 border border-green-800' :
                              champMatchup.type === 'HARD_COUNTERED' ? 'bg-red-950 text-red-300 border border-red-800' :
                              'bg-slate-900 text-slate-400 border border-slate-700'
                            }`}>
                              {champMatchup.type === 'HARD_COUNTER' ? '🎯 Counter (+15)' :
                               champMatchup.type === 'ADVANTAGE' ? '🗡️ Výhoda (+10)' :
                               champMatchup.type === 'HARD_COUNTERED' ? '⚠️ Nevýhoda (-15)' : '⚖️ Vyrovnaný'}
                            </span>
                          </div>
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
                  ⚔️ {t('match.confirm_champion')}: {selectedChamp} ({matchup.advantageBadge})
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: MINIMAP RADAR MINI-GAME */}
          {step === 'minimap_radar' && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <MinimapRadar onComplete={handleMinimapComplete} lang={lang} />
            </motion.div>
          )}

          {/* STEP 3, 4, 5: TACTICAL DECISION PHASES */}
          {(step === 'laning' || step === 'mid_game' || step === 'late_game') && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {/* Dynamic Tactical Scenario Banner */}
              {currentScenario && (
                <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/60 p-4 rounded-xl border border-blue-800/40 space-y-1">
                  <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider font-heading">
                    {isCs ? currentScenario.titleCs : currentScenario.titleEn}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {isCs ? currentScenario.descCs : currentScenario.descEn}
                  </p>
                </div>
              )}

              {/* Tactical Choices */}
              <div className="space-y-3">
                {currentChoices.map((choice, i) => {
                  const isSelected = selectedChoiceIdx === i;
                  const statValue = career.stats[choice.statKey];
                  const hasSynergy = currentChampObj && choice.synergy && currentChampObj.playstyle.toLowerCase().includes(choice.synergy.toLowerCase());

                  return (
                    <motion.div
                      key={choice.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => !resolving && setSelectedChoiceIdx(i)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-gold-400 bg-gold-950/40 shadow-lg shadow-gold-500/20'
                          : 'border-rift-border bg-rift-card hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gold-400 bg-gold-950/60 px-2 py-0.5 rounded border border-gold-700/40 font-mono">
                              {isCs ? choice.tagCs : choice.tagEn}
                            </span>
                            {hasSynergy && (
                              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                                🌟 Synergie s {currentChampObj?.playstyle} (+18)
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-white pt-0.5">
                            {isCs ? choice.titleCs : choice.titleEn}
                          </p>
                          <p className="text-xs text-slate-300">
                            {isCs ? choice.descCs : choice.descEn}
                          </p>
                        </div>
                        {isSelected && <span className="text-gold-400 font-black text-base shrink-0">✓</span>}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-rift-border/60 text-xs">
                        <span className="text-slate-400 font-medium">
                          Testuje: <strong className="text-slate-200">{t(`stat.${choice.statKey}` as any)} ({statValue})</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-green-400 font-bold font-mono">
                            +{choice.successScore} / {choice.failScore}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            choice.risk === 'High' ? 'bg-red-950/70 text-red-400 border border-red-800' :
                            choice.risk === 'Medium' ? 'bg-yellow-950/70 text-yellow-400 border border-yellow-800' :
                            'bg-green-950/70 text-green-400 border border-green-800'
                          }`}>
                            {choice.risk} Riziko
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Live Combat Logs */}
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
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={selectedChoiceIdx === null || resolving}
                  onClick={handleConfirmTacticalChoice}
                >
                  {resolving ? '⚔️ Vyhodnocuji tah...' : `⚡ ${t('match.confirm_decision')}`}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: MATCH SUMMARY */}
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
                  className={`text-3xl font-black uppercase font-heading tracking-wide ${isWon ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isWon ? t('match.victory_title') : t('match.defeat_title')}
                </h2>
                <p className="text-slate-300 text-sm mt-1 font-medium">
                  {isWon ? t('match.victory_desc') : t('match.defeat_desc')}
                </p>

                <div className="mt-4 pt-4 border-t border-rift-border grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Odehraný Champion</span>
                    <p className="text-white font-bold">{selectedChamp}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Mastery Zkušenosti</span>
                    <p className="text-gold-400 font-bold">+250 Bodů</p>
                  </div>
                </div>
              </div>

              {/* Combat Recap */}
              <Card className="p-4 text-left space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Průběh Zápasu & Rozhodnutí</p>
                <div className="space-y-1 text-xs">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={log.success ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                        {log.success ? '✓' : '✗'}
                      </span>
                      <span className="text-slate-300"><strong>[{log.phase}]:</strong> {log.text}</span>
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
