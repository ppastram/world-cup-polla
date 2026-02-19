'use client';

import { useEffect, useState } from 'react';
import { User, Mail, CheckCircle, Clock, AlertTriangle, Save, Loader2, Target, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import MascotAvatar from '@/components/shared/MascotAvatar';
import MascotSelector from '@/components/shared/MascotSelector';
import CountrySelector from '@/components/shared/CountrySelector';
import CountryFlag from '@/components/shared/CountryFlag';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import type { UserAchievement } from '@/lib/types';

export default function PerfilPage() {
  const { user, profile, loading: userLoading } = useUser();
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [selectedMascot, setSelectedMascot] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [predictionStats, setPredictionStats] = useState({
    matchPredictions: 0,
    totalMatches: 0,
    advancingPredictions: 0,
    awardPredictions: 0,
  });
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setSelectedMascot(profile.avatar_url);
      setCountryCode(profile.country_code);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      const supabase = createClient();

      const [matchPredRes, matchTotalRes, advRes, awardRes, achievementsRes] = await Promise.all([
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
        supabase
          .from('user_achievements')
          .select('*, achievement:achievements(*)')
          .eq('user_id', user!.id),
      ]);

      setPredictionStats({
        matchPredictions: matchPredRes.count ?? 0,
        totalMatches: matchTotalRes.count ?? 0,
        advancingPredictions: advRes.count ?? 0,
        awardPredictions: awardRes.count ?? 0,
      });

      if (achievementsRes.data) {
        setAchievements(achievementsRes.data as UserAchievement[]);
      }
    }

    fetchStats();
  }, [user]);

  async function handleSave() {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ display_name: displayName.trim(), avatar_url: selectedMascot, country_code: countryCode })
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
      label: t('profile.statusVerified'),
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-900/20 border-emerald-700/50',
    },
    uploaded: {
      label: t('profile.statusUploaded'),
      icon: Clock,
      color: 'text-gold-400 bg-gold-900/20 border-gold-700/50',
    },
    pending: {
      label: t('profile.statusPending'),
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
      <div className="flex items-center gap-3">
        <User className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">{t('profile.title')}</h1>
          <p className="text-sm text-gray-500">{t('profile.subtitle')}</p>
        </div>
      </div>

      <div className="bg-wc-card border border-wc-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <MascotAvatar avatarUrl={selectedMascot} displayName={profile.display_name} size="lg" />
          <div>
            <p className="text-lg font-bold text-white flex items-center gap-2">
              <CountryFlag countryCode={profile.country_code} size="md" />
              {profile.display_name}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs text-gray-500 uppercase tracking-wider block">
            {t('profile.displayName')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
              className="flex-1 bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors"
              placeholder={t('profile.namePlaceholder')}
            />
            <button
              onClick={handleSave}
              disabled={saving || !displayName.trim()}
              className="shrink-0 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? t('profile.saved') : t('profile.save')}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-3">
            {t('profile.avatar')}
          </label>
          <MascotSelector selected={selectedMascot} onSelect={setSelectedMascot} />
        </div>

        <div className="mt-4">
          <CountrySelector value={countryCode} onChange={setCountryCode} label={t('profile.country')} />
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
            {t('profile.email')}
          </label>
          <div className="flex items-center gap-2 bg-wc-darker border border-wc-border rounded-lg px-4 py-2.5">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-400">{user.email}</span>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border p-4 ${status.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{t('profile.paymentStatus')} {status.label}</p>
            </div>
          </div>
          {profile.payment_status !== 'verified' && (
            <Link
              href="/pago"
              className="text-xs font-semibold bg-gold-500 text-black px-3 py-1.5 rounded-lg hover:bg-gold-600 transition-colors"
            >
              {t('profile.goToPayment')}
            </Link>
          )}
        </div>
      </div>

      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-gold-400" />
          {t('profile.achievements')}
        </h3>
        {achievements.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t('profile.noAchievements')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ua) => (
              <div
                key={ua.id}
                className="flex items-center gap-3 p-3 bg-wc-darker rounded-lg border border-gold-500/20"
              >
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-gold-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {ua.achievement?.name || t('profile.achievement')}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {ua.achievement?.description || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-400" />
          {t('profile.predictionProgress')}
        </h3>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-400">{t('profile.matchesLabel')}</span>
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

          <div className="flex items-center justify-between p-3 bg-wc-darker rounded-lg">
            <span className="text-sm text-gray-400">{t('profile.advancingLabel')}</span>
            <span className="text-sm font-bold text-gold-400">
              {t('profile.advancingSelections', { count: predictionStats.advancingPredictions })}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-wc-darker rounded-lg">
            <span className="text-sm text-gray-400">{t('profile.awardsLabel')}</span>
            <span className="text-sm font-bold text-gold-400">
              {predictionStats.awardPredictions}/5
            </span>
          </div>
        </div>

        <Link
          href="/predicciones"
          className="block w-full text-center bg-wc-darker border border-wc-border hover:border-gold-500/50 text-gold-400 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          {t('profile.goToPredictions')}
        </Link>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
