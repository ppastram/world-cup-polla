"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Eye, Loader2, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { calculatePrizes } from "@/lib/constants";

export default function AdminPagosPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProfiles(data);
    setLoading(false);
  }

  async function updatePaymentStatus(userId: string, status: string) {
    setUpdating(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({ payment_status: status }).eq("id", userId);
    await fetchProfiles();
    setUpdating(null);
  }

  const verified = profiles.filter((p) => p.payment_status === "verified").length;
  const uploaded = profiles.filter((p) => p.payment_status === "uploaded").length;
  const pending = profiles.filter((p) => p.payment_status === "pending").length;
  const prizes = calculatePrizes(verified);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Gestión de Pagos</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-wc-card border border-wc-border rounded-xl p-4 text-center">
          <DollarSign className="w-6 h-6 text-gold-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gradient-gold">${prizes.totalPool.toLocaleString("es-CO")}</p>
          <p className="text-xs text-gray-500">Pozo Total</p>
        </div>
        <div className="bg-wc-card border border-emerald-500/30 rounded-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-400">{verified}</p>
          <p className="text-xs text-gray-500">Verificados</p>
        </div>
        <div className="bg-wc-card border border-yellow-500/30 rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-400">{uploaded}</p>
          <p className="text-xs text-gray-500">Por Verificar</p>
        </div>
        <div className="bg-wc-card border border-red-500/30 rounded-xl p-4 text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-400">{pending}</p>
          <p className="text-xs text-gray-500">Pendientes</p>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wc-border">
              <th className="text-left text-xs text-gray-500 px-4 py-3">Nombre</th>
              <th className="text-left text-xs text-gray-500 px-4 py-3">Estado</th>
              <th className="text-left text-xs text-gray-500 px-4 py-3">Comprobante</th>
              <th className="text-right text-xs text-gray-500 px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-wc-border/50 last:border-0">
                <td className="px-4 py-3">
                  <p className="text-sm text-white">{profile.display_name}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      profile.payment_status === "verified"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : profile.payment_status === "uploaded"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {profile.payment_status === "verified" && <CheckCircle className="w-3 h-3" />}
                    {profile.payment_status === "uploaded" && <Clock className="w-3 h-3" />}
                    {profile.payment_status === "pending" && <XCircle className="w-3 h-3" />}
                    {profile.payment_status === "verified"
                      ? "Verificado"
                      : profile.payment_status === "uploaded"
                      ? "Subido"
                      : "Pendiente"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {profile.payment_proof_url ? (
                    <button
                      onClick={() => setPreviewUrl(profile.payment_proof_url)}
                      className="text-gold-400 hover:text-gold-300 text-sm flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Ver
                    </button>
                  ) : (
                    <span className="text-gray-600 text-sm">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    {updating === profile.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <>
                        {profile.payment_status !== "verified" && (
                          <button
                            onClick={() => updatePaymentStatus(profile.id, "verified")}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition-colors"
                          >
                            Verificar
                          </button>
                        )}
                        {profile.payment_status === "verified" && (
                          <button
                            onClick={() => updatePaymentStatus(profile.id, "pending")}
                            className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1 rounded transition-colors"
                          >
                            Revertir
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="max-w-lg w-full">
            <img src={previewUrl} alt="Comprobante de pago" className="w-full rounded-xl" />
            <p className="text-center text-gray-400 text-sm mt-4">
              Haz clic para cerrar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
