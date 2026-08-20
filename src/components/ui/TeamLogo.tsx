import React from 'react';
import type { Team } from '../../types/game';

interface TeamLogoProps {
  team?: Team | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const TEAM_ICONS: Record<string, { icon: string; bg: string; border: string; text: string }> = {
  // LCK
  t1: { icon: '👑', bg: 'from-red-900 to-rose-950', border: 'border-red-500', text: 'text-red-300' },
  geng: { icon: '🛡️', bg: 'from-amber-900 to-yellow-950', border: 'border-amber-400', text: 'text-amber-300' },
  hle: { icon: '🧡', bg: 'from-orange-900 to-amber-950', border: 'border-orange-500', text: 'text-orange-300' },
  dk: { icon: '⚡', bg: 'from-blue-900 to-cyan-950', border: 'border-cyan-400', text: 'text-cyan-300' },
  kt: { icon: '🚀', bg: 'from-rose-900 to-red-950', border: 'border-rose-500', text: 'text-rose-300' },
  kdf: { icon: '⚔️', bg: 'from-red-950 to-orange-950', border: 'border-red-600', text: 'text-red-300' },
  drx: { icon: '🐉', bg: 'from-sky-900 to-blue-950', border: 'border-sky-400', text: 'text-sky-300' },
  bnk: { icon: '🦊', bg: 'from-orange-950 to-amber-950', border: 'border-orange-600', text: 'text-orange-300' },
  ns: { icon: '🍜', bg: 'from-red-950 to-rose-950', border: 'border-red-500', text: 'text-red-300' },
  bro: { icon: '⚔️', bg: 'from-emerald-950 to-green-950', border: 'border-emerald-500', text: 'text-emerald-300' },

  // LPL
  blg: { icon: '⚡', bg: 'from-cyan-900 to-sky-950', border: 'border-cyan-400', text: 'text-cyan-200' },
  tes: { icon: '⚔️', bg: 'from-amber-900 to-yellow-950', border: 'border-amber-400', text: 'text-amber-300' },
  jdg: { icon: '👹', bg: 'from-zinc-900 to-red-950', border: 'border-red-600', text: 'text-red-400' },
  weibo: { icon: '👁️', bg: 'from-orange-900 to-amber-950', border: 'border-orange-500', text: 'text-orange-300' },
  lng: { icon: '麒', bg: 'from-purple-900 to-indigo-950', border: 'border-purple-400', text: 'text-purple-300' },
  edg: { icon: '🛡️', bg: 'from-slate-900 to-blue-950', border: 'border-blue-500', text: 'text-blue-300' },
  fpx: { icon: '🦅', bg: 'from-red-900 to-amber-950', border: 'border-red-500', text: 'text-red-300' },
  nip: { icon: '🥷', bg: 'from-emerald-950 to-green-900', border: 'border-emerald-400', text: 'text-emerald-300' },
  rng: { icon: '👑', bg: 'from-amber-950 to-yellow-950', border: 'border-amber-400', text: 'text-amber-300' },
  imt: { icon: '⚡', bg: 'from-blue-950 to-sky-950', border: 'border-blue-400', text: 'text-blue-300' },
  omg: { icon: '🌌', bg: 'from-teal-950 to-cyan-950', border: 'border-teal-400', text: 'text-teal-300' },
  we: { icon: '🛡️', bg: 'from-red-950 to-rose-950', border: 'border-red-500', text: 'text-red-300' },

  // LEC
  g2: { icon: '🥷', bg: 'from-slate-900 to-zinc-950', border: 'border-slate-300', text: 'text-white' },
  fnc: { icon: '⚡', bg: 'from-orange-950 to-amber-950', border: 'border-orange-500', text: 'text-orange-300' },
  kc: { icon: '🦅', bg: 'from-sky-900 to-blue-950', border: 'border-sky-400', text: 'text-sky-300' },
  bds: { icon: '🛡️', bg: 'from-rose-950 to-pink-950', border: 'border-rose-500', text: 'text-rose-300' },
  mad: { icon: '🦁', bg: 'from-cyan-950 to-blue-950', border: 'border-cyan-400', text: 'text-cyan-300' },
  vit: { icon: '🐝', bg: 'from-yellow-950 to-amber-900', border: 'border-yellow-400', text: 'text-yellow-300' },
  hr: { icon: '⚔️', bg: 'from-red-950 to-zinc-900', border: 'border-red-500', text: 'text-red-300' },
  sk: { icon: '🛡️', bg: 'from-orange-950 to-zinc-900', border: 'border-orange-500', text: 'text-orange-300' },
  gx: { icon: '⚡', bg: 'from-indigo-950 to-purple-950', border: 'border-indigo-400', text: 'text-indigo-300' },
  rge: { icon: '🥷', bg: 'from-sky-950 to-blue-950', border: 'border-sky-400', text: 'text-sky-300' },

  // LTA_N
  fly: { icon: '🌳', bg: 'from-emerald-950 to-green-950', border: 'border-emerald-400', text: 'text-emerald-300' },
  tl: { icon: '🐎', bg: 'from-blue-950 to-teal-950', border: 'border-teal-400', text: 'text-teal-300' },
  c9: { icon: '☁️', bg: 'from-sky-900 to-blue-950', border: 'border-sky-400', text: 'text-sky-200' },
  '100t': { icon: '💯', bg: 'from-red-950 to-zinc-900', border: 'border-red-500', text: 'text-red-300' },
  sr: { icon: '⚡', bg: 'from-purple-950 to-indigo-950', border: 'border-purple-400', text: 'text-purple-300' },
  dig: { icon: '👽', bg: 'from-orange-950 to-amber-950', border: 'border-orange-500', text: 'text-orange-300' },
  dsg: { icon: '🎭', bg: 'from-yellow-950 to-amber-950', border: 'border-yellow-400', text: 'text-yellow-300' },

  // LTA_S
  pain: { icon: '⚔️', bg: 'from-red-950 to-black', border: 'border-red-600', text: 'text-red-300' },
  loud: { icon: '🔊', bg: 'from-green-950 to-emerald-950', border: 'border-green-400', text: 'text-green-300' },
  red: { icon: '🐺', bg: 'from-red-950 to-rose-950', border: 'border-red-500', text: 'text-red-300' },
  vks: { icon: '⭐', bg: 'from-lime-950 to-green-950', border: 'border-lime-400', text: 'text-lime-300' },
  fluxo: { icon: '🌊', bg: 'from-orange-950 to-red-950', border: 'border-orange-500', text: 'text-orange-300' },
  fur: { icon: '🐾', bg: 'from-zinc-900 to-black', border: 'border-zinc-300', text: 'text-zinc-200' },
  isurus: { icon: '🦈', bg: 'from-cyan-950 to-blue-950', border: 'border-cyan-400', text: 'text-cyan-300' },

  // LCP
  psg: { icon: '🛡️', bg: 'from-blue-950 to-sky-950', border: 'border-blue-400', text: 'text-blue-300' },
  gam: { icon: '⚡', bg: 'from-amber-950 to-yellow-950', border: 'border-amber-400', text: 'text-amber-300' },
  cfo: { icon: '🦪', bg: 'from-sky-950 to-blue-950', border: 'border-sky-400', text: 'text-sky-300' },
  shg: { icon: '🦅', bg: 'from-yellow-950 to-amber-950', border: 'border-yellow-400', text: 'text-yellow-300' },
  chiefs: { icon: '👑', bg: 'from-amber-950 to-yellow-900', border: 'border-amber-400', text: 'text-amber-300' },
};

const SIZE_STYLES = {
  xs: 'w-6 h-6 text-xs rounded-md',
  sm: 'w-8 h-8 text-sm rounded-lg',
  md: 'w-11 h-11 text-base rounded-xl',
  lg: 'w-14 h-14 text-xl rounded-2xl',
  xl: 'w-16 h-16 text-2xl rounded-2xl',
};

const TEXT_SIZES = {
  xs: 'text-[9px]',
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
};

export function TeamLogo({ team, size = 'md', className = '' }: TeamLogoProps) {
  if (!team) {
    return (
      <div className={`${SIZE_STYLES[size]} bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold ${className}`}>
        FA
      </div>
    );
  }

  const style = TEAM_ICONS[team.id] || {
    icon: '⚡',
    bg: 'from-slate-900 to-indigo-950',
    border: 'border-slate-500',
    text: 'text-slate-200',
  };

  return (
    <div
      className={`relative ${SIZE_STYLES[size]} bg-gradient-to-br ${style.bg} border-2 ${style.border} flex flex-col items-center justify-center shadow-lg flex-shrink-0 select-none ${className}`}
      title={team.name}
    >
      <span className="leading-none drop-shadow">{style.icon}</span>
      <span className={`font-black uppercase tracking-tighter ${TEXT_SIZES[size]} ${style.text} font-heading leading-none mt-0.5`}>
        {team.shortName}
      </span>
    </div>
  );
}
