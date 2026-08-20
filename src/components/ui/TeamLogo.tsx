import { useState } from 'react';
import type { Team } from '../../types/game';

interface TeamLogoProps {
  team?: Team | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Real official transparent logo URLs from Wikimedia Commons and official CDNs
const TEAM_LOGO_URLS: Record<string, string> = {
  // LCK
  t1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/T1_esports_logo.svg/300px-T1_esports_logo.svg.png',
  geng: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Gen.G_logo.svg/300px-Gen.G_logo.svg.png',
  hle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hanwha_Life_Esports_logo.svg/300px-Hanwha_Life_Esports_logo.svg.png',
  dk: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Dplus_KIA_logo.svg/300px-Dplus_KIA_logo.svg.png',
  kt: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/KT_Rolster_logo.svg/300px-KT_Rolster_logo.svg.png',
  kdf: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Kwangdong_Freecs_logo.svg/300px-Kwangdong_Freecs_logo.svg.png',
  drx: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/DRX_logo.svg/300px-DRX_logo.svg.png',
  bnk: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/BNK_FearX_logo.svg/300px-BNK_FearX_logo.svg.png',
  ns: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Nongshim_RedForce_logo.svg/300px-Nongshim_RedForce_logo.svg.png',
  bro: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/OK_Saving_Bank_BRION_logo.svg/300px-OK_Saving_Bank_BRION_logo.svg.png',

  // LEC
  g2: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Esports_G2_logo.svg/300px-Esports_G2_logo.svg.png',
  fnc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Fnatic_logo.svg/300px-Fnatic_logo.svg.png',
  kc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Karmine_Corp_logo.svg/300px-Karmine_Corp_logo.svg.png',
  bds: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Team_BDS_logo.svg/300px-Team_BDS_logo.svg.png',
  mad: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/MAD_Lions_KOI_logo.svg/300px-MAD_Lions_KOI_logo.svg.png',
  vit: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Team_Vitality_logo.svg/300px-Team_Vitality_logo.svg.png',
  hr: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Team_Heretics_logo.svg/300px-Team_Heretics_logo.svg.png',
  sk: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SK_Gaming_logo.svg/300px-SK_Gaming_logo.svg.png',
  gx: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GiantX_logo.svg/300px-GiantX_logo.svg.png',
  rge: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Rogue_logo.svg/300px-Rogue_logo.svg.png',

  // LPL
  blg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Bilibili_Gaming_logo.svg/300px-Bilibili_Gaming_logo.svg.png',
  tes: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Top_Esports_logo.svg/300px-Top_Esports_logo.svg.png',
  jdg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/JD_Gaming_logo.svg/300px-JD_Gaming_logo.svg.png',
  weibo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Weibo_Gaming_logo.svg/300px-Weibo_Gaming_logo.svg.png',
  lng: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/LNG_Esports_logo.svg/300px-LNG_Esports_logo.svg.png',
  edg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/EDward_Gaming_logo.svg/300px-EDward_Gaming_logo.svg.png',
  fpx: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/FunPlus_Phoenix_logo.svg/300px-FunPlus_Phoenix_logo.svg.png',
  nip: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Ninjas_in_Pyjamas_2021_logo.svg/300px-Ninjas_in_Pyjamas_2021_logo.svg.png',
  rng: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Royal_Never_Give_Up_logo.svg/300px-Royal_Never_Give_Up_logo.svg.png',
  ig: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Invictus_Gaming_logo.svg/300px-Invictus_Gaming_logo.svg.png',
  al: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Anyone%27s_Legend_logo.svg/300px-Anyone%27s_Legend_logo.svg.png',
  we: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Team_WE_logo.svg/300px-Team_WE_logo.svg.png',
  omg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Oh_My_God_logo.svg/300px-Oh_My_God_logo.svg.png',

  // LTA_N
  fly: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/FlyQuest_logo.svg/300px-FlyQuest_logo.svg.png',
  tl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Team_Liquid_logo.svg/300px-Team_Liquid_logo.svg.png',
  c9: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Cloud9_logo.svg/300px-Cloud9_logo.svg.png',
  '100t': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/100_Thieves_logo.svg/300px-100_Thieves_logo.svg.png',
  sr: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Shopify_Rebellion_logo.svg/300px-Shopify_Rebellion_logo.svg.png',
  dig: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Dignitas_logo_2021.svg/300px-Dignitas_logo_2021.svg.png',
  dsg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Disguised_logo.svg/300px-Disguised_logo.svg.png',

  // LTA_S
  pain: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/PaiN_Gaming_logo.svg/300px-PaiN_Gaming_logo.svg.png',
  loud: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/LOUD_logo.svg/300px-LOUD_logo.svg.png',
  red: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/RED_Canids_logo.svg/300px-RED_Canids_logo.svg.png',
  vks: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Vivo_Keyd_Stars_logo.svg/300px-Vivo_Keyd_Stars_logo.svg.png',
  fluxo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Fluxo_logo.svg/300px-Fluxo_logo.svg.png',
  fur: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/FURIA_Esports_logo.svg/300px-FURIA_Esports_logo.svg.png',
  isurus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Isurus_logo.svg/300px-Isurus_logo.svg.png',

  // LCP
  psg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/PSG_Talon_logo.svg/300px-PSG_Talon_logo.svg.png',
  gam: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/GAM_Esports_logo.svg/300px-GAM_Esports_logo.svg.png',
  cfo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/CTBC_Flying_Oyster_logo.svg/300px-CTBC_Flying_Oyster_logo.svg.png',
  shg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Fukuoka_SoftBank_HAWKS_gaming_logo.svg/300px-Fukuoka_SoftBank_HAWKS_gaming_logo.svg.png',
  chiefs: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/The_Chiefs_Esports_Club_logo.svg/300px-The_Chiefs_Esports_Club_logo.svg.png',
};

const SIZE_STYLES = {
  xs: 'w-6 h-6 rounded-md',
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-11 h-11 rounded-xl',
  lg: 'w-14 h-14 rounded-2xl',
  xl: 'w-16 h-16 rounded-2xl',
};

const PADDING_STYLES = {
  xs: 'p-0.5',
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-2',
  xl: 'p-2',
};

export function TeamLogo({ team, size = 'md', className = '' }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (!team) {
    return (
      <div className={`${SIZE_STYLES[size]} bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs ${className}`}>
        FA
      </div>
    );
  }

  const logoUrl = TEAM_LOGO_URLS[team.id];

  if (logoUrl && !imgError) {
    return (
      <div
        className={`relative ${SIZE_STYLES[size]} ${PADDING_STYLES[size]} bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-md flex-shrink-0 select-none overflow-hidden ${className}`}
        title={team.name}
        style={{ borderColor: team.color ? `${team.color}55` : undefined }}
      >
        <img
          src={logoUrl}
          alt={team.name}
          className="w-full h-full object-contain filter drop-shadow"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Stylish fallback badge with official team colors and initials
  return (
    <div
      className={`relative ${SIZE_STYLES[size]} bg-slate-900 border-2 flex flex-col items-center justify-center shadow-lg flex-shrink-0 select-none font-heading font-black uppercase text-white ${className}`}
      title={team.name}
      style={{
        borderColor: team.color || '#6366f1',
        background: `linear-gradient(135deg, ${team.color || '#1e1b4b'}33, #0f172a)`,
      }}
    >
      <span className="text-[10px] leading-none" style={{ color: team.color || '#ffffff' }}>
        {team.shortName.slice(0, 3)}
      </span>
    </div>
  );
}
