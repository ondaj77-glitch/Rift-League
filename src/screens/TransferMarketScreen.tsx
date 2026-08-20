import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { REGION_FLAGS } from '../data/teams';

export function TransferMarketScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const pendingOffers = useGameStore(s => s.pendingOffers);
  const acceptTeamOffer = useGameStore(s => s.acceptTeamOffer);
  const leaveTeam = useGameStore(s => s.leaveTeam);
  const searchForTeamOffers = useGameStore(s => s.searchForTeamOffers);

  if (!career) return null;

  const trust = career.lifestyle.coachTrust;
  const status = career.lifestyle.rosterStatus;

  return (
    <div className="space-y-6">

      {/* Current Team & Roster Status */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Organization & Contract
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-xl font-bold text-white">
                {career.currentTeam ? career.currentTeam.name : 'Free Agent / Unsigned'}
              </h2>
              {career.currentTeam && (
                <span className="text-xs text-slate-400">
                  ({REGION_FLAGS[career.currentTeam.region]} {career.currentTeam.region})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              status === 'starter' ? 'bg-green-950/70 text-green-400 border border-green-800' :
              status === 'benched' ? 'bg-amber-950/70 text-amber-400 border border-amber-800' :
              status === 'sub' ? 'bg-blue-950/70 text-blue-400 border border-blue-800' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {status === 'starter' ? '⭐ MAIN STARTER' :
               status === 'benched' ? '⚠️ BENCHED BY COACH' :
               status === 'sub' ? '🔄 ACADEMY / SUB' : 'FREE AGENT'}
            </span>
          </div>
        </div>

        {/* Coach Trust Meter (if in a team) */}
        {career.currentTeam && (
          <div className="space-y-1.5 pt-3 border-t border-rift-border">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Coach & Management Trust</span>
              <span className={trust >= 60 ? 'text-green-400 font-bold' : trust >= 30 ? 'text-amber-400 font-bold' : 'text-red-400 font-bold'}>
                {trust}% {trust < 30 ? '(DANGER OF BENCH/RELEASE!)' : ''}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  trust >= 60 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                  trust >= 30 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                  'bg-gradient-to-r from-red-600 to-red-500'
                }`}
                animate={{ width: `${trust}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Win matches and maintain high mental to keep your starter spot. If trust drops below 25%, you will be benched.
            </p>
          </div>
        )}

        {/* Leave Team Button */}
        {career.currentTeam && (
          <div className="pt-2">
            <Button variant="danger" size="sm" onClick={leaveTeam}>
              Request Contract Termination / Become Free Agent
            </Button>
          </div>
        )}
      </Card>

      {/* Available Team Offers */}
      <Card>
        <CardHeader
          title="📬 Scouting Inquiries & Contract Offers"
          icon="📄"
          subtitle="Teams scout players based on your SoloQ Rank and Age eligibility"
          action={
            <Button variant="secondary" size="sm" onClick={searchForTeamOffers}>
              🔍 Scout Market (-10⚡)
            </Button>
          }
        />

        <div className="p-5 space-y-3">
          {pendingOffers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <div className="text-4xl">📨</div>
              <p className="text-sm font-medium">No pending contract offers right now.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {career.age < 17
                  ? `You are ${career.age} years old. Tier 1 pro leagues require age 18+. Grind SoloQ to Master/Grandmaster to get early Academy offers!`
                  : 'Grind your SoloQ rank to Diamond/Master+ and click "Scout Market" to attract scout interest.'}
              </p>
            </div>
          ) : (
            pendingOffers.map((offer, idx) => (
              <div
                key={offer.team.id + idx}
                className="p-4 rounded-xl border border-rift-border bg-rift-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: offer.team.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{offer.team.name}</h4>
                      <span className="text-xs bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                        {REGION_FLAGS[offer.team.region]} {offer.team.region}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Role: <strong className="text-slate-200">{offer.role}</strong> · Contract: <strong className="text-slate-200">{offer.contractYears} Year(s)</strong>
                    </p>
                    <p className="text-xs text-green-400 font-bold font-mono mt-0.5">
                      ${offer.salary.toLocaleString()} USD / year
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="gold"
                    size="sm"
                    fullWidth
                    onClick={() => acceptTeamOffer(offer)}
                  >
                    ✍️ Sign Contract
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

    </div>
  );
}
