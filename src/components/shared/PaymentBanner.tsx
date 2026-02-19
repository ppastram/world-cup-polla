'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { ENTRY_FEE_COP } from '@/lib/constants';

interface PaymentBannerProps {
  paymentStatus: string;
}

export default function PaymentBanner({ paymentStatus }: PaymentBannerProps) {
  const { t, formatCurrency } = useTranslation();

  if (paymentStatus === 'verified') {
    return (
      <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg px-4 py-3 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-300">
          {t("paymentBanner.verified")}
        </p>
      </div>
    );
  }

  if (paymentStatus === 'uploaded') {
    return (
      <div className="bg-gold-900/30 border border-gold-700/50 rounded-lg px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-gold-400 shrink-0" />
        <p className="text-sm text-gold-300">
          {t("paymentBanner.uploaded")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <p className="text-sm text-amber-200">
          {t("paymentBanner.pending", { amount: formatCurrency(ENTRY_FEE_COP) })}
        </p>
      </div>
      <Link
        href="/pago"
        className="shrink-0 bg-gold-500 hover:bg-gold-600 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
      >
        {t("paymentBanner.pay")}
      </Link>
    </div>
  );
}
