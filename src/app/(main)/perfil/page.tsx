'use client';

import { useEffect, useState } from 'react';
import { User, Mail, CheckCircle, Clock, AlertTriangle, Save, Loader2, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import MascotAvatar from '@/components/shared/MascotAvatar';
import MascotSelector from '@/components/shared/MascotSelector';
import Link from 'next/link';

export default function PerfilPage() {
  const { user, profile, loading: userLoading } = useUser();
  const [displayName, setDisplayName] = useState('');
  const [selectedMascot, setSelectedMascot] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [predictionStats, setPredictionStats] = useState({
    matchPredictions: 0,
    totalMatches: 0,
    advancingPredictions: 0,
    awardPredictions: 0,
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setSelectedMascot(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      const supabase = createClient();

      const [matchPredRes, matchTotalRes, advRes, awardRes] = await Promise.all([
        supabase
          .from('match_predictions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user!.id),
        supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .eq('stage', 'group'),
        supabase
          .from('advancing_predictions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user!.id),
        supabase
          .from('award_predictions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user!.id),
      ]);

      setPredictionStats({
        matchPredictions: matchPredRes.count ?? 0,
        totalMatches: matchTotalRes.count ?? 0,
        advancingPredictions: advRes.count ?? 0,
        awardPredictions: awardRes.count ?? 0,
      });
    }

    fetchStats();
  }, [user]);

  async function handleSave() {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ display_name: displayName.trim(), avatar_url: selectedMascot })
      .eq('id', user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  if (!profile || !user) return null;

  const statusConfig = {
    verified: {
      label: 'Verificado',
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-900/20 border-emerald-700/50',
    },
    uploaded: {
      label: 'En revision',
      icon: Clock,
      color: 'text-gold-400 bg-gold-900/20 border-gold-700/50',
    },
    pending: {
      label: 'Pendiente',
      icon: AlertTriangle,
      color: 'text-red-400 bg-red-900/20 border-red-800/30',
    },
  };

  const status = statusConfig[profile.payment_status] ?? statusConfig.pending;
  const StatusIcon = status.icon;

  const matchPct =
    predictionStats.totalMatches > 0
      ? Math.round((predictionStats.matchPredictions / predictionStats.totalMatches) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          <p className="text-sm text-gray-500">Administra tu cuenta</p>
        </div>
      </div>

      {/* Avatar + Name */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <MascotAvatar avatarUrl={selectedMascot} displayName={profile.display_name} size="lg" />
          <div>
            <p className="text-lg font-bold text-white">{profile.display_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Edit Display Name */}
        <div className="space-y-3">
          <label className="text-xs text-gray-500 uppercase tracking-wider block">
            Nombre para mostrar
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
              className="flex-1 bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors"
              placeholder="Tu nombre"
            />
            <button
              onClick={handleSave}
              disabled={saving || !displayName.trim()}
              className="shrink-0 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? 'Guardado' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Mascot Selection */}
        <div className="mt-4">
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-3">
            Avatar (mascota mundialista)
          </label>
          <MascotSelector selected={selectedMascot} onSelect={setSelectedMascot} />
        </div>

        {/* Email (read-only) */}
        <div className="mt-4">
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
            Correo electronico
          </label>
          <div className="flex items-center gap-2 bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-400">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className={`rounded-xl border p-4 ${status.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Estado de pago: {status.label}</p>
            </div>
          </div>
          {profile.payment_status !== 'verified' && (
            <Link
              href="/pago"
              className="text-xs font-semibold bg-gold-500 text-black px-3 py-1.5 rounded-lg hover:bg-gold-600 transition-colors"
            >
              Ir a pago
            </Link>
          )}
        </div>
      </div>

      {/* Prediction Stats */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-400" />
          Progreso de Predicciones
        </h3>

        <div className="space-y-3">
          {/* Match predictions */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-400">Partidos</span>
              <span className="text-gray-300 font-medium">
                {predictionStats.matchPredictions}/{predictionStats.totalMatches}
              </span>
            </div>
            <div className="h-2 bg-wc-darker rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full transition-all duration-500"
                style={{ width: `${matchPct}%` }}
              />
            </div>
          </div>

          {/* Advancing predictions */}
          <div className="flex items-center justify-between p-3 bg-wc-darker rounded-lg">
            <span className="text-sm text-gray-400">Equipos clasificados</span>
            <span className="text-sm font-bold text-gold-400">
              {predictionStats.advancingPredictions} selecciones
            </span>
          </div>

          {/* Award predictions */}
          <div className="flex items-center justify-between p-3 bg-wc-darker rounded-lg">
            <span className="text-sm text-gray-400">Premios individuales</span>
            <span className="text-sm font-bold text-gold-400">
              {predictionStats.awardPredictions}/5
            </span>
          </div>
        </div>

        <Link
          href="/predicciones"
          className="block w-full text-center bg-wc-darker border border-wc-border hover:border-gold-500/50 text-gold-400 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          Ir a predicciones
        </Link>
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
