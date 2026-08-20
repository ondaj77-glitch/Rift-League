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

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. EARLY LANING SCENARIO (Strict on-lane coordinates, 0 overlap)
  // ═══════════════════════════════════════════════════════════════════════════
  const laningAllies: MapUnit[] = [
    { id: allyTeam.top, name: allyTeam.top, role: 'top', team: 'blue', isPlayer: playerRole === 'top', isDead: false, xPercent: 9, yPercent: 32 },
    { id: allyTeam.jungle, name: allyTeam.jungle, role: 'jungle', team: 'blue', isPlayer: playerRole === 'jungle', isDead: false, xPercent: 24, yPercent: 30 },
    { id: allyTeam.mid, name: allyTeam.mid, role: 'mid', team: 'blue', isPlayer: playerRole === 'mid', isDead: false, xPercent: 42, yPercent: 58 },
    { id: allyTeam.adc, name: allyTeam.adc, role: 'adc', team: 'blue', isPlayer: playerRole === 'adc', isDead: false, xPercent: 68, yPercent: 91 },
    { id: allyTeam.support, name: allyTeam.support, role: 'support', team: 'blue', isPlayer: playerRole === 'support', isDead: false, xPercent: 80, yPercent: 91 },
  ];

  const laningEnemies: MapUnit[] = [
    { id: enemyTeam.top, name: enemyTeam.top, role: 'top', team: 'red', isEnemyLaner: playerRole === 'top', isDead: false, xPercent: 9, yPercent: 16 },
    { id: enemyTeam.jungle, name: enemyTeam.jungle, role: 'jungle', team: 'red', isEnemyLaner: playerRole === 'jungle', isDead: false, xPercent: 72, yPercent: 36 },
    { id: enemyTeam.mid, name: enemyTeam.mid, role: 'mid', team: 'red', isEnemyLaner: playerRole === 'mid', isDead: false, xPercent: 58, yPercent: 42 },
    { id: enemyTeam.adc, name: enemyTeam.adc, role: 'adc', team: 'red', isEnemyLaner: playerRole === 'adc', isDead: false, xPercent: 91, yPercent: 68 },
    { id: enemyTeam.support, name: enemyTeam.support, role: 'support', team: 'red', isEnemyLaner: playerRole === 'support', isDead: false, xPercent: 91, yPercent: 80 },
  ];

  const laning: MapTacticalScenario = {
    id: 'laning_gank_setup',
    titleCs: `Fáze Linky: Lvl 3 Crash & Příjezd Junglera`,
    titleEn: `Laning Phase: Lvl 3 Crash & Jungler Gank Setup`,
    contextCs: `Oponent (${enemyChamp.name}) pushuje velkou vlnu k tvé věži a vyplýtval klíčový únikový spell. Tvůj jungler (${allyTeam.jungle}) dorazil do křoví v řece a čeká na tvůj signál k přepadení.`,
    contextEn: `Opponent (${enemyChamp.name}) crashed wave into your tower and burned their escape spell. Your jungler (${allyTeam.jungle}) is in river brush waiting for your engage.`,
    stage: 'EARLY_LANING',
    playerUltStatus: '⚡ Flash + Plné kombo připraveno',
    enemyKeyCooldown: '⚠️ Únikový spell v cooldownu (8s)',
    allies: laningAllies,
    enemies: laningEnemies,
    choices: [
      {
        id: 'lane_allin_combo',
        tagCs: '⚡ Bleskový All-In & Trest za Cooldown',
        tagEn: '⚡ Flash CC Engage Combo',
        titleCs: `Baitnout duel, spálit Flash a odpálit CC kombo na ${enemyChamp.name}`,
        titleEn: `Bait trade, Flash engage and land CC combo on ${enemyChamp.name}`,
        descCs: `Iniciuj souboj v momentě, kdy soupeř nemá čím uhnout. Podrž ho na místě a umožni junglerovi (${allyTeam.jungle}) snadný First Blood kill.`,
        descEn: `Initiate right as enemy cooldown is down, chain CC and hand over a clean First Blood kill to your jungler.`,
        statKey: 'mechanics',
        synergyRequired: 'Aggressive',
        difficulty: 52,
        scoreGain: 28,
        scoreLoss: -20,
        winTextCs: `⚡ PERFEKTNÍ GANK! Soupeř (${enemyChamp.name}) padl pod plným kombem a tvůj tým bere First Blood!`,
        winTextEn: `⚡ PERFECT GANK! Enemy (${enemyChamp.name}) deleted by cc chain, First Blood secured!`,
        lossTextCs: `💀 Minul jsi klíčový skillshot, soupeř přežil s 5% HP a stihl odskákat pod věž.`,
        lossTextEn: `💀 Missed key skillshot, opponent survived and flashed out safely.`,
      },
      {
        id: 'lane_freeze_wave',
        tagCs: '🧠 Zmrazit Vlnu a Zónovat pod Věží',
        tagEn: '🧠 Wave Freeze & Starve',
        titleCs: 'Nechat vlnu před věží a úplně odstřihnout soupeře od zlaťáků',
        titleEn: 'Hold freeze before turret and zone enemy completely',
        descCs: 'Vyhni se zbytečnému riziku coinflipu. Udrž freeze před svou věží a nech soupeře ztratit 2 vlny minionů a cenné zkušenosti.',
        descEn: 'Avoid coinflip risk, maintain freeze outside your turret range and starve opponent of 2 waves of gold & XP.',
        statKey: 'gameKnowledge',
        synergyRequired: 'Scaling',
        difficulty: 46,
        scoreGain: 20,
        scoreLoss: -10,
        winTextCs: `🎯 MISTROVSKÝ FREEZE! Soupeř ztratil 20 CS a je o úroveň pozadu!`,
        winTextEn: `🎯 FLAWLESS FREEZE! Opponent starved of 20 CS and a full level behind!`,
        lossTextCs: `⚠️ Vlna se odrazila a soupeř se v klidu vyresetoval na bázi.`,
        lossTextEn: `⚠️ Wave bounced into enemy turret, lost lane control.`,
      },
      {
        id: 'lane_invade_jungle',
        tagCs: '🗡️ Rychlý Push & Invade do Nepřátelské Jungle',
        tagEn: '🗡️ River Roam & Jungle Invade',
        titleCs: `Rychle zatlačit vlnu a vpadnout s junglerem do nepřátelského kempu`,
        titleEn: `Fast shove and collapse with jungler into enemy camps`,
        descCs: 'Využij převahu minionů na lince, otoč se s junglerem do řeky a seberte soupeřovu junglerovi buff a hlubokou vizi.',
        descEn: 'Shove wave, invade enemy jungle with your jungler and steal buff and deep vision.',
        statKey: 'communication',
        synergyRequired: 'Utility',
        difficulty: 50,
        scoreGain: 24,
        scoreLoss: -14,
        winTextCs: `💥 INVADE ÚSPĚCH! Sebrali jste nepřátelský buff a položil jsi deep wardu do jungle!`,
        winTextEn: `💥 INVADE WIN! Stole enemy buff and secured total jungle map tempo!`,
        lossTextCs: `👀 Nepřátelský mid laner včas zarotoval a museli jste ustoupit.`,
        lossTextEn: `👀 Enemy mid collapsed in time, forced to disengage.`,
      },
    ],
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. MID GAME SCENARIO (Dragon Contest, clean 5v4 spacing across River)
  // ═══════════════════════════════════════════════════════════════════════════
  const midAllies: MapUnit[] = [
    { id: allyTeam.top, name: allyTeam.top, role: 'top', team: 'blue', isPlayer: playerRole === 'top', isDead: false, xPercent: 54, yPercent: 62 },
    { id: allyTeam.jungle, name: allyTeam.jungle, role: 'jungle', team: 'blue', isPlayer: playerRole === 'jungle', isDead: false, xPercent: 64, yPercent: 70 },
    { id: allyTeam.mid, name: allyTeam.mid, role: 'mid', team: 'blue', isPlayer: playerRole === 'mid', isDead: false, xPercent: 46, yPercent: 74 },
    { id: allyTeam.adc, name: allyTeam.adc, role: 'adc', team: 'blue', isPlayer: playerRole === 'adc', isDead: false, xPercent: 38, yPercent: 82 },
    { id: allyTeam.support, name: allyTeam.support, role: 'support', team: 'blue', isPlayer: playerRole === 'support', isDead: false, xPercent: 52, yPercent: 82 },
  ];

  const midEnemies: MapUnit[] = [
    { id: enemyTeam.top, name: enemyTeam.top, role: 'top', team: 'red', isEnemyLaner: playerRole === 'top', isDead: false, xPercent: 35, yPercent: 11 },
    { id: enemyTeam.jungle, name: enemyTeam.jungle, role: 'jungle', team: 'red', isEnemyLaner: playerRole === 'jungle', isDead: false, xPercent: 78, yPercent: 66 },
    { id: enemyTeam.mid, name: enemyTeam.mid, role: 'mid', team: 'red', isEnemyLaner: playerRole === 'mid', isDead: false, xPercent: 84, yPercent: 54 },
    { id: enemyTeam.adc, name: enemyTeam.adc, role: 'adc', team: 'red', isEnemyLaner: playerRole === 'adc', isDead: true, respawnTime: 22, xPercent: 91, yPercent: 11 },
    { id: enemyTeam.support, name: enemyTeam.support, role: 'support', team: 'red', isEnemyLaner: playerRole === 'support', isDead: false, xPercent: 84, yPercent: 76 },
  ];

  const midGame: MapTacticalScenario = {
    id: 'mid_dragon_powerplay',
    titleCs: `Mid Game: Souboj o Draka (4v5 Power Play)`,
    titleEn: `Mid Game: Soul Dragon Contest (4v5 Power Play)`,
    contextCs: `Nepřátelské ADC (${enemyTeam.adc}) je MRTVÉ (💀 22s v bázi). Oponenti se ve 4 lidech pokouší o zoufalý steal draka, zatímco ${enemyChamp.name} overextenduje na horní lince bez teleportu.`,
    contextEn: `Enemy ADC (${enemyTeam.adc}) is DEAD (💀 22s). Enemies 4-man contesting Dragon while ${enemyChamp.name} splitpushes top without Teleport.`,
    stage: 'DRAGON_FIGHT',
    playerUltStatus: `👑 Ultimate [R] PŘIPRAVENA`,
    enemyKeyCooldown: `⚠️ Nepřátelské ADC mrtvé (22s) · Oponent bez TP`,
    allies: midAllies,
    enemies: midEnemies,
    choices: [
      {
        id: 'mid_rush_dragon',
        tagCs: '🐉 Rychlý Drak + Obrat na 4-Man Soupeře',
        tagEn: '🐉 Fast Dragon & Turn on Enemy',
        titleCs: 'Rychle dorazit draka a smést oslabený nepřátelský 4-man tým',
        titleEn: 'Secure Dragon quickly and wipe out the 4-man enemy collapse',
        descCs: 'Využijte drtivou početní převahu 5v4. Získejte Dračí Duši smitem a okamžitě otočte souboj s připravenými ultimátkami.',
        descEn: 'Leverage 5v4 number advantage, secure Soul point and turn the fight with full ultimate combo.',
        statKey: 'communication',
        synergyRequired: 'Teamfight',
        difficulty: 50,
        scoreGain: 32,
        scoreLoss: -22,
        winTextCs: '🏆 DRAK ZAJIŠTĚN & ACE! Zničili jste 4 nepřátele v pitu a získali Dračí Duši!',
        winTextEn: '🏆 DRAGON SECURED & ACE! Wiped 4 enemies in pit and took Dragon Soul!',
        lossTextCs: '💔 Nepřátelský jungler proklouzl a ukradl draka přes Smite.',
        lossTextEn: '💔 Enemy jungler sneaked in and stole dragon with Smite.',
      },
      {
        id: 'mid_flank_backline',
        tagCs: '⚡ Hluboký Flank ze Tmy na Enemy Mága',
        tagEn: '⚡ Deep Flank on Enemy Mid Carry',
        titleCs: `Obejít pit zezadu a smazat nepřátelského mága (${enemyTeam.mid})`,
        titleEn: `Flank around pit choke and burst enemy mid carry (${enemyTeam.mid})`,
        descCs: 'Zamiř z nehlídaného křoví přímo na jediného zbývajícího damage dealera a vyřaď ho dřív, než stihne zakouzlit své kombo.',
        descEn: 'Dive from fog of war directly onto enemy mid carry to delete them before teamfight begins.',
        statKey: 'mechanics',
        synergyRequired: 'Assassin',
        difficulty: 56,
        scoreGain: 36,
        scoreLoss: -26,
        winTextCs: `⚡ ONE-SHOT KILL! ${enemyTeam.mid} padl za 0.4s a nepřátelský tým se v panice rozpadl!`,
        winTextEn: `⚡ ONE-SHOT KILL! Deleted ${enemyTeam.mid} in 0.4s, enemy team completely collapsed!`,
        lossTextCs: `💀 Chytil tě nepřátelský support do CC a byl jsi smazán před zahájením boje.`,
        lossTextEn: `💀 Pinned down by enemy support CC and collapsed on.`,
      },
      {
        id: 'mid_crossmap_turrets',
        tagCs: '🏰 Cross-Map Tlak & Prolomení Inhibitoru',
        tagEn: '🏰 Cross-map Inhibitor Push',
        titleCs: 'Nechat draka na bezpečný poke a prolomit dvě boční věže a inhibitor',
        titleEn: 'Trade Dragon for 2 side turrets and open inhibitor',
        descCs: 'Zatímco se 4 soupeři zdržují na drakovi, využij volnou linku, znič vnitřní věž i inhibitor a otevři nepřátelskou bázi.',
        descEn: 'While 4 enemies stall around pit, crush inner turret and crack inhibitor on the open side.',
        statKey: 'adaptability',
        synergyRequired: 'Splitpush',
        difficulty: 48,
        scoreGain: 26,
        scoreLoss: -14,
        winTextCs: '🏰 INHIBITOR ZNIČEN! Superminioni proudí do nepřátelské báze!',
        winTextEn: '🏰 INHIBITOR DOWN! Super minions now pouring into enemy base!',
        lossTextCs: '⚠️ Soupeř rychle zabil draka a stihl tě rotací chytit před základnou.',
        lossTextEn: '⚠️ Enemy quickly finished dragon and collapsed before inhibitor fell.',
      },
    ],
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. LATE GAME SCENARIO (Baron Nashor Standoff)
  // ═══════════════════════════════════════════════════════════════════════════
  const lateAllies: MapUnit[] = [
    { id: allyTeam.top, name: allyTeam.top, role: 'top', team: 'blue', isPlayer: playerRole === 'top', isDead: false, xPercent: 34, yPercent: 34 },
    { id: allyTeam.jungle, name: allyTeam.jungle, role: 'jungle', team: 'blue', isPlayer: playerRole === 'jungle', isDead: false, xPercent: 28, yPercent: 42 },
    { id: allyTeam.mid, name: allyTeam.mid, role: 'mid', team: 'blue', isPlayer: playerRole === 'mid', isDead: false, xPercent: 42, yPercent: 42 },
    { id: allyTeam.adc, name: allyTeam.adc, role: 'adc', team: 'blue', isPlayer: playerRole === 'adc', isDead: false, xPercent: 48, yPercent: 50 },
    { id: allyTeam.support, name: allyTeam.support, role: 'support', team: 'blue', isPlayer: playerRole === 'support', isDead: false, xPercent: 36, yPercent: 52 },
  ];

  const lateEnemies: MapUnit[] = [
    { id: enemyTeam.top, name: enemyTeam.top, role: 'top', team: 'red', isEnemyLaner: playerRole === 'top', isDead: false, xPercent: 20, yPercent: 20 },
    { id: enemyTeam.jungle, name: enemyTeam.jungle, role: 'jungle', team: 'red', isEnemyLaner: playerRole === 'jungle', isDead: false, xPercent: 26, yPercent: 26 },
    { id: enemyTeam.mid, name: enemyTeam.mid, role: 'mid', team: 'red', isEnemyLaner: playerRole === 'mid', isDead: false, xPercent: 14, yPercent: 26 },
    { id: enemyTeam.adc, name: enemyTeam.adc, role: 'adc', team: 'red', isEnemyLaner: playerRole === 'adc', isDead: false, xPercent: 12, yPercent: 16 },
    { id: enemyTeam.support, name: enemyTeam.support, role: 'support', team: 'red', isEnemyLaner: playerRole === 'support', isDead: false, xPercent: 22, yPercent: 32 },
  ];

  const lateGame: MapTacticalScenario = {
    id: 'late_baron_deciding_fight',
    titleCs: `Late Game: Rozhodující 5v5 Bitva u Barona Nashora`,
    titleEn: `Late Game: Deciding 5v5 Baron Nashor Standoff`,
    contextCs: `34. minuta zápasu. Soupeř zahájil Barona v pitu (3 500 HP). Všech 10 šampiónů je naživu kolem řeky. Jeden jediný teamfight rozhodne o celém zápasu!`,
    contextEn: `Minute 34. Enemy started Baron (3.5k HP). All 10 champions alive around pit. A single teamfight will decide the entire match!`,
    stage: 'BARON_STANDOFF',
    playerUltStatus: '👑 Ultimate + Ochranný Item PŘIPRAVENO',
    enemyKeyCooldown: '⚠️ Nepřátelské ADC bez Flash (poslední teamfight)',
    allies: lateAllies,
    enemies: lateEnemies,
    choices: [
      {
        id: 'late_death_brush_engage',
        tagCs: '🧠 5-Man Ambush z Křoví & AoE Wombo',
        tagEn: '🧠 5-Man Death Bush Ambush',
        titleCs: 'Vyčkat v nehlídaném křoví a odpálit ultimátky na chuchvalec soupeřů',
        titleEn: 'Wait in unwarded brush and unleash full ultimate AoE combo',
        descCs: 'Nechte soupeře vejít do úzkého koridoru před pitem a zasypte je všemi AoE kouzly naráz dřív, než stihnou zareagovat.',
        descEn: 'Trap enemies in narrow choke and drop entire team AoE wombo-combo at once.',
        statKey: 'gameKnowledge',
        synergyRequired: 'Teamfight',
        difficulty: 54,
        scoreGain: 40,
        scoreLoss: -32,
        winTextCs: '👑 ACE & BARON NASHOR! Chytili jste 5 hráčů v koridoru a mašírujete středem pro výhru!',
        winTextEn: '👑 ACE & BARON NASHOR! 5-man choke wipeout, rushing mid to end game!',
        lossTextCs: '👀 Nepřátelský modrý trinket odhalil vaše křoví a dostali jste masivní poke.',
        lossTextEn: '👀 Enemy blue trinket revealed your bush, ate massive poke.',
      },
      {
        id: 'late_flash_target_adc',
        tagCs: '⚡ Flash Dive na Nepřátelské ADC bez Flashe',
        tagEn: '⚡ Flash Dive Immobile ADC',
        titleCs: `Okamžitý Flash engage na nepřátelské ADC (${enemyTeam.adc})`,
        titleEn: `Flash dive immobile enemy ADC (${enemyTeam.adc})`,
        descCs: 'Využij toho, že enemy ADC nemá Flash. Přeskoč frontlinu, svaž ho svým CC a ukonči souboj jedním tahem.',
        descEn: 'Exploit that enemy ADC has no Flash. Jump the frontline, lock them down and end the game in one play.',
        statKey: 'mechanics',
        synergyRequired: 'Aggressive',
        difficulty: 58,
        scoreGain: 42,
        scoreLoss: -35,
        winTextCs: `⚡ CLUTCH OUTPLAY! ADC soupeře smazáno za sekundu a zbytek týmu utekl v chaosu!`,
        winTextEn: `⚡ CLUTCH OUTPLAY! Enemy ADC obliterated, remaining team scrambled!`,
        lossTextCs: '💀 Minul jsi sweetspot o pixel a nepřátelská frontline tě uzamkla v CC.',
        lossTextEn: '💀 Missed key skillshot by a pixel, collapsed on by frontline.',
      },
      {
        id: 'late_front_to_back',
        tagCs: '🛡️ Metodický Front-to-Back Teamfight',
        tagEn: '🛡️ Front-to-Back Peel & DPS',
        titleCs: 'Držet formaci, peelovat pro své carry a ničit nepřátele zepředu dozadu',
        titleEn: 'Hold formation, peel your carry and shred frontline first',
        descCs: 'Nehrát na náhodu. Zůstaň u svého ADC, odrážej nepřátelské engagy a systematicky rozstřílejte jejich tanky.',
        descEn: 'No reckless flips. Anchor near your ADC, peel divers and systematically shred enemy frontline.',
        statKey: 'communication',
        synergyRequired: 'Control',
        difficulty: 50,
        scoreGain: 34,
        scoreLoss: -24,
        winTextCs: '🛡️ DOKONALÝ TEAMFIGHT! Vaše ADC přežilo bez škrábnutí a vyčistilo celý fight!',
        winTextEn: '🛡️ FLAWLESS TEAMFIGHT! Your ADC survived untouched and cleaned up!',
        lossTextCs: '💔 Nepřátelský assassin obešel flankem a zavraždil vašeho střelce.',
        lossTextEn: '💔 Enemy assassin flanked and assassinated your carry from behind.',
      },
    ],
  };

  return { laning, midGame, lateGame };
}
