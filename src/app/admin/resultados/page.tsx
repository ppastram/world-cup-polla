"use client";

import { useEffect, useState } from "react";
import { Save, RefreshCw, Loader2, CheckCircle, Plus, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Match, Team, ActualAdvancing } from "@/lib/types";
import { STAGES_LABELS } from "@/lib/constants";

type MatchWithTeams = Match & { home_team: Team; away_team: Team };

export default function AdminResultadosPage() {
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [advancing, setAdvancing] = useState<ActualAdvancing[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [saveAllMessage, setSaveAllMessage] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState("group");
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [teamAssignments, setTeamAssignments] = useState<Record<string, { home: string; away: string }>>({});

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    const supabase = createClient();
    const [matchesRes, teamsRes, advancingRes] = await Promise.all([
      supabase
        .from("matches")
        .select("*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)")
        .order("match_date", { ascending: true }),
      supabase.from("teams").select("*").order("name"),
      supabase.from("actual_advancing").select("*"),
    ]);

    if (teamsRes.data) setAllTeams(teamsRes.data as Team[]);
    if (advancingRes.data) setAdvancing(advancingRes.data as ActualAdvancing[]);

    if (matchesRes.data) {
      const data = matchesRes.data;
      setMatches(data as MatchWithTeams[]);
      const initialScores: Record<string, { home: string; away: string }> = {};
      const initialAssignments: Record<string, { home: string; away: string }> = {};
      data.forEach((m) => {
        initialScores[m.id] = {
          home: m.home_score?.toString() ?? "",
          away: m.away_score?.toString() ?? "",
        };
        initialAssignments[m.id] = {
          home: m.home_team_id ?? "",
          away: m.away_team_id ?? "",
        };
      });
      setScores(initialScores);
      setTeamAssignments(initialAssignments);
    }
    setLoading(false);
  }

  function getTeamsForStage(stage: string): Team[] {
    const advancingTeamIds = advancing
      .filter((a) => a.round === stage)
      .map((a) => a.team_id);
    if (advancingTeamIds.length > 0) {
      return allTeams.filter((t) => advancingTeamIds.includes(t.id));
    }
    return allTeams;
  }

  function changeScore(matchId: string, side: "home" | "away", delta: number) {
    setScores((prev) => {
      const current = prev[matchId] || { home: "", away: "" };
      const val = current[side] === "" ? 0 : parseInt(current[side]) || 0;
      const clamped = Math.max(0, Math.min(20, val + delta));
      return { ...prev, [matchId]: { ...current, [side]: clamped.toString() } };
    });
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

  async function saveAllResults() {
    const matchesToSave = filteredMatches.filter((m) => {
      const score = scores[m.id];
      const hasScores = score && score.home !== "" && score.away !== "";
      // For knockout matches, also save if team assignments changed
      if (m.stage !== "group") {
        const assignment = teamAssignments[m.id];
        const teamChanged =
          assignment &&
          (assignment.home !== (m.home_team_id ?? "") || assignment.away !== (m.away_team_id ?? ""));
        return hasScores || teamChanged;
      }
      return hasScores;
    });

    if (matchesToSave.length === 0) return;

    setSavingAll(true);
    setSaveAllMessage(null);
    const supabase = createClient();
    let saved = 0;

    try {
      for (const match of matchesToSave) {
        const score = scores[match.id];
        const homeScore = score.home !== "" ? parseInt(score.home) : null;
        const awayScore = score.away !== "" ? parseInt(score.away) : null;

        const updateData: Record<string, unknown> = {
          home_score: homeScore,
          away_score: awayScore,
          manual_override: true,
        };

        if (homeScore !== null && awayScore !== null) {
          updateData.status = "finished";
        }

        // For knockout matches, also update team assignments
        if (match.stage !== "group") {
          const assignment = teamAssignments[match.id];
          if (assignment) {
            updateData.home_team_id = assignment.home || null;
            updateData.away_team_id = assignment.away || null;
          }
        }

        const { error: matchError } = await supabase
          .from("matches")
          .update(updateData)
          .eq("id", match.id);

        if (matchError) {
          setSaveAllMessage(`Error en partido #${match.match_number}: ${matchError.message}`);
          break;
        }

        saved++;
      }

      // Score ALL match predictions server-side (bypasses RLS)
      const { error: scoreError } = await supabase.rpc("score_match_predictions");
      if (scoreError) throw scoreError;

      await supabase.rpc("recalculate_leaderboard");

      if (!saveAllMessage) {
        setSaveAllMessage(`${saved} partido${saved !== 1 ? 's' : ''} guardado${saved !== 1 ? 's' : ''} exitosamente`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setSaveAllMessage(`Error: ${message}`);
    }

    setSavingAll(false);
    setTimeout(() => setSaveAllMessage(null), 4000);
    fetchMatches();
  }

  const filteredMatches = matches
    .filter((m) => m.stage === stageFilter)
    .sort((a, b) => {
      const dateA = new Date(a.match_date).getTime();
      const dateB = new Date(b.match_date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.match_number - b.match_number;
    });

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
        {filteredMatches.map((match) => {
          const homeVal = scores[match.id]?.home ?? "";
          const awayVal = scores[match.id]?.away ?? "";
          const homeNum = homeVal === "" ? 0 : parseInt(homeVal) || 0;
          const awayNum = awayVal === "" ? 0 : parseInt(awayVal) || 0;
          const hasBoth = homeVal !== "" && awayVal !== "";

          return (
            <div
              key={match.id}
              className={`bg-wc-card border rounded-lg p-3 transition-colors ${
                match.status === "finished" ? "border-emerald-500/30" : hasBoth ? "border-gold-500/40" : "border-wc-border"
              }`}
            >
              {/* Status badge */}
              {match.status === "finished" && (
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">Finalizado</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                {/* Home Team */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {match.stage === "group" ? (
                    <>
                      {match.home_team && (
                        <img src={match.home_team.flag_url} alt="" className="w-8 h-6 object-cover rounded-sm shrink-0 border border-wc-border" />
                      )}
                      <span className="text-sm text-gray-200 truncate">{match.home_team?.name || "TBD"}</span>
                    </>
                  ) : (
                    <>
                      {teamAssignments[match.id]?.home && allTeams.find((t) => t.id === teamAssignments[match.id].home) && (
                        <img src={allTeams.find((t) => t.id === teamAssignments[match.id].home)!.flag_url} alt="" className="w-8 h-6 object-cover rounded-sm shrink-0 border border-wc-border" />
                      )}
                      <select
                        value={teamAssignments[match.id]?.home ?? ""}
                        onChange={(e) =>
                          setTeamAssignments((prev) => ({
                            ...prev,
                            [match.id]: { ...prev[match.id], home: e.target.value },
                          }))
                        }
                        className="bg-wc-darker border border-wc-border rounded-md text-sm text-gray-200 px-2 py-1 min-w-0 flex-1 focus:outline-none focus:border-gold-500/50"
                      >
                        <option value="">TBD</option>
                        {getTeamsForStage(match.stage).map((t) => (
                          <option key={t.id} value={t.id}>{t.code} - {t.name}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                {/* Score Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => changeScore(match.id, "home", -1)}
                    disabled={homeNum <= 0}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={homeVal}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Math.max(0, Math.min(20, parseInt(e.target.value) || 0)).toString();
                      setScores((prev) => ({ ...prev, [match.id]: { ...prev[match.id], home: val } }));
                    }}
                    className={`w-9 h-9 text-center rounded-md bg-wc-darker border border-wc-border text-base font-bold tabular-nums focus:outline-none focus:border-gold-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${homeVal !== "" ? "text-gold-400" : "text-gray-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => changeScore(match.id, "home", 1)}
                    disabled={homeNum >= 20}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-gray-600 font-bold mx-1">-</span>

                  <button
                    type="button"
                    onClick={() => changeScore(match.id, "away", -1)}
                    disabled={awayNum <= 0}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={awayVal}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Math.max(0, Math.min(20, parseInt(e.target.value) || 0)).toString();
                      setScores((prev) => ({ ...prev, [match.id]: { ...prev[match.id], away: val } }));
                    }}
                    className={`w-9 h-9 text-center rounded-md bg-wc-darker border border-wc-border text-base font-bold tabular-nums focus:outline-none focus:border-gold-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${awayVal !== "" ? "text-gold-400" : "text-gray-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => changeScore(match.id, "away", 1)}
                    disabled={awayNum >= 20}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  {match.stage === "group" ? (
                    <>
                      <span className="text-sm text-gray-200 truncate">{match.away_team?.name || "TBD"}</span>
                      {match.away_team && (
                        <img src={match.away_team.flag_url} alt="" className="w-8 h-6 object-cover rounded-sm shrink-0 border border-wc-border" />
                      )}
                    </>
                  ) : (
                    <>
                      <select
                        value={teamAssignments[match.id]?.away ?? ""}
                        onChange={(e) =>
                          setTeamAssignments((prev) => ({
                            ...prev,
                            [match.id]: { ...prev[match.id], away: e.target.value },
                          }))
                        }
                        className="bg-wc-darker border border-wc-border rounded-md text-sm text-gray-200 px-2 py-1 min-w-0 flex-1 text-right focus:outline-none focus:border-gold-500/50"
                      >
                        <option value="">TBD</option>
                        {getTeamsForStage(match.stage).map((t) => (
                          <option key={t.id} value={t.id}>{t.code} - {t.name}</option>
                        ))}
                      </select>
                      {teamAssignments[match.id]?.away && allTeams.find((t) => t.id === teamAssignments[match.id].away) && (
                        <img src={allTeams.find((t) => t.id === teamAssignments[match.id].away)!.flag_url} alt="" className="w-8 h-6 object-cover rounded-sm shrink-0 border border-wc-border" />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-600">
                <span className="text-gray-500">#{match.match_number}</span>
                {" · "}
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
          );
        })}

        {filteredMatches.length === 0 && (
          <p className="text-center text-gray-500 py-10">No hay partidos en esta fase</p>
        )}
      </div>

      {/* Save All Message */}
      {saveAllMessage && (
        <div
          className={`mt-4 text-center text-sm py-2 px-4 rounded-lg ${
            saveAllMessage.includes("Error")
              ? "bg-red-900/30 text-red-300 border border-red-700/50"
              : "bg-emerald-900/30 text-emerald-300 border border-emerald-700/50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {!saveAllMessage.includes("Error") && <CheckCircle className="w-4 h-4" />}
            {saveAllMessage}
          </div>
        </div>
      )}

      {/* Save All Button */}
      {filteredMatches.length > 0 && (
        <button
          onClick={saveAllResults}
          disabled={savingAll}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {savingAll ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Todos los Resultados
            </>
          )}
        </button>
      )}
    </div>
  );
}
