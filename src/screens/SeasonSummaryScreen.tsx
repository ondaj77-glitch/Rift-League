import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TEAMS } from '../data/teams';
import { generateStandings } from '../utils/simulation';
import { TIER_ICONS, TIER_COLORS } from '../data/ranks';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export function SeasonSummaryScreen() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
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
  const soloqWins = career.soloqWins ?? 0;
  const soloqLosses = career.soloqLosses ?? 0;
  const totalSoloq = soloqWins + soloqLosses;
  const soloqWinRate = totalSoloq > 0 ? Math.round((soloqWins / totalSoloq) * 100) : 50;

  const totalPro = career.wins + career.losses;
  const proWinRate = totalPro > 0 ? Math.round((career.wins / totalPro) * 100) : 0;
  const qualifiedPlayoffs = !isProdigy && (career.wins / Math.max(1, totalPro) >= 0.5 || career.wins >= 5);
  const qualifiedIntl = !isProdigy && proWinRate >= 60 && (career.stats?.reputation ?? 0) >= 60 && career.splitNumber === 3;

  const rank = career.rank || { tier: 'BRONZE', division: 'IV', lp: 0, globalRank: 1500000 };
  const rankColors = TIER_COLORS[rank.tier] || TIER_COLORS.BRONZE;
  const rankIcon = TIER_ICONS[rank.tier] || '🥉';

  const standings = !isProdigy ? generateStandings(
    career.currentTeam,
    career.region,
    career.wins,
    career.losses,
    TEAMS
  ) : [];

  const playerRank = !isProdigy ? standings.findIndex(s => s.isPlayer) + 1 : 0;

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
            {isProdigy
              ? (isCs ? '👑 Zhodnocení SoloQ Splitu' : '👑 SoloQ Split Summary')
              : t('season.title')}
          </h1>
          <p className="text-center text-slate-400 text-sm mt-1">
            {isProdigy
              ? (isCs ? `SoloQ Talent (${career.age} let) · ${career.split} Split ${career.year}` : `SoloQ Prodigy (${career.age} y/o) · ${career.split} Split ${career.year}`)
              : `${career.split} Split ${career.year}`}
          </p>
        </motion.div>

        {/* PRODIGY SOLOQ RECAP (When not on a pro team) */}
        {isProdigy ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Main Rank Milestone Card */}
            <div className={`p-6 rounded-2xl border ${rankColors.bg} ${rankColors.border} ${rankColors.glow} shadow-xl text-center space-y-3`}>
              <div className="text-5xl select-none">{rankIcon}</div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  {isCs ? 'Dosažený SoloQ Rank na konci splitu' : 'End of Split Ranked Tier'}
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black uppercase font-heading ${rankColors.text}`}>
                  {rank.tier} {rank.division || ''} ({rank.lp} LP)
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  #{rank.globalRank?.toLocaleString() || '1.5M'} {isCs ? 'na světovém serveru' : 'global server ranking'}
                </p>
              </div>
            </div>

            {/* SoloQ Match Statistics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center">
                <p className="text-2xl font-black text-green-400">{soloqWins}</p>
                <p className="text-xs text-slate-400 mt-0.5">{isCs ? 'SoloQ Výhry' : 'SoloQ Wins'}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-black text-red-400">{soloqLosses}</p>
                <p className="text-xs text-slate-400 mt-0.5">{isCs ? 'SoloQ Prohry' : 'SoloQ Losses'}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-black text-gold-400">{soloqWinRate}%</p>
                <p className="text-xs text-slate-400 mt-0.5">{isCs ? 'Úspěšnost' : 'Win Rate'}</p>
              </Card>
            </div>

            {/* Scouting & Pro Eligibility Status Card */}
            <Card className="p-5 space-y-2 border-gold-600/30">
              <div className="flex items-center gap-2">
                <span className="text-lg">🕵️</span>
                <h3 className="font-bold text-white text-sm uppercase font-heading">
                  {isCs ? 'Skautská Zpráva & Profi Status' : 'Scouting Report & Pro Eligibility'}
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {career.age < 17 ? (
                  isCs
                    ? `Je ti ${career.age} let. Do způsobilosti podepsat oficiální profesionální kontrakt zbývá ${17 - career.age} ${17 - career.age === 1 ? 'rok' : 'roky'}. Tvé výkony v SoloQ budují reputaci mezi týmovými skauty!`
                    : `You are ${career.age} years old. ${17 - career.age} years remaining until pro contract eligibility. Your soloq performances are tracking high with scouts!`
                ) : (
                  isCs
                    ? `Dosáhl jsi věku 17+ let a jsi plně způsobilý pro profesionální scénu! V záložce Přestupy můžeš přijmout nabídky z týmů.`
                    : `You are 17+ and fully eligible for the pro scene! Check the Transfer Market for team offers.`
                )}
              </p>
            </Card>
          </motion.div>
        ) : (
          /* PRO TEAM LEAGUE RECAP (When signed with a team) */
          <>
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
          </>
        )}

        {/* Continue to Next Split Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Button
            variant={qualifiedPlayoffs ? 'gold' : 'primary'}
            size="lg"
            fullWidth
            onClick={nextSplit}
          >
            {qualifiedPlayoffs ? `🏆 ${t('season.playoff_start')}` : (isCs ? 'Vstoupit do dalšího Splitu →' : t('season.next_split'))}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
