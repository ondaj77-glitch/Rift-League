import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TeamLogo } from '../components/ui/TeamLogo';
import { TEAMS, REGION_FLAGS } from '../data/teams';
import { generateStandings } from '../utils/simulation';
import { TIER_ICONS, TIER_COLORS, TIER_ORDER } from '../data/ranks';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import type { Team, TeamOffer } from '../types/game';

export function SeasonSummaryScreen() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const nextSplit = useGameStore(s => s.nextSplit);
  const acceptTeamOffer = useGameStore(s => s.acceptTeamOffer);
  const setPhase = useGameStore(s => s.setPhase);

  const [selectedOffer, setSelectedOffer] = useState<TeamOffer | null>(null);

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
  const rankOrder = TIER_ORDER.indexOf(rank.tier);

  const standings = !isProdigy ? generateStandings(
    career.currentTeam,
    career.region,
    career.wins,
    career.losses,
    TEAMS
  ) : [];

  const playerRank = !isProdigy ? standings.findIndex(s => s.isPlayer) + 1 : 0;

  // Generate Off-Season Transfer Offers (Tier 1 / Tier 2 Academy)
  const offSeasonOffers: TeamOffer[] = useMemo(() => {
    if (career.age < 17) return [];

    const availableTeams = TEAMS.filter(
      t => t.region === career.region && t.id !== career.currentTeam?.id
    );

    const offers: TeamOffer[] = [];
    availableTeams.forEach(team => {
      const isTopTeam = team.strength >= 85;
      const isMidTeam = team.strength >= 74 && team.strength < 85;
      const isAcademyTeam = team.strength < 74;

      // Tier eligibility based on rank:
      // Master/GM/Challenger => Tier 1 & Tier 2
      // Diamond => Tier 2 & Tier 3
      // Platinum => Tier 3 Academy
      let eligible = false;
      if (rankOrder >= 7) eligible = true;
      else if (rankOrder >= 5 && !isTopTeam) eligible = true;
      else if (rankOrder >= 4 && isAcademyTeam) eligible = true;

      if (eligible && offers.length < 3) {
        const salary = Math.floor(team.salaryRange[0] * (0.85 + (rankOrder / 10) * 0.4));
        offers.push({
          team,
          salary,
          contractYears: Math.random() > 0.5 ? 2 : 1,
          role: rankOrder >= 7 ? 'Starter' : 'Sub / Academy',
          bonuses: ['Worlds Bonus $50k', 'Stream revenue split 70%'],
          expiresWeeks: 1,
        });
      }
    });

    return offers;
  }, [career.age, career.region, career.currentTeam, rankOrder]);

  function handleSign(offer: TeamOffer) {
    acceptTeamOffer(offer);
    setSelectedOffer(offer);
  }

  return (
    <div className="screen-bg min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Top Header with Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher size="sm" />
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-black text-white text-center font-heading uppercase tracking-wide">
            {isProdigy
              ? (isCs ? '👑 Zhodnocení SoloQ Splitu & Off-Season' : '👑 SoloQ Split Summary & Off-Season')
              : t('season.title')}
          </h1>
          <p className="text-center text-slate-400 text-sm mt-1">
            {isProdigy
              ? (isCs ? `SoloQ Talent (${career.age} let) · ${career.split} Split ${career.year}` : `SoloQ Prodigy (${career.age} y/o) · ${career.split} Split ${career.year}`)
              : `${career.split} Split ${career.year}`}
          </p>
        </motion.div>

        {/* PRODIGY SOLOQ RECAP */}
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
          </motion.div>
        ) : (
          /* PRO TEAM LEAGUE RECAP */
          <div className="space-y-4">
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
                <p className="text-gold-400 font-bold">{t('season.qualified_intl')}</p>
              ) : qualifiedPlayoffs ? (
                <p className="text-green-400 font-bold">{t('season.qualified')}</p>
              ) : (
                <p className="text-slate-500 text-sm">{t('season.eliminated')}</p>
              )}
            </Card>

            {/* Standings Table */}
            <Card>
              <div className="px-5 py-4 border-b border-rift-border">
                <h3 className="font-semibold text-slate-100 text-sm">{t('season.standings')}</h3>
              </div>
              <div className="divide-y divide-rift-border/50">
                {standings.slice(0, 6).map((s, i) => (
                  <div
                    key={s.team.id}
                    className={`flex items-center px-5 py-3 ${s.isPlayer ? 'bg-purple-950/20' : ''}`}
                  >
                    <span className={`w-6 text-sm font-bold ${i < 4 ? 'text-gold-400' : 'text-slate-600'}`}>
                      {i + 1}
                    </span>
                    <TeamLogo team={s.team} size="xs" className="mr-2" />
                    <span className={`flex-1 text-sm font-medium ${s.isPlayer ? 'text-white' : 'text-slate-300'}`}>
                      {s.team.name}
                      {s.isPlayer && <span className="text-rift-purple text-xs ml-1">({t('bracket.you')})</span>}
                    </span>
                    <span className="text-green-400 text-sm font-semibold w-6 text-center">{s.wins}</span>
                    <span className="text-slate-600 text-sm mx-1">–</span>
                    <span className="text-red-400 text-sm font-semibold w-6 text-center">{s.losses}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* OFF-SEASON CONTRACT & TRANSFER WINDOW */}
        <Card className="p-5 space-y-4 border-gold-600/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤝</span>
              <div>
                <h3 className="font-bold text-white text-base font-heading">
                  {isCs ? 'Off-Season Přestupové Okno' : 'Off-Season Transfer Market'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isCs ? 'Nabídky smluv pro nadcházející split na základě tvých výkonů' : 'Contract offers for the upcoming split'}
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30">
              OFF-SEASON
            </span>
          </div>

          {/* Current Team Status / Extension */}
          {career.currentTeam && (
            <div className="p-4 rounded-xl border border-emerald-600/40 bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <TeamLogo team={career.currentTeam} size="md" />
                <div>
                  <span className="text-[11px] text-emerald-400 font-bold uppercase">
                    {isCs ? 'Aktuální Tým (Smluvní opce)' : 'Current Organization'}
                  </span>
                  <h4 className="font-bold text-white text-sm">{career.currentTeam.name}</h4>
                  <p className="text-xs text-slate-300 font-mono">${career.finances.salary.toLocaleString()} / rok</p>
                </div>
              </div>
              <span className="text-xs text-emerald-300 font-bold bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-700">
                ✅ {isCs ? 'Smlouva prodloužena' : 'Contract Extended'}
              </span>
            </div>
          )}

          {/* Incoming Offers */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {isCs ? 'Nové Nabídky Smluv (Tier 1 & Tier 2):' : 'Incoming Contract Offers (Tier 1 & Tier 2):'}
            </h4>

            {offSeasonOffers.length === 0 ? (
              <div className="p-4 rounded-xl bg-rift-surface border border-rift-border text-center text-xs text-slate-400">
                {career.age < 17
                  ? (isCs ? `Věk ${career.age} let. Profi nabídky vyžadují věk 17+ let.` : `Age ${career.age}. Pro offers require age 17+.`)
                  : (isCs ? 'Žádné nové externí nabídky. Dosáhni vyššího SoloQ ranku (Diamond/Master+) pro Tier 1 zájem!' : 'No new external offers. Reach Master+ for Tier 1 interest!')}
              </div>
            ) : (
              offSeasonOffers.map((offer, idx) => {
                const isSigned = career.currentTeam?.id === offer.team.id;
                return (
                  <div
                    key={offer.team.id + idx}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSigned
                        ? 'border-gold-500 bg-gold-950/30'
                        : 'border-rift-border bg-rift-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TeamLogo team={offer.team} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{offer.team.name}</h5>
                          <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                            {REGION_FLAGS[offer.team.region]} {offer.team.region}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {offer.role} · {offer.contractYears} {isCs ? 'rok(y)' : 'yr(s)'} · <strong className="text-green-400 font-mono">${offer.salary.toLocaleString()}/rok</strong>
                        </p>
                      </div>
                    </div>

                    <div>
                      {isSigned ? (
                        <span className="text-xs text-gold-400 font-bold">
                          ✅ {isCs ? 'Podepsáno' : 'Signed'}
                        </span>
                      ) : (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => handleSign(offer)}
                        >
                          ✍️ {isCs ? 'Podepsat Kontrakt' : 'Sign Contract'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Continue to Next Split Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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
