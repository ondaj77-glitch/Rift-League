export interface DilemmaChoice {
  id: string;
  textCs: string;
  textEn: string;
  descCs: string;
  descEn: string;
  effectTextCs: string;
  effectTextEn: string;
  modifiers: {
    mechanics?: number;
    gameKnowledge?: number;
    communication?: number;
    mental?: number;
    adaptability?: number;
    reputation?: number;
    coachTrust?: number;
    morale?: number;
    money?: number;
    followers?: number;
    energy?: number;
    lp?: number;
  };
}

export interface DilemmaEvent {
  id: string;
  titleCs: string;
  titleEn: string;
  tagCs: string;
  tagEn: string;
  icon: string;
  descriptionCs: string;
  descriptionEn: string;
  choices: DilemmaChoice[];
}

export const DILEMMA_EVENTS: DilemmaEvent[] = [
  {
    id: 'viral_twitter_clip',
    titleCs: 'Virální Klip ze Zápasu',
    titleEn: 'Viral Twitter Misplay Clip',
    tagCs: '📱 Sociální Sítě',
    tagEn: '📱 Social Media',
    icon: '🔥',
    descriptionCs: 'Prohrál jsi hru na nepovedený solo engage, který nikdo nechtěl. Než jsi vyšel z arény, klip má na Twitteru 40 000 zhlédnutí a fanoušci se baví.',
    descriptionEn: 'You threw a game on a solo engage nobody asked for. The clip is already on Twitter with 40,000 views before you even leave the arena.',
    choices: [
      {
        id: 'self_deprecating_tweet',
        textCs: 'Postnout klip sám se sebeironickým komentářem',
        textEn: 'Post the clip yourself with self-deprecating humor',
        descCs: 'Ukaž smysl pro humor a vezmi vítr z plachet kritikům.',
        descEn: 'Disarm the critics with humor and connect with the community.',
        effectTextCs: '+2 500 Followers · +4 Mentál · -2 Reputace',
        effectTextEn: '+2,500 Followers · +4 Mental · -2 Reputation',
        modifiers: { followers: 2500, mental: 4, reputation: -2 },
      },
      {
        id: 'mute_socials_grind',
        textCs: 'Ignorovat sociální sítě a jít okamžitě grindit SoloQ',
        textEn: 'Ignore social media and grind SoloQ immediately',
        descCs: 'Přetav hněv v mechanický trénink.',
        descEn: 'Channel the frustration into raw mechanical practice.',
        effectTextCs: '+4 Mechanika · +25 LP · -15⚡ Energie',
        effectTextEn: '+4 Mechanics · +25 LP · -15⚡ Energy',
        modifiers: { mechanics: 4, lp: 25, energy: -15 },
      },
      {
        id: 'blame_draft',
        textCs: 'Okomentovat, že draft neměl žádný engage tool',
        textEn: 'Subtweet that the draft had zero engage tools',
        descCs: 'Přenést vinu na trenéra a kompozici.',
        descEn: 'Shift the blame onto the coaching staff and team composition.',
        effectTextCs: '-10 Důvěra trenéra · -8 Morálka',
        effectTextEn: '-10 Coach Trust · -8 Team Morale',
        modifiers: { coachTrust: -10, morale: -8 },
      },
    ],
  },
  {
    id: 'podcast_beef',
    titleCs: 'Esport Podcast Callout',
    titleEn: 'Esport Podcast Callout',
    tagCs: '🎙️ Média & Drama',
    tagEn: '🎙️ Media & Drama',
    icon: '🎙️',
    descriptionCs: 'V populárním esportovém podcastu RiftGG tě analytik označil za hráče, který „má plnou pusu řečí, ale v rozhodujících momentech ještě nic nevyhrál“.',
    descriptionEn: 'On the RiftGG podcast, an analyst called you out as "a player who talks big on social media but has won nothing when it matters."',
    choices: [
      {
        id: 'pin_over_monitor',
        textCs: 'Udělat screenshot a nalepit si citát nad monitor',
        textEn: 'Screenshot the quote and tape it above your monitor',
        descCs: 'Použij kritiku jako palivo pro svůj každodenní hlad po vítězství.',
        descEn: 'Turn hate into pure fuel for your championship ambition.',
        effectTextCs: '+4 Mechanika · +4 Mentál · +2 Znalost Hry',
        effectTextEn: '+4 Mechanics · +4 Mental · +2 Knowledge',
        modifiers: { mechanics: 4, mental: 4, gameKnowledge: 2 },
      },
      {
        id: 'reply_publicly',
        textCs: 'Odpovědět veřejně na Twitteru ostrou statistikou',
        textEn: 'Reply publicly on Twitter with aggressive stats',
        descCs: 'Vytáhni své KDA a laning statistiky před celou komunitou.',
        descEn: 'Clap back with your lane statistics in front of the entire community.',
        effectTextCs: '+3 000 Followers · -5 Důvěra trenéra',
        effectTextEn: '+3,000 Followers · -5 Coach Trust',
        modifiers: { followers: 3000, coachTrust: -5 },
      },
      {
        id: 'silence_is_golden',
        textCs: 'Nereagovat a nechat za sebe mluvit trofeje',
        textEn: 'Stay completely silent and let trophies do the talking',
        descCs: 'Zachovej absolutní profesionalitu.',
        descEn: 'Maintain pure professional focus without drama.',
        effectTextCs: '+6 Důvěra trenéra · +4 Reputace',
        effectTextEn: '+6 Coach Trust · +4 Reputation',
        modifiers: { coachTrust: 6, reputation: 4 },
      },
    ],
  },
  {
    id: 'playoff_bench_strategy',
    titleCs: 'Taktická Lavička na Game 1',
    titleEn: 'Playoff Game 1 Bench Tactic',
    tagCs: '🏆 Playoff Rozhodnutí',
    tagEn: '🏆 Playoff Call',
    icon: '🪑',
    descriptionCs: 'Trenér tě svolal do kanclu: chce na Game 1 playoff série nasadit náhradníka, aby skryl vaši tajnou kompozici. Ty bys úvodní zápas sledoval ze židle.',
    descriptionEn: 'Coach calls you in: he wants to start a sub for Game 1 to hide your secret team draft, meaning you watch Game 1 from a chair.',
    choices: [
      {
        id: 'whatever_wins',
        textCs: '„Cokoliv pro výhru série, kouči.“',
        textEn: '"Whatever wins us the series, coach."',
        descCs: 'Podřiď své ego týmovému úspěchu.',
        descEn: 'Subordinate personal pride to team success.',
        effectTextCs: '+15 Důvěra trenéra · +6 Znalost Hry · -4 Morálka',
        effectTextEn: '+15 Coach Trust · +6 Knowledge · -4 Morale',
        modifiers: { coachTrust: 15, gameKnowledge: 6, morale: -4 },
      },
      {
        id: 'demand_to_start',
        textCs: '„Jsem starter. Na lavičce sedět nebudu.“',
        textEn: '"I am the starter. I play every single playoff game."',
        descCs: 'Ukázat sebevědomí a hlad po vítězství od první minuty.',
        descEn: 'Assert dominance and demand the stage.',
        effectTextCs: '+6 Mechanika · -12 Důvěra trenéra · +4 Reputace',
        effectTextEn: '+6 Mechanics · -12 Coach Trust · +4 Reputation',
        modifiers: { mechanics: 6, coachTrust: -12, reputation: 4 },
      },
    ],
  },
  {
    id: 'energy_drink_sponsor',
    titleCs: 'Lukrativní Sponzorská Nabídka',
    titleEn: 'Lucrative Energy Drink Sponsor',
    tagCs: '💰 Finance & Značka',
    tagEn: '💰 Money & Brand',
    icon: '⚡',
    descriptionCs: 'Značka energetických nápojů ti nabízí $35,000 za víkendové natáčení reklamy. Háček je v tom, že tě nutí říkat trapný slogan a zabere ti to tréninkový víkend.',
    descriptionEn: 'An energy drink brand offers $35,000 for a 2-day shoot. Catch: a cringe slogan and sacrificing a full weekend of practice.',
    choices: [
      {
        id: 'take_the_bag',
        textCs: 'Podepsat smlouvu a shrábnout $35 000',
        textEn: 'Sign the contract and take the $35,000 bag',
        descCs: 'Zajisti se finančně, peníze na ulici neleží.',
        descEn: 'Secure the bag. Esport careers can be short.',
        effectTextCs: '+$35 000 · -2 Reputace · -20⚡ Energie',
        effectTextEn: '+$35,000 · -2 Reputation · -20⚡ Energy',
        modifiers: { money: 35000, reputation: -2, energy: -20 },
      },
      {
        id: 'refuse_for_brand',
        textCs: 'Odmítnout – tvá reputace a trénink mají vyšší cenu',
        textEn: 'Decline – your competitive focus and brand pride come first',
        descCs: 'Udrž stoprocentní soustředění na esportový šampionát.',
        descEn: 'Protect your brand integrity and championship grind.',
        effectTextCs: '+6 Reputace · +4 Mentál · +6 Důvěra trenéra',
        effectTextEn: '+6 Reputation · +4 Mental · +6 Coach Trust',
        modifiers: { reputation: 6, mental: 4, coachTrust: 6 },
      },
    ],
  },
  {
    id: 'family_emergency',
    titleCs: 'Nečekaný Telefonát z Domova',
    titleEn: 'Late Night Call From Home',
    tagCs: '❤️ Osobní Život',
    tagEn: '❤️ Personal Life',
    icon: '📞',
    descriptionCs: 'Máma ti volá v půl třetí ráno. Táta leží v nemocnici. Letadlo domů letí za 6 hodin, ale za 3 dny vás čeká klíčový zápas o postup do finále.',
    descriptionEn: 'Your mom calls at 2:30 AM. Your dad is hospitalized. A flight home leaves in 6 hours, but your season-deciding match is in 3 days.',
    choices: [
      {
        id: 'fly_home',
        textCs: 'Okamžitě letět domů být s rodinou',
        textEn: 'Take the flight home immediately to be with family',
        descCs: 'Rodina je vždy na prvním místě.',
        descEn: 'Family always comes before anything else.',
        effectTextCs: '+15 Mentál · -8 Důvěra trenéra · -20⚡ Energie',
        effectTextEn: '+15 Mental · -8 Coach Trust · -20⚡ Energy',
        modifiers: { mental: 15, coachTrust: -8, energy: -20 },
      },
      {
        id: 'stay_and_win',
        textCs: 'Zůstat a vyhrát zápas pro tátu',
        textEn: 'Stay, play through the pain and win the series for him',
        descCs: 'Proměň emoce v nezastavitelný výkon na pódiu.',
        descEn: 'Channel every ounce of emotion into a legendary performance.',
        effectTextCs: '+8 Mechanika · -6 Mentál · +8 Důvěra týmu',
        effectTextEn: '+8 Mechanics · -6 Mental · +8 Team Trust',
        modifiers: { mechanics: 8, mental: -6, coachTrust: 8 },
      },
    ],
  },
  {
    id: 'scrim_leak_scandal',
    titleCs: 'Únik Taktiky ze Scrimů',
    titleEn: 'Leaked Scrim VOD Scandal',
    tagCs: '🕵️ Taktika & Špionáž',
    tagEn: '🕵️ Tactics & Leaks',
    icon: '🕵️',
    descriptionCs: 'Na redditu se objevily nahrávky vašich tajných scrimů. Soupeř teď přesně ví, co hrajete za drafty a jaké máte vize v řece.',
    descriptionEn: 'Secret scrim VODs were leaked on Reddit. Your rivals now know your level 1 invade setups and pocket picks.',
    choices: [
      {
        id: 'reinvent_draft',
        textCs: 'Překopat strategii a připravit nečekané flex picky',
        textEn: 'Reinvent the draft completely with surprise flex picks',
        descCs: 'Zaskoč soupeře novými kompozicemi.',
        descEn: 'Catch opponents completely off guard with fresh theorycrafting.',
        effectTextCs: '+8 Adaptabilita · +4 Znalost Hry · -10⚡ Energie',
        effectTextEn: '+8 Adaptability · +4 Knowledge · -10⚡ Energy',
        modifiers: { adaptability: 8, gameKnowledge: 4, energy: -10 },
      },
      {
        id: 'double_down_mastery',
        textCs: 'Hrát své nejlepší champy a přehrát je čistou mechanikou',
        textEn: 'Double down on main picks and win by pure mechanics',
        descCs: '„Ať ví, co hrajeme. Stejně to nezastaví.“',
        descEn: '"Let them know what we play. They still cannot stop it."',
        effectTextCs: '+6 Mechanika · +4 Mentál · +4 Morálka',
        effectTextEn: '+6 Mechanics · +4 Mental · +4 Morale',
        modifiers: { mechanics: 6, mental: 4, morale: 4 },
      },
    ],
  },
];
