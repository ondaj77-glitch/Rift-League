import { ALL_CHAMPIONS } from './champions';

export type MatchupType = 'HARD_COUNTER' | 'ADVANTAGE' | 'EVEN' | 'DISADVANTAGE' | 'HARD_COUNTERED';

export interface MatchupResult {
  type: MatchupType;
  scoreBonus: number;        // e.g. +15 or -15 to starting combat score
  difficultyDelta: number;   // e.g. -8 or +8 to tactical checks DC
  winRateDelta: number;      // e.g. +10% or -10% in auto-simulations
  labelCs: string;
  labelEn: string;
  reasonCs: string;
  reasonEn: string;
  advantageBadge: string;    // e.g. '🎯 HARD COUNTER (+15)'
}

// Explicit iconic LoL counter relationships
// key: championId -> { counters: string[]; counteredBy: string[]; reasonCs: string; reasonEn: string }
export const DIRECT_COUNTERS: Record<string, { counters: string[]; counteredBy: string[]; tipCs: string; tipEn: string }> = {
  // ── TOP LANE ─────────────────────────────────────────────────────────────
  Aatrox: {
    counters: ['Sion', 'Chogath', 'Nasus', 'DrMundo', 'Sett', 'Malphite'],
    counteredBy: ['Fiora', 'Irelia', 'Riven', 'Camille', 'Kled', 'Gwen'],
    tipCs: 'Drtí nepohyblivé tanky přes sweetspoty; ztrácí proti mobilním duelantům s vysokým DPS.',
    tipEn: 'Crushes immobile tanks with Q sweetspots; struggles against hyper-mobile duelists.',
  },
  Fiora: {
    counters: ['Aatrox', 'KSante', 'Ornn', 'Sion', 'Chogath', 'Mordekaiser', 'Urgot'],
    counteredBy: ['Malphite', 'Jayce', 'Kennen', 'Renekton', 'Poppy'],
    tipCs: 'Paríruje tvrdé CC a drtí tanky maximálním % true damage.',
    tipEn: 'Ripostes hard CC and shreds high HP targets with max % true damage vitals.',
  },
  Jax: {
    counters: ['Camille', 'Tryndamere', 'Yorick', 'Sett', 'Urgot', 'Ambessa', 'Irelia'],
    counteredBy: ['Malphite', 'Jayce', 'Gragas', 'Poppy', 'Kennen'],
    tipCs: 'Counter-Strike kompletně blokuje autoútoky a otáčí souboje na lince.',
    tipEn: 'Counter-Strike completely blocks auto-attacks and turns all-ins.',
  },
  KSante: {
    counters: ['Malphite', 'Ornn', 'Sion', 'Shen', 'Sett'],
    counteredBy: ['Fiora', 'Gwen', 'Vayne', 'Mordekaiser'],
    tipCs: 'Neúprosný tank s velkou kontrolou; ztrácí proti true damage a AP shredderům.',
    tipEn: 'Resilient warden with kidnap ult; falls to true damage and heavy AP shred.',
  },
  Mordekaiser: {
    counters: ['Malphite', 'Ornn', 'Sion', 'Illaoi', 'Chogath', 'Nasus'],
    counteredBy: ['Fiora', 'Olaf', 'Gangplank', 'Vayne', 'Jayce'],
    tipCs: 'Death Realm izoluje nepřátelské frontline tanky a krade jim atributy.',
    tipEn: 'Death Realm isolates frontliners and steals stats in 1v1 duels.',
  },
  Gwen: {
    counters: ['Ornn', 'Sion', 'Chogath', 'DrMundo', 'Malphite', 'KSante'],
    counteredBy: ['Riven', 'Jax', 'Fiora', 'Tryndamere', 'Kennen'],
    tipCs: 'Hallowed Mist imunita a nůžky drtí tanky i v pozdní fázi hry.',
    tipEn: 'Hallowed Mist immunity and snips melt tanks in both lane and late game.',
  },
  Irelia: {
    counters: ['Aatrox', 'Jayce', 'Gnar', 'Kennen', 'Gangplank', 'Kayle'],
    counteredBy: ['Jax', 'Sett', 'Volibear', 'Renekton', 'Poppy', 'Warwick'],
    tipCs: 'Nekonečné dashe přes miniony decimují křehké ranged toplanery.',
    tipEn: 'Relentless dashes through minion waves dismantle squishy ranged toplaners.',
  },
  Renekton: {
    counters: ['Irelia', 'Riven', 'Yasuo', 'Yone', 'Camille', 'Jayce'],
    counteredBy: ['Illaoi', 'Ornn', 'Malphite', 'Poppy', 'Garen'],
    tipCs: 'Empowered W láme štíty a uděluje brutální early burst.',
    tipEn: 'Empowered W breaks shields and provides devastating early lane dominance.',
  },
  Darius: {
    counters: ['Nasus', 'Sion', 'DrMundo', 'Chogath', 'Sett'],
    counteredBy: ['Vayne', 'Jayce', 'Gnar', 'Kennen', 'Quinn'],
    tipCs: 'Pasivní krvácení a Noxian Might vyhrávají každý prodloužený melee trade.',
    tipEn: 'Hemorrhage passive and Noxian Might dominate every prolonged melee trade.',
  },
  Malphite: {
    counters: ['Jax', 'Tryndamere', 'Fiora', 'Irelia', 'Quinn', 'Jayce'],
    counteredBy: ['Mordekaiser', 'Gwen', 'Sylas', 'Chogath', 'Sion'],
    tipCs: 'Ground Slam snižuje rychlost útoku o 50 % a ulti zaručuje tvrdý engage.',
    tipEn: 'Ground Slam cuts attack speed by 50% while Unstoppable Force guarantees hard engage.',
  },
  Teemo: {
    counters: ['Darius', 'Garen', 'Nasus', 'Tryndamere', 'Vayne'],
    counteredBy: ['Malphite', 'Jayce', 'Aatrox', 'Sion'],
    tipCs: 'Blind šipky znemožňují autoútoky a houby poskytují vizi a zónování.',
    tipEn: 'Blinding Dart disables basic attackers and noxious traps control the map.',
  },

  // ── JUNGLE ───────────────────────────────────────────────────────────────
  LeeSin: {
    counters: ['Nidalee', 'Karthus', 'MasterYi', 'Kindred', 'Belveth'],
    counteredBy: ['Poppy', 'Rammus', 'RekSai', 'Viego', 'Udyr'],
    tipCs: 'Rychlé rané tempo a InSec kopy vytváří okamžité výhody na linkách.',
    tipEn: 'Fast early tempo and InSec kicks create instant numerical advantages.',
  },
  Viego: {
    counters: ['JarvanIV', 'XinZhao', 'Sejuani', 'LeeSin'],
    counteredBy: ['Rammus', 'Amumu', 'Jax', 'Warwick'],
    tipCs: 'Posednutí padlých nepřátel řetězí resety a ničí týmové souboje.',
    tipEn: 'Possessions chain resets and turn teamfights into unstoppable snowballs.',
  },
  JarvanIV: {
    counters: ['Karthus', 'Kindred', 'Khazix', 'Nidalee'],
    counteredBy: ['Poppy', 'Viego', 'Gragas', 'Trundle'],
    tipCs: 'Cataclysm aréna uzamkne nepohyblivé cíle bez flashe.',
    tipEn: 'Cataclysm arena locks down immobile targets without escape tools.',
  },
  Nocturne: {
    counters: ['Kindred', 'Karthus', 'Graves', 'Evelynn'],
    counteredBy: ['Rammus', 'Amumu', 'Jax', 'Warwick'],
    tipCs: 'Paranoia zatemní celou mapu a spellshield blokuje klíčové CC.',
    tipEn: 'Paranoia blacks out global vision while spellshield negates peel CC.',
  },
  Rammus: {
    counters: ['MasterYi', 'Belveth', 'Briar', 'Kindred', 'Graves', 'Viego'],
    counteredBy: ['Lillia', 'Morgana', 'Trundle', 'Evelynn'],
    tipCs: 'Defensive Ball Curl odráží fyzické poškození a provokuje carry.',
    tipEn: 'Defensive Ball Curl reflects auto-attack damage and taunts physical carries.',
  },

  // ── MID LANE ─────────────────────────────────────────────────────────────
  Ahri: {
    counters: ['Lux', 'Orianna', 'Velkoz', 'Ziggs', 'Hwei'],
    counteredBy: ['Yasuo', 'Sylas', 'Tristana', 'LeBlanc'],
    tipCs: 'Spirit Rush rotace a Charm trestají nepřátelské mistry z dálky.',
    tipEn: 'Spirit Rush mobility and Charm punish long-range skillshot mages.',
  },
  Syndra: {
    counters: ['Azir', 'Cassiopeia', 'Ryze', 'Annie', 'Malzahar'],
    counteredBy: ['Fizz', 'Zed', 'Katarina', 'Ekko', 'Yasuo'],
    tipCs: 'Dlouhý dosah stunů a gigantický Unleashed Power burst.',
    tipEn: 'Long-range stun dispersion and massive single-target Unleashed Power burst.',
  },
  Yasuo: {
    counters: ['Ahri', 'TwistedFate', 'Syndra', 'Velkoz', 'Lux', 'Hwei'],
    counteredBy: ['Renekton', 'Pantheon', 'Malzahar', 'Annie', 'Vex', 'Sett'],
    tipCs: 'Windwall vymaže klíčové projektily a ultimáty.',
    tipEn: 'Wind Wall completely erases crucial enemy skillshots and ultimate projectiles.',
  },
  Yone: {
    counters: ['Orianna', 'Viktor', 'Hwei', 'Azir', 'AurelionSol'],
    counteredBy: ['Renekton', 'Pantheon', 'Akali', 'Vex', 'Jax'],
    tipCs: 'Soul Unbound umožňuje bezpečný engage z obří vzdálenosti.',
    tipEn: 'Soul Unbound allows safe, unstoppable dive engages across massive screens.',
  },
  Vex: {
    counters: ['Yasuo', 'Yone', 'Leblanc', 'Katarina', 'Akali', 'Irelia'],
    counteredBy: ['Viktor', 'Syndra', 'Orianna', 'Xerath', 'Lux'],
    tipCs: 'Doom ' + "'" + 'n Gloom pasivně trestá a děsí šampióny s dashi.',
    tipEn: 'Doom ' + "'" + 'n Gloom passively fears and counters hyper-mobile dash assassins.',
  },
  Sylas: {
    counters: ['Malphite', 'Ashe', 'Gnar', 'TwistedFate', 'Lissandra'],
    counteredBy: ['Cassiopeia', 'Zed', 'Syndra', 'Heimerdinger'],
    tipCs: 'Krádež vlivných ultimát a obří léčení z Kingslayeru.',
    tipEn: 'Hijack steals game-changing teamfight ultimates with massive Kingslayer heal.',
  },
  Malzahar: {
    counters: ['Yasuo', 'Leblanc', 'Katarina', 'Zed', 'Akali'],
    counteredBy: ['Syndra', 'Viktor', 'Orianna', 'Xerath'],
    tipCs: 'Nether Grasp potlačení zaručuje okamžitý pickoff mobilních asasínů.',
    tipEn: 'Nether Grasp point-and-click suppression locks down hyper-mobile threats.',
  },

  // ── BOT / ADC ────────────────────────────────────────────────────────────
  Kaisa: {
    counters: ['Vayne', 'Ezreal', 'Zeri', 'Sivir'],
    counteredBy: ['Caitlyn', 'Draven', 'Ashe', 'Lucian'],
    tipCs: 'Killer Instinct skok a hybridní poškození rozhodují izolované duely.',
    tipEn: 'Killer Instinct dive and hybrid plasma burst win isolated assassinations.',
  },
  Jinx: {
    counters: ['Aphelios', 'Ashe', 'Varus', 'Senna'],
    counteredBy: ['Samira', 'Draven', 'Lucian', 'Tristana', 'Nautilus'],
    tipCs: 'Get Excited pasivka a rakety dominují velkým týmovým soubojům.',
    tipEn: 'Get Excited passive resets and Fishbones rockets dominate late 5v5 teamfights.',
  },
  Caitlyn: {
    counters: ['Vayne', 'Kaisa', 'Samira', 'Nilah', 'Lucian'],
    counteredBy: ['Jinx', 'Ashe', 'Varus', 'Sivir'],
    tipCs: 'Nejdelší základní dosah ve hře a pasti šikanují nepřátele pod věží.',
    tipEn: 'Longest base attack range in the game and Yordle Snap Traps zone under turrets.',
  },
  Vayne: {
    counters: ['Sion', 'Chogath', 'Ornn', 'DrMundo', 'Malphite', 'KSante'],
    counteredBy: ['Caitlyn', 'Draven', 'Lucian', 'Ashe', 'MissFortune'],
    tipCs: 'Silver Bolts procentuální true damage drtí i nejodolnější tanky.',
    tipEn: 'Silver Bolts % max health true damage shreds through any armor stack.',
  },
  Samira: {
    counters: ['MissFortune', 'Ezreal', 'Ashe', 'Varus'],
    counteredBy: ['Nautilus', 'Leona', 'Lulu', 'Rammus', 'Amumu'],
    tipCs: 'Blade Whirl maže nepřátelské střely a Inferno Trigger uděluje masivní AoE.',
    tipEn: 'Blade Whirl destroys all incoming missiles while Inferno Trigger deals lethal AoE.',
  },

  // ── SUPPORT ──────────────────────────────────────────────────────────────
  Thresh: {
    counters: ['Sona', 'Soraka', 'Janna', 'Yuumi', 'Lux'],
    counteredBy: ['Morgana', 'Braum', 'Alistar', 'Leona', 'Taric'],
    tipCs: 'Death Sentence hák a Lucerna poskytují ultimátní tvorbu hry i záchranu.',
    tipEn: 'Death Sentence hooks and Dark Passage lantern provide unmatched playmaking and saves.',
  },
  Blitzcrank: {
    counters: ['Sona', 'Soraka', 'Janna', 'Yuumi', 'Lux', 'Nami'],
    counteredBy: ['Morgana', 'Braum', 'Alistar', 'Leona', 'Nautilus'],
    tipCs: 'Rocket Grab okamžitě zabíjí chycené křehké cíle.',
    tipEn: 'Rocket Grab instantly isolates and eliminates squishy backliners.',
  },
  Morgana: {
    counters: ['Blitzcrank', 'Thresh', 'Nautilus', 'Leona', 'Pyke'],
    counteredBy: ['Karma', 'Sona', 'Lulu', 'Zyra', 'Senna'],
    tipCs: 'Black Shield kompletně neguje jakékoliv nepřátelské crowd control.',
    tipEn: 'Black Shield completely negates hard CC and protects key hypercarries.',
  },
  Leona: {
    counters: ['Yuumi', 'Sona', 'Soraka', 'Janna', 'Senna'],
    counteredBy: ['Morgana', 'Thresh', 'Braum', 'Alistar', 'Janna'],
    tipCs: 'Sluneční štít a trojitý stun lockují cíle na místě bez možnosti úniku.',
    tipEn: 'Solar Flare and chain CC lock targets in place with zero counterplay.',
  },
};

