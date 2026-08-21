import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { getChampIconUrl } from '../../data/champions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean) => void;
  lang?: string;
}

const DRAFT_QUIZZES = [
  {
    enemyChampId: 'LeBlanc',
    enemyName: 'LeBlanc (Assassin Burst & Distortion)',
    contextCs: 'Soupeř v rozhodujícím zápase zamknul LeBlanc. Koho vybereš jako nejstabilnější counter s point-and-click CC?',
    contextEn: 'Enemy locked LeBlanc. Who is the best counter pick with targeted crowd control?',
    options: [
      { id: 'Lissandra', name: 'Lissandra (Glacial CC Lock & Self-R)', isCorrect: true },
      { id: 'Karthus', name: 'Karthus (Immobile Late Scaler)', isCorrect: false },
      { id: 'Ziggs', name: 'Ziggs (Squishy Artilery)', isCorrect: false },
      { id: 'VelKoz', name: 'VelKoz (Immobile Geometry Mage)', isCorrect: false },
    ],
  },
  {
    enemyChampId: 'Blitzcrank',
    enemyName: 'Blitzcrank (Rocket Grab Engage)',
    contextCs: 'Nepřátelský Support locknul Blitzcranka. Který pick kompletně zneguje jeho hook a ochrání carry?',
    contextEn: 'Enemy support locked Blitzcrank. Which pick neutralizes his hook completely?',
    options: [
      { id: 'Morgana', name: 'Morgana (Black Shield Spell Immunity)', isCorrect: true },
      { id: 'Sona', name: 'Sona (Squishy Enchanter)', isCorrect: false },
      { id: 'Yuumi', name: 'Yuumi (Detached Target)', isCorrect: false },
      { id: 'Janna', name: 'Janna (Disengage Tailwind)', isCorrect: false },
    ],
  },
  {
    enemyChampId: 'Aatrox',
    enemyName: 'Aatrox (Darkin Blade Healing Bruiser)',
    contextCs: 'Na topu čelíš Aatroxovi. Koho zvolíš pro agresivní duely a rychlý výmaz s Ignite?',
    contextEn: 'Facing Aatrox on top lane. Who is the best aggressive duelist counter?',
    options: [
      { id: 'Fiora', name: 'Fiora (Riposte Stun & Vital True Damage)', isCorrect: true },
      { id: 'Kayle', name: 'Kayle (Weak Early Game Scaler)', isCorrect: false },
      { id: 'Sion', name: 'Sion (Big Hitbox Tank)', isCorrect: false },
      { id: 'Nasus', name: 'Nasus (Vulnerable Early Farmer)', isCorrect: false },
    ],
  },
];

export function DraftCounterChallenge({ isOpen, onClose, onComplete, lang = 'cs' }: Props) {
  const isCs = lang === 'cs';
  const [quiz] = useState(() => DRAFT_QUIZZES[Math.floor(Math.random() * DRAFT_QUIZZES.length)]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);

  if (!isOpen) return null;

  function handlePick(index: number) {
    setSelectedIdx(index);
    const isCorrect = quiz.options[index].isCorrect;
    setResult(isCorrect ? 'success' : 'fail');

    setTimeout(() => {
      onComplete(isCorrect);
      onClose();
    }, 1400);
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg"
        >
          <Card className="p-6 border-red-800/60 bg-slate-950/95 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center gap-1.5 font-heading">
                <span>🎯</span>
                <span>{isCs ? 'Draft Counter-Pick Challenge' : 'Draft Counter-Pick Challenge'}</span>
              </span>
              <span className="text-[10px] font-mono bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800 font-bold">
                LAST PICK REACTION
              </span>
            </div>

            {/* Enemy Locked Pick Banner */}
            <div className="flex items-center gap-3 bg-red-950/50 p-3 rounded-xl border border-red-700/60">
              <img
                src={getChampIconUrl(quiz.enemyChampId)}
                alt={quiz.enemyName}
                className="w-12 h-12 rounded-lg border-2 border-red-500 object-cover shadow-md"
              />
              <div>
                <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">
                  {isCs ? 'Soupeř zamknul:' : 'Enemy Locked:'}
                </span>
                <h4 className="text-sm font-black text-white">{quiz.enemyName}</h4>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {isCs ? quiz.contextCs : quiz.contextEn}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2">
              {quiz.options.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handlePick(idx)}
                    disabled={result !== null}
                    className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-green-950/80 border-green-500 ring-2 ring-green-500'
                          : 'bg-red-950/80 border-red-500 ring-2 ring-red-500'
                        : 'bg-rift-surface hover:bg-slate-800/80 border-rift-border'
                    }`}
                  >
                    <img
                      src={getChampIconUrl(opt.id)}
                      alt={opt.name}
                      className="w-9 h-9 rounded-lg border border-slate-700 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white">{opt.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Result Feedback */}
            {result && (
              <div className={`p-3 rounded-xl border text-center text-xs font-bold ${
                result === 'success' ? 'bg-green-950/80 border-green-500 text-green-300' : 'bg-red-950/80 border-red-500 text-red-300'
              }`}>
                {result === 'success'
                  ? (isCs ? '✅ EXCELENTNÍ COUNTER-PICK! Získáváš dominanci v lajně a +6 Znalost Hry!' : '✅ EXCELLENT COUNTER! Gained massive lane advantage!')
                  : (isCs ? '❌ CHYBNÝ MATCHUP! Tento pick bude pod enormním tlakem.' : '❌ WEAK MATCHUP! Heavy lane disadvantage.')}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
