'use client';

import { MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import TeamFlag from '@/components/shared/TeamFlag';
import { useTranslation } from '@/i18n';
import type { Match, Team } from '@/lib/types';

interface MatchCardProps {
  match: Match & { home_team?: Team; away_team?: Team };
  prediction?: { home_score: number; away_score: number };
  showPrediction?: boolean;
}

export default function MatchCard({ match, prediction, showPrediction = false }: MatchCardProps) {
  const { t, locale } = useTranslation();
  const matchDate = new Date(match.match_date);
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <div
      className={`bg-wc-card border rounded-xl p-4 transition-colors ${
        isLive
          ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          : 'border-wc-border'
      }`}
    >
      {/* Header: Date, time, venue */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {format(matchDate, "d MMM, h:mm a", { locale: locale === 'es' ? es : enUS })}
          </span>
        </div>
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">{t("matches.live")}</span>
          </div>
        )}
        {isFinished && (
          <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            {t("matches.finished")}
          </span>
        )}
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {match.home_team ? (
            <>
              <TeamFlag team={match.home_team} size="md" />
              <span className="text-sm font-medium text-gray-200 truncate">
                {match.home_team.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">{t("matches.tbd")}</span>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 shrink-0">
          {isFinished || isLive ? (
            <>
              <span className="text-xl font-bold text-white tabular-nums w-7 text-right">
                {match.home_score ?? 0}
              </span>
              <span className="text-gray-600 font-bold">-</span>
              <span className="text-xl font-bold text-white tabular-nums w-7 text-left">
                {match.away_score ?? 0}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-blue-400 px-3">vs</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          {match.away_team ? (
            <>
              <span className="text-sm font-medium text-gray-200 truncate text-right">
                {match.away_team.name}
              </span>
              <TeamFlag team={match.away_team} size="md" />
            </>
          ) : (
            <span className="text-sm text-gray-500">{t("matches.tbd")}</span>
          )}
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-600">
          <MapPin className="w-3 h-3" />
          <span>{match.venue}</span>
        </div>
      )}

      {/* User Prediction */}
      {showPrediction && prediction && (
        <div className="mt-3 pt-3 border-t border-wc-border">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-gray-500">{t("matches.yourPrediction")}</span>
            <span className="text-sm font-bold text-gold-400 tabular-nums">
              {prediction.home_score} - {prediction.away_score}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
