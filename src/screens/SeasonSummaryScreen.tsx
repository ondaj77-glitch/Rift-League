import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TEAMS } from '../data/teams';
import { generateStandings } from '../utils/simulation';

import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function SeasonSummaryScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const nextSplit = useGameStore(s => s.nextSplit);
  const setPhase = useGameStore(s => s.setPhase);

  if (!career) {
    return (
      <div className="screen-bg min-h-screen flex items-center justify-center p-4">
        <Button onClick={() => setPhase('MENU')}>Hlavní Menu</Button>
      </div>
    );
  }

  const isProdigy = !career.currentTeam;
  const total = career.wins + career.losses;
  const winRate = total > 0 ? Math.round(career.wins / total * 100) : 0;
  const qualifiedPlayoffs = !isProdigy && (career.wins / Math.max(1, total) >= 0.5 || career.wins >= 5);
  const qualifiedIntl = !isProdigy && winRate >= 60 && career.stats.reputation >= 60 && career.splitNumber === 3;

  const standings = generateStandings(
    career.currentTeam,
    career.region,
    career.wins,
    career.losses,
    TEAMS
  );

  const playerRank = standings.findIndex(s => s.isPlayer) + 1;

  return (
    <div className="screen-bg min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Top Header with Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher size="sm" />
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-white text-center font-heading uppercase tracking-wide">
            {t('season.title')}
          </h1>
          <p className="text-center text-slate-400 text-sm mt-1">
            {career.split} Split {career.year}
          </p>
        </motion.div>

        {/* Your Result */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className={`p-5 text-center border ${
            qualifiedPlayoffs ? 'border-green-700/40 bg-green-950/20' : 'border-rift-border'
          }`}>
            <div className="flex justify-center gap-8 mb-4">
              <div>
                <p className="text-3xl font-black text-green-400">{career.wins}</p>
                <p className="text-slate-500 text-xs">{t('season.wins')}</p>
              </div>
              <div className="w-px bg-rift-border" />
              <div>
                <p className="text-3xl font-black text-red-400">{career.losses}</p>
                <p className="text-slate-500 text-xs">{t('season.losses')}</p>
              </div>
              <div className="w-px bg-rift-border" />
              <div>
                <p className="text-3xl font-black text-gold-400">#{playerRank}</p>
                <p className="text-slate-500 text-xs">{t('season.rank')}</p>
              </div>
            </div>

            {qualifiedIntl ? (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-gold-400 font-bold"
              >
                {t('season.qualified_intl')}
              </motion.p>
            ) : qualifiedPlayoffs ? (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-green-400 font-bold"
              >
                {t('season.qualified')}
              </motion.p>
            ) : (
              <p className="text-slate-500 text-sm">{t('season.eliminated')}</p>
            )}
          </Card>
        </motion.div>

        {/* Standings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="px-5 py-4 border-b border-rift-border">
              <h3 className="font-semibold text-slate-100 text-sm">{t('season.standings')}</h3>
            </div>
            <div className="divide-y divide-rift-border/50">
              {standings.slice(0, 8).map((s, i) => (
                <motion.div
                  key={s.team.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className={`flex items-center px-5 py-3 ${s.isPlayer ? 'bg-purple-950/20' : ''}`}
                >
                  <span className={`w-6 text-sm font-bold ${i < 4 ? 'text-gold-400' : 'text-slate-600'}`}>
                    {i + 1}
                  </span>
                  <div className="w-2 h-2 rounded-full mr-3 ml-1 flex-shrink-0" style={{ backgroundColor: s.team.color }} />
                  <span className={`flex-1 text-sm font-medium ${s.isPlayer ? 'text-white' : 'text-slate-300'}`}>
                    {s.team.shortName}
                    {s.isPlayer && <span className="text-rift-purple text-xs ml-1">({t('bracket.you')})</span>}
                  </span>
                  <span className="text-green-400 text-sm font-semibold w-6 text-center">{s.wins}</span>
                  <span className="text-slate-600 text-sm mx-1">–</span>
                  <span className="text-red-400 text-sm font-semibold w-6 text-center">{s.losses}</span>
                  {i < 4 && <span className="text-xs text-gold-400/60 ml-3">Playoffs</span>}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Continue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Button
            variant={qualifiedPlayoffs ? 'gold' : 'primary'}
            size="lg"
            fullWidth
            onClick={nextSplit}
          >
            {qualifiedPlayoffs ? `🏆 ${t('season.playoff_start')}` : t('season.next_split')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
