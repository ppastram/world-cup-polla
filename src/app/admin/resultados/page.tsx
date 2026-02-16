"use client";

import { useEffect, useState } from "react";
import { Save, RefreshCw, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Match, Team } from "@/lib/types";
import { STAGES_LABELS } from "@/lib/constants";

type MatchWithTeams = Match & { home_team: Team; away_team: Team };

export default function AdminResultadosPage() {
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState("group");
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    const supabase = createClient();
    const { data } = await supabase
      .from("matches")
      .select("*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)")
      .order("match_date", { ascending: true });

    if (data) {
      setMatches(data as MatchWithTeams[]);
      const initialScores: Record<string, { home: string; away: string }> = {};
      data.forEach((m) => {
        initialScores[m.id] = {
          home: m.home_score?.toString() ?? "",
          away: m.away_score?.toString() ?? "",
        };
      });
      setScores(initialScores);
    }
    setLoading(false);
  }

  async function saveResult(matchId: string) {
    const score = scores[matchId];
    if (!score || score.home === "" || score.away === "") return;

    setSaving(matchId);
    const supabase = createClient();

    const homeScore = parseInt(score.home);
    const awayScore = parseInt(score.away);

    // Update match
    await supabase
      .from("matches")
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: "finished",
      })
      .eq("id", matchId);

    // Recalculate points for all predictions on this match
    const { data: predictions } = await supabase
      .from("match_predictions")
      .select("*")
      .eq("match_id", matchId);

    if (predictions) {
      for (const pred of predictions) {
        let points = 0;
        if (pred.home_score === homeScore && pred.away_score === awayScore) {
          points = 5; // exact
        } else {
          const predDiff = pred.home_score - pred.away_score;
          const actualDiff = homeScore - awayScore;
          const predResult = Math.sign(predDiff);
          const actualResult = Math.sign(actualDiff);
          if (predResult === actualResult) {
            points = predDiff === actualDiff ? 3 : 2;
          }
        }
        await supabase
          .from("match_predictions")
          .update({ points_earned: points })
          .eq("id", pred.id);
      }
    }

    // Recalculate leaderboard
    await supabase.rpc("recalculate_leaderboard");

    setSaving(null);
    fetchMatches();
  }

  async function triggerSync() {
    try {
      const res = await fetch("/api/cron/sync-matches", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || "manual"}` },
      });
      const data = await res.json();
      alert(data.message || "Sync completado");
      fetchMatches();
    } catch {
      alert("Error al sincronizar");
    }
  }

  const filteredMatches = matches.filter((m) => m.stage === stageFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Resultados de Partidos</h1>
        <button
          onClick={triggerSync}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Sincronizar API
        </button>
      </div>

      {/* Stage Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(STAGES_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStageFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              stageFilter === key
                ? "bg-gold-500 text-black font-bold"
                : "bg-wc-card border border-wc-border text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div className="space-y-3">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className={`bg-wc-card border rounded-xl p-4 ${
              match.status === "finished" ? "border-emerald-500/30" : "border-wc-border"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 w-8">#{match.match_number}</span>

              {/* Home Team */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-sm text-white">{match.home_team?.name || "TBD"}</span>
                {match.home_team && (
                  <img src={match.home_team.flag_url} alt="" className="w-6 h-4 object-cover rounded" />
                )}
              </div>

              {/* Score Inputs */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={scores[match.id]?.home ?? ""}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [match.id]: { ...prev[match.id], home: e.target.value },
                    }))
                  }
                  className="w-12 bg-wc-darker border border-wc-border rounded px-2 py-1 text-center text-white text-sm focus:outline-none focus:border-gold-500/50"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={scores[match.id]?.away ?? ""}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [match.id]: { ...prev[match.id], away: e.target.value },
                    }))
                  }
                  className="w-12 bg-wc-darker border border-wc-border rounded px-2 py-1 text-center text-white text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-2 flex-1">
                {match.away_team && (
                  <img src={match.away_team.flag_url} alt="" className="w-6 h-4 object-cover rounded" />
                )}
                <span className="text-sm text-white">{match.away_team?.name || "TBD"}</span>
              </div>

              {/* Status & Save */}
              <div className="flex items-center gap-2">
                {match.status === "finished" && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                <button
                  onClick={() => saveResult(match.id)}
                  disabled={saving === match.id}
                  className="bg-gold-500 hover:bg-gold-600 text-black px-3 py-1 rounded text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {saving === match.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-600">
              {new Date(match.match_date).toLocaleDateString("es-CO", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {match.venue && ` · ${match.venue}`}
            </div>
          </div>
        ))}

        {filteredMatches.length === 0 && (
          <p className="text-center text-gray-500 py-10">No hay partidos en esta fase</p>
        )}
      </div>
    </div>
  );
}
