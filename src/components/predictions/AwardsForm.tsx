'use client';

import { Trophy, Target, Shield, Star, Hash, CheckCircle2, XCircle } from 'lucide-react';
import { SCORING } from '@/lib/constants';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

interface AwardsFormProps {
  predictions: Record<string, { player_name?: string; total_goals_guess?: number; points_earned?: number | null }>;
  onChange: (awardType: string, value: { player_name?: string; total_goals_guess?: number }) => void;
  disabled?: boolean;
}

const AWARDS = [
  {
    key: 'golden_ball',
    labelKey: 'awards.goldenBall' as TranslationKey,
    descKey: 'awards.goldenBallDesc' as TranslationKey,
    icon: Trophy,
    type: 'player' as const,
    points: `${SCORING.GOLDEN_BALL} pts`,
  },
  {
    key: 'golden_boot',
    labelKey: 'awards.goldenBoot' as TranslationKey,
    descKey: 'awards.goldenBootDesc' as TranslationKey,
    icon: Target,
    type: 'player' as const,
    points: `${SCORING.GOLDEN_BOOT} pts`,
  },
  {
    key: 'golden_glove',
    labelKey: 'awards.goldenGlove' as TranslationKey,
    descKey: 'awards.goldenGloveDesc' as TranslationKey,
    icon: Shield,
    type: 'player' as const,
    points: `${SCORING.GOLDEN_GLOVE} pts`,
  },
  {
    key: 'best_young',
    labelKey: 'awards.bestYoung' as TranslationKey,
    descKey: 'awards.bestYoungDesc' as TranslationKey,
    icon: Star,
    type: 'player' as const,
    points: `${SCORING.BEST_YOUNG} pts`,
  },
  {
    key: 'total_goals',
    labelKey: 'awards.totalGoals' as TranslationKey,
    descKey: 'awards.totalGoalsDesc' as TranslationKey,
    icon: Hash,
    type: 'number' as const,
    points: `${SCORING.TOTAL_GOALS_EXACT}/${SCORING.TOTAL_GOALS_WITHIN_3}/${SCORING.TOTAL_GOALS_WITHIN_5} pts`,
  },
];

export default function AwardsForm({
  predictions,
  onChange,
  disabled = false,
}: AwardsFormProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {AWARDS.map((award) => {
        const prediction = predictions[award.key] || {};
        const Icon = award.icon;
        const isFilled = award.type === 'player'
          ? !!prediction.player_name?.trim()
          : prediction.total_goals_guess != null;
        const hasBeenScored = prediction.points_earned != null;
        const earnedPoints = prediction.points_earned ?? 0;
        const isCorrect = hasBeenScored && earnedPoints > 0;

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
                <h4 className="text-sm font-semibold text-white">
                  {t(award.labelKey)}
                  <span className="text-xs text-gray-500 font-normal ml-2">· {award.points}</span>
                </h4>
                <p className="text-xs text-gray-500 mb-3">{t(award.descKey)}</p>

                {award.type === 'player' ? (
                  <input
                    type="text"
                    value={prediction.player_name || ''}
                    onChange={(e) =>
                      onChange(award.key, { player_name: e.target.value })
                    }
                    disabled={disabled}
                    placeholder={t('awards.playerPlaceholder')}
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
                    placeholder={t('awards.goalsPlaceholder')}
                    min={0}
                    max={500}
                    className="w-full bg-wc-darker border border-wc-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                )}

                {hasBeenScored && (
                  <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${
                    isCorrect ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>+{earnedPoints} pts</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>0 pts</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
