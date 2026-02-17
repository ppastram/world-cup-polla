'use client';

import { useEffect, useState, useRef } from 'react';
import {
  CreditCard,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  FileImage,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { ENTRY_FEE_COP, NEQUI_NUMBER } from '@/lib/constants';

export default function PagoPage() {
  const { user, profile, loading: userLoading } = useUser();
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setPaymentStatus(profile.payment_status);
      setProofUrl(profile.payment_proof_url);
    }
  }, [profile]);

  async function handleCopyNequi() {
    await navigator.clipboard.writeText(NEQUI_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('El archivo es demasiado grande. Maximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setUploadError('Solo se permiten imagenes o PDFs.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/comprobante-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) {
        console.error('Storage upload error:', uploadErr);
        throw new Error(`Error subiendo archivo: ${uploadErr.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({
          payment_status: 'uploaded',
          payment_proof_url: urlData.publicUrl,
        })
        .eq('id', user.id);

      if (updateErr) {
        console.error('Profile update error:', updateErr);
        throw new Error(`Error actualizando perfil: ${updateErr.message}`);
      }

      setPaymentStatus('uploaded');
      setProofUrl(urlData.publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al subir el comprobante';
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CreditCard className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Pago</h1>
          <p className="text-sm text-gray-500">Inscripcion a la Ampolla Mundialista</p>
        </div>
      </div>

      {/* Payment Status */}
      <div className={`rounded-xl border p-4 ${
        paymentStatus === 'verified'
          ? 'bg-emerald-900/20 border-emerald-700/50'
          : paymentStatus === 'uploaded'
          ? 'bg-gold-900/20 border-gold-700/50'
          : 'bg-red-900/10 border-red-800/30'
      }`}>
        <div className="flex items-center gap-3">
          {paymentStatus === 'verified' ? (
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : paymentStatus === 'uploaded' ? (
            <Clock className="w-6 h-6 text-gold-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold text-white">
              {paymentStatus === 'verified'
                ? 'Pago verificado'
                : paymentStatus === 'uploaded'
                ? 'Comprobante en revision'
                : 'Pago pendiente'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {paymentStatus === 'verified'
                ? 'Tu pago ha sido confirmado. Estas participando oficialmente.'
                : paymentStatus === 'uploaded'
                ? 'Hemos recibido tu comprobante. Te notificaremos cuando sea verificado.'
                : 'Realiza tu pago por Nequi y sube el comprobante.'}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Info Card */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-white">Datos de pago</h2>

        {/* Nequi Number */}
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
            Numero Nequi
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-wc-darker border border-wc-border rounded-lg px-4 py-3">
              <span className="text-lg font-mono font-bold text-blue-400 tracking-wider">
                {NEQUI_NUMBER}
              </span>
            </div>
            <button
              onClick={handleCopyNequi}
              className="shrink-0 bg-wc-darker border border-wc-border rounded-lg p-3 hover:bg-wc-border transition-colors"
              title="Copiar numero"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
            Valor a pagar
          </label>
          <div className="bg-wc-darker border border-wc-border rounded-lg px-4 py-3">
            <span className="text-lg font-bold text-white">
              ${ENTRY_FEE_COP.toLocaleString('es-CO')} COP
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-wc-darker rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Instrucciones</h3>
          <ol className="text-sm text-gray-400 space-y-1.5 list-decimal list-inside">
            <li>Abre Nequi y selecciona &quot;Enviar dinero&quot;</li>
            <li>Ingresa el numero <span className="text-gold-400 font-mono">{NEQUI_NUMBER}</span></li>
            <li>Envia <span className="text-gold-400 font-semibold">${ENTRY_FEE_COP.toLocaleString('es-CO')}</span></li>
            <li>Toma captura de pantalla del comprobante</li>
            <li>Sube el comprobante aqui abajo</li>
          </ol>
        </div>
      </div>

      {/* Upload Section */}
      {paymentStatus !== 'verified' && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Subir comprobante</h2>

          {/* Existing proof preview */}
          {proofUrl && (
            <div className="bg-wc-darker rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileImage className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500">Comprobante actual</span>
              </div>
              <img
                src={proofUrl}
                alt="Comprobante de pago"
                className="w-full max-h-64 object-contain rounded-lg"
              />
            </div>
          )}

          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-wc-border rounded-xl p-8 text-center cursor-pointer hover:border-gold-500/50 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            )}
            <p className="text-sm text-gray-400">
              {uploading
                ? 'Subiendo comprobante...'
                : 'Haz clic para seleccionar tu comprobante'}
            </p>
            <p className="text-xs text-gray-600 mt-1">PNG, JPG o PDF. Maximo 5MB</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Error */}
          {uploadError && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg px-4 py-3">
              <p className="text-sm text-red-400">{uploadError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
