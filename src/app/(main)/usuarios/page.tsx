'use client';

import { useEffect, useState } from 'react';
import { Users, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import MascotAvatar from '@/components/shared/MascotAvatar';
import CountryFlag from '@/components/shared/CountryFlag';
import { useTranslation } from '@/i18n';

interface ParticipantWithStats extends Profile {
  match_prediction_count?: number;
  advancing_prediction_count?: number;
  award_prediction_count?: number;
}

export default function UsuariosPage() {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState<ParticipantWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParticipants() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name', { ascending: true });

      if (!error && data) {
        const userIds = data.map((p) => p.id);
        const { data: predCounts } = await supabase
          .from('match_predictions')
          .select('user_id')
          .in('user_id', userIds);

        const matchCountMap: Record<string, number> = {};
        if (predCounts) {
          for (const pred of predCounts) {
            matchCountMap[pred.user_id] = (matchCountMap[pred.user_id] ?? 0) + 1;
          }
        }

        const { data: advCounts } = await supabase
          .from('advancing_predictions')
          .select('user_id')
          .in('user_id', userIds);

        const advCountMap: Record<string, number> = {};
        if (advCounts) {
          for (const pred of advCounts) {
            advCountMap[pred.user_id] = (advCountMap[pred.user_id] ?? 0) + 1;
          }
        }

        const { data: awardCounts } = await supabase
          .from('award_predictions')
          .select('user_id')
          .in('user_id', userIds);

        const awardCountMap: Record<string, number> = {};
        if (awardCounts) {
          for (const pred of awardCounts) {
            awardCountMap[pred.user_id] = (awardCountMap[pred.user_id] ?? 0) + 1;
          }
        }

        setParticipants(
          data.map((p) => ({
            ...p,
            match_prediction_count: matchCountMap[p.id] ?? 0,
            advancing_prediction_count: advCountMap[p.id] ?? 0,
            award_prediction_count: awardCountMap[p.id] ?? 0,
          }))
        );
      }
      setLoading(false);
    }
    fetchParticipants();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">{t('participants.title')}</h1>
          <p className="text-sm text-gray-500">
            {t('participants.count', {
              count: participants.length,
              s: participants.length !== 1 ? 's' : '',
              s2: participants.length !== 1 ? 's' : '',
            })}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {participants.map((p) => {
            return (
              <Link
                key={p.id}
                href={`/usuarios/${p.id}`}
                className="bg-wc-card border border-wc-border rounded-xl p-4 hover:border-gold-500/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <MascotAvatar avatarUrl={p.avatar_url} displayName={p.display_name || '?'} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-200 truncate flex items-center gap-1.5">
                        <CountryFlag countryCode={p.country_code} size="sm" />
                        {p.display_name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gold-400 transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && participants.length === 0 && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-12 text-center">
          <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">{t('participants.empty')}</p>
        </div>
      )}
    </div>
  );
}
