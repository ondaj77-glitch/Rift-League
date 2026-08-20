import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChampIconUrl, ALL_CHAMPIONS } from '../../data/champions';

export interface MapUnit {
  id: string;
  name: string;
  role: 'top' | 'jungle' | 'mid' | 'adc' | 'support';
  team: 'blue' | 'red';
  isPlayer?: boolean;
  isEnemyLaner?: boolean;
  isDead: boolean;
  respawnTime?: number;
  xPercent: number; // 0-100% on map
  yPercent: number; // 0-100% on map
  statusKey?: string; // e.g. '[R] Ready', 'Flash Down'
}

export interface MapTacticalScenario {
  id: string;
  titleCs: string;
  titleEn: string;
  contextCs: string;
  contextEn: string;
  stage: 'EARLY_LANING' | 'DRAGON_FIGHT' | 'BARON_STANDOFF' | 'BASE_DEFENSE';
  playerUltStatus: string;
  enemyKeyCooldown: string;
  allies: MapUnit[];
  enemies: MapUnit[];
  choices: Array<{
    id: string;
    tagCs: string;
    tagEn: string;
    titleCs: string;
    titleEn: string;
    descCs: string;
    descEn: string;
    statKey: 'mechanics' | 'gameKnowledge' | 'communication' | 'mental' | 'adaptability';
    synergyRequired?: string;
    difficulty: number;
    scoreGain: number;
    scoreLoss: number;
    winTextCs: string;
    winTextEn: string;
    lossTextCs: string;
    lossTextEn: string;
  }>;
}

interface Props {
  playerChampId: string;
  enemyChampId: string;
  playerRole: string;
  scenario: MapTacticalScenario;
  onSelectChoice: (choiceIdx: number) => void;
  selectedChoiceIdx: number | null;
  resolving: boolean;
  lang?: string;
}

