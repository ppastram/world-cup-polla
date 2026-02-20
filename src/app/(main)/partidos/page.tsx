'use client';

import { useEffect, useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/i18n';

import MatchCard from '@/components/matches/MatchCard';
import type { Match, Team, MatchStage } from '@/lib/types';

type MatchWithTeams = Match & { home_team?: Team; away_team?: Team };

const STAGE_TABS: { key: MatchStage | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'matches.all' },
  { key: 'group', labelKey: 'matches.groups' },
  { key: 'round_32', labelKey: 'matches.round32' },
  { key: 'round_16', labelKey: 'matches.round16' },
  { key: 'quarter', labelKey: 'matches.quarter' },
  { key: 'semi', labelKey: 'matches.semi' },
  { key: 'final', labelKey: 'matches.final' },
];

function groupMatchesByDate(matches: MatchWithTeams[]): Record<string, MatchWithTeams[]> {
  const grouped: Record<string, MatchWithTeams[]> = {};
  for (const match of matches) {
    const dateKey = format(new Date(match.match_date), 'yyyy-MM-dd');
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(match);
  }
  return grouped;
}

export default function PartidosPage() {
  const { t, locale } = useTranslation();
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState<MatchStage | 'all'>('all');

  useEffect(() => {
    async function fetchMatches() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('matches')
        .select(
          '*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)'
        )
        .order('match_date', { ascending: true })
        .order('match_number', { ascending: true });

      if (!error && data) {
        setMatches(data as unknown as MatchWithTeams[]);
      }
      setLoading(false);
    }
    fetchMatches();
  }, []);

  const filteredMatches =
    activeStage === 'all'
      ? matches
      : matches.filter((m) => m.stage === activeStage);

  const grouped = groupMatchesByDate(filteredMatches);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Calendar className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">{t("matches.title")}</h1>
          <p className="text-sm text-gray-500">{t("matches.subtitle")}</p>
        </div>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STAGE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStage(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeStage === tab.key
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'bg-wc-card border border-wc-border text-gray-400 hover:text-white hover:border-wc-border'
            }`}
          >
            {t(tab.labelKey as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMatches.length === 0 && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-12 text-center">
          <Calendar className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">{t("matches.empty")}</p>
        </div>
      )}

      {/* Matches grouped by date */}
      {!loading &&
        sortedDates.map((dateKey) => {
          const dayMatches = grouped[dateKey];
          const dateObj = new Date(dateKey + 'T12:00:00');
          return (
            <div key={dateKey}>
              <div className="sticky top-16 z-10 bg-wc-darker/90 backdrop-blur-sm py-2 mb-3">
                <h2 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">
                  {format(dateObj, locale === 'es' ? "EEEE d 'de' MMMM" : "EEEE, MMMM d", { locale: locale === 'es' ? es : enUS })}
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dayMatches.map((match) => (
                  <MatchCard key={match.id} match={match} isGroupStage={match.stage === 'group'} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
