import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import type { Language } from '../types/game';

export function LanguageSelectScreen() {
  const setLanguage = useGameStore(s => s.setLanguage);
  const setPhase = useGameStore(s => s.setPhase);

  function choose(lang: Language) {
    setLanguage(lang);
    setPhase('MENU');
  }

  return (
    <div className="screen-bg min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-10 max-w-md w-full px-6"
      >
        {/* Trophy */}
        <div className="text-8xl trophy-glow select-none">🏆</div>

        <div>
          <h1 className="text-5xl font-black tracking-tight uppercase font-heading">
            <span className="text-white">RIFT </span>
            <span className="text-gold-400">LEGACY</span>
          </h1>
        </div>

        <div className="space-y-3">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">
            Choose language / Vyber jazyk
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => choose('en')}
              className="flex-1 max-w-[160px] py-4 px-6 bg-rift-card border border-rift-border rounded-xl
                         hover:border-rift-purple hover:bg-purple-950/30 transition-all duration-200
                         text-white font-semibold text-lg"
            >
              🇬🇧 English
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => choose('cs')}
              className="flex-1 max-w-[160px] py-4 px-6 bg-rift-card border border-rift-border rounded-xl
                         hover:border-rift-purple hover:bg-purple-950/30 transition-all duration-200
                         text-white font-semibold text-lg"
            >
              🇨🇿 Čeština
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
