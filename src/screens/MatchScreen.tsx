import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function MatchScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const currentMatch = useGameStore(s => s.currentMatch);
  const setPhase = useGameStore(s => s.setPhase);

  const [phase, setPhase2] = useState<'loading' | 'result'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => setPhase2('result'), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!currentMatch || !career) return null;

  function handleContinue() {
    setPhase('EVENT');
  }

  return (
    <div className="screen-bg min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-5">

        {/* Loading Phase */}
        {phase === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl">⚔️</div>
            <p className="text-slate-400 text-sm">{t('match.loading')}</p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-rift-purple rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-slate-400 text-sm">
              <div className="text-right">
                <p className="font-semibold text-white">{career.gameName}</p>
                <p className="text-xs">{career.currentTeam?.shortName || 'FREE'}</p>
              </div>
              <span className="text-rift-border font-bold">{t('match.vs')}</span>
              <div className="text-left">
                <p className="font-semibold text-white">{currentMatch.opponentTeam.shortName}</p>
                <p className="text-xs">{currentMatch.opponentTeam.name}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Result Phase */}
        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            {/* Winner Banner */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className={`text-center py-8 rounded-2xl border ${
                currentMatch.won
                  ? 'bg-gradient-to-b from-green-950/60 to-rift-card border-green-700/40'
                  : 'bg-gradient-to-b from-red-950/40 to-rift-card border-red-800/30'
              }`}
            >
              <div className="text-5xl mb-3">{currentMatch.won ? '🏆' : '💔'}</div>
              <h2 className={`text-3xl font-black ${currentMatch.won ? 'text-green-400' : 'text-red-400'}`}
                  style={{ fontFamily: 'Cinzel, serif' }}>
                {currentMatch.won ? t('match.won') : t('match.lost')}
              </h2>
              <p className="text-slate-400 text-2xl font-bold mt-2">{currentMatch.score}</p>
              {currentMatch.mvp && (
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-gold-400 text-sm font-bold mt-2"
                >
                  {t('match.mvp')}
                </motion.p>
              )}
            </motion.div>

            {/* Match Details */}
            <Card className="p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-slate-500 text-xs mb-1">{t('match.vs')}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentMatch.opponentTeam.color }} />
                    <p className="text-white font-semibold">{currentMatch.opponentTeam.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs mb-1">{t('match.performance')}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 bg-rift-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rift-purple to-purple-400 rounded-full transition-all duration-1000"
                        style={{ width: `${currentMatch.playerScore}%` }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm">{currentMatch.playerScore}</span>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {currentMatch.highlights.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-rift-border">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{t('match.highlight')}</p>
                  {currentMatch.highlights.map((h, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-sm text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-rift-purple mt-0.5">▸</span>
                      {h}
                    </motion.p>
                  ))}
                </div>
              )}
            </Card>

            <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
              {t('match.continue')} →
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
