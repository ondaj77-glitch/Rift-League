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

  // Assign champions for each role
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

  function createAllies(coords: Record<string, { x: number; y: number }>): MapUnit[] {
    return roles.map(r => ({
      id: allyTeam[r],
      name: allyTeam[r],
      role: r,
      team: 'blue',
      isPlayer: r === playerRole,
      isDead: false,
      xPercent: coords[r]?.x ?? 50,
      yPercent: coords[r]?.y ?? 50,
    }));
  }

  function createEnemies(coords: Record<string, { x: number; y: number }>): MapUnit[] {
    return roles.map(r => ({
      id: enemyTeam[r],
      name: enemyTeam[r],
      role: r,
      team: 'red',
      isEnemyLaner: r === playerRole,
      isDead: false,
      xPercent: coords[r]?.x ?? 50,
      yPercent: coords[r]?.y ?? 50,
    }));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. ROLE-SPECIFIC LANING SCENARIOS
  // ═══════════════════════════════════════════════════════════════════════════
  let laningScenario: MapTacticalScenario;

  if (playerRole === 'top') {
    laningScenario = {
      id: 'top_freeze_gank',
      titleCs: 'Fáze Linky: Top Wave Freeze & Příjezd Junglera',
      titleEn: 'Laning Phase: Top Wave Freeze & Jungler Gank Setup',
      contextCs: `Oponent (${enemyChamp.name}) pushuje velkou vlnu k tvé horní věži a nemá Flash. Tvůj jungler (${allyTeam.jungle}) dorazil do horního křoví v řece a čeká na tvůj signál k odchytu.`,
      contextEn: `Opponent (${enemyChamp.name}) crashed a wave on top without Flash. Your jungler (${allyTeam.jungle}) is in top river brush waiting for your engage.`,
      stage: 'EARLY_LANING',
      playerUltStatus: '⚡ Flash + Plné kombo připraveno',
      enemyKeyCooldown: '⚠️ Flash v cooldownu (180s)',
      allies: createAllies({
        top: { x: 12, y: 32 },
        jungle: { x: 24, y: 28 },
        mid: { x: 46, y: 54 },
        adc: { x: 74, y: 88 },
        support: { x: 82, y: 88 },
      }),
      enemies: createEnemies({
        top: { x: 12, y: 18 },
        jungle: { x: 70, y: 36 },
        mid: { x: 54, y: 46 },
        adc: { x: 88, y: 74 },
        support: { x: 88, y: 82 },
      }),
      choices: [
        {
          id: 'top_engage_allin',
          tagCs: '⚡ Bleskový All-In & Trest za Cooldown',
          tagEn: '⚡ Flash CC Engage Combo',
          titleCs: `Baitnout trade, spálit Flash a odpálit CC kombo na ${enemyChamp.name}`,
          titleEn: `Bait trade, Flash engage and land CC combo on ${enemyChamp.name}`,
          descCs: `Iniciuj souboj v momentě, kdy soupeř nemá čím uhnout. Podrž ho na místě a umožni junglerovi (${allyTeam.jungle}) snadný First Blood kill.`,
          descEn: `Initiate right as enemy cooldown is down, chain CC and hand over a clean First Blood kill to your jungler.`,
          statKey: 'mechanics',
          synergyRequired: 'Aggressive',
          difficulty: 60,
          scoreGain: 28,
          scoreLoss: -20,
          winTextCs: `⚡ PERFEKTNÍ GANK! Soupeř (${enemyChamp.name}) padl pod plným kombem a tvůj tým bere First Blood na Topu!`,
          winTextEn: `⚡ PERFECT GANK! Enemy (${enemyChamp.name}) deleted by CC chain, First Blood secured on Top!`,
          lossTextCs: `💀 Minul jsi klíčový skillshot, soupeř přežil s 5% HP a stihl odskákat pod věž.`,
          lossTextEn: `💀 Missed key skillshot, opponent survived and flashed out safely.`,
        },
        {
          id: 'top_freeze_wave',
          tagCs: '🧠 Zmrazit Vlnu a Zónovat pod Věží',
          tagEn: '🧠 Wave Freeze & Starve',
          titleCs: 'Nechat vlnu před věží a úplně odstřihnout soupeře od zlaťáků',
          titleEn: 'Hold freeze before turret and zone enemy completely',
          descCs: 'Vyhni se zbytečnému riziku coinflipu. Udrž freeze před svou věží a nech soupeře ztratit 2 vlny minionů a cenné zkušenosti.',
          descEn: 'Avoid coinflip risk, maintain freeze outside your turret range and starve opponent of 2 waves of gold & XP.',
          statKey: 'gameKnowledge',
          synergyRequired: 'Scaling',
          difficulty: 50,
          scoreGain: 20,
          scoreLoss: -12,
          winTextCs: `🎯 MISTROVSKÝ FREEZE! Soupeř ztratil 20 CS a je o úroveň pozadu!`,
          winTextEn: `🎯 FLAWLESS FREEZE! Opponent starved of 20 CS and a full level behind!`,
          lossTextCs: `⚠️ Vlna se odrazila a soupeř se v klidu vyresetoval na bázi.`,
          lossTextEn: `⚠️ Wave bounced into enemy turret, lost lane control.`,
        },
        {
          id: 'top_grubs_roam',
          tagCs: '🗡️ Rychlý Push & Invade na Voidgruby',
          tagEn: '🗡️ Fast Shove & Voidgrub Take',
          titleCs: `Rychle zatlačit vlnu a pomoct junglerovi zajistit 3 Voidgruby`,
          titleEn: `Fast shove and secure 3 Voidgrubs with jungler`,
          descCs: 'Využij převahu minionů na horní lince, otoč se do řeky a seberte soupeřovu junglerovi Voidgruby a map tempo.',
          descEn: 'Shove wave, rotate to Voidgrubs and secure early turret taking power for your team.',
          statKey: 'communication',
          synergyRequired: 'Utility',
          difficulty: 54,
          scoreGain: 24,
          scoreLoss: -16,
          winTextCs: `💥 VOIDGRUBY ZAJIŠTĚNY! Získali jste permanentní siege buff pro celý tým!`,
          winTextEn: `💥 VOIDGRUBS SECURED! Granted permanent structure damage buff to team!`,
          lossTextCs: `👀 Nepřátelský mid laner včas zarotoval a museli jste ustoupit.`,
          lossTextEn: `👀 Enemy mid collapsed in time, forced to disengage.`,
        },
      ],
    };
  } else if (playerRole === 'jungle') {
    laningScenario = {
      id: 'jungle_bot_gank',
      titleCs: 'Fáze Linky: Lvl 3 Bot Gank & River Control',
      titleEn: 'Laning Phase: Lvl 3 Bot Gank & River Control',
      contextCs: `Dokončil jsi full-clear kempů na spodní straně. Nepřátelská spodní linka (${enemyTeam.adc} & ${enemyTeam.support}) overextenduje bez wardy v řece. Tvůj Bot (${allyTeam.adc} & ${allyTeam.support}) má CC!`,
      contextEn: `Finished bot side clear. Enemy bot lane is overextended without river vision. Your bot lane has CC ready for the dive.`,
      stage: 'EARLY_LANING',
      playerUltStatus: '🔥 Red Buff + Smite připraven',
      enemyKeyCooldown: '⚠️ Nepřátelský ADC bez Flash',
      allies: createAllies({
        top: { x: 12, y: 22 },
        jungle: { x: 74, y: 76 },
        mid: { x: 48, y: 52 },
        adc: { x: 76, y: 88 },
        support: { x: 82, y: 88 },
      }),
      enemies: createEnemies({
        top: { x: 12, y: 18 },
        jungle: { x: 26, y: 24 },
        mid: { x: 54, y: 46 },
        adc: { x: 86, y: 78 },
        support: { x: 90, y: 82 },
      }),
      choices: [
        {
          id: 'jungle_flank_dive',
          tagCs: '⚡ Přepadení zezadu & Odříznutí únikové cesty',
          tagEn: '⚡ River Bush Flank & Pin',
          titleCs: `Vpadnout za záda nepřátelského ADC (${enemyTeam.adc}) a zajistit Double Kill`,
          titleEn: `Flank behind enemy ADC and execute a double kill`,
          descCs: `Využij Red Buff zpomalení a odřízni únikovou cestu k věži. Přenechej kille svému ADC pro snowball.`,
          descEn: `Cut off escape route with Red Buff slow, funnel kills to your ADC for massive early snowball.`,
          statKey: 'mechanics',
          synergyRequired: 'Aggressive',
          difficulty: 58,
          scoreGain: 30,
          scoreLoss: -22,
          winTextCs: `🔥 DOUBLE KILL NA BOTU! Gank vyšel na jedničku a tvůj ADC má obří náskok!`,
          winTextEn: `🔥 DOUBLE KILL BOT! Flawless gank execution, feeding ADC massive early gold!`,
          lossTextCs: `💀 Nepřátelský Support tě counter-stunnul pod věží a soupeř unikl.`,
          lossTextEn: `💀 Enemy Support counter-CC'd you, opponent escaped safely.`,
        },
        {
          id: 'jungle_dragon_setup',
          tagCs: '🐉 Pustit Gank & Okamžitě Solovat Draka',
          tagEn: '🐉 Sneak First Drake',
          titleCs: 'Zabezpečit prvního Draka, zatímco nepřátelský jungler spí na topu',
          titleEn: 'Secure First Dragon while enemy jungler is top side',
          descCs: 'Využij bot prioritu linky a bezpečně seber prvního Infernal/Mountain Draka pro tým.',
          descEn: 'Capitalize on bot lane priority to secure First Drake uncontested.',
          statKey: 'gameKnowledge',
          synergyRequired: 'Scaling',
          difficulty: 48,
          scoreGain: 22,
          scoreLoss: -14,
          winTextCs: `🐉 PRVNÍ DRAK ZAJIŠTĚN! Získali jste trvalé staty a náskok na Dragon Soul!`,
          winTextEn: `🐉 FIRST DRAKE SECURED! Building early stack toward Dragon Soul!`,
          lossTextCs: `⚠️ Nepřátelé si všimli pohybu v řece a musel jsi Smite zahodit.`,
          lossTextEn: `⚠️ Enemy spotted river movement, forced to reset.`,
        },
      ],
    };
  } else if (playerRole === 'mid') {
    laningScenario = {
      id: 'mid_priority_roam',
      titleCs: 'Fáze Linky: Mid Priorita & Bot Roam Dive',
      titleEn: 'Laning Phase: Mid Priority & Bot Roam Dive',
      contextCs: `Zatlačil jsi vlnu pod věž soupeře (${enemyChamp.name}) a zmizel jsi do Fog of War. Nepřátelský Bot overextenduje s nízkým HP. Můžeš odpálit kombo na Botu nebo jít pro Solo Kill v Midu!`,
      contextEn: `Pushed wave under enemy mid turret and stepped into fog of war. Enemy bot lane is low HP and vulnerable to a roam dive.`,
      stage: 'EARLY_LANING',
      playerUltStatus: '🔥 Ultimate + Ignite připraveno',
      enemyKeyCooldown: '⚠️ Enemy Mid uvězněn pod věží',
      allies: createAllies({
        top: { x: 12, y: 22 },
        jungle: { x: 62, y: 64 },
        mid: { x: 50, y: 52 },
        adc: { x: 76, y: 88 },
        support: { x: 82, y: 88 },
      }),
      enemies: createEnemies({
        top: { x: 12, y: 18 },
        jungle: { x: 26, y: 24 },
        mid: { x: 56, y: 44 },
        adc: { x: 86, y: 80 },
        support: { x: 90, y: 82 },
      }),
      choices: [
        {
          id: 'mid_roam_bot',
          tagCs: '🚀 Rychlý Roam do Řeky & Bot Dive',
          tagEn: '🚀 River Roam & Double Kill Dive',
          titleCs: `Sestoupit přes řeku na Bot a odpálit Ultimate na nepřátelské Duo`,
          titleEn: `Roam down river and burst enemy bot lane with Ultimate`,
          descCs: `Překvap nepřátelský bot přes spodní tribush. Spoj síly se svým Supportem (${allyTeam.support}) pro čistý double kill.`,
          descEn: `Flank enemy bot from river, chain CC and delete bot lane carries.`,
          statKey: 'communication',
          synergyRequired: 'Aggressive',
          difficulty: 58,
          scoreGain: 28,
          scoreLoss: -18,
          winTextCs: `💥 EXCELENTNÍ ROAM! Připsal jsi si Double Kill na Botu a otevřel spodní věž!`,
          winTextEn: `💥 EXCELLENT ROAM! Picked up a clean double kill bot and unlocked tower plating!`,
          lossTextCs: `👀 Nepřátelský ward v řece tě odhalil včas a soupeři bezpečně ustoupili.`,
          lossTextEn: `👀 River ward spotted your roam, enemy backed off in time.`,
        },
        {
          id: 'mid_solokill_bait',
          tagCs: '🎯 1v1 Solo Kill v Midu',
          tagEn: '🎯 1v1 Mid Lane Outplay',
          titleCs: `Baitnout soupeře (${enemyChamp.name}) a odpálit bleskový Solo Kill`,
          titleEn: `Bait enemy mid out of turret and land lethal burst combo`,
          descCs: `Využij poziční převahu v midu, tref klíčový skillshot a zakonči souboj přesným Ignitem.`,
          descEn: `Outplay enemy mid with precise skillshot spacing and ignite execute.`,
          statKey: 'mechanics',
          synergyRequired: 'Scaling',
          difficulty: 62,
          scoreGain: 26,
          scoreLoss: -20,
          winTextCs: `⚡ SOLO KILL V MIDU! ${enemyChamp.name} byl vymazán z mapy!`,
          winTextEn: `⚡ SOLO KILL MID! Deleted ${enemyChamp.name} with surgical precision!`,
          lossTextCs: `💀 Minul jsi burst kombo a soupeř přežil s kouskem zdraví.`,
          lossTextEn: `💀 Missed burst window, opponent survived.`,
        },
      ],
    };
  } else if (playerRole === 'adc') {
    laningScenario = {
      id: 'adc_lvl2_powerspike',
      titleCs: 'Fáze Linky: Lvl 2 Power Spike All-In',
      titleEn: 'Laning Phase: Lvl 2 Power Spike All-In',
      contextCs: `Zabíjíš 9. miniona a s tvým Supportem (${allyTeam.support}) dosahujete Levelu 2 o 3 sekundy dříve než soupeř (${enemyChamp.name} & ${enemyTeam.support}). Máte okno pro First Blood!`,
      contextEn: `Killing minion 9 to hit Level 2 power spike ahead of enemy bot lane (${enemyChamp.name}). Perfect window for an aggressive all-in!`,
      stage: 'EARLY_LANING',
      playerUltStatus: '⚡ Level 2 Spells + Flash připraveny',
      enemyKeyCooldown: '⚠️ Enemy Bot je stále Level 1!',
      allies: createAllies({
        top: { x: 12, y: 22 },
        jungle: { x: 60, y: 64 },
        mid: { x: 48, y: 52 },
        adc: { x: 76, y: 88 },
        support: { x: 80, y: 86 },
      }),
      enemies: createEnemies({
        top: { x: 12, y: 18 },
        jungle: { x: 26, y: 24 },
        mid: { x: 54, y: 46 },
        adc: { x: 84, y: 82 },
        support: { x: 88, y: 80 },
      }),
      choices: [
        {
          id: 'adc_flash_allin',
          tagCs: '⚡ Okamžitý Flash All-In & Trest za Lvl 1',
          tagEn: '⚡ Flash Level 2 Engage & Burst',
          titleCs: `Vyrazit dopředu s Flash kombo a zlikvidovat ${enemyChamp.name}`,
          titleEn: `Flash engage with support CC and burst down enemy ADC`,
          descCs: `Využij statovou a spellovou převahu Levelu 2. Pál autoattacky a kiting pro okamžitý First Blood.`,
          descEn: `Unleash level 2 stat advantage with crisp auto-spacing to secure First Blood.`,
          statKey: 'mechanics',
          synergyRequired: 'Aggressive',
          difficulty: 58,
          scoreGain: 30,
          scoreLoss: -22,
          winTextCs: `🔥 FIRST BLOOD ZAJIŠTĚN! Nepřátelský ADC padl dřív, než stihl dorazit minion!`,
          winTextEn: `🔥 FIRST BLOOD SECURED! Crushed enemy ADC before they could reach Level 2!`,
          lossTextCs: `💀 Přeagresil jsi pozici a minioni ti udělili příliš velké poškození.`,
          lossTextEn: `💀 Overextended into minion wave aggro, trade backfired.`,
        },
        {
          id: 'adc_slow_push_crash',
          tagCs: '🧠 Slow Push & Odříznutí od CS pod Věží',
          tagEn: '🧠 Slow Push & Tower Plate Pressure',
          titleCs: 'Vytvořit obří vlnu, zatlačit ji pod věž a sebrat turret pláty',
          titleEn: 'Build massive slow push wave and collect turret plating gold',
          descCs: 'Udrž bezpečnou kontrolu, donuť soupeře farmit pod věží a pokeuj ho z maximálního range.',
          descEn: 'Build wave, crash under enemy turret and poke from safe range while taking plating.',
          statKey: 'gameKnowledge',
          synergyRequired: 'Scaling',
          difficulty: 48,
          scoreGain: 22,
          scoreLoss: -12,
          winTextCs: `💰 +350G Z TURRET PLÁTŮ! Vytvořil jsi si luxusní goldový náskok!`,
          winTextEn: `💰 +350G TURRET PLATES! Built a dominant CS and gold lead!`,
          lossTextCs: `⚠️ Špatný last-hit timing ti nechal miniony umřít pod věží.`,
          lossTextEn: `⚠️ Missed CS timing, wave crashed neutrally.`,
        },
      ],
    };
  } else {
    // SUPPORT
    laningScenario = {
      id: 'support_bush_control',
      titleCs: 'Fáze Linky: Kontrola Křoví & CC Hook Kombo',
      titleEn: 'Laning Phase: Brush Control & CC Hook Combo',
      contextCs: `Ovládáš přední křoví na spodní lince a nepřátelský Support (${enemyTeam.support}) vyplýtval ward. Tvůj ADC (${allyTeam.adc}) má připravený follow-up damage!`,
      contextEn: `Controlling lane brush without enemy vision. Enemy bot is vulnerable to a decisive CC engage with your ADC follow-up!`,
      stage: 'EARLY_LANING',
      playerUltStatus: '⚡ CC Hook / Engage Spell připraven',
      enemyKeyCooldown: '⚠️ Enemy Bot bez vize v křoví',
      allies: createAllies({
        top: { x: 12, y: 22 },
        jungle: { x: 60, y: 64 },
        mid: { x: 48, y: 52 },
        adc: { x: 74, y: 88 },
        support: { x: 80, y: 84 },
      }),
      enemies: createEnemies({
        top: { x: 12, y: 18 },
        jungle: { x: 26, y: 24 },
        mid: { x: 54, y: 46 },
        adc: { x: 84, y: 82 },
        support: { x: 88, y: 80 },
      }),
      choices: [
        {
          id: 'support_cc_hook',
          tagCs: '🎯 Nečekaný Hook / CC Engage z Křoví',
          tagEn: '🎯 Fog of War CC Engage',
          titleCs: `Trefit klíčové CC na ${enemyChamp.name} a odpálit Ignite`,
          titleEn: `Land lethal CC engage on enemy carry and drop Ignite`,
          descCs: `Vyčkej na chybný krok nepřátelského carryho, znehybni ho a zajisti kill pro své ADC.`,
          descEn: `Catch enemy carry out of position, chain crowd control and ignite for the execute.`,
          statKey: 'mechanics',
          synergyRequired: 'Aggressive',
          difficulty: 56,
          scoreGain: 28,
          scoreLoss: -18,
          winTextCs: `🎯 DOKONALÝ ENGAGE! Trefil jsi CC a tvůj ADC bere snadný First Blood!`,
          winTextEn: `🎯 FLAWLESS ENGAGE! Chained CC perfectly, securing First Blood for your carry!`,
          lossTextCs: `💀 Minul jsi skillshot a nepřátelé tě potrestali za ztrátu pozice.`,
          lossTextEn: `💀 Missed CC, took heavy counter-poke.`,
        },
        {
          id: 'support_river_vision',
          tagCs: '👁️ Deep Vision v Řece & Záchrana ADC',
          tagEn: '👁️ Deep River Vision & Jungle Tracking',
          titleCs: 'Položit hlubokou vizi k Drakovi a varovat tým před gankem',
          titleEn: 'Place deep control ward at Dragon and track enemy jungler',
          descCs: 'Zajisti bezpečnost linky před nepřátelským junglerem a umožni ADC bezpečný CS náskok.',
          descEn: 'Secure river vision, spot enemy jungler early and protect ADC from ganks.',
          statKey: 'gameKnowledge',
          synergyRequired: 'Utility',
          difficulty: 48,
          scoreGain: 22,
          scoreLoss: -12,
          winTextCs: `🛡️ GANK ZAŽEHNÁN! Tvá vize včas odhalila nepřítele a zabránila smrti týmu!`,
          winTextEn: `🛡️ GANK DENIED! Deep vision saved team from fatal river collapse!`,
          lossTextCs: `⚠️ Nepřátelský Support ti wardu okamžitě zničil.`,
          lossTextEn: `⚠️ Enemy swept ward immediately.`,
        },
      ],
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. MID-GAME SCENARIO: DRAGON SOUL STANDOFF (All 10 champions at Dragon Pit!)
  // ═══════════════════════════════════════════════════════════════════════════
  const midGameScenario: MapTacticalScenario = {
    id: 'mid_dragon_soul_fight',
    titleCs: 'Střední Hra: 5v5 Válka o Dragon Soul v Dračí Jámě',
    titleEn: 'Mid Game: 5v5 Dragon Soul River Teamfight',
    contextCs: `Rozhodující 4. Drak (Soul Point) je na 4 000 HP. Oba týmy stojí v řece kolem dračí jámy. Tvůj tým má poziční výhodu, ale nepřátelský carry hrozí smrtícím flankem!`,
    contextEn: `Decisive 4th Dragon is at 4,000 HP. Both teams posturing around Dragon Pit. Perfect time to execute your teamfight role!`,
    stage: 'DRAGON_FIGHT',
    playerUltStatus: '👑 Ultimate + Všechny Summoner Spelly READY',
    enemyKeyCooldown: '⚠️ Drak na 3 500 HP – Smite Duel!',
    allies: createAllies({
      top: { x: 66, y: 68 },
      jungle: { x: 74, y: 72 },
      mid: { x: 62, y: 76 },
      adc: { x: 58, y: 80 },
      support: { x: 68, y: 78 },
    }),
    enemies: createEnemies({
      top: { x: 80, y: 64 },
      jungle: { x: 76, y: 66 },
      mid: { x: 84, y: 70 },
      adc: { x: 88, y: 74 },
      support: { x: 82, y: 72 },
    }),
    choices: [
      {
        id: 'dragon_teamfight_burst',
        tagCs: '💥 Hromadný 5v5 Teamfight & Focus na Carries',
        tagEn: '💥 5v5 Front-to-Back Teamfight Execution',
        titleCs: `Odpálit Ultimate do nepřátelské zadní linie a zlikvidovat carry`,
        titleEn: `Execute full ultimate combo into enemy backline`,
        descCs: `Koordinuj útok s týmem, znič nepřátelské poškození a seberte Dragon Soul i Ace!`,
        descEn: `Coordinate burst onto priority carries, wipe enemy squad and secure Dragon Soul!`,
        statKey: 'mechanics',
        synergyRequired: 'Aggressive',
        difficulty: 64,
        scoreGain: 34,
        scoreLoss: -26,
        winTextCs: `🏆 ACE & DRAGON SOUL! Vynulovali jste nepřátelský tým a získali Dračí Duši!`,
        winTextEn: `🏆 ACE & DRAGON SOUL! Wiped enemy squad and claimed game-winning Dragon Soul!`,
        lossTextCs: `💀 Nepřátelský carry přežil a otočil teamfight s Quadra Killem.`,
        lossTextEn: `💀 Enemy carry turned the fight with clutch positioning.`,
      },
      {
        id: 'dragon_smite_zone',
        tagCs: '🛡️ Kontrola Jamy & Odzónování Nepřátelského Junglera',
        tagEn: '🛡️ Pit Zoning & Clean Smite Secure',
        titleCs: 'Vytvořit neprostupnou zeď před jámou a zajistit čistý Smite',
        titleEn: 'Zone enemy jungler away from pit and secure clean Smite',
        descCs: 'Zaměř se na kontrolu terénu, zabraň soupeři ve stealu a bezpečně zakončete Draka.',
        descEn: 'Zone off steal attempts and secure the objective cleanly without coinflip.',
        statKey: 'gameKnowledge',
        synergyRequired: 'Scaling',
        difficulty: 54,
        scoreGain: 26,
        scoreLoss: -16,
        winTextCs: `🐉 ČISTÝ SMITE! Drak je váš a soupeř se musel bez boje stáhnout!`,
        winTextEn: `🐉 CLEAN SECURE! Dragon secured without contest, enemy forced to disengage!`,
        lossTextCs: `⚠️ Nepřítel proklouzl a ukradl Draka přes zeď!`,
        lossTextEn: `⚠️ Enemy stole dragon over the wall!`,
      },
    ],
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. LATE-GAME SCENARIO: BARON NASHOR & BASE SIEGE (All 10 at Baron Pit!)
  // ═══════════════════════════════════════════════════════════════════════════
  const lateGameScenario: MapTacticalScenario = {
    id: 'late_baron_nexus_push',
    titleCs: 'Pozdní Hra: Baron Nashor & Závěrečný Útok na Nexus',
    titleEn: 'Late Game: Baron Nashor Standoff & Nexus Push',
    contextCs: `32. Minuta zápasu. Baron Nashor je živý. Vítěz tohoto teamfightu ukončí hru a vezme vítězství v sérii. Celý zápas leží na tvém rozhodnutí!`,
    contextEn: `Minute 32. Baron Nashor alive. Winner of this 5v5 teamfight takes Baron and ends the game with a Nexus push!`,
    stage: 'BARON_STANDOFF',
    playerUltStatus: '👑 Full Build (6 Items) + Elixir Active',
    enemyKeyCooldown: '⚠️ Všech 10 hráčů v plné síle na Barona!',
    allies: createAllies({
      top: { x: 32, y: 30 },
      jungle: { x: 26, y: 26 },
      mid: { x: 36, y: 36 },
      adc: { x: 38, y: 42 },
      support: { x: 34, y: 38 },
    }),
    enemies: createEnemies({
      top: { x: 20, y: 20 },
      jungle: { x: 24, y: 16 },
      mid: { x: 28, y: 22 },
      adc: { x: 32, y: 18 },
      support: { x: 26, y: 20 },
    }),
    choices: [
      {
        id: 'baron_decisive_flank',
        tagCs: '👑 Mistrovský Engage & Legendární Teamfight',
        tagEn: '👑 Clutch 5v5 Teamfight Engage',
        titleCs: `Provést vítězný engage na Barona a prorazit nepřátelskou bázi`,
        titleEn: `Execute game-winning teamfight engage and push for Nexus`,
        descCs: `Využij svůj maximální build, tref herní rozhodující schopnost a doveď tým k vítězství!`,
        descEn: `Land your signature ability, wipe the enemy team and march down mid to destroy the Nexus!`,
        statKey: 'mechanics',
        synergyRequired: 'Aggressive',
        difficulty: 68,
        scoreGain: 40,
        scoreLoss: -32,
        winTextCs: `👑 VICTORY! PENTAKILL & NEXUS DESTROYED! Předvedl jsi naprosto legendární výkon!`,
        winTextEn: `👑 VICTORY! PENTAKILL & NEXUS DESTROYED! Delivered a world-class clutch performance!`,
        lossTextCs: `💀 Těsná porážka v teamfightu na Barona rozhodla zápas ve prospěch soupeře.`,
        lossTextEn: `💀 Narrow teamfight loss at Baron sealed the defeat.`,
      },
      {
        id: 'baron_bait_turn',
        tagCs: '🧠 Baron Bait & Odchyt v Křoví',
        tagEn: '🧠 Baron Bush Bait & Trap',
        titleCs: 'Nalákat soupeře do neprozkoumaného křoví a smazat jejich carry',
        titleEn: 'Bait enemy into face-checking dark bush and burst carry',
        descCs: 'Přestaň bít Barona, schovej se s týmem do křoví v řece a smažte nepřátelské carry bez rizika.',
        descEn: 'Stop Baron DPS, ambush enemies as they facecheck river and secure free win.',
        statKey: 'gameKnowledge',
        synergyRequired: 'Utility',
        difficulty: 56,
        scoreGain: 32,
        scoreLoss: -20,
        winTextCs: `🎯 DOKONALÁ PAST! Soupeř naskákal do křoví a za 2 vteřiny bylo po zápase!`,
        winTextEn: `🎯 MASTERCLASS TRAP! Ambushed enemy carry, turning the pick into instant Victory!`,
        lossTextCs: `⚠️ Soupeř křoví prověřil modrou wardou a past selhala.`,
        lossTextEn: `⚠️ Enemy checked bush with blue trinket, trap failed.`,
      },
    ],
  };

  return {
    laning: laningScenario,
    midGame: midGameScenario,
    lateGame: lateGameScenario,
  };
}
