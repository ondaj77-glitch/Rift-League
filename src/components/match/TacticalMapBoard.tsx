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
        
        {/* 1. Official High-Resolution Summoner's Rift Minimap Image */}
        <img
          src="/minimap.png"
          alt="Summoner's Rift"
          className="absolute inset-0 w-full h-full object-cover select-none brightness-105 contrast-125"
        />

        {/* 2. Tactical Overlay Elements */}
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

        {/* Base Indicators */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-blue-950/90 text-blue-300 border border-blue-500/60 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono shadow-md backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          BLUE BASE
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-950/90 text-red-300 border border-red-500/60 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono shadow-md backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          RED BASE
        </div>

        {/* Baron Nashor Pit Landmark */}
        <div className="absolute top-[26%] left-[26%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-purple-950/90 border border-purple-500/70 text-purple-200 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase shadow-lg backdrop-blur-sm">
          <span>👑</span>
          <span>BARON PIT</span>
        </div>

        {/* Dragon Pit Landmark */}
        <div className="absolute bottom-[26%] right-[26%] translate-x-1/2 translate-y-1/2 flex items-center gap-1 bg-amber-950/90 border border-amber-500/70 text-amber-200 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase shadow-lg backdrop-blur-sm">
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
