'use client';

import { Trophy, Target, Shield, Star, Hash } from 'lucide-react';

interface AwardsFormProps {
  predictions: Record<string, { player_name?: string; total_goals_guess?: number }>;
  onChange: (awardType: string, value: { player_name?: string; total_goals_guess?: number }) => void;
  disabled?: boolean;
}

const AWARDS = [
  {
    key: 'golden_ball',
    label: 'Balon de Oro',
    description: 'Mejor jugador del torneo',
    icon: Trophy,
    type: 'player' as const,
  },
  {
    key: 'golden_boot',
    label: 'Bota de Oro',
    description: 'Maximo goleador del torneo',
    icon: Target,
    type: 'player' as const,
  },
  {
    key: 'golden_glove',
    label: 'Guante de Oro',
    description: 'Mejor portero del torneo',
    icon: Shield,
    type: 'player' as const,
  },
  {
    key: 'best_young',
    label: 'Mejor Jugador Joven',
    description: 'Mejor jugador sub-21',
    icon: Star,
    type: 'player' as const,
  },
  {
    key: 'total_goals',
    label: 'Total de Goles',
    description: 'Cantidad total de goles en el torneo',
    icon: Hash,
    type: 'number' as const,
  },
];

export default function AwardsForm({
  predictions,
  onChange,
  disabled = false,
}: AwardsFormProps) {
  return (
    <div className="space-y-4">
      {AWARDS.map((award) => {
        const prediction = predictions[award.key] || {};
        const Icon = award.icon;
        const isFilled = award.type === 'player'
          ? !!prediction.player_name?.trim()
          : prediction.total_goals_guess != null;

        return (
          <div
            key={award.key}
            className={`bg-wc-card border rounded-lg p-4 transition-colors ${
              isFilled ? 'border-gold-500/40' : 'border-wc-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isFilled ? 'bg-gold-500/20 text-gold-400' : 'bg-wc-darker text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">{award.label}</h4>
                <p className="text-xs text-gray-500 mb-3">{award.description}</p>

                {award.type === 'player' ? (
                  <input
                    type="text"
                    value={prediction.player_name || ''}
                    onChange={(e) =>
                      onChange(award.key, { player_name: e.target.value })
                    }
                    disabled={disabled}
                    placeholder="Nombre del jugador"
                    className="w-full bg-wc-darker border border-wc-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                ) : (
                  <input
                    type="number"
                    value={prediction.total_goals_guess ?? ''}
                    onChange={(e) =>
                      onChange(award.key, {
                        total_goals_guess: e.target.value ? parseInt(e.target.value, 10) : undefined,
                      })
                    }
                    disabled={disabled}
                    placeholder="Ej: 172"
                    min={0}
                    max={500}
                    className="w-full bg-wc-darker border border-wc-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
