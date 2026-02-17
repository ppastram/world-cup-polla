"use client";

import Link from "next/link";
import { Trophy, Users, Target, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { TOURNAMENT_START, ENTRY_FEE_COP, calculatePrizes } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

function CountdownTimer() {
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
        { value: timeLeft.days, label: "Días" },
        { value: timeLeft.hours, label: "Horas" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Seg" },
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
  const [paidCount, setPaidCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "verified")
      .then(({ count }) => {
        if (count) setPaidCount(count);
      });
  }, []);

  const prizes = calculatePrizes(paidCount);

  return (
    <div className="bg-wc-card border border-gold-500/30 rounded-2xl p-8 card-glow">
      <div className="flex items-center justify-center gap-2 mb-4">
        <DollarSign className="w-6 h-6 text-gold-400" />
        <h2 className="text-2xl font-bold text-white">Pozo Acumulado</h2>
      </div>
      <p className="text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-yellow-300 to-green-400 bg-clip-text text-transparent">
        ${prizes.totalPool.toLocaleString("es-CO")}
      </p>
      <p className="text-gray-500 text-center text-sm mb-6">
        {prizes.paidCount} participante{prizes.paidCount !== 1 ? "s" : ""} inscrito{prizes.paidCount !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-yellow-400 font-bold text-lg">
            ${prizes.firstPlace.toLocaleString("es-CO")}
          </p>
          <p className="text-gray-500 text-xs">1er Lugar (70%)</p>
        </div>
        <div>
          <p className="text-gray-300 font-bold text-lg">
            ${prizes.secondPlace.toLocaleString("es-CO")}
          </p>
          <p className="text-gray-500 text-xs">2do Lugar (15%)</p>
        </div>
        <div>
          <p className="text-gray-300 font-bold text-lg">
            ${ENTRY_FEE_COP.toLocaleString("es-CO")}
          </p>
          <p className="text-gray-500 text-xs">3er Lugar</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-wc-darker">
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
            <span className="text-gradient-gold">Ampolla</span>{" "}
            <span className="text-white">Mundialista</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-2xl mb-2">
            <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
          </div>
          <p className="text-xl text-gray-400 mb-2">FIFA World Cup 2026</p>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto">
            Predice los resultados, elige al campeón y compite con tus amigos
            por el premio mayor.
          </p>

          <div className="mb-10">
            <p className="text-sm text-gray-500 mb-4">El Mundial comienza en</p>
            <CountdownTimer />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/registro"
              className="bg-gold-500 hover:bg-gold-600 text-black font-bold px-8 py-3 rounded-xl text-lg transition-colors"
            >
              Registrarme
            </Link>
            <Link
              href="/login"
              className="border border-wc-border hover:border-gold-500/50 text-white font-semibold px-8 py-3 rounded-xl text-lg transition-colors"
            >
              Iniciar sesión
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
              title: "Predice",
              desc: "Ingresa tus predicciones para los 48 partidos de la fase de grupos, equipos clasificados y premios individuales.",
            },
            {
              icon: Users,
              title: "Compite",
              desc: "Compara tus predicciones con tus amigos. Tabla de posiciones en tiempo real durante el mundial.",
            },
            {
              icon: Trophy,
              title: "Gana",
              desc: `El mejor predictor se lleva el 70% del pozo. Segundo lugar 15%. Tercer lugar recupera su entrada de $${ENTRY_FEE_COP.toLocaleString("es-CO")}.`,
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
            Sistema de Puntos
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-blue-400 font-semibold mb-3">Partidos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Marcador exacto</span>
                  <span className="text-yellow-300 font-bold">5 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Resultado + diferencia</span>
                  <span className="text-yellow-300 font-bold">3 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Resultado correcto</span>
                  <span className="text-yellow-300 font-bold">2 pts</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-3">Clasificados</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Campeón</span>
                  <span className="text-yellow-300 font-bold">20 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Finalistas</span>
                  <span className="text-yellow-300 font-bold">12 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Semifinalistas</span>
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
        <p className="text-gray-600 text-sm">Ampolla Mundialista 2026 — México · United States · Canada</p>
      </footer>
    </div>
  );
}
