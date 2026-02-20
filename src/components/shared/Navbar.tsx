"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  BookOpen,
  UserCheck,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import MascotAvatar from "@/components/shared/MascotAvatar";

const mainNavItems: { href: string; labelKey: TranslationKey; icon: typeof Trophy }[] = [
  { href: "/predicciones", labelKey: "nav.predictions", icon: ClipboardList },
  { href: "/clasificacion", labelKey: "nav.leaderboard", icon: Trophy },
  { href: "/usuarios", labelKey: "nav.participants", icon: Users },
  { href: "/reglas", labelKey: "nav.rules", icon: BookOpen },
  { href: "/organizador", labelKey: "nav.organizer", icon: UserCheck },
];

const moreNavItems: { href: string; labelKey: TranslationKey; icon: typeof Trophy }[] = [
  { href: "/partidos", labelKey: "nav.matches", icon: Calendar },
  { href: "/estadisticas", labelKey: "nav.stats", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useUser();
  const { t, locale, setLocale } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [hasUnreadPosts, setHasUnreadPosts] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Check for unread blog posts
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function checkUnread() {
      const { data: latestPost } = await supabase
        .from("blog_posts")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!latestPost) {
        setHasUnreadPosts(false);
        return;
      }

      const { data: readRecord } = await supabase
        .from("blog_reads")
        .select("last_read_at")
        .eq("user_id", user!.id)
        .single();

      if (!readRecord || new Date(latestPost.created_at) > new Date(readRecord.last_read_at)) {
        setHasUnreadPosts(true);
      } else {
        setHasUnreadPosts(false);
      }
    }

    checkUnread();

    // Listen for new blog posts in real-time
    const channel = supabase
      .channel("blog_posts_changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "blog_posts" }, () => {
        setHasUnreadPosts(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) return null;
  if (!user) return null;

  const isMoreActive = moreNavItems.some((item) => pathname.startsWith(item.href));

  return (
    <nav className="bg-wc-card border-b border-wc-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/predicciones"
            className="flex items-center gap-2 text-gold-400 font-bold text-lg"
          >
            <img src="/wc-logo-minimalist.jpeg" alt="WC 2026" className="h-8 rounded-sm object-contain" />
            <span className="hidden sm:inline">{t('nav.brand')}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              const showDot = item.href === "/organizador" && hasUnreadPosts;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-gold-500/10 text-gold-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(item.labelKey)}
                  {showDot && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* "Más" dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isMoreActive
                    ? "bg-gold-500/10 text-gold-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                {t('nav.more')}
                <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 bg-wc-card border border-wc-border rounded-lg shadow-xl py-1 min-w-[180px] z-50">
                  {moreNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          active
                            ? "bg-gold-500/10 text-gold-400"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t(item.labelKey)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white px-2 py-2 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors"
              title={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-4 h-4" />
              {locale === 'es' ? 'EN' : 'ES'}
            </button>
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
              <MascotAvatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name || ''} size="sm" />
              <span className="max-w-[120px] truncate">
                {profile?.display_name || t('nav.profile')}
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
            {[...mainNavItems, ...moreNavItems].map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              const showDot = item.href === "/organizador" && hasUnreadPosts;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm ${
                    active
                      ? "bg-gold-500/10 text-gold-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {t(item.labelKey)}
                  {showDot && (
                    <span className="w-2 h-2 bg-red-500 rounded-full ml-auto" />
                  )}
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
              {t('nav.payment')}
            </Link>
            <Link
              href="/perfil"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
            >
              <User className="w-5 h-5" />
              {profile?.display_name || t('nav.profile')}
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
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 w-full"
            >
              <Globe className="w-5 h-5" />
              {locale === 'es' ? 'English' : 'Español'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-red-400 hover:bg-white/5 w-full"
            >
              <LogOut className="w-5 h-5" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
