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
    risk: 'Low' | 'Medium' | 'High';
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
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-indigo-950/70 p-4 rounded-2xl border border-blue-600/40 shadow-xl space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs font-black uppercase text-cyan-400 tracking-wider font-heading flex items-center gap-1.5">
            🗺️ {isCs ? scenario.titleCs : scenario.titleEn}
          </span>
          <span className="text-[11px] font-mono bg-blue-900/50 text-blue-200 border border-blue-700/50 px-2.5 py-0.5 rounded-full">
            {scenario.stage.replace('_', ' ')}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {isCs ? scenario.contextCs : scenario.contextEn}
        </p>

        {/* Live Ability & Cooldown Tracking Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-900/40 text-[11px]">
          <div className="flex items-center gap-2 bg-blue-950/60 p-2 rounded-xl border border-blue-800/50">
            <img src={getChampIconUrl(playerChamp.id)} alt="" className="w-6 h-6 rounded-md border border-cyan-400 object-cover" />
            <div className="truncate">
              <span className="text-cyan-300 font-bold">Ty ({playerChamp.name}): </span>
              <span className="text-emerald-400 font-mono font-semibold">{scenario.playerUltStatus}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-red-950/60 p-2 rounded-xl border border-red-800/50">
            <img src={getChampIconUrl(enemyChamp.id)} alt="" className="w-6 h-6 rounded-md border border-red-500 object-cover" />
            <div className="truncate">
              <span className="text-red-300 font-bold">Soupeř ({enemyChamp.name}): </span>
              <span className="text-amber-400 font-mono font-semibold">{scenario.enemyKeyCooldown}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Summoner's Rift Map Board */}
      <div className="relative w-full aspect-[4/3] max-w-[540px] mx-auto bg-[#07131e] rounded-2xl border-2 border-cyan-900/60 overflow-hidden shadow-2xl select-none">
        {/* Summoner's Rift Map Vector Texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35">
          {/* Lanes */}
          <path d="M 40 340 L 40 50 L 360 50" stroke="#475569" strokeWidth="22" fill="none" />
          <path d="M 40 340 L 360 340 L 360 50" stroke="#475569" strokeWidth="22" fill="none" />
          <path d="M 40 340 L 360 50" stroke="#475569" strokeWidth="26" fill="none" />
          {/* River Stream */}
          <path d="M 10 90 Q 200 200 390 310" stroke="#0284c7" strokeWidth="36" fill="none" opacity="0.6" />
          {/* Pits */}
          <circle cx="120" cy="110" r="24" fill="#581c87" opacity="0.4" />
          <circle cx="280" cy="290" r="24" fill="#c2410c" opacity="0.4" />
        </svg>

        {/* Map Sector Badges */}
        <div className="absolute top-2 left-3 text-[10px] text-slate-400 font-bold">TOP LANE</div>
        <div className="absolute top-[28%] left-[28%] text-[9px] text-purple-400 font-bold">👑 BARON PIT</div>
        <div className="absolute bottom-[28%] right-[28%] text-[9px] text-orange-400 font-bold">🐉 DRAGON PIT</div>
        <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-bold">BOT LANE</div>

        {/* ALLIES (Blue Team) Map Tokens */}
        {scenario.allies.map((unit) => {
          const isUser = unit.isPlayer;
          const champId = isUser ? playerChampId : unit.id;
          const champ = ALL_CHAMPIONS.find(c => c.id === champId) || ALL_CHAMPIONS[0];

          return (
            <motion.div
              key={unit.role + unit.team}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                top: `${unit.yPercent}%`,
                left: `${unit.xPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20"
            >
              <div className={`relative rounded-full p-0.5 ${
                isUser
                  ? 'ring-4 ring-gold-400 ring-offset-2 ring-offset-black shadow-lg shadow-gold-500/50 scale-110'
                  : 'ring-2 ring-blue-400 ring-offset-1 ring-offset-black'
              }`}>
                <img
                  src={getChampIconUrl(champ.id)}
                  alt={champ.name}
                  className={`w-8 h-8 rounded-full object-cover ${unit.isDead ? 'grayscale opacity-40' : ''}`}
                />
                {unit.isDead && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-full text-red-500 font-bold text-xs">
                    💀
                  </div>
                )}
                {isUser && (
                  <div className="absolute -top-2 -right-1 bg-gold-400 text-black text-[9px] font-black px-1 rounded-full">
                    TY
                  </div>
                )}
              </div>
              <span className={`text-[9px] font-bold px-1 rounded bg-black/80 mt-0.5 whitespace-nowrap ${
                isUser ? 'text-gold-300 font-extrabold' : 'text-blue-300'
              }`}>
                {unit.name}
              </span>
            </motion.div>
          );
        })}

        {/* ENEMIES (Red Team) Map Tokens */}
        {scenario.enemies.map((unit) => {
          const isEnemyLaner = unit.isEnemyLaner;
          const champId = isEnemyLaner ? enemyChampId : unit.id;
          const champ = ALL_CHAMPIONS.find(c => c.id === champId) || ALL_CHAMPIONS[1];

          return (
            <motion.div
              key={unit.role + unit.team}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                top: `${unit.yPercent}%`,
                left: `${unit.xPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20"
            >
              <div className={`relative rounded-full p-0.5 ${
                isEnemyLaner
                  ? 'ring-3 ring-red-500 ring-offset-2 ring-offset-black shadow-lg shadow-red-500/50 scale-105'
                  : 'ring-2 ring-rose-500 ring-offset-1 ring-offset-black'
              }`}>
                <img
                  src={getChampIconUrl(champ.id)}
                  alt={champ.name}
                  className={`w-8 h-8 rounded-full object-cover ${unit.isDead ? 'grayscale opacity-40' : ''}`}
                />
                {unit.isDead && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-full text-red-500 font-bold text-xs">
                    💀 {unit.respawnTime ? `${unit.respawnTime}s` : ''}
                  </div>
                )}
                {isEnemyLaner && (
                  <div className="absolute -top-2 -right-1 bg-red-600 text-white text-[8px] font-black px-1 rounded-full">
                    VS
                  </div>
                )}
              </div>
              <span className="text-[9px] font-bold text-red-300 px-1 rounded bg-black/80 mt-0.5 whitespace-nowrap">
                {unit.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* 3 Tactical Choice Cards */}
      <div className="space-y-3 pt-2">
        <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          {isCs ? '🎯 Vyber taktický postup pro tuto situaci na mapě:' : '🎯 Select your tactical response to this map state:'}
        </p>

        {scenario.choices.map((choice, idx) => {
          const isSelected = selectedChoiceIdx === idx;
          const hasSynergy = choice.synergyRequired && playerChamp.playstyle.toLowerCase().includes(choice.synergyRequired.toLowerCase());

          return (
            <motion.div
              key={choice.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => !resolving && onSelectChoice(idx)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-gold-400 bg-gold-950/50 shadow-xl shadow-gold-500/20'
                  : 'border-rift-border bg-rift-card hover:border-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-gold-400 bg-gold-950/70 px-2 py-0.5 rounded border border-gold-700/50 font-mono">
                      {isCs ? choice.tagCs : choice.tagEn}
                    </span>
                    {hasSynergy && (
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                        🌟 Synergie ({playerChamp.playstyle}) +18 k úspěchu
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white pt-1">
                    {isCs ? choice.titleCs : choice.titleEn}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isCs ? choice.descCs : choice.descEn}
                  </p>
                </div>
                {isSelected && <span className="text-gold-400 font-black text-xl shrink-0">✓</span>}
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-rift-border/60 text-xs">
                <span className="text-slate-400 font-medium">
                  Stat: <strong className="text-slate-200 uppercase">{choice.statKey}</strong>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-green-400 font-bold">+{choice.scoreGain}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-red-400 font-bold">-{Math.abs(choice.scoreLoss)}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    choice.risk === 'High' ? 'bg-red-950/80 text-red-400 border border-red-800' :
                    choice.risk === 'Medium' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                    'bg-green-950/80 text-green-400 border border-green-800'
                  }`}>
                    {choice.risk} Riziko
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
