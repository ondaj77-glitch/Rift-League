import { ALL_CHAMPIONS } from './champions';

export type MatchupType = 'HARD_COUNTER' | 'ADVANTAGE' | 'EVEN' | 'DISADVANTAGE' | 'HARD_COUNTERED';

export interface MatchupResult {
  type: MatchupType;
  scoreBonus: number;        // e.g. +15 or -15 to starting combat score
  difficultyDelta: number;   // e.g. -8 or +8 to tactical checks DC
  winRateDelta: number;      // e.g. +12% or -12% in auto-simulations
  labelCs: string;
  labelEn: string;
  reasonCs: string;
  reasonEn: string;
  advantageBadge: string;    // e.g. '🎯 HARD COUNTER (+15)'
}

// Explicit statistical LoL counter matrix covering all champions
export const DIRECT_COUNTERS: Record<string, { counters: string[]; counteredBy: string[]; tipCs: string; tipEn: string }> = {
  // ── TOP LANE ─────────────────────────────────────────────────────────────
  Aatrox: {
    counters: ['Sion', 'Chogath', 'Nasus', 'DrMundo', 'Sett', 'Malphite', 'Ornn', 'Singed'],
    counteredBy: ['Fiora', 'Irelia', 'Riven', 'Camille', 'Kled', 'Gwen', 'Wukong'],
    tipCs: 'Drtí nepohyblivé tanky přes sweetspoty; ztrácí proti mobilním duelantům s vysokým DPS.',
    tipEn: 'Crushes immobile tanks with Q sweetspots; struggles against hyper-mobile duelists.',
  },
  Jax: {
    counters: ['Camille', 'Tryndamere', 'Yorick', 'Sett', 'Urgot', 'Ambessa', 'Irelia', 'Kled'],
    counteredBy: ['Malphite', 'Jayce', 'Gragas', 'Poppy', 'Kennen', 'Singed'],
    tipCs: 'Counter-Strike kompletně blokuje autoútoky a otáčí souboje na lince.',
    tipEn: 'Counter-Strike completely blocks auto-attacks and turns all-ins.',
  },
  KSante: {
    counters: ['Malphite', 'Ornn', 'Sion', 'Shen', 'Sett', 'Chogath', 'DrMundo'],
    counteredBy: ['Fiora', 'Gwen', 'Vayne', 'Mordekaiser', 'Kayle'],
    tipCs: 'Neúprosný tank s velkou kontrolou; ztrácí proti true damage a AP shredderům.',
    tipEn: 'Resilient warden with kidnap ult; falls to true damage and heavy AP shred.',
  },
  Mordekaiser: {
    counters: ['Malphite', 'Ornn', 'Sion', 'Illaoi', 'Chogath', 'Nasus', 'Sett', 'Shen'],
    counteredBy: ['Fiora', 'Olaf', 'Gangplank', 'Vayne', 'Jayce', 'Kennen'],
    tipCs: 'Death Realm izoluje nepřátelské frontline tanky a krade jim atributy.',
    tipEn: 'Death Realm isolates frontliners and steals stats in 1v1 duels.',
  },
  Fiora: {
    counters: ['Aatrox', 'KSante', 'Ornn', 'Sion', 'Chogath', 'Mordekaiser', 'Urgot', 'Kled'],
    counteredBy: ['Malphite', 'Jayce', 'Kennen', 'Renekton', 'Poppy', 'Akali'],
    tipCs: 'Paríruje tvrdé CC a drtí tanky maximálním % true damage.',
    tipEn: 'Ripostes hard CC and shreds high HP targets with max % true damage vitals.',
  },
  Camille: {
    counters: ['Gnar', 'Gangplank', 'Jayce', 'Kayle', 'Kennen', 'Aatrox'],
    counteredBy: ['Jax', 'Renekton', 'Fiora', 'Shen', 'Poppy', 'Darius'],
    tipCs: 'Hookshot a Hextech Ultimátka spolehlivě odchytávají křehké boční linky.',
    tipEn: 'Hookshot and Hextech Ultimatum cleanly isolate and lockdown squishies.',
  },
  Gwen: {
    counters: ['Ornn', 'Sion', 'Chogath', 'DrMundo', 'Malphite', 'KSante', 'Shen'],
    counteredBy: ['Riven', 'Jax', 'Fiora', 'Tryndamere', 'Kennen', 'Akali'],
    tipCs: 'Hallowed Mist imunita a nůžky drtí tanky i v pozdní fázi hry.',
    tipEn: 'Hallowed Mist immunity and snips melt tanks in both lane and late game.',
  },
  Irelia: {
    counters: ['Aatrox', 'Jayce', 'Gnar', 'Kennen', 'Gangplank', 'Kayle', 'Ryze'],
    counteredBy: ['Jax', 'Sett', 'Volibear', 'Renekton', 'Poppy', 'Warwick', 'Darius'],
    tipCs: 'Nekonečné dashe přes miniony decimují křehké ranged toplanery.',
    tipEn: 'Relentless dashes through minion waves dismantle squishy ranged toplaners.',
  },
  Gangplank: {
    counters: ['Illaoi', 'Nasus', 'Teemo', 'Garen', 'DrMundo', 'Singed'],
    counteredBy: ['Irelia', 'Riven', 'Camille', 'Kled', 'Lucian', 'Jayce'],
    tipCs: 'Pomeranč čistí veškeré CC a barely s globální ulti zajišťují mapový tlak.',
    tipEn: 'Oranges cleanse CC and global Cannon Barrage exerts cross-map pressure.',
  },
  Renekton: {
    counters: ['Irelia', 'Riven', 'Yasuo', 'Yone', 'Camille', 'Jayce'],
    counteredBy: ['Illaoi', 'Ornn', 'Malphite', 'Poppy', 'Garen', 'Mordekaiser'],
    tipCs: 'Empowered W láme štíty a uděluje brutální early burst.',
    tipEn: 'Empowered W breaks shields and provides devastating early lane dominance.',
  },
  Jayce: {
    counters: ['Darius', 'Garen', 'Mordekaiser', 'Urgot', 'Sett', 'Teemo'],
    counteredBy: ['Irelia', 'Malphite', 'Wukong', 'Camille', 'Poppy'],
    tipCs: 'Dálkový poke a rychlá změna zbraně trestají nepohyblivé kolosy.',
    tipEn: 'Ranged poke and form swaps punish slow immobile juggernauts.',
  },
  Gnar: {
    counters: ['Darius', 'Garen', 'Sett', 'Illaoi', 'Singed', 'Chogath'],
    counteredBy: ['Irelia', 'Yasuo', 'Malphite', 'Camille', 'Jayce'],
    tipCs: 'Kite v mini formě a brutální CC engage ve formě Mega Gnara.',
    tipEn: 'Kiting in Mini form and massive wall-slam CC in Mega form.',
  },
  Ornn: {
    counters: ['Malphite', 'Sion', 'Chogath', 'Teemo', 'Shen'],
    counteredBy: ['Fiora', 'Gwen', 'Vayne', 'Mordekaiser', 'Illaoi'],
    tipCs: 'Vylepšuje týmové itemy a Call of the Forge God zahajuje teamfighty.',
    tipEn: 'Item upgrades scale allies and Call of the Forge God initiates teamfights.',
  },
  Rumble: {
    counters: ['Jax', 'Renekton', 'Shen', 'Teemo', 'Gangplank'],
    counteredBy: ['Jayce', 'Kennen', 'TahmKench', 'Aatrox', 'Irelia'],
    tipCs: 'Plamenomet a Equalizer v úzkých prostorech pálí celé týmy.',
    tipEn: 'Flamespitter and Equalizer in narrow chokes melt grouped teams.',
  },
  Riven: {
    counters: ['Gwen', 'Aatrox', 'Yasuo', 'Yone', 'Kayle', 'Gangplank'],
    counteredBy: ['Renekton', 'Poppy', 'Volibear', 'Urgot', 'Malphite', 'Kennen'],
    tipCs: 'Vysoká mobilita a štíty; trpí proti tvrdému point-and-click CC a tankům.',
    tipEn: 'High mobility and shields; shut down by hard point-and-click CC and armor.',
  },
  Sett: {
    counters: ['Irelia', 'Yasuo', 'Yone', 'Rengar', 'Riven', 'Kled'],
    counteredBy: ['Aatrox', 'Renekton', 'Volibear', 'Vayne', 'Malphite', 'Gnar'],
    tipCs: 'Haymaker absorbuje burst a vrací gigantický true damage středem.',
    tipEn: 'Haymaker absorbs lethal burst and returns massive center true damage.',
  },
  Darius: {
    counters: ['Nasus', 'Sion', 'DrMundo', 'Chogath', 'Sett', 'Shen', 'Singed'],
    counteredBy: ['Vayne', 'Jayce', 'Gnar', 'Kennen', 'Quinn', 'Teemo'],
    tipCs: 'Pasivní krvácení a Noxian Might vyhrávají každý prodloužený melee trade.',
    tipEn: 'Hemorrhage passive and Noxian Might dominate every prolonged melee trade.',
  },
  Malphite: {
    counters: ['Jax', 'Tryndamere', 'Fiora', 'Irelia', 'Quinn', 'Jayce', 'Lucian'],
    counteredBy: ['Mordekaiser', 'Gwen', 'Sylas', 'Chogath', 'Sion', 'Rumble'],
    tipCs: 'Ground Slam snižuje attack speed o 50 % a ulti zaručuje tvrdý engage.',
    tipEn: 'Ground Slam cuts attack speed by 50% while Unstoppable Force guarantees hard engage.',
  },

  // ── JUNGLE ───────────────────────────────────────────────────────────────
  LeeSin: {
    counters: ['Nidalee', 'Khazix', 'MasterYi', 'Kindred', 'Evelynn', 'Shaco'],
    counteredBy: ['Poppy', 'RekSai', 'Udyr', 'Volibear', 'Viego', 'Sejuani'],
    tipCs: 'Early game invady a InSec kopy vytvářejí okamžité přesilovky.',
    tipEn: 'Early game invades and InSec kicks create instant numerical advantages.',
  },
  Viego: {
    counters: ['Graves', 'JarvanIV', 'LeeSin', 'XinZhao', 'Diana'],
    counteredBy: ['Rammus', 'Amumu', 'Poppy', 'Warwick', 'Jax', 'Belveth'],
    tipCs: 'Posednutí padlých nepřátel dává nezranitelnost a řetězové resety.',
    tipEn: 'Possessing fallen champions grants invulnerability and chain resets.',
  },
  Belveth: {
    counters: ['Graves', 'JarvanIV', 'Sejuani', 'Zac', 'Amumu'],
    counteredBy: ['Rammus', 'Jax', 'MasterYi', 'Nocturne', 'Poppy'],
    tipCs: 'Nekonečné útoky a True Damage drtí nepohyblivé tanky.',
    tipEn: 'Infinite attack speed scaling and True Damage melt heavy tanks.',
  },
  Khazix: {
    counters: ['LeeSin', 'Nidalee', 'Kindred', 'Karthus', 'Viego', 'Ekko'],
    counteredBy: ['Rammus', 'Poppy', 'Amumu', 'Sejuani', 'Volibear', 'Warwick'],
    tipCs: 'Izolované cíle dostávají trojnásobný burst damage ze zálohy.',
    tipEn: 'Isolated targets take triple burst damage from unseen stealth.',
  },
  JarvanIV: {
    counters: ['Kindred', 'Graves', 'Fiddlesticks', 'Karthus', 'Diana'],
    counteredBy: ['Poppy', 'Viego', 'Belveth', 'LeeSin', 'Sylas'],
    tipCs: 'Cataclysm aréna uzamkne nepřátele bez flash a zajistí týmový wombo combo.',
    tipEn: 'Cataclysm arena locks flashless carries for instant wombo combo execution.',
  },
  Poppy: {
    counters: ['LeeSin', 'Riven', 'Irelia', 'Khazix', 'JarvanIV', 'Zac', 'Vi'],
    counteredBy: ['Olaf', 'Morgana', 'Trundle', 'Lillia', 'Karthus'],
    tipCs: 'Steadfast Presence kompletně zastavuje nepřátelské skoky a dashe.',
    tipEn: 'Steadfast Presence shuts down all incoming enemy dashes and leaps.',
  },

  // ── MID LANE ─────────────────────────────────────────────────────────────
  Azir: {
    counters: ['Orianna', 'Viktor', 'Ryze', 'Cassiopeia', 'Malzahar', 'Galio'],
    counteredBy: ['Zed', 'Kassadin', 'Xerath', 'Ekko', 'Syndra', 'Yone'],
    tipCs: 'Shurima Shuffle rozděluje nepřátelský tým a vojáci zónují bojiště.',
    tipEn: 'Shurima Shuffle divides enemy team and sand soldiers control late game.',
  },
  Yone: {
    counters: ['Azir', 'AurelionSol', 'Veigar', 'Viktor', 'Syndra', 'Orianna'],
    counteredBy: ['Vex', 'Pantheon', 'Renekton', 'Akali', 'Sett', 'Jax'],
    tipCs: 'Soul Unbound dává bezpečný trade a Fate Sealed zaručuje AoE knockup.',
    tipEn: 'Soul Unbound provides safe dive trades and Fate Sealed lands huge AoE knockup.',
  },
  Yasuo: {
    counters: ['Ahri', 'Syndra', 'TwistedFate', 'Zoe', 'MissFortune', 'Lux'],
    counteredBy: ['Vex', 'Renekton', 'Pantheon', 'Malzahar', 'Annie', 'Poppy'],
    tipCs: 'Windwall maže veškeré projektily a ultimátky z dálky.',
    tipEn: 'Windwall deletes all enemy ranged skillshots and key projectile ultimates.',
  },
  Ahri: {
    counters: ['Syndra', 'Lux', 'Viktor', 'Anivia', 'Velkoz', 'Hwei'],
    counteredBy: ['Yasuo', 'Yone', 'Leblanc', 'Vex', 'Tristana', 'Kassadin'],
    tipCs: 'Charm a trojitý Spirit Rush skok zaručují bezpečný pickoff ze zálohy.',
    tipEn: 'Charm and triple Spirit Rush dashes ensure safe assassination and disengage.',
  },
  Syndra: {
    counters: ['Ahri', 'Azir', 'Leblanc', 'Cassiopeia', 'Taliyah', 'Ryze'],
    counteredBy: ['Fizz', 'Zed', 'Ekko', 'Yasuo', 'Katarina', 'Kassadin'],
    tipCs: 'Scatter the Weak plošný stun a Unleashed Power vymažou cíl na dálku.',
    tipEn: 'Scatter the Weak long range stun and Unleashed Power delete single targets.',
  },
  Vex: {
    counters: ['Yasuo', 'Yone', 'Leblanc', 'Akali', 'Katarina', 'Irelia', 'Kalista'],
    counteredBy: ['Viktor', 'Xerath', 'Velkoz', 'Lux', 'Orianna', 'Anivia'],
    tipCs: 'Doom pasivka automaticky fearuje a trestá každého, kdo použije dash.',
    tipEn: 'Doom passive automatically fears and interrupts enemy dash champions.',
  },
  Zed: {
    counters: ['Azir', 'Orianna', 'Viktor', 'Veigar', 'Lux', 'Syndra'],
    counteredBy: ['Lissandra', 'Malzahar', 'Kayle', 'Vladimir', 'Zhonya'],
    tipCs: 'Death Mark a stíny umožňují one-shot bez možnosti protiútoku.',
    tipEn: 'Death Mark and shadows execute squishies and cleanly teleport back.',
  },
  Sylas: {
    counters: ['Malphite', 'Ashe', 'Gnar', 'TwistedFate', 'Lissandra', 'Amumu'],
    counteredBy: ['Cassiopeia', 'Zed', 'Syndra', 'Heimerdinger', 'Vex'],
    tipCs: 'Krádež vlivných ultimát a obří léčení z Kingslayeru.',
    tipEn: 'Hijack steals game-changing teamfight ultimates with massive Kingslayer heal.',
  },
  Malzahar: {
    counters: ['Yasuo', 'Leblanc', 'Katarina', 'Zed', 'Akali', 'Sylas'],
    counteredBy: ['Syndra', 'Viktor', 'Orianna', 'Xerath', 'Velkoz'],
    tipCs: 'Nether Grasp potlačení zaručuje okamžitý pickoff mobilních asasínů.',
    tipEn: 'Nether Grasp point-and-click suppression locks down hyper-mobile threats.',
  },

  // ── ADC / BOT ────────────────────────────────────────────────────────────
  Kaisa: {
    counters: ['Vayne', 'Ezreal', 'Zeri', 'Sivir', 'Smolder'],
    counteredBy: ['Caitlyn', 'Draven', 'Ashe', 'Lucian', 'Jinx'],
    tipCs: 'Killer Instinct skok a hybridní poškození rozhodují izolované duely.',
    tipEn: 'Killer Instinct dive and hybrid plasma burst win isolated assassinations.',
  },
  Jinx: {
    counters: ['Aphelios', 'Ashe', 'Varus', 'Senna', 'Smolder', 'Zeri'],
    counteredBy: ['Samira', 'Draven', 'Lucian', 'Tristana', 'Nautilus'],
    tipCs: 'Get Excited pasivka a rakety dominují velkým týmovým soubojům.',
    tipEn: 'Get Excited passive resets and Fishbones rockets dominate late 5v5 teamfights.',
  },
  Caitlyn: {
    counters: ['Vayne', 'Kaisa', 'Samira', 'Nilah', 'Lucian', 'Ezreal'],
    counteredBy: ['Jinx', 'Ashe', 'Varus', 'Sivir', 'Tristana'],
    tipCs: 'Nejdelší základní dosah ve hře a pasti šikanují nepřátele pod věží.',
    tipEn: 'Longest base attack range in the game and Yordle Snap Traps zone under turrets.',
  },
  Vayne: {
    counters: ['Sion', 'Chogath', 'Ornn', 'DrMundo', 'Malphite', 'KSante', 'Ezreal'],
    counteredBy: ['Caitlyn', 'Draven', 'Lucian', 'Ashe', 'MissFortune', 'Samira'],
    tipCs: 'Silver Bolts procentuální true damage drtí i nejodolnější tanky.',
    tipEn: 'Silver Bolts % max health true damage shreds through any armor stack.',
  },
  Samira: {
    counters: ['MissFortune', 'Ezreal', 'Ashe', 'Varus', 'Sivir'],
    counteredBy: ['Nautilus', 'Leona', 'Lulu', 'Rammus', 'Amumu', 'Poppy'],
    tipCs: 'Blade Whirl maže nepřátelské střely a Inferno Trigger uděluje masivní AoE.',
    tipEn: 'Blade Whirl destroys all incoming missiles while Inferno Trigger deals lethal AoE.',
  },
  Draven: {
    counters: ['Vayne', 'Kaisa', 'Jinx', 'Ezreal', 'Twitch', 'Smolder'],
    counteredBy: ['Caitlyn', 'Varus', 'Ashe', 'Nautilus', 'Leona', 'Braum'],
    tipCs: 'Spinning Axes udělují obří poškození a snowballují zlaťáky z pasivky.',
    tipEn: 'Spinning Axes deal massive early damage and Adoration passive snowballs gold.',
  },

  // ── SUPPORT ──────────────────────────────────────────────────────────────
  Thresh: {
    counters: ['Sona', 'Soraka', 'Janna', 'Yuumi', 'Lux', 'Nami'],
    counteredBy: ['Morgana', 'Braum', 'Alistar', 'Leona', 'Taric', 'Nautilus'],
    tipCs: 'Death Sentence hák a Lucerna poskytují ultimátní tvorbu hry i záchranu.',
    tipEn: 'Death Sentence hooks and Dark Passage lantern provide unmatched playmaking and saves.',
  },
  Blitzcrank: {
    counters: ['Sona', 'Soraka', 'Janna', 'Yuumi', 'Lux', 'Nami', 'Senna'],
    counteredBy: ['Morgana', 'Braum', 'Alistar', 'Leona', 'Nautilus', 'Rell'],
    tipCs: 'Rocket Grab okamžitě zabíjí chycené křehké cíle.',
    tipEn: 'Rocket Grab instantly isolates and eliminates squishy backliners.',
  },
  Morgana: {
    counters: ['Blitzcrank', 'Thresh', 'Nautilus', 'Leona', 'Pyke', 'Rell', 'Amumu'],
    counteredBy: ['Karma', 'Sona', 'Lulu', 'Zyra', 'Senna', 'Milio'],
    tipCs: 'Black Shield kompletně neguje jakékoliv nepřátelské crowd control.',
    tipEn: 'Black Shield completely negates hard CC and protects key hypercarries.',
  },
  Leona: {
    counters: ['Yuumi', 'Sona', 'Soraka', 'Janna', 'Senna', 'Lulu'],
    counteredBy: ['Morgana', 'Thresh', 'Braum', 'Alistar', 'Janna', 'Rell'],
    tipCs: 'Sluneční štít a trojitý stun lockují cíle na místě bez možnosti úniku.',
    tipEn: 'Solar Flare and chain CC lock targets in place with zero counterplay.',
  },
  Nautilus: {
    counters: ['Yuumi', 'Sona', 'Soraka', 'Senna', 'Lux', 'Nami'],
    counteredBy: ['Morgana', 'Braum', 'Alistar', 'Leona', 'Thresh', 'Rell'],
    tipCs: 'Point-and-click Depth Charge ulti zaručuje zásah na nepřátelské carry.',
    tipEn: 'Point-and-click Depth Charge guarantees knockup on priority carry targets.',
  },
  Braum: {
    counters: ['MissFortune', 'Ornn', 'Twitch', 'Ezreal', 'Nami', 'Jhin'],
    counteredBy: ['Morgana', 'Senna', 'Zyra', 'Lux', 'Karma', 'Brand'],
    tipCs: 'Unbreakable štít blokuje veškeré projektily a chrání tým před AoE burstem.',
    tipEn: 'Unbreakable wall intercepts projectiles and absorbs entire enemy ultimate barrage.',
  },
  Lulu: {
    counters: ['Zed', 'Katarina', 'Akali', 'Rengar', 'MasterYi', 'Khazix'],
    counteredBy: ['Blitzcrank', 'Nautilus', 'Pyke', 'Leona', 'Thresh'],
    tipCs: 'Polymorph promění nabíhající asasíny v bezmocné zvířátko.',
    tipEn: 'Polymorph shuts down diving assassins into harmless critters instantly.',
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
