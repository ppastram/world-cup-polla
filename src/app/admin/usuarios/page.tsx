"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export default function AdminUsuariosPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("display_name");
    if (data) setProfiles(data);
    setLoading(false);
  }

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    setUpdating(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({ is_admin: !isAdmin }).eq("id", userId);
    await fetchProfiles();
    setUpdating(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Usuarios ({profiles.length})
      </h1>

      <div className="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wc-border">
              <th className="text-left text-xs text-gray-500 px-4 py-3">Nombre</th>
              <th className="text-left text-xs text-gray-500 px-4 py-3">Pago</th>
              <th className="text-left text-xs text-gray-500 px-4 py-3">Admin</th>
              <th className="text-left text-xs text-gray-500 px-4 py-3">Registro</th>
              <th className="text-right text-xs text-gray-500 px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-wc-border/50 last:border-0">
                <td className="px-4 py-3 text-sm text-white">{p.display_name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.payment_status === "verified"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : p.payment_status === "uploaded"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {p.payment_status === "verified" ? "Verificado" : p.payment_status === "uploaded" ? "Subido" : "Pendiente"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.is_admin && (
                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(p.created_at).toLocaleDateString("es-CO")}
                </td>
                <td className="px-4 py-3 text-right">
                  {updating === p.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-auto" />
                  ) : (
                    <button
                      onClick={() => toggleAdmin(p.id, p.is_admin)}
                      className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ml-auto ${
                        p.is_admin
                          ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          : "bg-gold-500/10 text-gold-400 hover:bg-gold-500/20"
                      }`}
                    >
                      {p.is_admin ? (
                        <>
                          <ShieldOff className="w-3 h-3" />
                          Quitar Admin
                        </>
                      ) : (
                        <>
                          <Shield className="w-3 h-3" />
                          Hacer Admin
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
