'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trophy, DollarSign, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { calculatePrizes, ENTRY_FEE_COP } from '@/lib/constants';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import PointsBreakdown from '@/components/leaderboard/PointsBreakdown';
import type { LeaderboardEntry } from '@/lib/types';

export default function ClasificacionPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [paidCount, setPaidCount] = useState(0);
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

  const fetchPaidCount = useCallback(async () => {
    const supabase = createClient();
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('payment_status', 'verified');
    if (count !== null) setPaidCount(count);
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchLeaderboard(), fetchPaidCount()]);
      setLoading(false);
    }
    init();
  }, [fetchLeaderboard, fetchPaidCount]);

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

  const prizes = calculatePrizes(paidCount);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Clasificacion</h1>
          <p className="text-sm text-gray-500">Tabla de posiciones en tiempo real</p>
        </div>
      </div>

      {/* Prize Pool */}
      <div className="bg-wc-card border border-gold-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-gold-400" />
          <h2 className="text-lg font-bold text-white">Pozo Acumulado</h2>
        </div>
        <p className="text-4xl md:text-5xl font-extrabold text-gold-400 text-center mb-1">
          ${prizes.totalPool.toLocaleString('es-CO')}
        </p>
        <p className="text-gray-500 text-center text-sm mb-5">
          {prizes.paidCount} participante{prizes.paidCount !== 1 ? 's' : ''} inscrito{prizes.paidCount !== 1 ? 's' : ''}
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-wc-darker rounded-lg p-3">
            <p className="text-gold-400 font-bold text-lg">
              ${prizes.firstPlace.toLocaleString('es-CO')}
            </p>
            <p className="text-gray-500 text-xs">1er Lugar (70%)</p>
          </div>
          <div className="bg-wc-darker rounded-lg p-3">
            <p className="text-gray-300 font-bold text-lg">
              ${prizes.secondPlace.toLocaleString('es-CO')}
            </p>
            <p className="text-gray-500 text-xs">2do Lugar (15%)</p>
          </div>
          <div className="bg-wc-darker rounded-lg p-3">
            <p className="text-gray-300 font-bold text-lg">
              ${ENTRY_FEE_COP.toLocaleString('es-CO')}
            </p>
            <p className="text-gray-500 text-xs">3er Lugar</p>
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
