'use client';

import { getMascotById } from '@/lib/mascots';

interface MascotAvatarProps {
  avatarUrl: string | null | undefined;
  displayName: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-2xl',
};

export default function MascotAvatar({ avatarUrl, displayName, size = 'md' }: MascotAvatarProps) {
  const mascot = avatarUrl ? getMascotById(avatarUrl) : undefined;
  const sizeClass = sizeClasses[size];

  if (mascot) {
    return (
      <img
        src={mascot.imageUrl}
        alt={mascot.name}
        className={`${sizeClass} rounded-full object-cover border-2 border-gold-500/30`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-wc-darker border border-wc-border flex items-center justify-center shrink-0`}>
      <span className="font-bold text-gray-400">
        {(displayName || '?').charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
