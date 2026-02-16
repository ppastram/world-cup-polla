'use client';

import { MASCOTS } from '@/lib/mascots';

interface MascotSelectorProps {
  selected: string | null;
  onSelect: (mascotId: string) => void;
}

export default function MascotSelector({ selected, onSelect }: MascotSelectorProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
      {MASCOTS.map((mascot) => {
        const isSelected = selected === mascot.id;
        return (
          <button
            key={mascot.id}
            type="button"
            onClick={() => onSelect(mascot.id)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
              isSelected
                ? 'border-gold-500/60 bg-gold-500/10'
                : 'border-wc-border bg-wc-darker hover:border-gold-500/30'
            }`}
          >
            <img
              src={mascot.imageUrl}
              alt={mascot.name}
              className={`w-12 h-12 rounded-full object-cover border-2 ${
                isSelected ? 'border-gold-500' : 'border-transparent'
              }`}
            />
            <span className="text-[10px] text-gray-400 text-center leading-tight truncate w-full">
              {mascot.year}
            </span>
          </button>
        );
      })}
    </div>
  );
}
