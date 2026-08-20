import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';

const HOUSING_NAMES: Record<string, { label: string; rent: number; desc: string }> = {
  parents_home: { label: '🏠 Parents Bedroom', rent: 0, desc: 'Free living, home-cooked food, but parental pressure.' },
  budget_room: { label: '🏢 Rented Shared Room', rent: 600, desc: 'Independence to grind all night without complaints.' },
  gaming_house: { label: '⚡ Team Gaming House', rent: 0, desc: 'Provided by your organization with in-house chef and teammates.' },
  luxury_apt: { label: '🌆 Luxury Highrise Penthouse', rent: 3500, desc: 'Stunning city views, ultimate comfort and privacy.' },
};

const PC_NAMES = [
  { level: 1, name: 'Potato 60Hz Setup', cost: 0, bonus: 'Standard response time' },
  { level: 2, name: 'Esports 144Hz Gaming Rig', cost: 1500, bonus: '+5 Mechanics in SoloQ & Matches' },
  { level: 3, name: 'Pro 360Hz Monster Rig + Ergonomic Setup', cost: 5000, bonus: '+10 Mechanics & Mental' },
];

export function LifestyleScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const performWeeklyAction = useGameStore(s => s.performWeeklyAction);
  const upgradePC = useGameStore(s => s.upgradePC);

  if (!career) return null;

  const energy = career.lifestyle.energy;
  const maxEnergy = career.lifestyle.maxEnergy;
  const housing = HOUSING_NAMES[career.lifestyle.housing] || HOUSING_NAMES.parents_home;
  const nextPC = PC_NAMES.find(p => p.level === career.lifestyle.pcLevel + 1);

  return (
    <div className="space-y-6">

      {/* Energy & Living Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weekly Energy */}
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">⚡ Weekly Energy Focus</span>
            <span className="text-amber-400 font-bold">{energy} / {maxEnergy}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
              animate={{ width: `${(energy / maxEnergy) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">Resets each week. Use it to grind or work.</p>
        </Card>

        {/* Current Housing */}
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Current Housing</p>
          <p className="text-sm font-bold text-white">{housing.label}</p>
          <p className="text-xs text-slate-400">${housing.rent}/month rent</p>
        </Card>

        {/* Total Savings */}
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Bank Savings</p>
          <p className="text-xl font-black text-green-400 font-mono">
            ${career.finances.savings.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            {career.currentTeam ? `Salary: $${(career.finances.salary / 1000).toFixed(0)}k/yr` : 'No Team Salary'}
          </p>
        </Card>
      </div>

      {/* Weekly Life Actions (Energy Spenders) */}
      <Card>
        <CardHeader title="⚡ Weekly Focus Activities" icon="🎮" subtitle="Spend your weekly energy to progress your life and skills" />
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Part-time Job (Crucial for Free Agents!) */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">💼 Part-Time Job / Odd Jobs</h4>
                <p className="text-xs text-slate-400 mt-0.5">Work a shift at a cafe/warehouse to pay rent.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                -30⚡
              </span>
            </div>
            <div className="text-xs text-green-400 font-semibold">+ $450 Cash · -3 Mental</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 30}
              onClick={() => performWeeklyAction('job')}
            >
              Work Shift
            </Button>
          </div>

          {/* Stream SoloQ */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">🎥 Stream SoloQ to Fans</h4>
                <p className="text-xs text-slate-400 mt-0.5">Broadcast your gameplay on Twitch / AfreecaTV.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                -25⚡
              </span>
            </div>
            <div className="text-xs text-green-400 font-semibold">+ $200-$500 Subs & Donations · +2 Rep</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 25}
              onClick={() => performWeeklyAction('stream')}
            >
              Start Stream
            </Button>
          </div>

          {/* VOD Review */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">🧠 Deep Macro & VOD Review</h4>
                <p className="text-xs text-slate-400 mt-0.5">Analyze Korean pro players wave states and ward timings.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                -20⚡
              </span>
            </div>
            <div className="text-xs text-blue-400 font-semibold">+3 Game Knowledge · +2 Adaptability</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 20}
              onClick={() => performWeeklyAction('vod')}
            >
              Study VODs
            </Button>
          </div>

          {/* Gym & Mental Reset */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">🏋️ Gym Workout & Mental Reset</h4>
                <p className="text-xs text-slate-400 mt-0.5">Physical training, sauna, and meditation to recover from tilt.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                -20⚡
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">+8 Mental · Removes Tilt</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 20}
              onClick={() => performWeeklyAction('gym')}
            >
              Hit the Gym
            </Button>
          </div>

        </div>
      </Card>

      {/* Hardware Setup & Upgrades */}
      <Card>
        <CardHeader title="🖥️ Gaming Hardware & Battle Station" icon="⚡" subtitle="Better equipment boosts your performance in SoloQ and pro games" />
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Current Setup</p>
              <p className="font-bold text-white text-base">
                {PC_NAMES[career.lifestyle.pcLevel - 1]?.name || 'Standard Setup'}
              </p>
              <p className="text-xs text-gold-400 mt-0.5">
                {PC_NAMES[career.lifestyle.pcLevel - 1]?.bonus}
              </p>
            </div>
          </div>

          {nextPC && (
            <div className="p-4 rounded-xl border border-gold-600/30 bg-gold-950/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gold-400 font-bold uppercase">Next Upgrade Available</span>
                <h4 className="font-bold text-white text-sm">{nextPC.name}</h4>
                <p className="text-xs text-slate-300">{nextPC.bonus}</p>
              </div>
              <Button
                variant="gold"
                size="md"
                disabled={career.finances.savings < nextPC.cost}
                onClick={upgradePC}
              >
                Upgrade (${nextPC.cost.toLocaleString()})
              </Button>
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
