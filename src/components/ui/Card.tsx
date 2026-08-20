import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  gold?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', glow = false, gold = false, onClick }: CardProps) {
  const base = 'bg-rift-card rounded-xl border';
  const border = gold ? 'border-gold-600/40' : 'border-rift-border';
  const shadow = glow ? 'card-glow' : '';
  const goldBg = gold ? 'bg-gradient-to-b from-gold-600/5 to-transparent' : '';
  const cursor = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01, borderColor: 'rgba(124,58,237,0.5)' } : {}}
      className={`${base} ${border} ${shadow} ${goldBg} ${cursor} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-rift-border">
      <div className="flex items-center gap-3">
        {icon && <span className="text-gold-400 text-lg">{icon}</span>}
        <div>
          <h3 className="font-semibold text-slate-100 text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
