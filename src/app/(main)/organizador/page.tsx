'use client';

import { UserCheck, Phone, Mail } from 'lucide-react';

export default function OrganizadorPage() {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UserCheck className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Organizador</h1>
          <p className="text-sm text-gray-500">Polla Mundialista 2026</p>
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-wc-card border border-wc-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-wc-darker border-2 border-gold-500/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-gold-400">PP</span>
          </div>
          <div>
            <p className="text-lg font-bold text-white">Pablo Pastrana</p>
            <p className="text-sm text-gray-500">Organizador oficial</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          Soy el organizador de esta polla mundialista. Me encargo de administrar los pagos,
          verificar las inscripciones y asegurar que todo funcione correctamente. Si tienes
          alguna duda sobre tu inscripcion, el pago o cualquier aspecto de la polla, no dudes
          en contactarme.
        </p>

        {/* Contact Info */}
        <div className="space-y-3 pt-2">
          <a
            href="tel:3163235264"
            className="flex items-center gap-3 p-3 bg-wc-darker rounded-lg border border-wc-border hover:border-gold-500/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefono / WhatsApp</p>
              <p className="text-sm font-medium text-gray-200 group-hover:text-gold-400 transition-colors">
                316 323 5264
              </p>
            </div>
          </a>

          <a
            href="mailto:ppastram@hotmail.com"
            className="flex items-center gap-3 p-3 bg-wc-darker rounded-lg border border-wc-border hover:border-gold-500/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Correo electronico</p>
              <p className="text-sm font-medium text-gray-200 group-hover:text-gold-400 transition-colors">
                ppastram@hotmail.com
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
