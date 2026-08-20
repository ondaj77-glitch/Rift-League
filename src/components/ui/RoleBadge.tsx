import type { Role } from '../../types/game';

const ROLE_DATA: Record<Role, { label: string; color: string; bg: string; icon: string }> = {
  top:     { label: 'TOP', color: 'text-orange-400', bg: 'bg-orange-950/50 border-orange-800/40', icon: '🛡️' },
  jungle:  { label: 'JG',  color: 'text-green-400',  bg: 'bg-green-950/50 border-green-800/40',   icon: '🌲' },
  mid:     { label: 'MID', color: 'text-purple-400',  bg: 'bg-purple-950/50 border-purple-800/40', icon: '⚡' },
  adc:     { label: 'ADC', color: 'text-blue-400',    bg: 'bg-blue-950/50 border-blue-800/40',     icon: '🏹' },
  support: { label: 'SUP', color: 'text-yellow-400',  bg: 'bg-yellow-950/50 border-yellow-800/40', icon: '💛' },
};

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RoleBadge({ role, size = 'md', showIcon = true }: RoleBadgeProps) {
  const data = ROLE_DATA[role];
  const sizes = { sm: 'text-xs px-1.5 py-0.5', md: 'text-xs px-2 py-1', lg: 'text-sm px-3 py-1.5' };

  return (
    <span className={`inline-flex items-center gap-1 rounded border font-bold ${data.bg} ${data.color} ${sizes[size]}`}>
      {showIcon && <span>{data.icon}</span>}
      {data.label}
    </span>
  );
}
