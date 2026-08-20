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
  { level: 1, name: 'Potato 60Hz Setup (Starý rodinný PC)', cost: 0, bonus: 'Základní odezva, nedostačuje pro stream' },
  { level: 2, name: 'Entry 144Hz Rig + Mikrofon', cost: 2500, bonus: '+3 Mechanika · Odemkne možnost Streamování' },
  { level: 3, name: 'Esports 240Hz OLED + Stream Setup', cost: 6500, bonus: '+5 Mechanika & +4 Mentál · +25% Stream Diváci' },
  { level: 4, name: 'Pro 360Hz Dual-PC Studio Monster', cost: 15000, bonus: '+8 Mechanika & +6 Mentál · +50% Stream Výdělky' },
];

export function LifestyleScreen() {
  const { t } = useTranslation();
  const career = useGameStore(s => s.career);
  const performWeeklyAction = useGameStore(s => s.performWeeklyAction);
  const upgradePC = useGameStore(s => s.upgradePC);

  if (!career) return null;

  const energy = career.lifestyle?.energy ?? 100;
  const maxEnergy = career.lifestyle?.maxEnergy ?? 100;
  const pcLevel = career.lifestyle?.pcLevel ?? 1;
  const housingKey = career.lifestyle?.housing ?? 'budget_room';

  const housingLabels: Record<string, { label: string; rent: number }> = {
    parents_home: { label: t('housing.parents' as any) || '🏠 Rodinný dům u rodičů', rent: 0 },
    budget_room: { label: t('housing.budget' as any) || '🏢 Sdílený byt', rent: 450 },
    gaming_house: { label: t('housing.gaming_house' as any) || '⚡ Týmový Gaming House', rent: 0 },
    luxury_apt: { label: t('housing.penthouse' as any) || '🌆 Luxusní Penthouse', rent: 2800 },
  };

  const housing = housingLabels[housingKey] || housingLabels.budget_room;

  const pcNames = PC_NAMES;

  const nextPC = pcNames.find(p => p.level === pcLevel + 1);
  const canStream = pcLevel >= 2;
  const followers = career.streamFollowers ?? 0;
  const viewers = career.streamViewers ?? 0;

  return (
    <div className="space-y-6">

      {/* Energy & Living Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weekly Energy */}
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">{t('lifestyle.energy_title')}</span>
            <span className="text-amber-400 font-bold">{energy} / {maxEnergy}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
              animate={{ width: `${(energy / maxEnergy) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">{t('lifestyle.energy_desc')}</p>
        </Card>

        {/* Current Housing */}
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400 font-medium">{t('lifestyle.housing_label')}</p>
          <p className="text-sm font-bold text-white">{housing.label}</p>
          <p className="text-xs text-slate-400">${housing.rent}{t('lifestyle.rent_month')}</p>
        </Card>

        {/* Twitch & Stream Audience */}
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-400 font-medium">{t('lifestyle.twitch_followers')}</p>
          <p className="text-base font-black text-purple-400 font-mono">
            {followers.toLocaleString()} {t('lifestyle.followers')}
          </p>
          <p className="text-[11px] text-slate-400">
            {canStream
              ? t('lifestyle.avg_viewers').replace('{viewers}', viewers.toLocaleString())
              : t('lifestyle.stream_locked')}
          </p>
        </Card>
      </div>

      {/* Weekly Life Actions (Energy Spenders) */}
      <Card>
        <CardHeader
          title={t('lifestyle.activities_title')}
          icon="🎮"
          subtitle={t('lifestyle.activities_subtitle')}
        />
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Part-time Job */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">{t('lifestyle.job_title')}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{t('lifestyle.job_desc')}</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -30⚡
              </span>
            </div>
            <div className="text-xs text-green-400 font-semibold">{t('lifestyle.job_effects')}</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 30}
              onClick={() => performWeeklyAction('job')}
            >
              {t('lifestyle.job_btn')}
            </Button>
          </div>

          {/* Stream SoloQ */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            canStream ? 'border-rift-border bg-rift-surface' : 'border-rift-border/40 bg-rift-card/40 opacity-60'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">{t('lifestyle.stream_title')}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {canStream ? t('lifestyle.stream_desc') : t('lifestyle.stream_desc_locked')}
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -25⚡
              </span>
            </div>
            <div className="text-xs text-green-400 font-semibold">{t('lifestyle.stream_effects')}</div>
            <Button
              variant={canStream ? 'secondary' : 'ghost'}
              size="sm"
              fullWidth
              disabled={!canStream || energy < 25}
              onClick={() => performWeeklyAction('stream')}
            >
              {canStream ? t('lifestyle.stream_btn') : t('lifestyle.stream_btn_buy')}
            </Button>
          </div>

          {/* VOD Review */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">{t('lifestyle.vod_title')}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{t('lifestyle.vod_desc')}</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -20⚡
              </span>
            </div>
            <div className="text-xs text-blue-400 font-semibold">{t('lifestyle.vod_effects')}</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 20}
              onClick={() => performWeeklyAction('vod')}
            >
              {t('lifestyle.vod_btn')}
            </Button>
          </div>

          {/* Gym & Mental Reset */}
          <div className="p-4 rounded-xl border border-rift-border bg-rift-surface space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">{t('lifestyle.gym_title')}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{t('lifestyle.gym_desc')}</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                -20⚡
              </span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">{t('lifestyle.gym_effects')}</div>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={energy < 20}
              onClick={() => performWeeklyAction('gym')}
            >
              {t('lifestyle.gym_btn')}
            </Button>
          </div>

        </div>
      </Card>

      {/* Hardware Setup & Upgrades */}
      <Card>
        <CardHeader
          title={t('lifestyle.upgrade_pc_title')}
          icon="⚡"
          subtitle={t('lifestyle.activities_subtitle')}
        />
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{t('lifestyle.current_pc')}</p>
              <p className="font-bold text-white text-base">
                {pcNames[pcLevel - 1]?.name || 'Base Setup'}
              </p>
              <p className="text-xs text-gold-400 mt-0.5">
                {pcNames[pcLevel - 1]?.bonus}
              </p>
            </div>
          </div>

          {nextPC ? (
            <div className="p-4 rounded-xl border border-gold-600/30 bg-gold-950/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gold-400 font-bold uppercase">
                  {t('lifestyle.upgrade_to')}
                </span>
                <h4 className="font-bold text-white text-sm">{nextPC.name}</h4>
                <p className="text-xs text-slate-300">{nextPC.bonus}</p>
              </div>
              <Button
                variant="gold"
                size="md"
                disabled={(career.finances?.savings ?? 0) < nextPC.cost}
                onClick={upgradePC}
              >
                ${nextPC.cost.toLocaleString()} Upgrade
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-rift-surface rounded-xl border border-rift-border text-center text-xs text-amber-300 font-bold">
              {t('lifestyle.max_pc_level')}
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
