'use client';

interface TeamFlagProps {
  team: {
    name: string;
    flag_url: string;
    code: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-6 h-4',
  md: 'w-8 h-6',
  lg: 'w-12 h-8',
};

export default function TeamFlag({ team, size = 'md' }: TeamFlagProps) {
  return (
    <img
      src={team.flag_url}
      alt={team.name}
      title={team.name}
      className={`${sizeClasses[size]} object-cover rounded-sm border border-wc-border`}
    />
  );
}
