'use client';

import { useEffect, useState } from 'react';
import { X, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/i18n';
import { SCORING } from '@/lib/constants';
import MascotAvatar from '@/components/shared/MascotAvatar';
import CountryFlag from '@/components/shared/CountryFlag';
import type { Profile } from '@/lib/types';

interface ExactScorePopupProps {
  matchId: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExactScorePopup({
  matchId,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  isOpen,
  onClose,
}: ExactScorePopupProps) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchExactScores() {
      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from('match_predictions')
        .select('user_id, profiles:user_id(id, display_name, avatar_url, country_code)')
        .eq('match_id', matchId)
        .eq('points_earned', SCORING.EXACT_SCORE);

      const profiles = (data ?? [])
        .map((d: Record<string, unknown>) => d.profiles as unknown as Profile)
        .filter(Boolean);

      setPlayers(profiles);
      setLoading(false);
    }

    fetchExactScores();
  }, [matchId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-wc-card border border-wc-border rounded-2xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-wc-border shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-gold-400" />
              {t('matches.exactScores')}
            </h2>
            {homeTeam && awayTeam && (
              <p className="text-sm text-gray-500 mt-0.5">
                {homeTeam} {homeScore ?? 0} - {awayScore ?? 0} {awayTeam}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : players.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              {t('matches.noExactScores')}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-3">
                {t('matches.exactScoresDesc')}
              </p>
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 bg-wc-darker rounded-lg px-3 py-2"
                >
                  <MascotAvatar
                    avatarUrl={player.avatar_url}
                    displayName={player.display_name}
                    size="sm"
                  />
                  <CountryFlag countryCode={player.country_code} size="sm" />
                  <span className="text-sm text-gray-200 font-medium">
                    {player.display_name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
