'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trophy, DollarSign, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/i18n';
import { FIXED_PRIZES } from '@/lib/constants';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import PointsBreakdown from '@/components/leaderboard/PointsBreakdown';
import type { LeaderboardEntry } from '@/lib/types';

export default function ClasificacionPage() {
  const { t, formatCurrency } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*, profile:profiles(*)')
      .order('rank', { ascending: true });

    if (!error && data) {
      setEntries(data as unknown as LeaderboardEntry[]);
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await fetchLeaderboard();
      setLoading(false);
    }
    init();
  }, [fetchLeaderboard]);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">{t("leaderboard.title")}</h1>
          <p className="text-sm text-gray-500">{t("leaderboard.subtitle")}</p>
        </div>
      </div>

      {/* Prize Pool */}
      <div className="bg-wc-card border border-gold-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-gold-400" />
          <h2 className="text-lg font-bold text-white">{t("leaderboard.prizePool")}</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-wc-darker rounded-lg p-3">
            <p className="text-yellow-400 font-bold text-lg">
              {formatCurrency(FIXED_PRIZES.firstPlace)}
            </p>
            <p className="text-gray-500 text-xs">{t("leaderboard.1stPlace")}</p>
          </div>
          <div className="bg-wc-darker rounded-lg p-3">
            <p className="text-gray-300 font-bold text-lg">
              {formatCurrency(FIXED_PRIZES.secondPlace)}
            </p>
            <p className="text-gray-500 text-xs">{t("leaderboard.2ndPlace")}</p>
          </div>
          <div className="bg-wc-darker rounded-lg p-3">
            <p className="text-gray-300 font-bold text-lg">
              {formatCurrency(FIXED_PRIZES.thirdPlace)}
            </p>
            <p className="text-gray-500 text-xs">{t("leaderboard.3rdPlace")}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
        </div>
      ) : (
        <LeaderboardTable
          entries={entries}
          onUserClick={(userId) => setSelectedUserId(userId)}
        />
      )}

      {/* Points Breakdown Modal */}
      {selectedUserId && (
        <PointsBreakdown
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
