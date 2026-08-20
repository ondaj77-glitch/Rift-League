import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import type { Housing, NutritionPlan } from '../types/game';

const HOUSING_OPTIONS: Array<{
  id: Housing;
  titleKey: string;
  descKey: string;
  rent: number;
  maxEnergy: number;
  bonus: string;
  minAge?: number;
  requiresTeam?: boolean;
}> = [
  {
    id: 'parents_home',
    titleKey: 'housing.parents',
    descKey: 'housing.parents_desc',
    rent: 0,
    maxEnergy: 100,
    bonus: 'Jídlo zdarma od rodičů · $0 nájem',
  },
  {
    id: 'budget_room',
    titleKey: 'housing.budget',
    descKey: 'housing.budget_desc',
    rent: 450,
    maxEnergy: 105,
    bonus: 'Samostatnost · Noční grind bez vyrušení',
    minAge: 18,
  },
  {
    id: 'modern_apt',
    titleKey: 'housing.modern',
    descKey: 'housing.modern_desc',
    rent: 1200,
    maxEnergy: 110,
    bonus: '+4 Mentál / týden · Soukromý stream koutek',
    minAge: 18,
  },
  {
    id: 'gaming_house',
    titleKey: 'housing.gaming_house',
    descKey: 'housing.gaming_house_desc',
    rent: 0,
    maxEnergy: 115,
    bonus: 'Hradí tým · Týmový šéfkuchař · +2 Komunikace/týden',
    requiresTeam: true,
  },
  {
    id: 'luxury_apt',
    titleKey: 'housing.penthouse',
    descKey: 'housing.penthouse_desc',
    rent: 3200,
    maxEnergy: 120,
    bonus: '+8 Mentál / týden · +4 Reputace / split · Wellness',
    minAge: 18,
  },
];

