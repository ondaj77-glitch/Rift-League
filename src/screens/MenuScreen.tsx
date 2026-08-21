import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { getTodayChallenge } from '../data/origins';
import { TEAMS } from '../data/teams';
import { TeamLogo } from '../components/ui/TeamLogo';

export function MenuScreen() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const setPhase = useGameStore(s => s.setPhase);
  const resetGame = useGameStore(s => s.resetGame);
  const startDailyChallenge = useGameStore(s => s.startDailyChallenge);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const todayChallenge = getTodayChallenge();

  const featuredTeams = TEAMS.filter(t => ['t1', 'geng', 'g2', 'fnc', 'c9', 'fly', 'blg', 'wbg', 'kc'].includes(t.id));

  function handleStartNewCareer() {
    if (career) {
      setConfirmResetOpen(true);
    } else {
      setPhase('CHARACTER_CREATION');
    }
  }

  function handleConfirmReset() {
    resetGame();
    setConfirmResetOpen(false);
    setPhase('CHARACTER_CREATION');
  }

  function handleContinueCareer() {
    setPhase('CAREER_HUB');
  }

  function handlePlayDaily() {
    startDailyChallenge();
  }

  return (
    <div className="screen-bg min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg space-y-6">

        {/* Top Header with Version and Language Switcher */}
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            v15.2 · ESPORTS CAREER SIM
          </span>
          <LanguageSwitcher size="sm" />
        </div>

        {/* Hero Section: 3D Worlds Trophy & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          {/* Glowing Worlds Trophy */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="text-7xl select-none filter drop-shadow-[0_0_25px_rgba(234,179,8,0.45)]">
                🏆
              </div>
              <div className="absolute -inset-2 bg-gradient-to-t from-gold-500/20 to-transparent blur-xl -z-10 rounded-full" />
            </div>
          </motion.div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase font-heading">
              <span className="text-white">RIFT </span>
              <span className="text-purple-400">LEGACY</span>
            </h1>
            <p className="text-slate-400 text-xs mt-2.5 max-w-sm mx-auto leading-relaxed font-medium">
              {isCs
                ? 'Jedna kariéra. Tisíc rozhodnutí. Jediná šance získat pohár pro Mistry Světa.'
                : 'One career, a thousand decisions, one shot at the Worlds trophy.'}
            </p>
          </div>

          {/* Minimalist Monochrome Team Logos Ticker */}
          <div className="flex items-center justify-center gap-3 pt-1 opacity-70 grayscale hover:grayscale-0 transition-all">
            {featuredTeams.slice(0, 7).map(team => (
              <TeamLogo key={team.id} team={team} size="xs" />
            ))}
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <div className="space-y-3">
          {career ? (
            <>
              {/* Continue Active Career Button */}
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={handleContinueCareer}
                className="py-4 text-base font-black shadow-lg shadow-gold-950/40 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <span className="block font-black text-sm">
                      {isCs ? 'POKRAČOVAT V KARIÉŘE →' : 'CONTINUE CAREER →'}
                    </span>
                    <span className="text-[11px] text-slate-900 font-bold block opacity-90">
                      {career.gameName} · {career.currentTeam?.name || 'Free Agent'} · {career.split} {career.year}
                    </span>
                  </div>
                  <span className="text-xl">⚔️</span>
                </div>
              </Button>

              {/* Start New Run Button */}
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleStartNewCareer}
                className="border-slate-700 hover:border-slate-500 text-slate-300"
              >
                {isCs ? '🔄 Zahájit Novou Kariéru (Reset)' : '🔄 Start New Career (Reset)'}
              </Button>
            </>
          ) : (
            /* Start My Career Button */
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartNewCareer}
              className="py-4 text-base font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-950/50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-black tracking-wide">
                  {isCs ? 'START MY CAREER →' : 'START MY CAREER →'}
                </span>
                {/* Dot Matrix Corner Pattern */}
                <div className="flex flex-col gap-0.5 opacity-60">
                  <div className="flex gap-0.5"><span className="w-1 h-1 bg-white rounded-full"/><span className="w-1 h-1 bg-white rounded-full"/><span className="w-1 h-1 bg-white rounded-full"/></div>
                  <div className="flex gap-0.5"><span className="w-1 h-1 bg-white rounded-full"/><span className="w-1 h-1 bg-white rounded-full"/><span className="w-1 h-1 bg-white rounded-full"/></div>
                </div>
              </div>
            </Button>
          )}
        </div>

        {/* DAILY CHALLENGE Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-400 font-heading tracking-wider">
                DAILY CHALLENGE
              </span>
              <span className="text-[10px] font-black bg-indigo-950 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded-full uppercase">
                NEW TODAY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">ROLE</span>
                <span className="text-sm font-bold text-white capitalize">{todayChallenge.role}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">REGION</span>
                <span className="text-sm font-bold text-white uppercase">{todayChallenge.region}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">OBJECTIVE</span>
              <span className="text-xs font-semibold text-slate-200 block mt-0.5">
                {isCs ? todayChallenge.objectiveCs : todayChallenge.objectiveEn}
              </span>
            </div>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handlePlayDaily}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600"
            >
              <div className="flex items-center justify-between w-full">
                <span>{isCs ? 'PLAY THE DAILY' : 'PLAY THE DAILY'}</span>
                <span className="text-xs text-indigo-400 font-mono">⚡ TODAY ONLY</span>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Confirmation Reset Modal */}
        <AnimatePresence>
          {confirmResetOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl"
              >
                <div className="text-3xl">⚠️</div>
                <h3 className="text-lg font-bold text-white">
                  {isCs ? 'Zahájit novou kariéru?' : 'Start New Career?'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isCs
                    ? `Máš rozehranou kariéru za hráče ${career?.gameName} (${career?.currentTeam?.name || 'Free Agent'}). Zahájením nové kariéry přepíšeš aktuální postup.`
                    : `You have an ongoing career with ${career?.gameName}. Starting a new run will overwrite your save.`}
                </p>
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" size="md" fullWidth onClick={() => setConfirmResetOpen(false)}>
                    {isCs ? 'Zrušit' : 'Cancel'}
                  </Button>
                  <Button variant="danger" size="md" fullWidth onClick={handleConfirmReset}>
                    {isCs ? 'Smazat & Začít Znovu' : 'Reset & Start'}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
