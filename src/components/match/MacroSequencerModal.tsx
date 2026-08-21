import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface MacroStep {
  id: string;
  labelCs: string;
  labelEn: string;
  icon: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean) => void;
  lang?: string;
}

const SAMPLE_STEPS: MacroStep[] = [
  { id: 'baron', labelCs: 'Zabít Barona Nashora v řece', labelEn: 'Slay Baron Nashor in river', icon: '👑' },
  { id: 'recall', labelCs: 'Resetovat na bázi a utratit 2500g', labelEn: 'Base recall & spend 2,500g', icon: '🛍️' },
  { id: 'push', labelCs: '5v0 Siege na Mid Inhibitor s Baron Buffem', labelEn: '5-Man Mid Inhibitor Siege with Baron', icon: '💥' },
];

const CORRECT_ORDER = ['baron', 'recall', 'push'];

export function MacroSequencerModal({ isOpen, onClose, onComplete, lang = 'cs' }: Props) {
  const isCs = lang === 'cs';
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);

  if (!isOpen) return null;

  function handleToggleStep(id: string) {
    if (selectedOrder.includes(id)) {
      setSelectedOrder(selectedOrder.filter(s => s !== id));
    } else {
      setSelectedOrder([...selectedOrder, id]);
    }
  }

  function handleVerify() {
    const isCorrect =
      selectedOrder.length === CORRECT_ORDER.length &&
      selectedOrder.every((id, idx) => id === CORRECT_ORDER[idx]);

    setResult(isCorrect ? 'success' : 'fail');
    setTimeout(() => {
      onComplete(isCorrect);
      onClose();
    }, 1500);
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
          <Card className="p-6 border-gold-600/40 space-y-4 bg-slate-950/95 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-gold-400 tracking-wider flex items-center gap-1.5">
                <span>🧠</span>
                <span>{isCs ? 'Macro Sequencer – Seřaď Krok za Krokem' : 'Macro Sequencer – Order the Play'}</span>
              </span>
              <span className="text-[11px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                TEMPO CALL
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {isCs ? 'Dali jste Ace u Draka, zbývá 35 vteřin do respawnu.' : 'Team wiped with Ace, 35 seconds death timers.'}
              </h3>
              <p className="text-xs text-slate-300">
                {isCs
                  ? 'Klikni na akce v přesném pořadí, jak má tým postupovat pro maximální makro efektivitu:'
                  : 'Click the actions in optimal tempo order to maximize objective pressure:'}
              </p>
            </div>

            {/* Selected Sequence Preview */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 min-h-[52px] flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold uppercase">Pořadí:</span>
              {selectedOrder.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Klikni níže na kroky 1, 2, 3...</span>
              ) : (
                selectedOrder.map((id, index) => {
                  const step = SAMPLE_STEPS.find(s => s.id === id);
                  return (
                    <div
                      key={id}
                      onClick={() => handleToggleStep(id)}
                      className="cursor-pointer bg-gold-950/60 border border-gold-500/60 text-gold-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold"
                    >
                      <span>{index + 1}.</span>
                      <span>{step?.icon}</span>
                      <span>{isCs ? step?.labelCs.split(' ')[0] : step?.labelEn.split(' ')[0]}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Available Step Choices */}
            <div className="space-y-2">
              {SAMPLE_STEPS.map(step => {
                const isPicked = selectedOrder.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleToggleStep(step.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isPicked
                        ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-500'
                        : 'bg-rift-surface hover:bg-slate-800/80 border-rift-border'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{step.icon}</span>
                      <span className="text-xs font-bold text-white">
                        {isCs ? step.labelCs : step.labelEn}
                      </span>
                    </div>
                    {isPicked && (
                      <span className="text-xs font-mono font-bold text-gold-400 bg-black/40 px-2 py-0.5 rounded">
                        #{selectedOrder.indexOf(step.id) + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result Feedback Banner */}
            {result && (
              <div className={`p-3 rounded-xl border text-center text-xs font-bold ${
                result === 'success' ? 'bg-green-950/80 border-green-500 text-green-300' : 'bg-red-950/80 border-red-500 text-red-300'
              }`}>
                {result === 'success'
                  ? (isCs ? '✅ DOKONALÉ MAKRO! Vzali jste Barona s plným nákupem a otevřeli bázi!' : '✅ PERFECT MACRO CALL! Clean Baron siege execute!')
                  : (isCs ? '❌ CHYBNÝ TEMPO CALL! Soupeř stihl zrespawnovat a bránit bázi.' : '❌ FAILED TEMPO! Enemy respawned and defended.')}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedOrder([])}
              >
                Resetovat
              </Button>
              <Button
                variant="gold"
                size="md"
                fullWidth
                disabled={selectedOrder.length !== SAMPLE_STEPS.length || result !== null}
                onClick={handleVerify}
              >
                ⚡ Ověřit Makro Sekvenci
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
