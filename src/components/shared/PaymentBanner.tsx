'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface PaymentBannerProps {
  paymentStatus: string;
}

export default function PaymentBanner({ paymentStatus }: PaymentBannerProps) {
  if (paymentStatus === 'verified') {
    return (
      <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg px-4 py-3 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-300">
          Pago verificado. Estas participando en la polla.
        </p>
      </div>
    );
  }

  if (paymentStatus === 'uploaded') {
    return (
      <div className="bg-gold-900/30 border border-gold-700/50 rounded-lg px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-gold-400 shrink-0" />
        <p className="text-sm text-gold-300">
          Tu comprobante de pago esta en revision. Te notificaremos cuando sea verificado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        <p className="text-sm text-amber-200">
          Recuerda realizar tu pago de <span className="font-bold text-gold-400">$300.000 COP</span> para participar
        </p>
      </div>
      <Link
        href="/pago"
        className="shrink-0 bg-gold-500 hover:bg-gold-600 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Pagar
      </Link>
    </div>
  );
}
