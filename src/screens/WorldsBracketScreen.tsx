import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TEAMS, getTopTeamsByRegion } from '../data/teams';
import { simulateMatch } from '../utils/simulation';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import type { Team } from '../types/game';

type BracketRound = 'QF' | 'SF' | 'F';

interface BracketMatch {
  teamA: Team;
  teamB: Team;
  winner?: Team;
  score?: string;
}

function generateBracket(playerTeam: Team, region: string, isWorlds: boolean): BracketMatch[] {
  const regionKey = region as any;
  let pool: Team[];

  if (isWorlds) {
    // Worlds: top 2 from each region
    pool = [
      ...getTopTeamsByRegion('LCK', 2),
      ...getTopTeamsByRegion('LPL', 2),
      ...getTopTeamsByRegion('LEC', 2),
      ...getTopTeamsByRegion('LTA_N', 1),
      ...getTopTeamsByRegion('LCP', 1),
    ];
  } else {
    pool = TEAMS.filter(t => t.region === regionKey).sort((a, b) => b.strength - a.strength).slice(0, 7);
  }

  // Remove player's team if present, then shuffle rest
  const others = pool.filter(t => t.id !== playerTeam.id).sort(() => Math.random() - 0.5).slice(0, 7);

  // QF: player vs 8th seed
  return [
    { teamA: playerTeam, teamB: others[0] },
    { teamA: others[1], teamB: others[2] },
    { teamA: others[3], teamB: others[4] },
    { teamA: others[5], teamB: others[6] || others[0] },
  ];
}

