import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const CATEGORY_ICONS: Record<string, string> = {
  training: '📚',
  team_dynamics: '👥',
  meta: '🎮',
  contract: '📄',
  social: '📱',
  health: '❤️',
  match: '⚔️',
  international: '🌍',
  career: '⭐',
  soloq: '🔥',
  prodigy: '👶',
};

function EffectChip({ label, value }: { label: string; value: number }) {
  const positive = value > 0;
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
      positive
        ? 'bg-green-950/60 border-green-700/50 text-green-400'
        : 'bg-red-950/60 border-red-700/50 text-red-400'
    }`}>
      {positive ? '+' : ''}{value} {label}
    </span>
  );
}

import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function EventScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const currentEvent = useGameStore(s => s.currentEvent);
  const resolveEvent = useGameStore(s => s.resolveEvent);
  const setPhase = useGameStore(s => s.setPhase);

  // Selection state before confirmation
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);

  // Keep last event in state so during AnimatePresence exit transitions it doesn't flash
  const [cachedEvent, setCachedEvent] = useState(currentEvent);
  if (currentEvent && currentEvent !== cachedEvent) {
    setCachedEvent(currentEvent);
  }

  const eventToRender = currentEvent || cachedEvent;

  if (!career || !eventToRender) {
    return null;
  }

  function handleSelectOption(index: number) {
    if (showResult) return;
    const choice = eventToRender!.choices[index];
    if (choice.requiresStat) {
      if (career!.stats[choice.requiresStat.stat] < choice.requiresStat.min) return; // locked
    }
    setSelectedIdx(index);
  }

  function handleConfirmDecision() {
    if (selectedIdx === null) return;
    setAppliedIdx(selectedIdx);
    setShowResult(true);
  }

  function handleContinue() {
    if (appliedIdx !== null && eventToRender) {
      resolveEvent(eventToRender, appliedIdx);
      setSelectedIdx(null);
      setAppliedIdx(null);
      setShowResult(false);
    }
  }

  const appliedChoice = appliedIdx !== null ? eventToRender.choices[appliedIdx] : null;
  const effects = appliedChoice?.effects || {};
  const significantEffects = Object.entries(effects).filter(([, v]) => v !== 0 && v !== undefined);

  return (
    <div className="screen-bg min-h-screen py-8 px-4 flex items-start justify-center">
      <div className="w-full max-w-xl space-y-5">

        {/* Event Header with Language Switcher */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">{CATEGORY_ICONS[eventToRender.category] || '📋'}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              {career.gameName} · {t('event.week')} {career.week}
            </span>
          </div>
          <LanguageSwitcher size="sm" />
        </motion.div>

        {/* Main Event Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-6 space-y-4 border-gold-600/30">
            <h2 className="text-xl font-bold text-white leading-tight font-heading uppercase tracking-wide">
              {t(eventToRender.titleKey as any)}
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              {t(eventToRender.descriptionKey as any)}
            </p>
          </Card>
        </motion.div>

        {/* Choices List */}
        <AnimatePresence>
          {!showResult && (
            <motion.div
              key="choices"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {t('event.choose')}
              </p>

              {eventToRender.choices.map((choice, i) => {
                const isSelected = selectedIdx === i;
                const isLocked = choice.requiresStat
                  ? career.stats[choice.requiresStat.stat] < choice.requiresStat.min
                  : false;

                return (
                  <motion.div
                    key={i}
                    whileHover={isLocked ? {} : { scale: 1.01 }}
                    onClick={() => !isLocked && handleSelectOption(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-gold-400 bg-gold-950/40 shadow-lg shadow-gold-500/20'
                        : isLocked
                        ? 'border-rift-border/30 bg-rift-card/30 opacity-40 cursor-not-allowed'
                        : 'border-rift-border bg-rift-card hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isSelected ? 'border-gold-400 bg-gold-400 text-black font-extrabold' : 'border-rift-border text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed ${isSelected ? 'text-white font-bold' : 'text-slate-300'}`}>
                          {t(choice.textKey as any)}
                        </p>
                        {isLocked && choice.requiresStat && (
                          <p className="text-xs text-amber-500 font-semibold mt-1">
                            🔒 {t('event.locked')} {t(`stat.${choice.requiresStat.stat}` as any)} ({choice.requiresStat.min})
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="text-gold-400 font-black text-lg">✓</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Confirm Choice Button */}
              <div className="pt-2">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  disabled={selectedIdx === null}
                  onClick={handleConfirmDecision}
                >
                  ⚡ {t('event.confirm_choice_btn')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result & Consequences */}
        <AnimatePresence>
          {showResult && appliedChoice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-5 space-y-4 border-gold-600/40 bg-rift-card">
                <div className="flex items-center gap-2">
                  <span className="text-gold-400 text-lg">📋</span>
                  <p className="text-sm font-bold text-slate-200">{t('event.result')}</p>
                </div>

                {appliedChoice.nextTextKey && (
                  <p className="text-white text-sm leading-relaxed">
                    {t(appliedChoice.nextTextKey as any)}
                  </p>
                )}

                {/* Stat Effects */}
                {significantEffects.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-rift-border">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Stat Adjustments</p>
                    <div className="flex flex-wrap gap-2">
                      {significantEffects.map(([key, value]) => (
                        <EffectChip
                          key={key}
                          label={
                            key === 'salary' ? 'Salary' :
                            key === 'savings' ? '$ Cash' :
                            key === 'teamStrength' ? 'Team Str' :
                            key === 'coachTrust' ? 'Coach Trust' :
                            key === 'lp' ? 'LP' :
                            t(`stat.${key}` as any)
                          }
                          value={value as number}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
                {t('event.continue')} →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
