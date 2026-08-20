import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

interface LanguageSwitcherProps {
  size?: 'sm' | 'md';
}

export function LanguageSwitcher({ size = 'md' }: LanguageSwitcherProps) {
  const language = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);

  return (
    <div className="inline-flex items-center p-1 bg-rift-card border border-rift-border rounded-xl shadow-md gap-1">
      {/* Czech Button */}
      <button
        onClick={() => setLanguage('cs')}
        className={`relative px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
          language === 'cs'
            ? 'text-slate-900 font-extrabold shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {language === 'cs' && (
          <motion.div
            layoutId="activeLangPill"
            className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg shadow-lg shadow-amber-500/30 -z-0"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 text-sm">🇨🇿</span>
        <span className="relative z-10">{size === 'sm' ? 'CZ' : 'Čeština'}</span>
      </button>

      {/* English Button */}
      <button
        onClick={() => setLanguage('en')}
        className={`relative px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
          language === 'en'
            ? 'text-slate-900 font-extrabold shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {language === 'en' && (
          <motion.div
            layoutId="activeLangPill"
            className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg shadow-lg shadow-amber-500/30 -z-0"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10 text-sm">🇬🇧</span>
        <span className="relative z-10">{size === 'sm' ? 'EN' : 'English'}</span>
      </button>
    </div>
  );
}
