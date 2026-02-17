"use client";

import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────
const COUNTDOWN = { days: 115, hours: 8, minutes: 32, seconds: 45 };
const PRIZE_POOL = "$3,000,000 COP";

const MATCHES = [
  { id: 1, teamA: "MEX", teamB: "RSA", flagA: "🇲🇽", flagB: "🇿🇦", scoreA: 1, scoreB: 1, group: "Grupo A", date: "Jun 11" },
  { id: 2, teamA: "BRA", teamB: "GER", flagA: "🇧🇷", flagB: "🇩🇪", scoreA: 3, scoreB: 1, group: "Grupo E", date: "Jun 13" },
  { id: 3, teamA: "ARG", teamB: "FRA", flagA: "🇦🇷", flagB: "🇫🇷", scoreA: 2, scoreB: 2, group: "Grupo C", date: "Jun 15" },
];

const LEADERBOARD = [
  { rank: 1, name: "Carlos M.", points: 42 },
  { rank: 2, name: "María G.", points: 39 },
  { rank: 3, name: "Andrés P.", points: 36 },
  { rank: 4, name: "Valentina R.", points: 34 },
  { rank: 5, name: "Santiago L.", points: 31 },
];

const FEATURES = [
  { title: "Predice", desc: "Pronostica los resultados de cada partido del Mundial 2026" },
  { title: "Compite", desc: "Enfréntate contra amigos y demuestra quién sabe más de fútbol" },
  { title: "Gana", desc: "Acumula puntos y llévate el pozo de premios" },
];

