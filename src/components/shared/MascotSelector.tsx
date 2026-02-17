'use client';

import { MASCOTS } from '@/lib/mascots';

interface MascotSelectorProps {
  selected: string | null;
  onSelect: (mascotId: string) => void;
  compact?: boolean;
}

export default function MascotSelector({ selected, onSelect, compact = false }: MascotSelectorProps) {
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-8'}`}>
      {MASCOTS.map((mascot) => {
        const isSelected = selected === mascot.id;
        return (
          <button
            key={mascot.id}
            type="button"
            onClick={() => onSelect(mascot.id)}
            className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
              isSelected
                ? 'border-gold-500/60 bg-gold-500/10'
                : 'border-wc-border bg-wc-darker hover:border-gold-500/30'
            }`}
          >
            <img
              src={mascot.imageUrl}
              alt={mascot.name}
              className={`w-full aspect-square rounded-full object-cover border-2 ${
                isSelected ? 'border-gold-500' : 'border-transparent'
              }`}
            />
            {!compact && (
              <span className="text-[10px] text-gray-400 text-center leading-tight truncate w-full mt-1">
                {mascot.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
