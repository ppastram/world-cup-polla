"use client";

import Link from "next/link";
import { Trophy, Users, Target, DollarSign, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { TOURNAMENT_START, ENTRY_FEE_COP, FIXED_PRIZES } from "@/lib/constants";
import { useTranslation } from "@/i18n";

function CountdownTimer() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const distance = TOURNAMENT_START.getTime() - now;
      if (distance < 0) return;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 justify-center">
      {[
        { value: timeLeft.days, label: t("countdown.days") },
        { value: timeLeft.hours, label: t("countdown.hours") },
        { value: timeLeft.minutes, label: t("countdown.min") },
        { value: timeLeft.seconds, label: t("countdown.sec") },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="bg-wc-card border border-wc-border rounded-xl w-20 h-20 flex items-center justify-center">
            <span className="text-3xl font-bold text-yellow-300">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function PrizePoolDisplay() {
  const { t, formatCurrency } = useTranslation();

  return (
    <div className="bg-wc-card border border-gold-500/30 rounded-2xl p-8 card-glow">
      <div className="flex items-center justify-center gap-2 mb-4">
        <DollarSign className="w-6 h-6 text-gold-400" />
        <h2 className="text-2xl font-bold text-white">{t("landing.prizePool")}</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-yellow-400 font-bold text-lg">
            {formatCurrency(FIXED_PRIZES.firstPlace)}
          </p>
          <p className="text-gray-500 text-xs">{t("landing.1stPlace")}</p>
        </div>
        <div>
          <p className="text-gray-300 font-bold text-lg">
            {formatCurrency(FIXED_PRIZES.secondPlace)}
          </p>
          <p className="text-gray-500 text-xs">{t("landing.2ndPlace")}</p>
        </div>
        <div>
          <p className="text-gray-300 font-bold text-lg">
            {formatCurrency(FIXED_PRIZES.thirdPlace)}
          </p>
          <p className="text-gray-500 text-xs">{t("landing.3rdPlace")}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t, formatCurrency, locale, setLocale } = useTranslation();

  return (
    <div className="min-h-screen bg-wc-darker">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white px-3 py-2 rounded-lg text-xs font-medium bg-wc-card/80 border border-wc-border hover:border-gold-500/30 backdrop-blur-sm transition-colors"
        >
          <Globe className="w-4 h-4" />
          {locale === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center relative">
          <img
            src="/wc-logo-blue-and-green.jpeg"
            alt="FIFA World Cup 2026"
            className="mx-auto h-32 md:h-40 mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            <span className="text-gradient-gold">{t("landing.title1")}</span>{" "}
            <span className="text-white">{t("landing.title2")}</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-2xl mb-2">
            <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
          </div>
          <p className="text-xl text-gray-400 mb-2">{t("landing.tagline")}</p>

          <div className="mb-10">
            <p className="text-sm text-gray-500 mb-4">{t("landing.worldCupStartsIn")}</p>
            <CountdownTimer />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/registro"
              className="bg-gold-500 hover:bg-gold-600 text-black font-bold px-8 py-3 rounded-xl text-lg transition-colors"
            >
              {t("landing.register")}
            </Link>
            <Link
              href="/login"
              className="border border-wc-border hover:border-gold-500/50 text-white font-semibold px-8 py-3 rounded-xl text-lg transition-colors"
            >
              {t("landing.login")}
            </Link>
          </div>

          {/* Prize Pool */}
          <div className="max-w-md mx-auto">
            <PrizePoolDisplay />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: t("landing.feature1Title"),
              desc: t("landing.feature1Desc"),
            },
            {
              icon: Users,
              title: t("landing.feature2Title"),
              desc: t("landing.feature2Desc"),
            },
            {
              icon: Trophy,
              title: t("landing.feature3Title"),
              desc: t("landing.feature3Desc", { entryFee: formatCurrency(ENTRY_FEE_COP) }),
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-wc-card border border-wc-border rounded-2xl p-6 text-center"
              >
                <Icon className="w-10 h-10 text-gold-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoring preview */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-wc-card border border-wc-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {t("landing.scoringSystem")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-blue-400 font-semibold mb-3">{t("landing.matches")}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>{t("landing.exactScore")}</span>
                  <span className="text-yellow-300 font-bold">5 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("landing.resultAndDiff")}</span>
                  <span className="text-yellow-300 font-bold">3 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("landing.correctResult")}</span>
                  <span className="text-yellow-300 font-bold">2 pts</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-3">{t("landing.advancing")}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>{t("landing.champion")}</span>
                  <span className="text-yellow-300 font-bold">20 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("landing.finalists")}</span>
                  <span className="text-yellow-300 font-bold">12 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("landing.semifinalists")}</span>
                  <span className="text-yellow-300 font-bold">8 pts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-wc-border py-8 text-center">
        <img src="/wc-logo-minimalist.jpeg" alt="FIFA World Cup 2026" className="mx-auto h-16 mb-3 opacity-60" />
        <div className="flex items-center justify-center gap-4 text-xl mb-2">
          <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
        </div>
        <p className="text-gray-600 text-sm">{t("landing.footer")}</p>
      </footer>
    </div>
  );
}
