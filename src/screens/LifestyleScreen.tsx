import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';

const HOUSING_NAMES: Record<string, { label: string; rent: number; desc: string }> = {
  parents_home: { label: '🏠 Dětský pokoj u rodičů', rent: 0, desc: 'Bydlení zdarma, navařeno, ale rodičovský tlak.' },
  budget_room: { label: '🏢 Pronajatý sdílený pokoj', rent: 600, desc: 'Nezávislost a možnost grindit celou noc bez vyrušování.' },
  gaming_house: { label: '⚡ Týmový Gaming House', rent: 0, desc: 'Zajištěno organizací – kuchař, trenéři a spoluhráči.' },
  luxury_apt: { label: '🌆 Luxusní Penthouse v centru', rent: 3500, desc: 'Nádherný výhled, maximální soukromí a pohodlí.' },
};

const PC_NAMES = [
  { level: 1, name: 'Potato 60Hz Setup (Starý PC)', cost: 0, bonus: 'Základní odezva, nedostačuje pro stream' },
  { level: 2, name: 'Esports 144Hz Rig + Stream Webcam', cost: 1500, bonus: '+5 Mechanika · Odemkne možnost Streamování' },
  { level: 3, name: 'Pro 360Hz Beast + Dual PC Streaming Rig', cost: 5000, bonus: '+10 Mechanika & Mentál · +50% Stream Výdělky' },
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
  const canStream = career.lifestyle.pcLevel >= 2;
  const followers = career.streamFollowers ?? 0;
  const viewers = career.streamViewers ?? 0;

  return (
    <div className="space-y-6">

      {/* Energy & Living Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weekly Energy */}
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">⚡ Týdenní Energie & Focus</span>
            <span className="text-amber-400 font-bold">{energy} / {maxEnergy}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
              animate={{ width: `${(energy / maxEnergy) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">Obnovuje se každý týden. Využij ji na SoloQ, práci nebo trénink.</p>
        </Card>

        {/* Current Housing */}
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Bydlení</p>
          <p className="text-sm font-bold text-white">{housing.label}</p>
          <p className="text-xs text-slate-400">${housing.rent}/měsíc nájem</p>
        </Card>

        {/* Twitch & Stream Audience */}
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Twitch / Stream Sledující</p>
          <p className="text-base font-black text-purple-400 font-mono">
            {followers.toLocaleString()} Followerů
          </p>
          <p className="text-[11px] text-slate-400">
            {canStream ? `Průměrně ${viewers.toLocaleString()} diváků online` : '🔒 Vyžaduje Level 2 PC Setup'}
          </p>
        </Card>
      </div>

      {/* Weekly Life Actions (Energy Spenders) */}
      <Card>
        <CardHeader title="⚡ Týdenní Aktivity & Životní Styl" icon="🎮" subtitle="Využij energii pro výdělek, zlepšení mentálu nebo trénink" />
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Part-time Job (Crucial for Free Agents!) */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">💼 Brigáda / Práce na dohodu</h4>
                <p className="text-xs text-slate-400 mt-0.5">Směna v kavárně nebo skladu na zaplacení nájmu.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -30⚡
              </span>
            </div>
            <div className="text-xs text-green-400 font-semibold">+ $450 Hotovost · -3 Mentál</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 30}
              onClick={() => performWeeklyAction('job')}
            >
              Odpracovat Směnu
            </Button>
          </div>

          {/* Stream SoloQ */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            canStream ? 'border-rift-border bg-rift-surface' : 'border-rift-border/40 bg-rift-card/40 opacity-60'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">🎥 Streamovat SoloQ na Twitchi</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {canStream ? 'Vysílat zápasy, bavit diváky a sbírat donaty.' : '🔒 Odemkne se nákupem Esports PC Rig!'}
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -25⚡
              </span>
            </div>
            <div className="text-xs text-green-400 font-semibold">+ $200-$600 Suby & Donaty · +Followeři</div>
            <Button
              variant={canStream ? 'secondary' : 'ghost'}
              size="sm"
              fullWidth
              disabled={!canStream || energy < 25}
              onClick={() => performWeeklyAction('stream')}
            >
              {canStream ? 'Spustit Stream' : '🔒 Koupit Stream PC'}
            </Button>
          </div>

          {/* VOD Review */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">🧠 Hluboká VOD & Makro Analýza</h4>
                <p className="text-xs text-slate-400 mt-0.5">Studium rotací a wardování korejských Challenger hráčů.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -20⚡
              </span>
            </div>
            <div className="text-xs text-blue-400 font-semibold">+3 Znalost hry · +2 Přizpůsobivost</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 20}
              onClick={() => performWeeklyAction('vod')}
            >
              Studovat VODy
            </Button>
          </div>

          {/* Gym & Mental Reset */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">🏋️ Fitko & Mentální Reset</h4>
                <p className="text-xs text-slate-400 mt-0.5">Trénink a sauna k odstranění tiltu a únavy ze SoloQ.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -20⚡
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">+8 Mentál · Vymaže Tilt</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 20}
              onClick={() => performWeeklyAction('gym')}
            >
              Jít do Fitka
            </Button>
          </div>

        </div>
      </Card>

      {/* Hardware Setup & Upgrades */}
      <Card>
        <CardHeader title="🖥️ Herní Vybavení & Battle Station" icon="⚡" subtitle="Lepší počítač a monitor zvyšuje mechaniku a odemyká streaming" />
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Aktuální Setup</p>
              <p className="font-bold text-white text-base">
                {PC_NAMES[career.lifestyle.pcLevel - 1]?.name || 'Základní Setup'}
              </p>
              <p className="text-xs text-gold-400 mt-0.5">
                {PC_NAMES[career.lifestyle.pcLevel - 1]?.bonus}
              </p>
            </div>
          </div>

          {nextPC && (
            <div className="p-4 rounded-xl border border-gold-600/30 bg-gold-950/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gold-400 font-bold uppercase">Dostupný Upgrade</span>
                <h4 className="font-bold text-white text-sm">{nextPC.name}</h4>
                <p className="text-xs text-slate-300">{nextPC.bonus}</p>
              </div>
              <Button
                variant="gold"
                size="md"
                disabled={career.finances.savings < nextPC.cost}
                onClick={upgradePC}
              >
                Koupit Upgrade (${nextPC.cost.toLocaleString()})
              </Button>
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
