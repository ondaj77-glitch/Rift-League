import { ALL_CHAMPIONS, getChampionsByRole } from './champions';
import type { MapTacticalScenario, MapUnit } from '../components/match/TacticalMapBoard';

export function generateTacticalScenarios(
  playerChampId: string,
  enemyChampId: string,
  playerRole: string,
): {
  laning: MapTacticalScenario;
  midGame: MapTacticalScenario;
  lateGame: MapTacticalScenario;
} {
  const roles: Array<'top' | 'jungle' | 'mid' | 'adc' | 'support'> = ['top', 'jungle', 'mid', 'adc', 'support'];

  // Pick random teammates and enemies for each role
  const allyTeam: Record<string, string> = {};
  const enemyTeam: Record<string, string> = {};

  roles.forEach(r => {
    const rolePool = getChampionsByRole(r);
    if (r === playerRole) {
      allyTeam[r] = playerChampId;
      enemyTeam[r] = enemyChampId;
    } else {
      const allyChoice = rolePool.find(c => c.id !== playerChampId && c.id !== enemyChampId) || rolePool[0];
      const enemyChoice = rolePool.find(c => c.id !== allyChoice.id && c.id !== playerChampId && c.id !== enemyChampId) || rolePool[1] || rolePool[0];
      allyTeam[r] = allyChoice.id;
      enemyTeam[r] = enemyChoice.id;
    }
  });

  const playerChamp = ALL_CHAMPIONS.find(c => c.id === playerChampId) || ALL_CHAMPIONS[0];
  const enemyChamp = ALL_CHAMPIONS.find(c => c.id === enemyChampId) || ALL_CHAMPIONS[1];

  // 1. EARLY LANING SCENARIO
  const laningAllies: MapUnit[] = [
    { id: allyTeam.top, name: allyTeam.top, role: 'top', team: 'blue', isPlayer: playerRole === 'top', isDead: false, xPercent: 22, yPercent: 18 },
    { id: allyTeam.jungle, name: allyTeam.jungle, role: 'jungle', team: 'blue', isPlayer: playerRole === 'jungle', isDead: false, xPercent: 35, yPercent: 32 },
    { id: allyTeam.mid, name: allyTeam.mid, role: 'mid', team: 'blue', isPlayer: playerRole === 'mid', isDead: false, xPercent: 48, yPercent: 52 },
    { id: allyTeam.adc, name: allyTeam.adc, role: 'adc', team: 'blue', isPlayer: playerRole === 'adc', isDead: false, xPercent: 78, yPercent: 82 },
    { id: allyTeam.support, name: allyTeam.support, role: 'support', team: 'blue', isPlayer: playerRole === 'support', isDead: false, xPercent: 84, yPercent: 76 },
  ];

  const laningEnemies: MapUnit[] = [
    { id: enemyTeam.top, name: enemyTeam.top, role: 'top', team: 'red', isEnemyLaner: playerRole === 'top', isDead: false, xPercent: 28, yPercent: 14 },
    { id: enemyTeam.jungle, name: enemyTeam.jungle, role: 'jungle', team: 'red', isEnemyLaner: playerRole === 'jungle', isDead: false, xPercent: 62, yPercent: 68 },
    { id: enemyTeam.mid, name: enemyTeam.mid, role: 'mid', team: 'red', isEnemyLaner: playerRole === 'mid', isDead: false, xPercent: 54, yPercent: 46 },
    { id: enemyTeam.adc, name: enemyTeam.adc, role: 'adc', team: 'red', isEnemyLaner: playerRole === 'adc', isDead: false, xPercent: 82, yPercent: 80 },
    { id: enemyTeam.support, name: enemyTeam.support, role: 'support', team: 'red', isEnemyLaner: playerRole === 'support', isDead: false, xPercent: 88, yPercent: 74 },
  ];

  const laning: MapTacticalScenario = {
    id: 'laning_gank_setup',
    titleCs: `Fáze Linky: Lvl 3 Crash & Příjezd Junglera`,
    titleEn: `Laning Phase: Lvl 3 Crash & Jungler Gank Setup`,
    contextCs: `Oponent (${enemyChamp.name}) pushuje velkou vlnu do tvé věže. Tvůj jungler (${allyTeam.jungle}) dorazil do křoví v řece a čeká na tvůj signál k přepadení.`,
    contextEn: `Opponent (${enemyChamp.name}) crashing wave into your tower. Your jungler (${allyTeam.jungle}) waiting in river brush for your engage call.`,
    stage: 'EARLY_LANING',
    playerUltStatus: '⚡ Flash + Plné kombo připraveno',
    enemyKeyCooldown: '⚠️ Hlavní obranný skill v cooldownu (6s)',
    allies: laningAllies,
    enemies: laningEnemies,
    choices: [
      {
        id: 'lane_allin_combo',
        tagCs: '⚡ Bleskový Flash Engage + CC',
        tagEn: '⚡ Flash CC Engage Combo',
        titleCs: `Baitnout duel, spálit Flash a odpálit CC kombo na ${enemyChamp.name}`,
        titleEn: `Bait trade, Flash engage and land CC combo on ${enemyChamp.name}`,
        descCs: `Iniciuj souboj, podrž soupeře na místě a umožni junglerovi (${allyTeam.jungle}) snadný First Blood kill.`,
        descEn: `Initiate trade, lock opponent in place and set up an easy First Blood for your jungler.`,
        statKey: 'mechanics',
        synergyRequired: 'Aggressive',
        difficulty: 54,
        risk: 'High',
        scoreGain: 28,
        scoreLoss: -22,
        winTextCs: `⚡ PERFEKTNÍ GANK! Soupeř (${enemyChamp.name}) padl pod plným kombem, First Blood (+28 Skóre)!`,
        winTextEn: `⚡ PERFECT GANK! Enemy (${enemyChamp.name}) deleted by cc chain, First Blood secured (+28 Score)!`,
        lossTextCs: `💀 Minul jsi klíčový skillshot, soupeř přežil a stihl odskákat pod věž (-22 Skóre).`,
        lossTextEn: `💀 Missed key skillshot, opponent survived and flashed out safely (-22 Score).`,
      },
      {
        id: 'lane_freeze_wave',
        tagCs: '🧠 Zmrazit Vlnu a Zónovat',
        tagEn: '🧠 Wave Freeze & Starve',
        titleCs: 'Nechat vlnu před věží a úplně odstřihnout soupeře od zlaťáků',
        titleEn: 'Hold freeze before turret and zone enemy completely',
        descCs: 'Vyhni se zbytečnému riziku, udrž freeze a nech soupeře ztratit 2 vlny minionů a zkušenosti.',
        descEn: 'Avoid coinflip risk, maintain freeze and starve opponent of 2 waves of gold & XP.',
        statKey: 'gameKnowledge',
        synergyRequired: 'Scaling',
        difficulty: 48,
        risk: 'Low',
        scoreGain: 18,
        scoreLoss: -10,
        winTextCs: `🎯 MISTROVSKÝ FREEZE! Soupeř ztratil 20 CS a je o úroveň pozadu (+18 Skóre).`,
        winTextEn: `🎯 FLAWLESS FREEZE! Opponent starved of 20 CS and a full level behind (+18 Score).`,
        lossTextCs: `⚠️ Vlna se odrazila a soupeř se v klidu vyresetoval (-10 Skóre).`,
        lossTextEn: `⚠️ Wave bounced into enemy turret, lost lane control (-10 Score).`,
      },
      {
        id: 'lane_invade_jungle',
        tagCs: '🗡️ Rotace do Nepřátelské Jungle',
        tagEn: '🗡️ River Roam & Jungle Invade',
        titleCs: `Rychle zatlačit vlnu a ukrást nepřátelskému junglerovi kemp`,
        titleEn: `Fast shove and collapse with jungler into enemy camps`,
        descCs: `Využij převahu vln, vpadni do nepřátelské jungle s junglerem a seberte buff a vizi.`,
        descEn: `Shove wave, invade enemy jungle with your jungler and steal buff and deep vision.`,
        statKey: 'communication',
        synergyRequired: 'Utility',
        difficulty: 52,
        risk: 'Medium',
        scoreGain: 22,
        scoreLoss: -14,
        winTextCs: `💥 INVADE ÚSPĚCH! Sebrali jste nepřátelský buff a jungler (${allyTeam.jungle}) má obří náskok (+22 Skóre).`,
        winTextEn: `💥 INVADE WIN! Stole enemy buff and secured total jungle map tempo (+22 Score).`,
        lossTextCs: `👀 Nepřátelský mid laner včas zarotoval a museli jste ustoupit (-14 Skóre).`,
        lossTextEn: `👀 Enemy mid collapsed in time, forced to disengage (-14 Score).`,
      },
    ],
  };

  // 2. MID GAME SCENARIO (4v5 Dragon Contest)
  const midAllies: MapUnit[] = [
    { id: allyTeam.top, name: allyTeam.top, role: 'top', team: 'blue', isPlayer: playerRole === 'top', isDead: false, xPercent: 58, yPercent: 62 },
    { id: allyTeam.jungle, name: allyTeam.jungle, role: 'jungle', team: 'blue', isPlayer: playerRole === 'jungle', isDead: false, xPercent: 64, yPercent: 68 },
    { id: allyTeam.mid, name: allyTeam.mid, role: 'mid', team: 'blue', isPlayer: playerRole === 'mid', isDead: false, xPercent: 52, yPercent: 58 },
    { id: allyTeam.adc, name: allyTeam.adc, role: 'adc', team: 'blue', isPlayer: playerRole === 'adc', isDead: false, xPercent: 68, yPercent: 72 },
    { id: allyTeam.support, name: allyTeam.support, role: 'support', team: 'blue', isPlayer: playerRole === 'support', isDead: false, xPercent: 60, yPercent: 74 },
  ];

  const midEnemies: MapUnit[] = [
    { id: enemyTeam.top, name: enemyTeam.top, role: 'top', team: 'red', isEnemyLaner: playerRole === 'top', isDead: false, xPercent: 24, yPercent: 20 },
    { id: enemyTeam.jungle, name: enemyTeam.jungle, role: 'jungle', team: 'red', isEnemyLaner: playerRole === 'jungle', isDead: false, xPercent: 72, yPercent: 64 },
    { id: enemyTeam.mid, name: enemyTeam.mid, role: 'mid', team: 'red', isEnemyLaner: playerRole === 'mid', isDead: false, xPercent: 70, yPercent: 54 },
    { id: enemyTeam.adc, name: enemyTeam.adc, role: 'adc', team: 'red', isEnemyLaner: playerRole === 'adc', isDead: true, respawnTime: 22, xPercent: 88, yPercent: 86 },
    { id: enemyTeam.support, name: enemyTeam.support, role: 'support', team: 'red', isEnemyLaner: playerRole === 'support', isDead: false, xPercent: 76, yPercent: 70 },
  ];

  const midGame: MapTacticalScenario = {
    id: 'mid_dragon_powerplay',
    titleCs: `Mid Game: Souboj o Draka (4v5 Power Play)`,
    titleEn: `Mid Game: Soul Dragon Contest (4v5 Power Play)`,
    contextCs: `Nepřátelské ADC (${enemyTeam.adc}) je MRTVÉ (💀 22s). Oponenti se ve 4 lidech pokouší o zoufalý steal draka, zatímco ${enemyChamp.name} overextenduje na horní lince.`,
    contextEn: `Enemy ADC (${enemyTeam.adc}) is DEAD (💀 22s). Enemies 4-man contesting Dragon while ${enemyChamp.name} splitpushes top.`,
    stage: 'DRAGON_FIGHT',
    playerUltStatus: `👑 Ultimate [R] PŘIPRAVENA`,
    enemyKeyCooldown: `⚠️ Nepřátelské ADC mrtvé (22s) · Oponent bez TP`,
    allies: midAllies,
    enemies: midEnemies,
    choices: [
      {
        id: 'mid_rush_dragon',
        tagCs: '🐉 Rychlý Drak + Obrat na Soupeře',
        tagEn: '🐉 Fast Dragon & Turn on Enemy',
        titleCs: 'Rychle dorazit draka a smést oslabený nepřátelský 4-man tým',
        titleEn: 'Secure Dragon quickly and wipe out the 4-man enemy collapse',
        descCs: 'Využijte početní převahu 5v4, získejte Dračí Duši a otočte boj s ultimátkou.',
        descEn: 'Leverage 5v4 number advantage, secure Soul point and turn the fight with ultimate.',
        statKey: 'communication',
        synergyRequired: 'Teamfight',
        difficulty: 55,
        risk: 'Medium',
        scoreGain: 32,
        scoreLoss: -24,
        winTextCs: '🏆 DRAK ZAJIŠTĚN & ACE! Zničili jste 4 nepřátele v pitu a získali Dračí Duši (+32 Skóre)!',
        winTextEn: '🏆 DRAGON SECURED & ACE! Wiped 4 enemies in pit and took Dragon Soul (+32 Score)!',
        lossTextCs: '💔 Nepřátelský jungler proklouzl a ukradl draka přes Smite (-24 Skóre).',
        lossTextEn: '💔 Enemy jungler sneaked in and stole dragon with Smite (-24 Score).',
      },
      {
        id: 'mid_flank_backline',
        tagCs: '⚡ Hluboký Flank na Nepřátelský Mid',
        tagEn: '⚡ Deep Flank on Enemy Mid Carry',
        titleCs: `Obejít pit zezadu a smazat nepřátelského mága (${enemyTeam.mid})`,
        titleEn: `Flank around pit choke and burst enemy mid carry (${enemyTeam.mid})`,
        descCs: 'Zamiř ze tmy přímo na klíčového nepřátelského damage dealera a vyřaď ho dřív než stihne zakouzlit.',
        descEn: 'Dive from fog of war directly onto enemy mid carry to delete them before teamfight begins.',
        statKey: 'mechanics',
        synergyRequired: 'Assassin',
        difficulty: 62,
        risk: 'High',
        scoreGain: 36,
        scoreLoss: -28,
        winTextCs: `⚡ ONE-SHOT KILL! ${enemyTeam.mid} padl za 0.4s a nepřátelský tým se rozpadl (+36 Skóre)!`,
        winTextEn: `⚡ ONE-SHOT KILL! Deleted ${enemyTeam.mid} in 0.4s, enemy team completely collapsed (+36 Score)!`,
        lossTextCs: `💀 Chytil tě support do CC a byl jsi smazán před zahájením boje (-28 Skóre).`,
        lossTextEn: `💀 Pinned down by enemy support CC and collapsed on (-28 Score).`,
      },
      {
        id: 'mid_crossmap_turrets',
        tagCs: '🏰 Cross-map Inhibitor Push',
        tagEn: '🏰 Cross-map Inhibitor Push',
        titleCs: 'Nechat draka na poke a prolomit dvě boční věže a inhibitor',
        titleEn: 'Trade Dragon for 2 side turrets and open inhibitor',
        descCs: 'Zatímco se 4 soupeři zdržují na drakovi, znič vnitřní věž i inhibitor na volné lince.',
        descEn: 'While 4 enemies stall around pit, crush inner turret and crack inhibitor on side.',
        statKey: 'adaptability',
        synergyRequired: 'Splitpush',
        difficulty: 50,
        risk: 'Low',
        scoreGain: 24,
        scoreLoss: -14,
        winTextCs: '🏰 INHIBITOR ZNIČEN! Superminioni proudí do nepřátelské báze (+24 Skóre)!',
        winTextEn: '🏰 INHIBITOR DOWN! Super minions now pouring into enemy base (+24 Score)!',
        lossTextCs: '⚠️ Soupeř rychle zabil draka a stihl tě chytit před inhibitorem (-14 Skóre).',
        lossTextEn: '⚠️ Enemy quickly finished dragon and collapsed before inhibitor fell (-14 Score).',
      },
    ],
  };

  // 3. LATE GAME SCENARIO (Baron Nashor Standoff)
  const lateAllies: MapUnit[] = [
    { id: allyTeam.top, name: allyTeam.top, role: 'top', team: 'blue', isPlayer: playerRole === 'top', isDead: false, xPercent: 32, yPercent: 28 },
    { id: allyTeam.jungle, name: allyTeam.jungle, role: 'jungle', team: 'blue', isPlayer: playerRole === 'jungle', isDead: false, xPercent: 28, yPercent: 32 },
    { id: allyTeam.mid, name: allyTeam.mid, role: 'mid', team: 'blue', isPlayer: playerRole === 'mid', isDead: false, xPercent: 36, yPercent: 34 },
    { id: allyTeam.adc, name: allyTeam.adc, role: 'adc', team: 'blue', isPlayer: playerRole === 'adc', isDead: false, xPercent: 40, yPercent: 38 },
    { id: allyTeam.support, name: allyTeam.support, role: 'support', team: 'blue', isPlayer: playerRole === 'support', isDead: false, xPercent: 34, yPercent: 42 },
  ];

  const lateEnemies: MapUnit[] = [
    { id: enemyTeam.top, name: enemyTeam.top, role: 'top', team: 'red', isEnemyLaner: playerRole === 'top', isDead: false, xPercent: 24, yPercent: 22 },
    { id: enemyTeam.jungle, name: enemyTeam.jungle, role: 'jungle', team: 'red', isEnemyLaner: playerRole === 'jungle', isDead: false, xPercent: 22, yPercent: 26 },
    { id: enemyTeam.mid, name: enemyTeam.mid, role: 'mid', team: 'red', isEnemyLaner: playerRole === 'mid', isDead: false, xPercent: 18, yPercent: 32 },
    { id: enemyTeam.adc, name: enemyTeam.adc, role: 'adc', team: 'red', isEnemyLaner: playerRole === 'adc', isDead: false, xPercent: 14, yPercent: 28 },
    { id: enemyTeam.support, name: enemyTeam.support, role: 'support', team: 'red', isEnemyLaner: playerRole === 'support', isDead: false, xPercent: 20, yPercent: 36 },
  ];

  const lateGame: MapTacticalScenario = {
    id: 'late_baron_deciding_fight',
    titleCs: `Late Game: Rozhodující 5v5 Bitva u Barona Nashora`,
    titleEn: `Late Game: Deciding 5v5 Baron Nashor Standoff`,
    contextCs: `34. minuta zápasu. Soupeř zahájil Barona (3500 HP). Všech 10 šampiónů je naživu kolem pitu. Jeden jediný teamfight rozhodne o celém zápasu!`,
    contextEn: `Minute 34. Enemy started Baron (3.5k HP). All 10 champions alive around pit. A single teamfight will decide the entire match!`,
    stage: 'BARON_STANDOFF',
    playerUltStatus: '👑 Ultimate + Zhonya / GA PŘIPRAVENO',
    enemyKeyCooldown: '⚠️ Nepřátelské ADC bez Flash (poslední teamfight)',
    allies: lateAllies,
    enemies: lateEnemies,
    choices: [
      {
        id: 'late_death_brush_engage',
        tagCs: '🧠 5-Man Ambush z Křoví',
        tagEn: '🧠 5-Man Death Bush Ambush',
        titleCs: 'Vyčkat v nehlídaném křoví a odpálit ultimátky na chuchvalec soupeřů',
        titleEn: 'Wait in unwarded brush and unleash full ultimate AoE combo',
        descCs: 'Nechte soupeře vejít do úzkého koridoru a zasypte je všemi AoE kouzly naráz.',
        descEn: 'Trap enemies in narrow choke and drop entire team AoE wombo-combo at once.',
        statKey: 'gameKnowledge',
        synergyRequired: 'Teamfight',
        difficulty: 58,
        risk: 'Medium',
        scoreGain: 38,
        scoreLoss: -30,
        winTextCs: '🎯 DOKONALÝ ACE! Nepřátelský tým padl v 3vteřinovém AoE řetězci, Baron a Nexus jsou vaši (+38 Skóre)!',
        winTextEn: '🎯 PERFECT ACE! Enemy wiped in 3-second AoE chain, Baron and Nexus secured (+38 Score)!',
        lossTextCs: '👀 Soupeř hodil modrý trinket, odhalil vás a otočil boj z dálky (-30 Skóre).',
        lossTextEn: '👀 Enemy used blue trinket to reveal brush and kited the engage (-30 Score).',
      },
      {
        id: 'late_heroic_steal',
        tagCs: '🔥 Flash Smite Steal + Stopwatch',
        tagEn: '🔥 Flash Smite Steal & Stopwatch Stall',
        titleCs: 'Skočit přes zeď pitu na 1500 HP Barona, ukrást ho a ustát boj',
        titleEn: 'Flash over pit wall at 1.5k Baron HP, Smite steal and pop Zhonya',
        descCs: 'Legendární mechanický clutch: seber Barona nepřátelskému junglerovi před očima!',
        descEn: 'Legendary mechanical clutch: steal Baron from under enemy junglers nose!',
        statKey: 'mechanics',
        synergyRequired: 'Aggressive',
        difficulty: 64,
        risk: 'High',
        scoreGain: 45,
        scoreLoss: -38,
        winTextCs: '👑 BARON UKRADEN! Neuvěřitelný Smite steal roku, získali jste buff a převálcovali lobby (+45 Skóre)!',
        winTextEn: '👑 BARON STOLEN! Clutch steal of the century, secured buff and crushed the game (+45 Score)!',
        lossTextCs: '💀 Smite minul o 30 HP, soupeř zajistil Barona a ukončil zápas (-38 Skóre).',
        lossTextEn: '💀 Smite missed by 30 HP, enemy secured Baron and ended game (-38 Score).',
      },
      {
        id: 'late_peel_hypercarry',
        tagCs: '🛡️ Frontline Ochrana ADC',
        tagEn: '🛡️ Frontline Hypercarry Bodyguard',
        titleCs: `Absorbovat burst a ubránit své ADC (${allyTeam.adc}) pro čisté vyčištění`,
        titleEn: `Absorb dive damage and peel for your ADC (${allyTeam.adc}) to clean up`,
        descCs: 'Postav se jako neproniknutelná zeď, zablokuj nepřátelské assassiny a nech své ADC carry vyhrát hru.',
        descEn: 'Stand as an impenetrable wall, block enemy divers and let your ADC carry the victory.',
        statKey: 'mental',
        synergyRequired: 'Tank',
        difficulty: 54,
        risk: 'Low',
        scoreGain: 30,
        scoreLoss: -18,
        winTextCs: `🛡️ NEPRONIKNUTELNÁ OBRANA! Tvé ADC přežilo bez škrábnutí a rozstřílelo nepřátelský tým (+30 Skóre)!`,
        winTextEn: `🛡️ IMPENETRABLE WALL! Your ADC survived untouched and aced the lobby (+30 Score)!`,
        lossTextCs: '⚠️ Nepřátelský burst prošel a vaše zadní linie padla (-18 Skóre).',
        lossTextEn: '⚠️ Enemy burst pierced frontline and deleted your backline carries (-18 Score).',
      },
    ],
  };

  return { laning, midGame, lateGame };
}
