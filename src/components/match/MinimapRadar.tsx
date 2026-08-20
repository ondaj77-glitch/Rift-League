import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';

export interface MinimapMission {
  id: string;
  titleCs: string;
  titleEn: string;
  promptCs: string;
  promptEn: string;
  targetZone: 'top_river' | 'dragon_pit' | 'baron_pit' | 'bot_bush' | 'mid_river';
  rewardScore: number;
  icon: string;
}

const MISSIONS: MinimapMission[] = [
  {
    id: 'gank_alert',
    titleCs: '⚠️ GANK ALERT! (Hlídej řeku)',
    titleEn: '⚠️ GANK ALERT! (Watch the River)',
    promptCs: 'Nepřátelský jungler byl zahlédnut v mlze na horní řece! Rychle klikni na HORNÍ ŘEKU pro wardu a záchranu linky!',
    promptEn: 'Enemy jungler spotted in fog on top river! Quickly click TOP RIVER to place a ward and prevent the gank!',
    targetZone: 'top_river',
    rewardScore: 20,
    icon: '👁️',
  },
  {
    id: 'dragon_contest',
    titleCs: '🐉 SOUL DRAKE CONTEST!',
    titleEn: '🐉 SOUL DRAKE CONTEST!',
    promptCs: 'Nepřítel začal draka v pitě! Klikni na DRAČÍ PIT pro zahájení engage a krádež smitem!',
    promptEn: 'Enemy started Dragon! Click the DRAGON PIT to initiate the collapse and contest with Smite!',
    targetZone: 'dragon_pit',
    rewardScore: 25,
    icon: '🐉',
  },
  {
    id: 'baron_rush',
    titleCs: '👑 BARON NASHOR SNEAK!',
    titleEn: '👑 BARON NASHOR SNEAK!',
    promptCs: 'Soupeři se stahují k Baronovi! Klikni na BARONŮV PIT pro vyčištění vize a teleport!',
    promptEn: 'Enemies rushing Baron! Click BARON PIT for vision deny and Teleport flank!',
    targetZone: 'baron_pit',
    rewardScore: 30,
    icon: '👑',
  },
  {
    id: 'bot_split_flank',
    titleCs: '⚡ BOT LANE FLANK! (Teleport Příležitost)',
    titleEn: '⚡ BOT LANE FLANK! (TP Opportunity)',
    promptCs: 'Nepřátelské ADC pushuje samotné na botu! Klikni na BOT LINKU pro zničující TP flank!',
    promptEn: 'Enemy ADC overextended on Bot! Click BOT LANE to execute a devastating Teleport flank!',
    targetZone: 'bot_bush',
    rewardScore: 22,
    icon: '⚡',
  },
  {
    id: 'mid_roam_trap',
    titleCs: '🧠 MID ROAM PAST!',
    titleEn: '🧠 MID ROAM TRAP!',
    promptCs: 'Nepřátelský mid laner rotuje přes střed řeky! Klikni na STŘEDNÍ ŘEKU a odchytni ho v křoví!',
    promptEn: 'Enemy mid laner rotating through mid river! Click MID RIVER to ambush them from brush!',
    targetZone: 'mid_river',
    rewardScore: 20,
    icon: '🎯',
  },
];

interface Props {
  onComplete: (success: boolean, scoreBonus: number, logText: string) => void;
  lang?: string;
}

