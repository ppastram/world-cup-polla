'use client';

import { useEffect, useState } from 'react';
import { X, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/i18n';
import { ADVANCING_ROUND_POINTS } from '@/lib/constants';
import MascotAvatar from '@/components/shared/MascotAvatar';
import CountryFlag from '@/components/shared/CountryFlag';
import type { Profile, AdvancingRound } from '@/lib/types';

interface PredictorRow {
  profile: Profile;
  points_earned: number | null;
  is_lone_wolf: boolean;
}

interface TeamPredictorsPopupProps {
  teamId: string;
  teamName: string;
  teamFlagUrl: string;
  round: AdvancingRound;
  roundLabel: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamPredictorsPopup({
  teamName,
  teamFlagUrl,
  teamId,
  round,
  roundLabel,
  isOpen,
  onClose,
}: TeamPredictorsPopupProps) {
  const { t } = useTranslation();
  const [predictors, setPredictors] = useState<PredictorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchPredictors() {
      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from('advancing_predictions')
        .select('user_id, points_earned, is_lone_wolf, profiles:user_id(id, display_name, avatar_url, country_code)')
        .eq('team_id', teamId)
        .eq('round', round);

      const rows: PredictorRow[] = (data ?? []).map((d: Record<string, unknown>) => ({
        profile: d.profiles as unknown as Profile,
        points_earned: d.points_earned as number | null,
        is_lone_wolf: d.is_lone_wolf as boolean,
      })).filter((r) => r.profile);

      setPredictors(rows);
      setLoading(false);
    }

    fetchPredictors();
  }, [teamId, round, isOpen]);

  if (!isOpen) return null;

  const expectedPoints = ADVANCING_ROUND_POINTS[round] ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-wc-card border border-wc-border rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-wc-border shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={teamFlagUrl}
              alt={teamName}
              className="w-8 h-5 object-cover rounded-sm border border-wc-border"
            />
            <div>
              <h2 className="text-lg font-bold text-white">{teamName}</h2>
              <p className="text-xs text-gray-500">{roundLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400 bg-wc-darker px-2 py-1 rounded-full">
              <Users className="w-3 h-3" />
              {loading ? '...' : predictors.length}
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : predictors.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              {t('bracket.noPredictions')}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-3">
                {t('bracket.predictedBy')}
              </p>
              {predictors.map((row) => (
                <div
                  key={row.profile.id}
                  className="flex items-center gap-3 bg-wc-darker rounded-lg px-3 py-2"
                >
                  <MascotAvatar
                    avatarUrl={row.profile.avatar_url}
                    displayName={row.profile.display_name}
                    size="sm"
                  />
                  <CountryFlag countryCode={row.profile.country_code} size="sm" />
                  <span className="text-sm text-gray-200 font-medium flex-1 truncate">
                    {row.profile.display_name}
                  </span>
                  {row.is_lone_wolf && (
                    <span className="text-xs" title="Lone Wolf x2">🐺</span>
                  )}
                  {row.points_earned !== null && row.points_earned > 0 ? (
                    <span className="text-xs font-bold text-emerald-400">
                      +{row.points_earned} pts
                    </span>
                  ) : row.points_earned !== null && row.points_earned === 0 ? (
                    <span className="text-xs font-bold text-red-400">
                      0 pts
                    </span>
                  ) : (
                    <span className="text-xs text-gray-600">
                      {expectedPoints} pts
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
