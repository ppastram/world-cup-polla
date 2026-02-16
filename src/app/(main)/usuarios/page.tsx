'use client';

import { useEffect, useState } from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

const statusConfig: Record<string, { label: string; icon: React.ElementType; badgeClass: string }> = {
  verified: {
    label: 'Verificado',
    icon: CheckCircle,
    badgeClass: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50',
  },
  uploaded: {
    label: 'En revision',
    icon: Clock,
    badgeClass: 'text-gold-400 bg-gold-900/30 border-gold-700/50',
  },
  pending: {
    label: 'Pendiente',
    icon: AlertTriangle,
    badgeClass: 'text-red-400 bg-red-900/30 border-red-800/30',
  },
};

interface ParticipantWithStats extends Profile {
  match_prediction_count?: number;
}

export default function UsuariosPage() {
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
        // Fetch prediction counts
        const userIds = data.map((p) => p.id);
        const { data: predCounts } = await supabase
          .from('match_predictions')
          .select('user_id')
          .in('user_id', userIds);

        const countMap: Record<string, number> = {};
        if (predCounts) {
          for (const pred of predCounts) {
            countMap[pred.user_id] = (countMap[pred.user_id] ?? 0) + 1;
          }
        }

        setParticipants(
          data.map((p) => ({
            ...p,
            match_prediction_count: countMap[p.id] ?? 0,
          }))
        );
      }
      setLoading(false);
    }
    fetchParticipants();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Participantes</h1>
          <p className="text-sm text-gray-500">
            {participants.length} persona{participants.length !== 1 ? 's' : ''} registrada{participants.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
        </div>
      )}

      {/* Participants Grid */}
      {!loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {participants.map((p) => {
            const config = statusConfig[p.payment_status] ?? statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <Link
                key={p.id}
                href={`/usuarios/${p.id}`}
                className="bg-wc-card border border-wc-border rounded-xl p-4 hover:border-gold-500/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-wc-darker border border-wc-border flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-gray-400">
                        {(p.display_name || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-200 truncate">
                        {p.display_name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gold-400 transition-colors shrink-0 mt-1" />
                </div>

                <div className="flex items-center justify-between">
                  {/* Payment badge */}
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${config.badgeClass}`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </div>

                  {/* Prediction indicator */}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      (p.match_prediction_count ?? 0) > 0 ? 'bg-emerald-500' : 'bg-gray-700'
                    }`} />
                    <span className="text-xs text-gray-500">
                      {(p.match_prediction_count ?? 0) > 0 ? 'Con predicciones' : 'Sin predicciones'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && participants.length === 0 && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-12 text-center">
          <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">Aun no hay participantes registrados.</p>
        </div>
      )}
    </div>
  );
}
