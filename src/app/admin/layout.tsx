"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText, CreditCard, Users, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const adminNav = [
  { href: "/admin/resultados", label: "Resultados", icon: FileText },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) {
        router.push("/predicciones");
        return;
      }
      setAuthorized(true);
    });
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-wc-darker flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Verificando permisos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wc-darker">
      <nav className="bg-wc-card border-b border-wc-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/predicciones" className="flex items-center gap-2 text-gold-400 font-bold">
                <img src="/wc-logo-minimalist.jpeg" alt="WC 2026" className="w-7 h-7 rounded-sm" />
                <span className="hidden sm:inline">Polla Mundialista</span>
              </Link>
              <div className="flex items-center gap-1 bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                <Shield className="w-3 h-3" />
                Admin
              </div>
            </div>
            <div className="flex items-center gap-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-gold-500/10 text-gold-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
