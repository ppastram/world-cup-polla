'use client';

import {
  BookOpen,
  Trophy,
  Target,
  Star,
  Calendar,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import {
  SCORING,
  ENTRY_FEE_COP,
  NEQUI_NUMBER,
} from '@/lib/constants';
import { useTranslation } from '@/i18n';

function ScoringTable({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: React.ElementType;
  rows: { label: string; points: number }[];
}) {
  return (
    <div className="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-wc-darker border-b border-wc-border">
        <Icon className="w-4 h-4 text-gold-400" />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-wc-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-gray-300">{row.label}</span>
            <span className="text-sm font-bold text-gold-400">{row.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-wc-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-wc-card hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-medium text-gray-200">{question}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 bg-wc-darker border-t border-wc-border">
          <p className="text-sm text-gray-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function ReglasPage() {
  const { t, formatCurrency } = useTranslation();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <BookOpen className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">{t('rules.title')}</h1>
          <p className="text-sm text-gray-500">{t('rules.subtitle')}</p>
        </div>
      </div>

      <ScoringTable
        title={t('rules.matchPrediction')}
        icon={Target}
        rows={[
          { label: t('rules.exactScore'), points: SCORING.EXACT_SCORE },
          { label: t('rules.resultAndDiff'), points: SCORING.CORRECT_RESULT_AND_DIFF },
          { label: t('rules.correctResult'), points: SCORING.CORRECT_RESULT },
        ]}
      />

      <ScoringTable
        title={t('rules.advancingTeams')}
        icon={Trophy}
        rows={[
          { label: t('rules.advRound32'), points: SCORING.ROUND_32 },
          { label: t('rules.advRound16'), points: SCORING.ROUND_16 },
          { label: t('rules.advQuarter'), points: SCORING.QUARTER },
          { label: t('rules.advSemi'), points: SCORING.SEMI },
          { label: t('rules.advFinal'), points: SCORING.FINAL },
          { label: t('rules.advThirdPlace'), points: SCORING.THIRD_PLACE },
          { label: t('rules.advChampion'), points: SCORING.CHAMPION },
        ]}
      />

      <ScoringTable
        title={t('rules.individualAwards')}
        icon={Star}
        rows={[
          { label: t('rules.awardGoldenBall'), points: SCORING.GOLDEN_BALL },
          { label: t('rules.awardGoldenBoot'), points: SCORING.GOLDEN_BOOT },
          { label: t('rules.awardGoldenGlove'), points: SCORING.GOLDEN_GLOVE },
          { label: t('rules.awardBestYoung'), points: SCORING.BEST_YOUNG },
          { label: t('rules.awardGoalsExact'), points: SCORING.TOTAL_GOALS_EXACT },
          { label: t('rules.awardGoalsWithin3'), points: SCORING.TOTAL_GOALS_WITHIN_3 },
          { label: t('rules.awardGoalsWithin5'), points: SCORING.TOTAL_GOALS_WITHIN_5 },
        ]}
      />

      <div className="bg-wc-card border border-purple-500/30 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400 text-xl">🐺</span>
          {t('rules.loneWolf')}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {t('rules.loneWolfDesc')}
        </p>
      </div>

      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-400" />
          {t('rules.categoriesTitle')}
        </h3>
        <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
          <p>
            <span className="text-gold-400 font-semibold">{t('rules.category1')}</span>{' '}
            {t('rules.category1Desc')}
          </p>
          <p>
            <span className="text-gold-400 font-semibold">{t('rules.category2')}</span>{' '}
            {t('rules.category2Desc')}
          </p>
          <p>
            <span className="text-gold-400 font-semibold">{t('rules.category3')}</span>{' '}
            {t('rules.category3Desc')}
          </p>
        </div>
      </div>

      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold-400" />
          {t('rules.importantDates')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">{t('rules.deadline')}</p>
              <p className="text-sm text-gray-500">
                {t('rules.deadlineDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">{t('rules.tournamentStart')}</p>
              <p className="text-sm text-gray-500">
                {t('rules.tournamentStartDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-wc-card border border-gold-500/30 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gold-400" />
          {t('rules.prizeDistribution')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">{t('rules.1stPlace')}</span>
            </div>
            <span className="text-sm font-bold text-yellow-400">{t('rules.1stPrize')}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-400/5 rounded-lg border border-gray-400/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-300">{t('rules.2ndPlace')}</span>
            </div>
            <span className="text-sm font-bold text-gray-300">{t('rules.2ndPrize')}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-amber-700/5 rounded-lg border border-amber-700/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-500">{t('rules.3rdPlace')}</span>
            </div>
            <span className="text-sm font-bold text-amber-500">{t('rules.3rdPrize', { amount: formatCurrency(ENTRY_FEE_COP) })}</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {t('rules.remaining')}
        </p>
      </div>

      <div className="bg-wc-card border border-wc-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">{t('rules.registration')}</h3>
        <div className="flex items-center justify-between p-4 bg-wc-darker rounded-lg">
          <span className="text-sm text-gray-400">{t('rules.entryFee')}</span>
          <span className="text-xl font-bold text-gold-400">
            {formatCurrency(ENTRY_FEE_COP)}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {t('rules.paymentInstructions', { nequi: NEQUI_NUMBER })}{' '}
          <a href="/pago" className="text-gold-400 underline hover:text-gold-300">
            {t('rules.paymentLink')}
          </a>.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gold-400" />
          {t('rules.faq')}
        </h3>
        <div className="space-y-2">
          <FAQItem question={t('rules.faq1Q')} answer={t('rules.faq1A')} />
          <FAQItem question={t('rules.faq2Q')} answer={t('rules.faq2A')} />
          <FAQItem question={t('rules.faq3Q')} answer={t('rules.faq3A')} />
          <FAQItem question={t('rules.faq4Q')} answer={t('rules.faq4A')} />
          <FAQItem question={t('rules.faq5Q')} answer={t('rules.faq5A')} />
          <FAQItem question={t('rules.faq6Q')} answer={t('rules.faq6A')} />
        </div>
      </div>
    </div>
  );
}