const NUTRITION_OPTIONS: Array<{
  id: NutritionPlan;
  titleKey: string;
  descKey: string;
  cost: number;
  energyCost: number;
  effectBadge: string;
}> = [
  {
    id: 'groceries',
    titleKey: 'nutrition.groceries',
    descKey: 'nutrition.groceries_desc',
    cost: 40,
    energyCost: 10,
    effectBadge: '+4 Mentál / týden (Vyvážená domácí strava)',
  },
  {
    id: 'meal_prep',
    titleKey: 'nutrition.meal_prep',
    descKey: 'nutrition.meal_prep_desc',
    cost: 120,
    energyCost: 0,
    effectBadge: '+6 Mentál & +5% Regenerace (Špičková dovážka)',
  },
  {
    id: 'fast_food',
    titleKey: 'nutrition.fast_food',
    descKey: 'nutrition.fast_food_desc',
    cost: 25,
    energyCost: 0,
    effectBadge: '-2 Mentál & -2 Mechanika (Nezdravá nouzovka)',
  },
  {
    id: 'none',
    titleKey: 'nutrition.none',
    descKey: 'nutrition.none_desc',
    cost: 0,
    energyCost: 0,
    effectBadge: '-15 Max Energie & -6 Mentál (Hladovění)',
  },
];

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
  const changeHousing = useGameStore(s => s.changeHousing);
  const setNutritionPlan = useGameStore(s => s.setNutritionPlan);

  if (!career) return null;

  const energy = career.lifestyle?.energy ?? 100;
  const maxEnergy = career.lifestyle?.maxEnergy ?? 100;
  const pcLevel = career.lifestyle?.pcLevel ?? 1;
  const currentHousing = career.lifestyle?.housing ?? 'budget_room';
  const currentNutrition = career.lifestyle?.nutrition ?? 'groceries';

  const isWithParents = currentHousing === 'parents_home';
  const isInGamingHouse = currentHousing === 'gaming_house';
  const isLivingAlone = !isWithParents && !isInGamingHouse;

  const activeHousingObj = HOUSING_OPTIONS.find(h => h.id === currentHousing) || HOUSING_OPTIONS[0];

  const pcNames = PC_NAMES;
  const nextPC = pcNames.find(p => p.level === pcLevel + 1);
  const canStream = pcLevel >= 2;
  const followers = career.streamFollowers ?? 0;
  const viewers = career.streamViewers ?? 0;

  return (
    <div className="space-y-6">

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weekly Energy */}
        <Card className="p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-400">{t('lifestyle.energy_title')}</span>
            <span className="text-amber-400 font-bold">{energy} / {maxEnergy}⚡</span>
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
          <p className="text-sm font-bold text-white">{t(activeHousingObj.titleKey as any)}</p>
          <p className="text-xs text-slate-400">
            {activeHousingObj.rent === 0 ? 'Bez nájmu' : `$${activeHousingObj.rent}/měsíc`} · Max {activeHousingObj.maxEnergy}⚡
          </p>
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

      {/* Housing & Living Selection */}
      <Card>
        <CardHeader
          title="🏠 Bydlení, Domov & Stěhování"
          icon="📦"
          subtitle="Vyber si, kde budeš žít. Odstěhování je možné od 18 let, lepší bydlení zvyšuje max energii a mentál."
        />
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOUSING_OPTIONS.map((opt) => {
            const isCurrent = currentHousing === opt.id;
            const isAgeLocked = (opt.minAge ?? 0) > career.age;
            const isTeamLocked = opt.requiresTeam && !career.currentTeam;
            const isLocked = isAgeLocked || isTeamLocked;

            return (
              <div
                key={opt.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-gold-500 bg-gold-950/20 shadow-lg shadow-gold-950/30 ring-1 ring-gold-500/50'
                    : isLocked
                    ? 'border-rift-border/40 bg-rift-card/30 opacity-60'
                    : 'border-rift-border bg-rift-surface hover:border-slate-500'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-sm">{t(opt.titleKey as any)}</h4>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-gold-500 text-slate-950 uppercase">
                        Bydlíš zde
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-slate-300 font-bold">
                        {opt.rent === 0 ? 'Zdarma' : `$${opt.rent}/m`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{t(opt.descKey as any)}</p>
                  <div className="text-[11px] text-amber-300 font-semibold bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    ✨ {opt.bonus}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-rift-border/50">
                  {isCurrent ? (
                    <Button variant="secondary" size="sm" fullWidth disabled>
                      ✅ Aktuální domov
                    </Button>
                  ) : isAgeLocked ? (
                    <Button variant="ghost" size="sm" fullWidth disabled>
                      🔒 Vyžaduje věk {opt.minAge}+ (je ti {career.age})
                    </Button>
                  ) : isTeamLocked ? (
                    <Button variant="ghost" size="sm" fullWidth disabled>
                      🔒 Vyžaduje angažmá v týmu
                    </Button>
                  ) : (
                    <Button
                      variant="gold"
                      size="sm"
                      fullWidth
                      onClick={() => changeHousing(opt.id)}
                    >
                      Nastěhovat se
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Food, Nutrition & Self-Care */}
      <Card>
        <CardHeader
          title={t('nutrition.title')}
          icon="🥗"
          subtitle={t('nutrition.subtitle')}
        />
        <div className="p-5 space-y-4">
          {isWithParents ? (
            <div className="p-4 rounded-xl border border-green-800 bg-green-950/30 flex items-center gap-3">
              <span className="text-3xl">🍲</span>
              <div>
                <h4 className="font-bold text-green-300 text-sm">{t('nutrition.free_home')}</h4>
                <p className="text-xs text-green-400/80 mt-0.5">
                  Bydlíš s rodinou. Rodiče se starají o teplé jídlo, nákupy a čisté prádlo zdarma. Žádné výdaje na jídlo!
                </p>
              </div>
            </div>
          ) : isInGamingHouse ? (
            <div className="p-4 rounded-xl border border-cyan-800 bg-cyan-950/30 flex items-center gap-3">
              <span className="text-3xl">👨‍🍳</span>
              <div>
                <h4 className="font-bold text-cyan-300 text-sm">{t('nutrition.free_team')}</h4>
                <p className="text-xs text-cyan-400/80 mt-0.5">
                  V Gaming Housu vaří osobní šéfkuchař výživově vyváženou stravu pro esportovce. Hrazeno z rozpočtu organizace!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {NUTRITION_OPTIONS.map((plan) => {
                const isSelected = currentNutrition === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/50'
                        : 'border-rift-border bg-rift-surface hover:border-slate-500'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-white text-xs">{t(plan.titleKey as any)}</h5>
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                            Aktivní
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{t(plan.descKey as any)}</p>
                      <p className="text-[11px] text-emerald-400 font-semibold">{plan.effectBadge}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-rift-border/50">
                      {isSelected ? (
                        <Button variant="secondary" size="xs" fullWidth disabled>
                          ✅ Nastaveno
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="xs"
                          fullWidth
                          onClick={() => setNutritionPlan(plan.id)}
                        >
                          Zvolit tento plán
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

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