export function getMatchupAdvantage(playerChampId: string, enemyChampId: string): MatchupResult {
  const player = ALL_CHAMPIONS.find(c => c.id === playerChampId);
  const enemy = ALL_CHAMPIONS.find(c => c.id === enemyChampId);

  const direct = DIRECT_COUNTERS[playerChampId];
  const enemyDirect = DIRECT_COUNTERS[enemyChampId];

  // 1. Direct Hard Counter Matchup
  if (direct?.counters?.includes(enemyChampId)) {
    return {
      type: 'HARD_COUNTER',
      scoreBonus: 15,
      difficultyDelta: -8,
      winRateDelta: 12,
      labelCs: '🎯 Tvrdý Counter (+15 Výhoda)',
      labelEn: '🎯 Hard Counter (+15 Advantage)',
      reasonCs: `${player?.name || playerChampId} je přímým counterem proti ${enemy?.name || enemyChampId}. ${direct.tipCs}`,
      reasonEn: `${player?.name || playerChampId} directly hard counters ${enemy?.name || enemyChampId}. ${direct.tipEn}`,
      advantageBadge: '🎯 HARD COUNTER (+15)',
    };
  }

  // 2. Direct Hard Countered Matchup
  if (direct?.counteredBy?.includes(enemyChampId) || enemyDirect?.counters?.includes(playerChampId)) {
    return {
      type: 'HARD_COUNTERED',
      scoreBonus: -15,
      difficultyDelta: 8,
      winRateDelta: -12,
      labelCs: '⚠️ Counterován soupeřem (-15 Znevýhodnění)',
      labelEn: '⚠️ Countered by Enemy (-15 Disadvantage)',
      reasonCs: `${enemy?.name || enemyChampId} counteruje tvůj pick (${player?.name || playerChampId}). Budeš muset hrát obezřetně!`,
      reasonEn: `${enemy?.name || enemyChampId} counters your pick (${player?.name || playerChampId}). Play cautiously!`,
      advantageBadge: '⚠️ HARD COUNTERED (-15)',
    };
  }

  // 3. Archetype Advantages based on tags & playstyle
  if (player && enemy) {
    const isPlayerTankShredder = player.counterTags.some(t => t.toLowerCase().includes('tank shredder') || t.toLowerCase().includes('anti-tank'));
    const isEnemyTank = enemy.playstyle === 'Tank' || enemy.counterTags.some(t => t.toLowerCase().includes('tank') || t.toLowerCase().includes('armor'));

    if (isPlayerTankShredder && isEnemyTank) {
      return {
        type: 'ADVANTAGE',
        scoreBonus: 10,
        difficultyDelta: -5,
        winRateDelta: 8,
        labelCs: '🗡️ Výhoda proti tankům (+10 Výhoda)',
        labelEn: '🗡️ Anti-Tank Advantage (+10 Advantage)',
        reasonCs: `${player.name} disponuje true damage a procentuálním poškozením proti tankovi (${enemy.name}).`,
        reasonEn: `${player.name} brings true damage and % health shred against tank (${enemy.name}).`,
        advantageBadge: '🗡️ ANTI-TANK (+10)',
      };
    }

    const isPlayerAntiDive = player.counterTags.some(t => t.toLowerCase().includes('anti-dive') || t.toLowerCase().includes('anti-carry'));
    const isEnemyDive = enemy.playstyle === 'Assassin' || enemy.counterTags.some(t => t.toLowerCase().includes('dive') || t.toLowerCase().includes('dashes'));

    if (isPlayerAntiDive && isEnemyDive) {
      return {
        type: 'ADVANTAGE',
        scoreBonus: 8,
        difficultyDelta: -4,
        winRateDelta: 6,
        labelCs: '🛡️ Anti-Dive Výhoda (+8 Výhoda)',
        labelEn: '🛡️ Anti-Dive Advantage (+8 Advantage)',
        reasonCs: `${player.name} skvěle zónuje a odráží agresivní dive pokusy (${enemy.name}).`,
        reasonEn: `${player.name} zones effectively and dismantles aggressive dives (${enemy.name}).`,
        advantageBadge: '🛡️ ANTI-DIVE (+8)',
      };
    }
  }

  // 4. Neutral / Even Skill Matchup
  return {
    type: 'EVEN',
    scoreBonus: 0,
    difficultyDelta: 0,
    winRateDelta: 0,
    labelCs: '⚖️ Vyrovnaný Skill Matchup',
    labelEn: '⚖️ Even Skill Matchup',
    reasonCs: 'Žádný ze šampiónů nemá zásadní counter výhodu. Rozhodnou čisté mechaniky a makro.',
    reasonEn: 'Neither champion has a hard advantage. Raw mechanics and macro execution decide the lane.',
    advantageBadge: '⚖️ EVEN MATCHUP',
  };
}

export function getChampionCounters(champId: string): { counters: string[]; counteredBy: string[]; tipCs: string; tipEn: string } {
  if (DIRECT_COUNTERS[champId]) {
    return DIRECT_COUNTERS[champId];
  }
  return {
    counters: [],
    counteredBy: [],
    tipCs: 'Univerzální flexibilní pick do různých sestav.',
    tipEn: 'Flexible all-round pick suitable for multiple team compositions.',
  };
}
