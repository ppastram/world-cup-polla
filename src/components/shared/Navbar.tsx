"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Trophy,
  ClipboardList,
  BarChart3,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  CreditCard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

const navItems = [
  { href: "/predicciones", label: "Predicciones", icon: ClipboardList },
  { href: "/partidos", label: "Partidos", icon: Calendar },
  { href: "/clasificacion", label: "Clasificación", icon: Trophy },
  { href: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/usuarios", label: "Participantes", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <nav className="bg-wc-card border-b border-wc-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/predicciones"
            className="flex items-center gap-2 text-gold-400 font-bold text-lg"
          >
            <img src="/wc-logo-minimalist.jpeg" alt="WC 2026" className="w-8 h-8 rounded-sm" />
            <span className="hidden sm:inline">Polla Mundialista</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
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
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {profile?.is_admin && (
              <Link
                href="/admin/resultados"
                className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/perfil"
              className="text-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="max-w-[120px] truncate">
                {profile?.display_name || "Perfil"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-wc-border bg-wc-card">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm ${
                    active
                      ? "bg-gold-500/10 text-gold-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <hr className="border-wc-border my-2" />
            <Link
              href="/pago"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
            >
              <CreditCard className="w-5 h-5" />
              Pago
            </Link>
            <Link
              href="/perfil"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
            >
              <User className="w-5 h-5" />
              {profile?.display_name || "Perfil"}
            </Link>
            {profile?.is_admin && (
              <Link
                href="/admin/resultados"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
              >
                <Settings className="w-5 h-5" />
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-red-400 hover:bg-white/5 w-full"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