export function TacticalMapBoard({
  playerChampId,
  enemyChampId,
  scenario,
  onSelectChoice,
  selectedChoiceIdx,
  resolving,
  lang = 'cs',
}: Props) {
  const isCs = lang === 'cs';
  const playerChamp = ALL_CHAMPIONS.find(c => c.id === playerChampId) || ALL_CHAMPIONS[0];
  const enemyChamp = ALL_CHAMPIONS.find(c => c.id === enemyChampId) || ALL_CHAMPIONS[1];

  return (
    <div className="space-y-4">
      {/* Scenario Header & Cooldown Context */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 p-4 rounded-2xl border border-cyan-500/40 shadow-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs font-black uppercase text-cyan-400 tracking-wider font-heading flex items-center gap-1.5">
            🗺️ {isCs ? scenario.titleCs : scenario.titleEn}
          </span>
          <span className="text-[11px] font-mono bg-cyan-950/80 text-cyan-200 border border-cyan-700/50 px-2.5 py-0.5 rounded-full font-bold">
            {scenario.stage.replace('_', ' ')}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {isCs ? scenario.contextCs : scenario.contextEn}
        </p>

        {/* Live Ability & Cooldown Tracking Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-cyan-900/40 text-[11px]">
          <div className="flex items-center gap-2 bg-blue-950/70 p-2 rounded-xl border border-blue-700/50">
            <img src={getChampIconUrl(playerChamp.id)} alt="" className="w-6 h-6 rounded-md border border-cyan-400 object-cover" />
            <div className="truncate">
              <span className="text-cyan-300 font-bold">{isCs ? 'Ty' : 'You'} ({playerChamp.name}): </span>
              <span className="text-emerald-400 font-mono font-semibold">{scenario.playerUltStatus}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-red-950/70 p-2 rounded-xl border border-red-700/50">
            <img src={getChampIconUrl(enemyChamp.id)} alt="" className="w-6 h-6 rounded-md border border-red-500 object-cover" />
            <div className="truncate">
              <span className="text-red-300 font-bold">{isCs ? 'Soupeř' : 'Enemy'} ({enemyChamp.name}): </span>
              <span className="text-amber-400 font-mono font-semibold">{scenario.enemyKeyCooldown}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AUTHENTIC SUMMONER'S RIFT MAP BOARD */}
      <div className="relative w-full aspect-square max-w-[460px] mx-auto bg-[#07131e] rounded-2xl border-2 border-cyan-800/70 overflow-hidden shadow-2xl select-none">
        
        {/* Authentic Top-Down Summoner's Rift Map Vector */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            {/* River Gradient */}
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
            </linearGradient>

            {/* Jungle Quadrant Gradient */}
            <radialGradient id="jungleGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Map Base Background Texture */}
          <rect width="400" height="400" fill="#06101e" />

          {/* Jungle Zones */}
          <rect x="50" y="50" width="130" height="130" rx="20" fill="url(#jungleGlow)" />
          <rect x="220" y="220" width="130" height="130" rx="20" fill="url(#jungleGlow)" />
          <rect x="220" y="50" width="130" height="130" rx="20" fill="url(#jungleGlow)" />
          <rect x="50" y="220" width="130" height="130" rx="20" fill="url(#jungleGlow)" />

          {/* 1. Diagonal River Path with Natural Curve */}
          <path
            d="M 5 110 Q 140 180 200 200 T 395 290"
            stroke="url(#riverGrad)"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
          />

          {/* 2. Top Lane (Perimeter Top-Left) */}
          <path
            d="M 35 365 L 35 45 L 365 45"
            stroke="#334155"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Top Lane Inner Path */}
          <path
            d="M 35 365 L 35 45 L 365 45"
            stroke="#1e293b"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* 3. Bot Lane (Perimeter Bottom-Right) */}
          <path
            d="M 35 365 L 365 365 L 365 45"
            stroke="#334155"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 35 365 L 365 365 L 365 45"
            stroke="#1e293b"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* 4. Mid Lane (Diagonal Center) */}
          <path
            d="M 35 365 L 365 45"
            stroke="#334155"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 35 365 L 365 45"
            stroke="#1e293b"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />

          {/* River Water Highlight Line */}
          <path
            d="M 10 110 Q 140 180 200 200 T 390 290"
            stroke="#38bdf8"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 6"
            opacity="0.6"
          />

          {/* Turret Icon Positions */}
          {/* Top Turrets */}
          <circle cx="35" cy="240" r="4" fill="#3b82f6" opacity="0.8" />
          <circle cx="35" cy="140" r="4" fill="#3b82f6" opacity="0.8" />
          <circle cx="160" cy="45" r="4" fill="#ef4444" opacity="0.8" />
          <circle cx="260" cy="45" r="4" fill="#ef4444" opacity="0.8" />

          {/* Mid Turrets */}
          <circle cx="130" cy="270" r="4" fill="#3b82f6" opacity="0.8" />
          <circle cx="270" cy="130" r="4" fill="#ef4444" opacity="0.8" />

          {/* Bot Turrets */}
          <circle cx="140" cy="365" r="4" fill="#3b82f6" opacity="0.8" />
          <circle cx="240" cy="365" r="4" fill="#3b82f6" opacity="0.8" />
          <circle cx="365" cy="240" r="4" fill="#ef4444" opacity="0.8" />
          <circle cx="365" cy="140" r="4" fill="#ef4444" opacity="0.8" />

          {/* Bases Glows */}
          <circle cx="35" cy="365" r="28" fill="#1d4ed8" opacity="0.3" />
          <circle cx="365" cy="45" r="28" fill="#b91c1c" opacity="0.3" />
        </svg>

        {/* Base Indicators */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-blue-950/90 text-blue-300 border border-blue-500/60 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          BLUE BASE
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-950/90 text-red-300 border border-red-500/60 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          RED BASE
        </div>

        {/* Baron Nashor Pit Landmark */}
        <div className="absolute top-[26%] left-[26%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-purple-950/80 border border-purple-500/50 text-purple-300 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase shadow-sm">
          <span>👑</span>
          <span>BARON PIT</span>
        </div>

        {/* Dragon Pit Landmark */}
        <div className="absolute bottom-[26%] right-[26%] translate-x-1/2 translate-y-1/2 flex items-center gap-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase shadow-sm">
          <span>🐉</span>
          <span>DRAGON PIT</span>
        </div>

        {/* 5v5 Live Champion Position Tokens */}
        {[...scenario.allies, ...scenario.enemies].map(unit => {
          const isPlayer = unit.isPlayer;
          const isEnemyLaner = unit.isEnemyLaner;
          const isAlly = unit.team === 'blue';

          return (
            <motion.div
              key={`${unit.team}-${unit.role}-${unit.id}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                top: `${unit.yPercent}%`,
                left: `${unit.xPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none group z-10"
            >
              {/* Token Portrait Container */}
              <div className="relative">
                <img
                  src={getChampIconUrl(unit.id)}
                  alt={unit.name}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-lg transition-transform ${
                    unit.isDead
                      ? 'filter grayscale opacity-40 border-2 border-slate-600'
                      : isPlayer
                      ? 'border-2 border-gold-400 ring-2 ring-gold-500/80 scale-110 shadow-gold-500/50'
                      : isEnemyLaner
                      ? 'border-2 border-red-500 ring-2 ring-red-600/80 scale-105 shadow-red-500/50'
                      : isAlly
                      ? 'border-2 border-cyan-400 shadow-cyan-500/30'
                      : 'border-2 border-rose-600 shadow-rose-500/30'
                  }`}
                />

                {/* Dead Status Overlay */}
                {unit.isDead && (
                  <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black text-red-400 font-mono">💀</span>
                  </div>
                )}

                {/* Player 'TY' Badge */}
                {isPlayer && (
                  <div className="absolute -top-1.5 -right-1.5 bg-gold-500 text-black font-black text-[8px] px-1 rounded-full border border-white font-mono shadow-sm">
                    TY
                  </div>
                )}

                {/* Enemy Laner 'VS' Badge */}
                {isEnemyLaner && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[8px] px-1 rounded-full border border-white font-mono shadow-sm">
                    VS
                  </div>
                )}
              </div>

              {/* Champion Name Tag & Respawn Timer */}
              <div className="mt-0.5 flex flex-col items-center">
                <span
                  className={`text-[9px] font-bold px-1 rounded leading-tight whitespace-nowrap shadow-sm ${
                    unit.isDead
                      ? 'bg-black/90 text-red-400 border border-red-800'
                      : isPlayer
                      ? 'bg-gold-500/90 text-black font-black'
                      : isEnemyLaner
                      ? 'bg-red-600/90 text-white font-bold'
                      : isAlly
                      ? 'bg-blue-950/90 text-cyan-200 border border-cyan-700/60'
                      : 'bg-red-950/90 text-rose-200 border border-rose-700/60'
                  }`}
                >
                  {unit.isDead ? `💀 ${unit.respawnTime}s` : unit.id}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3 Meaningful Tactical Action Choices (LoL Strategy Focused) */}
      <div className="space-y-2.5 pt-2">
        <h4 className="text-xs font-black uppercase text-slate-300 font-heading tracking-wider flex items-center gap-1.5">
          <span>🎯</span>
          <span>{isCs ? 'Vyber taktický postup pro tuto situaci na mapě:' : 'Select your tactical response for this map state:'}</span>
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {scenario.choices.map((choice, idx) => {
            const isSelected = selectedChoiceIdx === idx;

            return (
              <motion.button
                key={choice.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectChoice(idx)}
                disabled={resolving}
                className={`w-full p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-gold-950/60 via-slate-900 to-gold-950/60 border-gold-400 ring-2 ring-gold-500/40 shadow-xl'
                    : 'bg-rift-surface hover:bg-slate-800/80 border-rift-border hover:border-slate-600'
                }`}
              >
                {/* Header Tag & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border inline-block ${
                      isSelected
                        ? 'bg-gold-500/20 text-gold-300 border-gold-500/40 font-mono'
                        : 'bg-slate-800 text-slate-300 border-slate-700 font-mono'
                    }`}>
                      {isCs ? choice.tagCs : choice.tagEn}
                    </span>

                    <h5 className="font-bold text-white text-sm leading-snug">
                      {isCs ? choice.titleCs : choice.titleEn}
                    </h5>
                  </div>

                  {/* Checkmark Indicator */}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-gold-500 text-black flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                      ✓
                    </div>
                  )}
                </div>

                {/* Tactical Description */}
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {isCs ? choice.descCs : choice.descEn}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