export function MinimapRadar({ onComplete, lang = 'cs' }: Props) {
  const [mission] = useState<MinimapMission>(() => {
    return MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
  });

  const [timeLeft, setTimeLeft] = useState(8);
  const [clickedZone, setClickedZone] = useState<string | null>(null);
  const [status, setStatus] = useState<'playing' | 'success' | 'failed'>('playing');

  useEffect(() => {
    if (status !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFail('Vypršel čas reakce! Nepřítel získal pozici na mapě.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  function handleZoneClick(zone: MinimapMission['targetZone']) {
    if (status !== 'playing') return;
    setClickedZone(zone);

    if (zone === mission.targetZone) {
      setStatus('success');
      const text = lang === 'cs'
        ? `🎯 Skvělé makro! Správně jsi přečetl mapu na ${zone.replace('_', ' ').toUpperCase()} (+${mission.rewardScore} Skóre).`
        : `🎯 Perfect Macro! You correctly read the minimap at ${zone.replace('_', ' ').toUpperCase()} (+${mission.rewardScore} Score).`;
      setTimeout(() => {
        onComplete(true, mission.rewardScore, text);
      }, 1200);
    } else {
      handleFail(
        lang === 'cs'
          ? `❌ Špatná zóna! Kliknul jsi na jinou část mapy.`
          : `❌ Wrong Zone! You pinged the wrong section of the map.`
      );
    }
  }

  function handleFail(reason: string) {
    setStatus('failed');
    setTimeout(() => {
      onComplete(false, -15, reason);
    }, 1200);
  }

  const isCs = lang === 'cs';

  return (
    <Card className="p-5 space-y-4 border-gold-600/40 bg-gradient-to-b from-[#09101f] to-rift-card shadow-2xl">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-rift-border/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{mission.icon}</span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-gold-400 uppercase font-heading tracking-wide">
              {isCs ? mission.titleCs : mission.titleEn}
            </h3>
            <p className="text-xs text-slate-300">
              {isCs ? mission.promptCs : mission.promptEn}
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="text-right shrink-0">
          <span className={`text-lg font-black font-mono px-3 py-1 rounded-xl border ${
            timeLeft <= 3
              ? 'bg-red-950/80 text-red-400 border-red-700 animate-pulse'
              : 'bg-rift-surface text-amber-300 border-amber-600/40'
          }`}>
            ⏱️ {timeLeft}s
          </span>
        </div>
      </div>

      {/* Interactive Stylized Summoner's Rift Minimap */}
      <div className="relative w-full aspect-square max-w-[380px] mx-auto bg-[#07131e] rounded-2xl border-2 border-slate-700 overflow-hidden shadow-inner select-none">
        {/* River Diagonal Graphic */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* Diagonal River Flow */}
          <path d="M 0 60 Q 150 180 340 380" stroke="#0284c7" strokeWidth="32" fill="none" opacity="0.6" />
          {/* River banks */}
          <line x1="20" y1="360" x2="360" y2="20" stroke="#334155" strokeWidth="4" strokeDasharray="6 6" />
          {/* Lanes */}
          <path d="M 40 340 L 40 40 L 340 40" stroke="#475569" strokeWidth="8" fill="none" />
          <path d="M 40 340 L 340 340 L 340 40" stroke="#475569" strokeWidth="8" fill="none" />
          <path d="M 40 340 L 340 40" stroke="#475569" strokeWidth="8" fill="none" />
        </svg>

        {/* Bases */}
        <div className="absolute bottom-3 left-3 bg-blue-600/80 text-white text-[10px] font-black px-2 py-1 rounded-lg border border-blue-400">
          BLUE BASE
        </div>
        <div className="absolute top-3 right-3 bg-red-600/80 text-white text-[10px] font-black px-2 py-1 rounded-lg border border-red-400">
          RED BASE
        </div>

        {/* Interactive Clickable Zones */}

        {/* 1. TOP RIVER */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleZoneClick('top_river')}
          className={`absolute top-[20%] left-[26%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            clickedZone === 'top_river'
              ? status === 'success'
                ? 'bg-green-600 border-green-300 shadow-lg shadow-green-500/50 scale-110'
                : 'bg-red-600 border-red-300'
              : mission.targetZone === 'top_river' && status === 'playing'
              ? 'bg-amber-500/30 border-amber-400 animate-pulse text-amber-200 shadow-md shadow-amber-500/30'
              : 'bg-slate-900/80 border-slate-600 text-slate-300 hover:bg-blue-900/60'
          }`}
        >
          <span className="text-base">🌊</span>
          <span className="text-[10px] font-black uppercase tracking-tight">Horní Řeka</span>
        </motion.button>

        {/* 2. BARON PIT */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleZoneClick('baron_pit')}
          className={`absolute top-[32%] left-[40%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            clickedZone === 'baron_pit'
              ? status === 'success'
                ? 'bg-green-600 border-green-300 shadow-lg shadow-green-500/50 scale-110'
                : 'bg-red-600 border-red-300'
              : mission.targetZone === 'baron_pit' && status === 'playing'
              ? 'bg-purple-600/40 border-purple-400 animate-pulse text-purple-200 shadow-md shadow-purple-500/30'
              : 'bg-slate-900/80 border-slate-600 text-purple-300 hover:bg-purple-900/60'
          }`}
        >
          <span className="text-base">👑</span>
          <span className="text-[10px] font-black uppercase tracking-tight">Baron Pit</span>
        </motion.button>

        {/* 3. MID RIVER */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleZoneClick('mid_river')}
          className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            clickedZone === 'mid_river'
              ? status === 'success'
                ? 'bg-green-600 border-green-300 shadow-lg shadow-green-500/50 scale-110'
                : 'bg-red-600 border-red-300'
              : mission.targetZone === 'mid_river' && status === 'playing'
              ? 'bg-amber-500/30 border-amber-400 animate-pulse text-amber-200 shadow-md shadow-amber-500/30'
              : 'bg-slate-900/80 border-slate-600 text-slate-300 hover:bg-blue-900/60'
          }`}
        >
          <span className="text-base">⚔️</span>
          <span className="text-[10px] font-black uppercase tracking-tight">Mid Řeka</span>
        </motion.button>

        {/* 4. DRAGON PIT */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleZoneClick('dragon_pit')}
          className={`absolute top-[68%] left-[62%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            clickedZone === 'dragon_pit'
              ? status === 'success'
                ? 'bg-green-600 border-green-300 shadow-lg shadow-green-500/50 scale-110'
                : 'bg-red-600 border-red-300'
              : mission.targetZone === 'dragon_pit' && status === 'playing'
              ? 'bg-amber-500/40 border-amber-400 animate-pulse text-amber-200 shadow-md shadow-amber-500/30'
              : 'bg-slate-900/80 border-slate-600 text-orange-400 hover:bg-orange-900/60'
          }`}
        >
          <span className="text-base">🐉</span>
          <span className="text-[10px] font-black uppercase tracking-tight">Drak Pit</span>
        </motion.button>

        {/* 5. BOT BUSH */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleZoneClick('bot_bush')}
          className={`absolute top-[80%] left-[78%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
            clickedZone === 'bot_bush'
              ? status === 'success'
                ? 'bg-green-600 border-green-300 shadow-lg shadow-green-500/50 scale-110'
                : 'bg-red-600 border-red-300'
              : mission.targetZone === 'bot_bush' && status === 'playing'
              ? 'bg-amber-500/30 border-amber-400 animate-pulse text-amber-200 shadow-md shadow-amber-500/30'
              : 'bg-slate-900/80 border-slate-600 text-slate-300 hover:bg-blue-900/60'
          }`}
        >
          <span className="text-base">🌿</span>
          <span className="text-[10px] font-black uppercase tracking-tight">Dolní Linka</span>
        </motion.button>
      </div>

      {/* Live Feedback Overlay */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-950/60 border border-green-600 rounded-xl text-center"
          >
            <p className="text-green-300 font-bold text-sm">
              🎯 PERFEKTNÍ MAKRO REAKCE! (+{mission.rewardScore} Bodů Převahy)
            </p>
          </motion.div>
        )}
        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-950/60 border border-red-600 rounded-xl text-center"
          >
            <p className="text-red-300 font-bold text-sm">
              ❌ ZMEŠKANÁ PŘÍLEŽITOST (-15 Bodů Ztráta Vize)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
