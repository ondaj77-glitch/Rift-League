import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { TeamLogo } from '../components/ui/TeamLogo';
import { RoleBadge } from '../components/ui/RoleBadge';
import { REGION_FLAGS, TEAMS } from '../data/teams';
import { generateStandings } from '../utils/simulation';
import type { Role } from '../types/game';

const ROSTER_NAMES: Record<Role, string[]> = {
  top: ['Zeus', 'Kiin', 'Doran', '369', 'Bin', 'BrokenBlade', 'Bwipo', 'Impact'],
  jungle: ['Oner', 'Canyon', 'Peanut', 'Kanavi', 'Tian', 'Yike', 'Elyoya', 'Inspired'],
  mid: ['Faker', 'Chovy', 'ShowMaker', 'Knight', 'Rookie', 'Caps', 'Humanoid', 'Jojopyun'],
  adc: ['Gumayusi', 'Viper', 'Peyz', 'Ruler', 'JackeyLove', 'Hans Sama', 'Comp', 'Berserker'],
  support: ['Keria', 'Lehends', 'Delight', 'ON', 'Crisp', 'Mikyx', 'Hylissang', 'CoreJJ'],
};

export function TransferMarketScreen() {
  const { t, language } = useTranslation();
  const isCs = language === 'cs';
  const career = useGameStore(s => s.career);
  const leaveTeam = useGameStore(s => s.leaveTeam);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  if (!career) return null;

  const trust = career.lifestyle?.coachTrust ?? 50;
  const status = career.lifestyle?.rosterStatus ?? 'free_agent';
  const currentTeam = career.currentTeam;

  const leagueTier = currentTeam
    ? currentTeam.strength >= 80 ? 'TIER 1 PRO LEAGUE' : 'TIER 2 ACADEMY'
    : 'UNRANKED SOLOQ';

  const standings = currentTeam
    ? generateStandings(currentTeam, career.region, career.wins, career.losses, TEAMS)
    : [];

  const playerStandingIdx = standings.findIndex(s => s.isPlayer);
  const playerRank = playerStandingIdx >= 0 ? playerStandingIdx + 1 : 1;

  // Fake match history form array (wins and losses)
  const form: Array<'W' | 'L'> = [];
  for (let i = 0; i < career.wins; i++) form.push('W');
  for (let i = 0; i < career.losses; i++) form.push('L');
  while (form.length < 8) form.push(Math.random() > 0.4 ? 'W' : 'L');
  const recentForm = form.slice(-8);

  // Generate teammate roster
  const roles: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];
  const teammates = roles.map(role => {
    const isPlayer = role === career.role;
    const namePool = ROSTER_NAMES[role];
    const teammateName = isPlayer
      ? career.gameName
      : namePool[Math.abs((currentTeam?.name.length || 3) + role.length) % namePool.length];
    const rating = isPlayer
      ? Math.round(
          (career.stats.mechanics * 0.35 +
            career.stats.gameKnowledge * 0.25 +
            career.stats.mental * 0.2 +
            career.stats.communication * 0.2)
        )
      : Math.min(99, Math.max(60, (currentTeam?.strength ?? 75) + (role.charCodeAt(0) % 7) - 3));

    return { role, name: teammateName, rating, isPlayer };
  });

  return (
    <div className="space-y-6">

      {/* When Player is in a Pro Team */}
      {currentTeam ? (
        <>
          {/* Main Organization & Contract Banner */}
          <Card className="p-5 space-y-5 border-gold-600/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <TeamLogo team={currentTeam} size="xl" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {leagueTier}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      {REGION_FLAGS[currentTeam.region]} {currentTeam.region}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-0.5 font-heading">
                    {currentTeam.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isCs ? 'Prestiž Organizace' : 'Organization Prestige'}: <strong className="text-gold-400 font-mono">{currentTeam.prestige}/100</strong> · {isCs ? 'Síla kádru' : 'Roster Power'}: <strong className="text-cyan-400 font-mono">{currentTeam.strength}/100</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase ${
                  status === 'starter'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700 shadow-lg shadow-emerald-950/40'
                    : status === 'benched'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-700'
                    : 'bg-blue-950/80 text-blue-400 border border-blue-700'
                }`}>
                  {status === 'starter' ? '⭐ MAIN STARTER' : status === 'benched' ? '⚠️ BENCHED' : '🔄 SUB / ACADEMY'}
                </span>
              </div>
            </div>

            {/* Contract Compensation & Length */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-rift-surface rounded-xl border border-rift-border">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">{isCs ? 'Roční Plat' : 'Annual Salary'}</span>
                <p className="text-base font-black text-green-400 font-mono mt-0.5">
                  ${career.finances.salary.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">{isCs ? 'Základní kontrakt' : 'Base salary'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">{isCs ? 'Týdenní Výplata' : 'Weekly Payout'}</span>
                <p className="text-base font-black text-emerald-300 font-mono mt-0.5">
                  +${Math.round(career.finances.salary / 52).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">{isCs ? 'Každý týden na účet' : 'Auto-credited weekly'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">{isCs ? 'Délka Smlouvy' : 'Contract Term'}</span>
                <p className="text-base font-black text-white font-mono mt-0.5">
                  {career.splitNumber === 1 ? '3 Splity (1 Rok)' : career.splitNumber === 2 ? '2 Splity' : '1 Split (Končí)'}
                </p>
                <p className="text-[10px] text-slate-500">{isCs ? 'Do Off-Season' : 'Until Off-Season'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">{isCs ? 'Smluvní Bonus' : 'Incentives'}</span>
                <p className="text-sm font-bold text-gold-400 mt-0.5">
                  +$50k Worlds / 70% Stream
                </p>
                <p className="text-[10px] text-slate-500">{isCs ? 'Výkonnostní bonusy' : 'Performance perks'}</p>
              </div>
            </div>

            {/* Segmented LED Meters for Trust & Morale (Rift Legacy Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Coach Trust Segmented Bar */}
              <div className="p-3.5 bg-rift-surface rounded-xl border border-rift-border space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300 uppercase tracking-wider">{isCs ? 'Důvěra Kouče & Vedení' : 'Team Trust'}</span>
                  <span className={trust >= 60 ? 'text-emerald-400 font-mono' : trust >= 30 ? 'text-amber-400 font-mono' : 'text-red-400 font-mono'}>
                    {trust}%
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const filled = i < Math.round(trust / 5);
                    return (
                      <div
                        key={i}
                        className={`h-3 flex-1 rounded-sm transition-all ${
                          filled
                            ? trust >= 60
                              ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                              : trust >= 30
                              ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                              : 'bg-red-500 shadow-sm shadow-red-500/50'
                            : 'bg-slate-800/80'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500">
                  {isCs ? 'Vyhrávej zápasy v lize. Při poklesu pod 25% budeš posazen na lavičku.' : 'Win official games. Drops below 25% result in being benched.'}
                </p>
              </div>

              {/* Team Morale Segmented Bar */}
              <div className="p-3.5 bg-rift-surface rounded-xl border border-rift-border space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300 uppercase tracking-wider">{isCs ? 'Morálka Kabiny' : 'Locker Room Morale'}</span>
                  <span className="text-amber-400 font-mono">
                    {Math.min(100, Math.max(20, Math.round((career.stats.mental * 0.6 + trust * 0.4))))}%
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const score = Math.min(100, Math.max(20, Math.round((career.stats.mental * 0.6 + trust * 0.4))));
                    const filled = i < Math.round(score / 5);
                    return (
                      <div
                        key={i}
                        className={`h-3 flex-1 rounded-sm transition-all ${
                          filled
                            ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                            : 'bg-slate-800/80'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500">
                  {isCs ? 'Vysoký mentál a týmové aktivity zvedají soudržnost v teamfightech.' : 'High mental & team synergy improves macro teamfighting.'}
                </p>
              </div>
            </div>
          </Card>

          {/* League Record & Form & Standings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Split Record & Form */}
            <Card className="p-5 space-y-4">
              <CardHeader
                title={isCs ? 'Zápasová Forma & Výsledky' : 'Match Record & Form'}
                icon="🏆"
                subtitle={`${career.split} Split ${career.year} · ${currentTeam.name}`}
              />

              <div className="flex items-center justify-between p-4 bg-rift-surface rounded-xl border border-rift-border">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">{isCs ? 'Bilance Zápasů' : 'Split Record'}</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-green-400 font-mono">{career.wins}</span>
                    <span className="text-slate-500 text-xl font-bold">-</span>
                    <span className="text-3xl font-black text-red-400 font-mono">{career.losses}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-semibold">{isCs ? 'Umístění v Tabulce' : 'League Standing'}</span>
                  <p className="text-2xl font-black text-gold-400 font-mono mt-1">
                    #{playerRank} <span className="text-xs text-slate-400 font-normal">/ {standings.length}</span>
                  </p>
                </div>
              </div>

              {/* Form Pills */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-400 font-semibold">{isCs ? 'Poslední zápasy (Forma):' : 'Recent Form:'}</span>
                <div className="flex gap-2">
                  {recentForm.map((result, idx) => (
                    <span
                      key={idx}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        result === 'W'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/50'
                          : 'bg-rose-700 text-white'
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Starting 5 Roster */}
            <Card className="p-5 space-y-4">
              <CardHeader
                title={isCs ? 'Základní Sestava (Starting 5)' : 'Active Starting Roster'}
                icon="👥"
                subtitle={isCs ? 'Spoluhráči a celkový rating' : 'Teammates & overall ratings'}
              />

              <div className="space-y-2">
                {teammates.map((member) => (
                  <div
                    key={member.role}
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      member.isPlayer
                        ? 'border-purple-500/60 bg-purple-950/30'
                        : 'border-rift-border bg-rift-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <RoleBadge role={member.role} size="xs" />
                      <div>
                        <span className={`text-xs font-bold ${member.isPlayer ? 'text-gold-300' : 'text-white'}`}>
                          {member.name}
                        </span>
                        {member.isPlayer && (
                          <span className="text-[10px] text-purple-300 font-bold ml-1.5">({isCs ? 'TY' : 'YOU'})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">OVR</span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-black bg-slate-900 border border-slate-700 text-gold-400">
                        {member.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Off-Season Notice & Contract Action */}
          <Card className="p-5 space-y-3 border-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">
                  {isCs ? '📅 Přestupové Okno & Scouting' : '📅 Transfer Market Window'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                  {isCs
                    ? 'Nabídky od ostatních týmů (Tier 1, Tier 2 Academy) přicházejí automaticky po skončení splitu v Off-Season na základě tvých statistik a SoloQ ranku.'
                    : 'Official transfer offers from Tier 1 & Tier 2 orgs arrive automatically during the Off-Season based on your split performance and SoloQ rank.'}
                </p>
              </div>

              {!showTerminateConfirm ? (
                <Button variant="danger" size="sm" onClick={() => setShowTerminateConfirm(true)}>
                  {isCs ? 'Ukončit smlouvu' : 'Terminate Contract'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowTerminateConfirm(false)}>
                    {isCs ? 'Zrušit' : 'Cancel'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={leaveTeam}>
                    {isCs ? 'Potvrdit odchod (Free Agent)' : 'Confirm Release'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        /* When Player is a Free Agent / Prodigy */
        <Card className="p-8 text-center space-y-5 border-amber-600/30">
          <div className="text-5xl">🦅</div>
          <div className="space-y-1">
            <span className="text-xs uppercase font-black text-amber-400 tracking-wider">
              {isCs ? 'Volný Hráč / SoloQ Talent' : 'Unsigned Free Agent / SoloQ Grinder'}
            </span>
            <h2 className="text-2xl font-black text-white font-heading">
              {career.gameName}
            </h2>
            <p className="text-xs text-slate-400">
              {isCs
                ? `Věk ${career.age} let · ${career.rank?.tier} ${career.rank?.division || ''} (${career.rank?.lp} LP)`
                : `Age ${career.age} · ${career.rank?.tier} ${career.rank?.division || ''} (${career.rank?.lp} LP)`}
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 bg-rift-surface rounded-xl border border-rift-border text-xs text-slate-300 leading-relaxed text-left space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-bold">
              <span>📋</span>
              <span>{isCs ? 'Jak podepsat profesionální tým?' : 'How to sign a pro team contract?'}</span>
            </div>
            <p>
              {career.age < 17
                ? (isCs
                    ? `Profi ligy Tier 1 & Academy vyžadují minimální věk 17+ let. Grinduj SoloQ do Master/Grandmaster a sbírej reputaci – týmy tě budou sledovat!`
                    : `Tier 1 & Academy pro leagues require age 17+. Grind SoloQ to Master/Grandmaster to build scout reputation!`)
                : (isCs
                    ? `Dosáhl jsi věku způsobilosti (17+)! Oficiální přestupové okno a nabídky smluv (Tier 1 / Tier 2 Academy) se ti otevřou po dohrání aktuálního splitu v Off-Season.`
                    : `You meet the age requirement (17+)! Official team contract offers will be presented during the Off-Season after completing the current split.`)}
            </p>
          </div>
        </Card>
      )}

    </div>
  );
}