export function WorldsBracketScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const nextSplit = useGameStore(s => s.nextSplit);
  const setPhase = useGameStore(s => s.setPhase);
  const retire = useGameStore(s => s.retire);

  if (!career) return null;

  const isWorlds = career.internationalEvent === 'Worlds';
  const titleKey = isWorlds ? 'bracket.title.worlds' :
                  career.internationalEvent === 'MSI' ? 'bracket.title.msi' :
                  career.splitNumber ? 'bracket.title.playoffs' : 'bracket.title.fst';

  const [round, setRound] = useState<BracketRound>('QF');
  const [qfResults, setQfResults] = useState<(BracketMatch & { winner: Team; score: string })[] | null>(null);
  const [sfResults, setSfResults] = useState<(BracketMatch & { winner: Team; score: string })[] | null>(null);
  const [finalResult, setFinalResult] = useState<(BracketMatch & { winner: Team; score: string }) | null>(null);
  const [playerEliminated, setPlayerEliminated] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);

  const bracket = useState(() =>
    generateBracket(career.currentTeam!, career.region, isWorlds)
  )[0];

  function simulateBracketMatch(match: BracketMatch, playerTeam: Team): BracketMatch & { winner: Team; score: string } {
    const playerIsA = match.teamA.id === playerTeam.id;
    const playerIsB = match.teamB.id === playerTeam.id;

    if (playerIsA || playerIsB) {
      const result = simulateMatch(career!, playerIsA ? match.teamB : match.teamA);
      const winner = result.won ? playerTeam : (playerIsA ? match.teamB : match.teamA);
      return { ...match, winner, score: result.score };
    } else {
      // CPU vs CPU
      const aStrength = match.teamA.strength + Math.random() * 20 - 10;
      const bStrength = match.teamB.strength + Math.random() * 20 - 10;
      const winner = aStrength > bStrength ? match.teamA : match.teamB;
      const score = Math.random() > 0.5 ? '3-1' : (Math.random() > 0.5 ? '3-0' : '3-2');
      return { ...match, winner, score };
    }
  }

  function handleSimulateQF() {
    const results = bracket.map(m => simulateBracketMatch(m, career!.currentTeam!));
    setQfResults(results as any);

    const playerMatch = results.find(r => r.teamA.id === career!.currentTeam!.id || r.teamB.id === career!.currentTeam!.id);
    if (playerMatch && playerMatch.winner.id !== career!.currentTeam!.id) {
      setPlayerEliminated(true);
    }
    setRound('SF');
  }

  function handleSimulateSF() {
    if (!qfResults) return;
    const sfMatches: BracketMatch[] = [
      { teamA: qfResults[0].winner, teamB: qfResults[1].winner },
      { teamA: qfResults[2].winner, teamB: qfResults[3].winner },
    ];
    const results = sfMatches.map(m => simulateBracketMatch(m, career!.currentTeam!));
    setSfResults(results as any);

    const playerMatch = results.find(r => r.teamA.id === career!.currentTeam!.id || r.teamB.id === career!.currentTeam!.id);
    if (playerMatch && playerMatch.winner.id !== career!.currentTeam!.id) {
      setPlayerEliminated(true);
    }
    setRound('F');
  }

  function handleSimulateFinal() {
    if (!sfResults) return;
    const finalMatch: BracketMatch = { teamA: sfResults[0].winner, teamB: sfResults[1].winner };
    const result = simulateBracketMatch(finalMatch, career!.currentTeam!);
    setFinalResult(result as any);

    if (result.winner.id === career!.currentTeam!.id) {
      setPlayerWon(true);
    }
  }

  function handleContinue() {
    if (playerWon && isWorlds) {
      // Win worlds → retirement with legendary status
      retire();
    } else {
      nextSplit();
    }
  }

  const showQFButton = round === 'QF';
  const showSFButton = round === 'SF' && qfResults && !playerEliminated;
  const showFinalButton = round === 'F' && sfResults && !playerEliminated;
  const showResult = finalResult || playerEliminated;

  function MatchCard({ match, label }: { match: BracketMatch & { winner?: Team; score?: string }; label?: string }) {
    return (
      <div className="bg-rift-surface rounded-lg border border-rift-border p-3 space-y-2">
        {label && <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>}
        {[match.teamA, match.teamB].map((team, i) => (
          <div key={i} className={`flex items-center justify-between p-2 rounded ${
            match.winner?.id === team.id ? 'bg-green-950/30 border border-green-800/30' :
            match.winner && match.winner.id !== team.id ? 'opacity-40' : ''
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }} />
              <span className={`text-sm font-medium ${team.id === career!.currentTeam?.id ? 'text-white font-bold' : 'text-slate-300'}`}>
                {team.shortName}
                {team.id === career!.currentTeam?.id && <span className="text-rift-purple text-xs ml-1">({t('bracket.you')})</span>}
              </span>
            </div>
            {match.winner?.id === team.id && (
              <span className="text-green-400 text-xs font-bold">{match.score} ✓</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="screen-bg min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Top Header with Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher size="sm" />
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl font-black text-gold-400 font-heading uppercase tracking-wide">
            {t(titleKey as any)}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{career.year}</p>
        </motion.div>

        {/* QF */}
        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider">{t('bracket.quarterfinals')}</p>
          <div className="grid grid-cols-2 gap-3">
            {bracket.map((match, i) => (
              <MatchCard key={i} match={{ ...match, ...(qfResults?.[i] || {}) } as any} />
            ))}
          </div>
        </div>

        {/* SF */}
        {qfResults && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider">{t('bracket.semifinals')}</p>
            <div className="grid grid-cols-2 gap-3">
              {[[0, 1], [2, 3]].map(([a, b], i) => (
                <MatchCard key={i}
                  match={{
                    teamA: qfResults[a].winner,
                    teamB: qfResults[b].winner,
                    ...(sfResults?.[i] || {}),
                  } as any}
                />
              ))}
            </div>
          </div>
        )}

        {/* Final */}
        {sfResults && (
          <div className="space-y-3">
            <p className="text-xs text-gold-500 uppercase tracking-wider font-bold">🏆 {t('bracket.final')}</p>
            <MatchCard
              match={{
                teamA: sfResults[0].winner,
                teamB: sfResults[1].winner,
                ...(finalResult || {}),
              } as any}
            />
          </div>
        )}

        {/* Player Eliminated */}
        {playerEliminated && !finalResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 bg-red-950/20 rounded-xl border border-red-800/30"
          >
            <p className="text-red-400 font-bold text-lg">Eliminated</p>
            <p className="text-slate-500 text-sm mt-1">Your run ends here. Keep watching?</p>
          </motion.div>
        )}

        {/* Winner */}
        {playerWon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center py-8 bg-gold-600/10 rounded-xl border border-gold-600/30"
          >
            <div className="text-6xl mb-3">🏆</div>
            <p className="text-gold-400 font-black text-2xl font-heading uppercase tracking-wide">
              {t('bracket.champion')}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {showQFButton && (
            <Button variant="primary" size="lg" fullWidth onClick={handleSimulateQF}>
              {t('bracket.simulate')} ({t('bracket.quarterfinals')})
            </Button>
          )}
          {showSFButton && (
            <Button variant="primary" size="lg" fullWidth onClick={handleSimulateSF}>
              {t('bracket.simulate')} ({t('bracket.semifinals')})
            </Button>
          )}
          {showFinalButton && (
            <Button variant="gold" size="lg" fullWidth onClick={handleSimulateFinal}>
              🏆 {t('bracket.simulate')} ({t('bracket.final')})
            </Button>
          )}
          {(showResult || playerEliminated) && (
            <Button variant={playerWon ? 'gold' : 'secondary'} size="lg" fullWidth onClick={handleContinue}>
              {playerWon ? '🏆 Claim Your Legacy →' : 'Continue →'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
