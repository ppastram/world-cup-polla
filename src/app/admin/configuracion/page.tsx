"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ScoringSetting } from "@/lib/types";

const LABELS: Record<string, string> = {
  exact_score: "Marcador exacto",
  correct_result_and_diff: "Resultado + diferencia de goles",
  correct_result: "Resultado correcto (G/E/P)",
  round_32: "Clasificado a Dieciseisavos",
  round_16: "Clasificado a Octavos",
  quarter: "Clasificado a Cuartos",
  semi: "Clasificado a Semifinales",
  final: "Clasificado a la Final",
  champion: "Campeón",
  golden_ball: "Balón de Oro",
  golden_boot: "Bota de Oro",
  golden_glove: "Guante de Oro",
  best_young: "Mejor Jugador Joven",
  total_goals_exact: "Total de goles (exacto)",
  total_goals_within_3: "Total de goles (±3)",
  total_goals_within_5: "Total de goles (±5)",
};

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<ScoringSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const supabase = createClient();
    const { data } = await supabase.from("scoring_settings").select("*").order("id");
    if (data) {
      setSettings(data);
      const v: Record<string, string> = {};
      data.forEach((s) => (v[s.key] = s.value.toString()));
      setValues(v);
    }
    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    const supabase = createClient();
    for (const setting of settings) {
      const newValue = parseInt(values[setting.key]);
      if (newValue !== setting.value) {
        await supabase
          .from("scoring_settings")
          .update({ value: newValue })
          .eq("id", setting.id);
      }
    }
    await fetchSettings();
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  // Group settings by category
  const matchSettings = settings.filter((s) =>
    ["exact_score", "correct_result_and_diff", "correct_result"].includes(s.key)
  );
  const advancingSettings = settings.filter((s) =>
    ["round_32", "round_16", "quarter", "semi", "final", "champion"].includes(s.key)
  );
  const awardSettings = settings.filter((s) =>
    ["golden_ball", "golden_boot", "golden_glove", "best_young", "total_goals_exact", "total_goals_within_3", "total_goals_within_5"].includes(s.key)
  );

  const renderGroup = (title: string, items: ScoringSetting[]) => (
    <div className="bg-wc-card border border-wc-border rounded-xl p-6">
      <h3 className="text-gold-400 font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.key} className="flex items-center justify-between gap-4">
            <label className="text-sm text-gray-300">{LABELS[s.key] || s.key}</label>
            <input
              type="number"
              min="0"
              value={values[s.key] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [s.key]: e.target.value }))}
              className="w-20 bg-wc-darker border border-wc-border rounded px-3 py-2 text-center text-white text-sm focus:outline-none focus:border-gold-500/50"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Configuración de Puntos</h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {renderGroup("Predicción de Partidos", matchSettings)}
        {renderGroup("Equipos Clasificados", advancingSettings)}
        {renderGroup("Premios Individuales", awardSettings)}
      </div>
    </div>
  );
}