const THEMES = [
  { id: "fiesta", name: "Fiesta", desc: "Carnival / Latin Party" },
  { id: "estadio", name: "Estadio", desc: "Stadium / Light" },
  { id: "retro", name: "Retro Legends", desc: "Vintage / Classic WC" },
  { id: "tropical", name: "Tropical", desc: "Vibrant / Fresh" },
  { id: "neon", name: "Neón", desc: "Electric / Modern" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

// ── Images ─────────────────────────────────────────────────────────────
const IMG = {
  trophy: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
  stadium: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80",
  stadiumField: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1400&q=80",
  vintage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80",
  ball: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&q=80",
  wc2026Logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/2026_FIFA_World_Cup_emblem.svg/480px-2026_FIFA_World_Cup_emblem.svg.png",
};

const HOST_CITIES = [
  { country: "🇲🇽 México", cities: "CDMX · Guadalajara · Monterrey" },
  { country: "🇺🇸 USA", cities: "New York · LA · Miami · Dallas · Houston · Atlanta · Seattle · SF · Philadelphia · Kansas City · Boston" },
  { country: "🇨🇦 Canadá", cities: "Toronto · Vancouver" },
];

// ═══════════════════════════════════════════════════════════════════════
// THEME 1: FIESTA
// ═══════════════════════════════════════════════════════════════════════
function FiestaTheme() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-blue-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={IMG.stadium} alt="Stadium" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-blue-900/90" />
        <div className="relative z-10 text-center py-24 px-4">
          <img
            src="/wc-logo-blue-and-green.jpeg"
            alt="FIFA World Cup 2026"
            className="mx-auto h-32 md:h-40 mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-400 via-yellow-300 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Ampolla Mundialista 2026
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4 text-2xl">
            <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
          </div>
          <p className="mt-4 text-xl text-green-200 max-w-2xl mx-auto">
            ¡Vive la fiesta del fútbol! Predice, compite y gana con tus amigos.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-green-400 to-yellow-300 text-green-900 font-bold text-lg shadow-lg shadow-green-500/30 hover:scale-105 transition-transform">
              ¡Únete ahora!
            </button>
            <button className="px-8 py-3 rounded-full border-2 border-blue-400 text-blue-300 font-bold text-lg hover:bg-blue-400/10 transition-colors">
              Ver reglas
            </button>
          </div>
        </div>
      </section>

      {/* Host Cities */}
      <section className="bg-gradient-to-r from-green-700 via-emerald-600 to-blue-700 py-5 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 text-center text-white">
          {HOST_CITIES.map((h) => (
            <div key={h.country}>
              <div className="text-lg font-bold">{h.country}</div>
              <div className="text-green-200 text-xs mt-1 leading-relaxed">{h.cities}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Countdown */}
      <section className="py-12 px-4">
        <h2 className="text-center text-2xl font-bold text-yellow-300 mb-6">Faltan para el Mundial</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          {Object.entries(COUNTDOWN).map(([label, value]) => (
            <div key={label} className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur border border-green-400/30 rounded-2xl p-4 w-24 text-center shadow-lg shadow-green-500/10 hover:scale-110 transition-transform">
              <div className="text-4xl font-black text-yellow-300">{value}</div>
              <div className="text-xs uppercase text-green-300 mt-1">{label === "days" ? "días" : label === "hours" ? "horas" : label === "minutes" ? "min" : "seg"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-8 px-4 text-center">
        <div className="inline-block bg-gradient-to-r from-green-500/20 via-blue-500/20 to-green-500/20 backdrop-blur border border-yellow-400/30 rounded-3xl px-12 py-8 shadow-xl">
          <p className="text-sm uppercase tracking-widest text-green-300">Pozo de premios</p>
          <p className="text-5xl font-black bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent mt-2">{PRIZE_POOL}</p>
        </div>
      </section>

      {/* Match Cards */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-blue-300 mb-8">Partidos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {MATCHES.map((m) => (
            <div key={m.id} className="bg-white/5 backdrop-blur-xl border border-green-400/20 rounded-3xl p-6 text-center shadow-lg hover:shadow-green-400/20 hover:border-yellow-400/40 transition-all">
              <div className="text-xs text-blue-300 font-semibold mb-1">{m.group} · {m.date}</div>
              <div className="flex items-center justify-center gap-4 my-4">
                <div>
                  <span className="text-4xl">{m.flagA}</span>
                  <div className="text-sm font-bold mt-1">{m.teamA}</div>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-yellow-300 text-green-900 font-black text-xl px-4 py-2 rounded-full shadow-lg">
                  {m.scoreA} - {m.scoreB}
                </div>
                <div>
                  <span className="text-4xl">{m.flagB}</span>
                  <div className="text-sm font-bold mt-1">{m.teamB}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stadium divider */}
      <section className="relative h-48 md:h-56 overflow-hidden my-4">
        <img src={IMG.stadiumField} alt="Stadium field" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-transparent to-green-900" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-green-900/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg text-center border border-green-400/20">
            <div className="text-3xl">🇲🇽 🇺🇸 🇨🇦</div>
            <p className="text-sm font-bold text-green-200 mt-1">16 sedes · 3 países · 1 campeón</p>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-12 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-2xl font-bold text-yellow-300 mb-6">Tabla de Posiciones</h2>
        <div className="bg-white/5 backdrop-blur-xl border border-green-400/20 rounded-3xl overflow-hidden">
          {LEADERBOARD.map((p, i) => (
            <div key={p.rank} className={`flex items-center justify-between px-6 py-4 ${i < LEADERBOARD.length - 1 ? "border-b border-green-500/20" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-black ${p.rank <= 3 ? "text-yellow-300" : "text-green-400"}`}>#{p.rank}</span>
                <span className="font-semibold">{p.name}</span>
              </div>
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-bold">{p.points} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur border border-green-400/20 rounded-3xl p-8 text-center hover:scale-105 transition-transform">
              <h3 className="text-2xl font-black bg-gradient-to-r from-yellow-300 to-green-400 bg-clip-text text-transparent">{f.title}</h3>
              <p className="mt-3 text-green-200 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="bg-green-950 py-8 px-4 text-center">
        <img src="/wc-logo-blue-and-green.jpeg" alt="FIFA World Cup 2026" className="mx-auto h-20 mb-3" />
        <div className="flex items-center justify-center gap-4 text-2xl mb-2">
          <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
        </div>
        <p className="text-green-400 text-sm">FIFA World Cup 2026 · México · United States · Canada</p>
        <p className="text-green-700 text-xs mt-2">Ampolla Mundialista — Predice, Compite, Gana</p>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// THEME 2: ESTADIO (Light theme with host country references)
// ═══════════════════════════════════════════════════════════════════════
function EstadioTheme() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <img src={IMG.stadium} alt="Stadium panorama" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white" />
        <div className="relative z-10 text-center py-20 px-4">
          {/* Official WC 2026 Logo */}
          <img
            src={IMG.wc2026Logo}
            alt="FIFA World Cup 2026"
            className="mx-auto h-28 md:h-36 mb-6 drop-shadow-md"
          />
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900">
            POLLA MUNDIALISTA
          </h1>
          <p className="text-lg font-bold text-emerald-700 mt-2 tracking-wide">FIFA World Cup 2026</p>

          {/* Host countries banner */}
          <div className="flex items-center justify-center gap-3 mt-5 text-2xl">
            <span>🇲🇽</span>
            <span>🇺🇸</span>
            <span>🇨🇦</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 font-medium">México · United States · Canada</p>

          <p className="mt-5 text-base text-gray-600 max-w-xl mx-auto">
            Siente la emoción del estadio. Predice cada resultado como si estuvieras en la tribuna.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg shadow-emerald-600/20">
              Entrar al Estadio
            </button>
            <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-lg hover:bg-gray-50 transition-colors">
              Reglamento
            </button>
          </div>
        </div>
      </section>

      {/* Host Cities Strip */}
      <section className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 py-5 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 text-center text-white">
          {HOST_CITIES.map((h) => (
            <div key={h.country}>
              <div className="text-lg font-bold">{h.country}</div>
              <div className="text-emerald-200 text-xs mt-1 leading-relaxed">{h.cities}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Countdown - LED scoreboard */}
      <section className="py-14 px-4 bg-slate-50">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-emerald-700 font-bold mb-6">Cuenta Regresiva</h2>
        <div className="flex gap-3 justify-center flex-wrap">
          {Object.entries(COUNTDOWN).map(([label, value]) => (
            <div key={label} className="bg-gray-900 rounded-lg px-5 py-4 text-center min-w-[80px] shadow-lg">
              <div className="text-4xl font-mono font-bold text-emerald-400 tracking-wider" style={{ textShadow: "0 0 20px rgba(16,185,129,0.4)" }}>
                {String(value).padStart(2, "0")}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">{label === "days" ? "días" : label === "hours" ? "hrs" : label === "minutes" ? "min" : "seg"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-10 px-4 text-center bg-white">
        <div className="inline-block bg-gradient-to-br from-slate-50 to-emerald-50 border-2 border-emerald-200 rounded-2xl px-12 py-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 font-bold">Premio Total</p>
          <p className="text-5xl font-black text-gray-900 mt-2">{PRIZE_POOL}</p>
        </div>
      </section>

      {/* Match Cards - TV broadcast style on light bg */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-emerald-700 font-bold mb-8">Partidos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {MATCHES.map((m) => (
            <div key={m.id} className="bg-white border border-gray-200 border-l-4 border-l-emerald-500 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-mono">{m.group}</span>
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse">Live</span>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{m.flagA}</span>
                      <span className="font-bold text-sm text-gray-800">{m.teamA}</span>
                    </div>
                    <span className="text-2xl font-mono font-bold text-emerald-600">{m.scoreA}</span>
                  </div>
                  <div className="border-t border-gray-100" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{m.flagB}</span>
                      <span className="font-bold text-sm text-gray-800">{m.teamB}</span>
                    </div>
                    <span className="text-2xl font-mono font-bold text-emerald-600">{m.scoreB}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-3 font-mono">{m.date} · 20:00</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stadium panorama divider */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        <img src={IMG.stadiumField} alt="Stadium field" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center bg-white/90 backdrop-blur rounded-2xl px-8 py-4 shadow-lg">
            <div className="text-3xl">🇲🇽 🇺🇸 🇨🇦</div>
            <p className="text-sm font-bold text-gray-700 mt-1">16 sedes · 3 países · 1 campeón</p>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-14 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-emerald-700 font-bold mb-6">Clasificación</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[40px_1fr_60px] bg-slate-50 px-4 py-2.5 text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100">
            <span>#</span><span>Jugador</span><span className="text-right">Pts</span>
          </div>
          {LEADERBOARD.map((p, i) => (
            <div key={p.rank} className={`grid grid-cols-[40px_1fr_60px] px-4 py-3 items-center ${i < LEADERBOARD.length - 1 ? "border-b border-gray-100" : ""} ${p.rank === 1 ? "bg-emerald-50" : ""}`}>
              <span className={`font-mono font-bold text-sm ${p.rank === 1 ? "text-amber-500" : p.rank <= 3 ? "text-emerald-600" : "text-gray-400"}`}>{p.rank}</span>
              <span className="font-semibold text-sm text-gray-800">{p.name}</span>
              <span className="text-right font-mono font-bold text-emerald-600 text-sm">{p.points}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:border-emerald-300 hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-emerald-700">{f.title}</h3>
              <p className="mt-3 text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer strip with host countries */}
      <section className="bg-gray-900 text-white py-8 px-4 text-center">
        <img src={IMG.wc2026Logo} alt="FIFA World Cup 2026" className="mx-auto h-16 mb-4 brightness-200" />
        <div className="flex items-center justify-center gap-4 text-2xl mb-2">
          <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
        </div>
        <p className="text-gray-400 text-sm">FIFA World Cup 2026 · México · United States · Canada</p>
        <p className="text-gray-600 text-xs mt-2">Ampolla Mundialista — Predice, Compite, Gana</p>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// THEME 3: RETRO LEGENDS
// ═══════════════════════════════════════════════════════════════════════
function RetroTheme() {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-900" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h40v40H0z\" fill=\"none\"/%3E%3Cpath d=\"M0 0h1v1H0z\" fill=\"%23d4a574\" fill-opacity=\"0.07\"/%3E%3C/svg%3E')" }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={IMG.vintage} alt="Vintage football" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 to-amber-50" />
        <div className="relative z-10 text-center py-24 px-4">
          <div className="inline-block border-2 border-red-800 px-6 py-1 rounded-full text-red-800 text-xs font-bold uppercase tracking-[0.3em] mb-6">
            Edición Especial · 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-navy-900 tracking-tight" style={{ color: "#1a1a4e", fontFamily: "Georgia, serif" }}>
            Ampolla Mundialista
          </h1>
          <p className="text-3xl font-black mt-1" style={{ color: "#b8860b", fontFamily: "Georgia, serif" }}>★ 2026 ★</p>
          <p className="mt-4 text-lg text-amber-800 max-w-xl mx-auto" style={{ fontFamily: "Georgia, serif" }}>
            Revive la magia de los mundiales. Colecciona tus predicciones como figuritas.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 bg-red-800 hover:bg-red-700 text-amber-50 font-bold text-lg rounded shadow-md transition-colors" style={{ fontFamily: "Georgia, serif" }}>
              Abrir Mi Álbum
            </button>
            <button className="px-8 py-3 border-2 border-amber-800 text-amber-800 font-bold text-lg rounded hover:bg-amber-100 transition-colors" style={{ fontFamily: "Georgia, serif" }}>
              Reglamento
            </button>
          </div>
        </div>
      </section>

      {/* Countdown - Flip clock */}
      <section className="py-12 px-4">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] font-bold mb-6" style={{ color: "#1a1a4e", fontFamily: "Georgia, serif" }}>Cuenta Regresiva al Mundial</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          {Object.entries(COUNTDOWN).map(([label, value]) => (
            <div key={label} className="text-center">
              <div className="relative">
                <div className="bg-gray-900 text-amber-50 rounded-lg w-20 h-24 flex items-center justify-center shadow-lg" style={{ fontFamily: "'Courier New', monospace" }}>
                  <span className="text-4xl font-bold">{String(value).padStart(2, "0")}</span>
                </div>
                <div className="absolute inset-x-0 top-1/2 h-px bg-gray-700" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-amber-800 mt-2 font-bold">{label === "days" ? "días" : label === "hours" ? "horas" : label === "minutes" ? "min" : "seg"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-8 px-4 text-center">
        <div className="inline-block bg-white border-2 border-amber-700 rounded-xl px-12 py-8 shadow-lg" style={{ backgroundImage: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" }}>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-bold" style={{ fontFamily: "Georgia, serif" }}>Pozo de Premios</p>
          <p className="text-5xl font-black mt-2" style={{ color: "#b8860b", fontFamily: "Georgia, serif" }}>{PRIZE_POOL}</p>
        </div>
      </section>

      {/* Match Cards - Panini sticker style */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] font-bold mb-8" style={{ color: "#1a1a4e", fontFamily: "Georgia, serif" }}>Partidos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {MATCHES.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-amber-200 hover:shadow-xl hover:-translate-y-1 transition-all" style={{ backgroundImage: "linear-gradient(180deg, #fffbeb 0%, #ffffff 30%)" }}>
              <div className="inline-block bg-red-800 text-amber-50 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-3">{m.group}</div>
              <div className="flex items-center justify-center gap-5 my-4">
                <div>
                  <span className="text-5xl block">{m.flagA}</span>
                  <div className="text-xs font-bold mt-2 uppercase tracking-wider" style={{ color: "#1a1a4e" }}>{m.teamA}</div>
                </div>
                <div>
                  <div className="bg-gray-900 text-amber-50 font-black text-xl px-5 py-2 rounded-lg shadow-md" style={{ fontFamily: "'Courier New', monospace" }}>
                    {m.scoreA} - {m.scoreB}
                  </div>
                </div>
                <div>
                  <span className="text-5xl block">{m.flagB}</span>
                  <div className="text-xs font-bold mt-2 uppercase tracking-wider" style={{ color: "#1a1a4e" }}>{m.teamB}</div>
                </div>
              </div>
              <div className="text-xs text-amber-700 font-semibold mt-2" style={{ fontFamily: "Georgia, serif" }}>{m.date} · 20:00</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-12 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] font-bold mb-6" style={{ color: "#1a1a4e", fontFamily: "Georgia, serif" }}>Tabla de Honor</h2>
        <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-lg overflow-hidden">
          {LEADERBOARD.map((p, i) => (
            <div key={p.rank} className={`flex items-center justify-between px-6 py-4 ${i < LEADERBOARD.length - 1 ? "border-b border-amber-100" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`font-black text-lg ${p.rank === 1 ? "text-yellow-600" : p.rank === 2 ? "text-gray-400" : p.rank === 3 ? "text-amber-700" : "text-gray-300"}`}>
                  {p.rank <= 3 ? ["🥇", "🥈", "🥉"][p.rank - 1] : `#${p.rank}`}
                </span>
                <span className="font-semibold" style={{ fontFamily: "Georgia, serif" }}>{p.name}</span>
              </div>
              <span className="font-bold" style={{ color: "#b8860b" }}>{p.points} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 text-center shadow-lg border-2 border-amber-200 hover:shadow-xl hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-black" style={{ color: "#1a1a4e", fontFamily: "Georgia, serif" }}>{f.title}</h3>
              <p className="mt-3 text-amber-800 text-sm" style={{ fontFamily: "Georgia, serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="h-16" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// THEME 4: TROPICAL (Light + Fun — coral, teal, warm orange)
// ═══════════════════════════════════════════════════════════════════════
function TropicalTheme() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-teal-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={IMG.stadium} alt="Stadium" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/90 via-white/80 to-teal-50/90" />
        <div className="relative z-10 text-center py-20 px-4">
          <img src={IMG.wc2026Logo} alt="FIFA World Cup 2026" className="mx-auto h-28 md:h-36 mb-5 drop-shadow-md" />
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-500 via-rose-500 to-teal-500 bg-clip-text text-transparent">
            Ampolla Mundialista 2026
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4 text-2xl">
            <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 font-medium">México · United States · Canada</p>
          <p className="mt-5 text-lg text-gray-600 max-w-xl mx-auto">
            ¡Dale color a tus predicciones! Vive el mundial más grande de la historia.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-105 transition-all">
              ¡Juega ahora!
            </button>
            <button className="px-8 py-3 rounded-full border-2 border-teal-400 text-teal-600 font-bold text-lg hover:bg-teal-50 transition-colors">
              Ver reglas
            </button>
          </div>
        </div>
      </section>

      {/* Host Cities */}
      <section className="bg-gradient-to-r from-orange-500 via-rose-500 to-teal-500 py-5 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 text-center text-white">
          {HOST_CITIES.map((h) => (
            <div key={h.country}>
              <div className="text-lg font-bold">{h.country}</div>
              <div className="text-white/80 text-xs mt-1 leading-relaxed">{h.cities}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Countdown */}
      <section className="py-14 px-4">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Faltan para el Mundial</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          {Object.entries(COUNTDOWN).map(([label, value], i) => {
            const colors = ["from-orange-400 to-rose-400", "from-rose-400 to-pink-400", "from-pink-400 to-teal-400", "from-teal-400 to-cyan-400"];
            return (
              <div key={label} className={`bg-gradient-to-br ${colors[i]} rounded-2xl p-5 w-24 text-center shadow-lg hover:scale-110 transition-transform`}>
                <div className="text-4xl font-black text-white">{value}</div>
                <div className="text-xs uppercase text-white/80 mt-1 font-semibold">{label === "days" ? "días" : label === "hours" ? "horas" : label === "minutes" ? "min" : "seg"}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-8 px-4 text-center">
        <div className="inline-block bg-white border-2 border-orange-200 rounded-3xl px-12 py-8 shadow-lg">
          <p className="text-sm uppercase tracking-widest text-rose-400 font-bold">Pozo de premios</p>
          <p className="text-5xl font-black bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent mt-2">{PRIZE_POOL}</p>
        </div>
      </section>

      {/* Match Cards */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">Partidos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {MATCHES.map((m, i) => {
            const accents = ["border-orange-300 hover:shadow-orange-200/50", "border-rose-300 hover:shadow-rose-200/50", "border-teal-300 hover:shadow-teal-200/50"];
            const scoreBg = ["from-orange-500 to-rose-500", "from-rose-500 to-pink-500", "from-teal-500 to-cyan-500"];
            return (
              <div key={m.id} className={`bg-white border-2 ${accents[i]} rounded-3xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all`}>
                <div className="text-xs text-rose-400 font-bold mb-1">{m.group} · {m.date}</div>
                <div className="flex items-center justify-center gap-4 my-4">
                  <div>
                    <span className="text-4xl">{m.flagA}</span>
                    <div className="text-sm font-bold mt-1 text-gray-700">{m.teamA}</div>
                  </div>
                  <div className={`bg-gradient-to-r ${scoreBg[i]} text-white font-black text-xl px-5 py-2 rounded-full shadow-md`}>
                    {m.scoreA} - {m.scoreB}
                  </div>
                  <div>
                    <span className="text-4xl">{m.flagB}</span>
                    <div className="text-sm font-bold mt-1 text-gray-700">{m.teamB}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stadium divider */}
      <section className="relative h-48 md:h-56 overflow-hidden my-4">
        <img src={IMG.stadiumField} alt="Stadium field" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg text-center">
            <div className="text-3xl">🇲🇽 🇺🇸 🇨🇦</div>
            <p className="text-sm font-bold text-gray-700 mt-1">16 sedes · 3 países · 1 campeón</p>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-12 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Tabla de Posiciones</h2>
        <div className="bg-white rounded-3xl border-2 border-orange-200 shadow-lg overflow-hidden">
          {LEADERBOARD.map((p, i) => (
            <div key={p.rank} className={`flex items-center justify-between px-6 py-4 ${i < LEADERBOARD.length - 1 ? "border-b border-orange-100" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-black ${p.rank === 1 ? "text-orange-500" : p.rank === 2 ? "text-rose-400" : p.rank === 3 ? "text-teal-500" : "text-gray-300"}`}>
                  #{p.rank}
                </span>
                <span className="font-semibold text-gray-800">{p.name}</span>
              </div>
              <span className="font-bold bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">{p.points} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const gradients = ["from-orange-500 to-rose-500", "from-rose-500 to-pink-500", "from-teal-500 to-cyan-500"];
            return (
              <div key={f.title} className="bg-white rounded-3xl p-8 text-center shadow-md border-2 border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                <h3 className={`text-2xl font-black bg-gradient-to-r ${gradients[i]} bg-clip-text text-transparent`}>{f.title}</h3>
                <p className="mt-3 text-gray-500 text-sm">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <section className="bg-gradient-to-r from-orange-500 via-rose-500 to-teal-500 py-8 px-4 text-center text-white">
        <img src={IMG.wc2026Logo} alt="FIFA World Cup 2026" className="mx-auto h-16 mb-3 brightness-200" />
        <div className="flex items-center justify-center gap-4 text-2xl mb-2">
          <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
        </div>
        <p className="text-white/80 text-sm">FIFA World Cup 2026 · México · United States · Canada</p>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// THEME 5: NEÓN (Light base + electric neon pops — violet, lime, coral)
// ═══════════════════════════════════════════════════════════════════════
function NeonTheme() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-transparent to-lime-100/50" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-lime-300/20 rounded-full blur-3xl" />
        <div className="relative z-10 text-center py-20 px-4">
          <img src={IMG.wc2026Logo} alt="FIFA World Cup 2026" className="mx-auto h-28 md:h-36 mb-5 drop-shadow-md" />
          <div className="inline-block bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xs font-bold uppercase tracking-[0.3em] px-5 py-1.5 rounded-full mb-5">
            Mundial 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
            Polla <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-lime-500 bg-clip-text text-transparent">Mundialista</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4 text-2xl">
            <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 font-medium">México · United States · Canada</p>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
            La experiencia más electrizante del mundial. Predice, compite y gana.
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 hover:shadow-xl hover:scale-105 transition-all">
              Comenzar
            </button>
            <button className="px-8 py-3 rounded-xl border-2 border-lime-400 text-lime-600 font-bold text-lg hover:bg-lime-50 transition-colors">
              Reglas
            </button>
          </div>
        </div>
      </section>

      {/* Host Cities */}
      <section className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-lime-500 py-5 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 text-center text-white">
          {HOST_CITIES.map((h) => (
            <div key={h.country}>
              <div className="text-lg font-bold">{h.country}</div>
              <div className="text-white/80 text-xs mt-1 leading-relaxed">{h.cities}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Countdown */}
      <section className="py-14 px-4 bg-white">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-violet-600 font-bold mb-8">Cuenta Regresiva</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          {Object.entries(COUNTDOWN).map(([label, value]) => (
            <div key={label} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-lime-400 rounded-2xl opacity-50 group-hover:opacity-100 blur transition-opacity" />
              <div className="relative bg-white rounded-2xl px-5 py-5 w-24 text-center">
                <div className="text-4xl font-black text-gray-900">{value}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 font-bold">{label === "days" ? "días" : label === "hours" ? "horas" : label === "minutes" ? "min" : "seg"}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-10 px-4 text-center bg-gray-50">
        <div className="relative inline-block group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-lime-400 rounded-3xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-white rounded-3xl px-12 py-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 font-bold">Pozo de premios</p>
            <p className="text-5xl font-black text-gray-900 mt-2">{PRIZE_POOL}</p>
          </div>
        </div>
      </section>

      {/* Match Cards */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-violet-600 font-bold mb-8">Partidos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {MATCHES.map((m) => (
            <div key={m.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-400 to-lime-400 rounded-2xl opacity-0 group-hover:opacity-40 blur transition-opacity" />
              <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-400 font-mono">{m.group}</span>
                  <span className="text-[10px] bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">En vivo</span>
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.flagA}</span>
                        <span className="font-bold text-sm">{m.teamA}</span>
                      </div>
                      <span className="text-2xl font-mono font-black text-violet-600">{m.scoreA}</span>
                    </div>
                    <div className="border-t border-gray-100" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.flagB}</span>
                        <span className="font-bold text-sm">{m.teamB}</span>
                      </div>
                      <span className="text-2xl font-mono font-black text-violet-600">{m.scoreB}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-3 font-mono">{m.date} · 20:00</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stadium divider */}
      <section className="relative h-48 md:h-56 overflow-hidden my-4">
        <img src={IMG.stadiumField} alt="Stadium" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-transparent to-gray-50" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg text-center">
            <div className="text-3xl">🇲🇽 🇺🇸 🇨🇦</div>
            <p className="text-sm font-bold text-gray-700 mt-1">16 sedes · 3 países · 1 campeón</p>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-14 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-violet-600 font-bold mb-6">Clasificación</h2>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[40px_1fr_60px] bg-gray-50 px-4 py-2.5 text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <span>#</span><span>Jugador</span><span className="text-right">Pts</span>
          </div>
          {LEADERBOARD.map((p, i) => (
            <div key={p.rank} className={`grid grid-cols-[40px_1fr_60px] px-4 py-3 items-center ${i < LEADERBOARD.length - 1 ? "border-b border-gray-100" : ""} ${p.rank === 1 ? "bg-violet-50" : ""}`}>
              <span className={`font-mono font-bold text-sm ${p.rank === 1 ? "text-violet-600" : p.rank <= 3 ? "text-fuchsia-500" : "text-gray-300"}`}>{p.rank}</span>
              <span className="font-semibold text-sm">{p.name}</span>
              <span className="text-right font-mono font-bold text-violet-600 text-sm">{p.points}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const gradients = ["from-violet-600 to-fuchsia-500", "from-fuchsia-500 to-rose-500", "from-lime-500 to-emerald-500"];
            return (
              <div key={f.title} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradients[i]} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity`} />
                <div className="relative bg-white border border-gray-200 rounded-2xl p-8 text-center group-hover:shadow-md transition-shadow">
                  <h3 className={`text-xl font-black bg-gradient-to-r ${gradients[i]} bg-clip-text text-transparent`}>{f.title}</h3>
                  <p className="mt-3 text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <section className="bg-gray-900 py-8 px-4 text-center">
        <img src={IMG.wc2026Logo} alt="FIFA World Cup 2026" className="mx-auto h-16 mb-3 brightness-200" />
        <div className="flex items-center justify-center gap-4 text-2xl mb-2">
          <span>🇲🇽</span><span>🇺🇸</span><span>🇨🇦</span>
        </div>
        <p className="text-gray-400 text-sm">FIFA World Cup 2026 · México · United States · Canada</p>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN PREVIEW PAGE
// ═══════════════════════════════════════════════════════════════════════
export default function PreviewPage() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("estadio");

  return (
    <div className="min-h-screen">
      {/* Tab Switcher - fixed at top */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTheme(t.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTheme === t.id
                  ? t.id === "fiesta"
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    : t.id === "estadio"
                    ? "bg-emerald-600 text-white"
                    : t.id === "retro"
                    ? "bg-red-800 text-amber-50"
                    : t.id === "tropical"
                    ? "bg-gradient-to-r from-orange-500 to-teal-500 text-white"
                    : "bg-gradient-to-r from-violet-600 to-lime-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              <span className="font-bold">{t.name}</span>
              <span className="ml-2 opacity-70 hidden sm:inline">· {t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Content */}
      {activeTheme === "fiesta" && <FiestaTheme />}
      {activeTheme === "estadio" && <EstadioTheme />}
      {activeTheme === "retro" && <RetroTheme />}
      {activeTheme === "tropical" && <TropicalTheme />}
      {activeTheme === "neon" && <NeonTheme />}
    </div>
  );
}
