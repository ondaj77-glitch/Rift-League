import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, className = '', fullWidth = false,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 select-none focus:outline-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variants = {
    primary: 'bg-rift-purple hover:bg-purple-700 active:bg-purple-800 text-white shadow-lg shadow-purple-900/30',
    secondary: 'bg-rift-card border border-rift-border hover:border-rift-purple text-slate-200 hover:text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
    danger: 'bg-red-900/40 border border-red-800 hover:bg-red-900/60 text-red-300',
    gold: 'bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-black font-bold shadow-lg shadow-gold-900/30',
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        ${base} ${sizes[size]} ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
