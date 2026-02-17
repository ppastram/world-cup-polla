"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle, Trophy, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Team, AdvancingRound, AwardType } from "@/lib/types";

const ROUNDS: { key: AdvancingRound; label: string; count: number; prev?: string }[] = [
  { key: "round_32", label: "Dieciseisavos de Final", count: 32 },
  { key: "round_16", label: "Octavos de Final", count: 16, prev: "round_32" },
  { key: "quarter", label: "Cuartos de Final", count: 8, prev: "round_16" },
  { key: "semi", label: "Semifinales", count: 4, prev: "quarter" },
  { key: "final", label: "Final", count: 2, prev: "semi" },
  { key: "third_place", label: "Tercer Puesto", count: 1, prev: "semi" },
  { key: "champion", label: "Campeón", count: 1, prev: "final" },
];

const AWARD_TYPES: { key: AwardType; label: string; isPlayer: boolean }[] = [
  { key: "golden_ball", label: "Balón de Oro", isPlayer: true },
  { key: "golden_boot", label: "Bota de Oro", isPlayer: true },
  { key: "golden_glove", label: "Guante de Oro", isPlayer: true },
  { key: "best_young", label: "Mejor Jugador Joven", isPlayer: true },
  { key: "total_goals", label: "Total de Goles", isPlayer: false },
];

type Tab = "advancing" | "awards";

export default function AdminAvancesPage() {
  const [tab, setTab] = useState<Tab>("advancing");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Advancing state: round -> team_id[]
  const [advancing, setAdvancing] = useState<Record<string, string[]>>({});
  const [expandedRound, setExpandedRound] = useState<string>("round_32");

  // Awards state
  const [awards, setAwards] = useState<Record<string, { player_name: string; total_goals: string }>>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();

    const [teamsRes, advancingRes, awardsRes] = await Promise.all([
      supabase.from("teams").select("*").order("group_letter").order("name"),
      supabase.from("actual_advancing").select("*"),
      supabase.from("actual_awards").select("*"),
    ]);

    if (teamsRes.data) setTeams(teamsRes.data);

    if (advancingRes.data) {
      const map: Record<string, string[]> = {};
      for (const row of advancingRes.data) {
        if (!map[row.round]) map[row.round] = [];
        map[row.round].push(row.team_id);
      }
      setAdvancing(map);
    }

    if (awardsRes.data) {
      const map: Record<string, { player_name: string; total_goals: string }> = {};
      for (const row of awardsRes.data) {
        map[row.award_type] = {
          player_name: row.player_name || "",
          total_goals: row.total_goals?.toString() || "",
        };
      }
      setAwards(map);
    }

    setLoading(false);
  }

  // --- Advancing logic ---
  function getAvailableTeams(round: (typeof ROUNDS)[number]): Team[] {
    if (round.key === "round_32") {
      return [...teams].sort((a, b) => {
        if (a.group_letter !== b.group_letter) return a.group_letter.localeCompare(b.group_letter);
        return a.name.localeCompare(b.name);
      });
    }
    if (round.key === "third_place") {
      const semiTeams = advancing["semi"] || [];
      const finalTeams = advancing["final"] || [];
      return teams
        .filter((t) => semiTeams.includes(t.id) && !finalTeams.includes(t.id))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    const prevKey = round.prev;
    if (!prevKey) return [];
    const prevSelected = advancing[prevKey] || [];
    return teams
      .filter((t) => prevSelected.includes(t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function toggleTeam(roundKey: string, teamId: string, maxCount: number) {
    const current = advancing[roundKey] || [];
    const isSelected = current.includes(teamId);

    if (isSelected) {
      const updated = current.filter((id) => id !== teamId);
      const newAdvancing = { ...advancing, [roundKey]: updated };
      // Remove from subsequent rounds
      const roundIndex = ROUNDS.findIndex((r) => r.key === roundKey);
      for (let i = roundIndex + 1; i < ROUNDS.length; i++) {
        const laterRound = ROUNDS[i];
        const laterTeams = newAdvancing[laterRound.key] || [];
        if (laterTeams.includes(teamId)) {
          newAdvancing[laterRound.key] = laterTeams.filter((id) => id !== teamId);
        }
      }
      setAdvancing(newAdvancing);
    } else {
      if (current.length >= maxCount) return;
      // If adding to final, remove from third_place
      const newAdvancing = { ...advancing };
      if (roundKey === "final") {
        const thirdPlace = newAdvancing["third_place"] || [];
        if (thirdPlace.includes(teamId)) {
          newAdvancing["third_place"] = thirdPlace.filter((id) => id !== teamId);
        }
      }
      newAdvancing[roundKey] = [...current, teamId];
      setAdvancing(newAdvancing);
    }
  }

  async function saveAdvancing() {
    setSaving(true);
    setSaveMessage(null);
    const supabase = createClient();

    try {
      // Build upserts from current state
      const upserts: { team_id: string; round: string }[] = [];
      const keepKeys = new Set<string>();
      for (const round of ROUNDS) {
        const teamIds = advancing[round.key] || [];
        for (const teamId of teamIds) {
          upserts.push({ team_id: teamId, round: round.key });
          keepKeys.add(`${teamId}|${round.key}`);
        }
      }

      // Upsert all current selections
      if (upserts.length > 0) {
        const { error } = await supabase
          .from("actual_advancing")
          .upsert(upserts, { onConflict: "team_id,round" });
        if (error) throw error;
      }

      // Selectively delete only rows no longer in current state
      const { data: existing } = await supabase
        .from("actual_advancing")
        .select("id, team_id, round");

      if (existing) {
        const staleIds = existing
          .filter((row) => !keepKeys.has(`${row.team_id}|${row.round}`))
          .map((row) => row.id);
        if (staleIds.length > 0) {
          const { error: delError } = await supabase
            .from("actual_advancing")
            .delete()
            .in("id", staleIds);
          if (delError) throw delError;
        }
      }

      // Score predictions and recalculate leaderboard
      const { error: scoreError } = await supabase.rpc("score_advancing_predictions");
      if (scoreError) throw scoreError;
      const { error: lbError } = await supabase.rpc("recalculate_leaderboard");
      if (lbError) throw lbError;

      setSaveMessage("Avances guardados y puntos recalculados");
    } catch (err) {
      const message = err instanceof Error ? err.message : (typeof err === 'object' && err !== null && 'message' in err) ? String((err as { message: unknown }).message) : JSON.stringify(err);
      setSaveMessage(`Error: ${message}`);
    }

    setSaving(false);
    setTimeout(() => setSaveMessage(null), 4000);
  }

  // --- Awards logic ---
  async function saveAwards() {
    setSaving(true);
    setSaveMessage(null);
    const supabase = createClient();

    try {
      const upserts = AWARD_TYPES.map((award) => {
        const val = awards[award.key] || { player_name: "", total_goals: "" };
        return {
          award_type: award.key,
          player_name: award.isPlayer ? val.player_name || null : null,
          total_goals: !award.isPlayer && val.total_goals ? parseInt(val.total_goals) : null,
        };
      });

      // Upsert all current awards
      const { error } = await supabase
        .from("actual_awards")
        .upsert(upserts, { onConflict: "award_type" });
      if (error) throw error;

      // Selectively delete award types no longer present
      const activeTypes = upserts.map((u) => u.award_type);
      const { data: existingAwards } = await supabase
        .from("actual_awards")
        .select("id, award_type");
      if (existingAwards) {
        const staleAwardIds = existingAwards
          .filter((row) => !activeTypes.includes(row.award_type))
          .map((row) => row.id);
        if (staleAwardIds.length > 0) {
          const { error: delError } = await supabase
            .from("actual_awards")
            .delete()
            .in("id", staleAwardIds);
          if (delError) throw delError;
        }
      }

      // Score predictions and recalculate leaderboard
      const { error: scoreError } = await supabase.rpc("score_award_predictions");
      if (scoreError) throw scoreError;
      const { error: lbError } = await supabase.rpc("recalculate_leaderboard");
      if (lbError) throw lbError;

      setSaveMessage("Premios guardados y puntos recalculados");
    } catch (err) {
      const message = err instanceof Error ? err.message : (typeof err === 'object' && err !== null && 'message' in err) ? String((err as { message: unknown }).message) : JSON.stringify(err);
      setSaveMessage(`Error: ${message}`);
    }

    setSaving(false);
    setTimeout(() => setSaveMessage(null), 4000);
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
      <h1 className="text-2xl font-bold text-white mb-6">Avances y Premios</h1>

      {/* Tab selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("advancing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            tab === "advancing"
              ? "bg-gold-500 text-black font-bold"
              : "bg-wc-card border border-wc-border text-gray-400 hover:text-white"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Equipos Clasificados
        </button>
        <button
          onClick={() => setTab("awards")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            tab === "awards"
              ? "bg-gold-500 text-black font-bold"
              : "bg-wc-card border border-wc-border text-gray-400 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          Premios Individuales
        </button>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className={`mb-4 text-center text-sm py-2 px-4 rounded-lg ${
            saveMessage.includes("Error")
              ? "bg-red-900/30 text-red-300 border border-red-700/50"
              : "bg-emerald-900/30 text-emerald-300 border border-emerald-700/50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {!saveMessage.includes("Error") && <CheckCircle className="w-4 h-4" />}
            {saveMessage}
          </div>
        </div>
      )}

      {/* Advancing Tab */}
      {tab === "advancing" && (
        <div className="space-y-4">
          {ROUNDS.map((round) => {
            const selected = advancing[round.key] || [];
            const available = getAvailableTeams(round);
            const isExpanded = expandedRound === round.key;
            const isComplete = selected.length === round.count;
            const hasPrev =
              round.key === "round_32" ||
              (round.key === "third_place"
                ? (advancing["final"] || []).length > 0
                : round.prev && (advancing[round.prev] || []).length > 0);

            return (
              <div
                key={round.key}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  isComplete ? "border-emerald-500/40 bg-wc-card" : "border-wc-border bg-wc-card"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedRound(isExpanded ? "" : round.key)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-wc-border/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isComplete
                          ? "bg-emerald-500 text-white"
                          : "bg-wc-darker border border-wc-border text-gray-400"
                      }`}
                    >
                      {isComplete ? "✓" : selected.length}
                    </div>
                    <p className="text-sm font-semibold text-white">{round.label}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {selected.length}/{round.count}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-wc-border">
                    {!hasPrev && round.key !== "round_32" ? (
                      <p className="text-sm text-gray-500 py-4 text-center">
                        Primero selecciona los equipos de la ronda anterior
                      </p>
                    ) : (
                      <>
                        {isComplete && (
                          <p className="text-xs text-emerald-400 mt-3 mb-2">
                            Selección completa ({round.count}/{round.count})
                          </p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                          {available.map((team) => {
                            const isSelected = selected.includes(team.id);
                            const isFull = selected.length >= round.count && !isSelected;

                            return (
                              <button
                                key={team.id}
                                type="button"
                                onClick={() => toggleTeam(round.key, team.id, round.count)}
                                disabled={isFull && !isSelected}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                                  isSelected
                                    ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                                    : isFull
                                    ? "bg-wc-darker border-wc-border text-gray-600 cursor-not-allowed opacity-40"
                                    : "bg-wc-darker border-wc-border text-gray-300 hover:border-emerald-500/40 hover:text-white"
                                }`}
                              >
                                <img
                                  src={team.flag_url}
                                  alt={team.code}
                                  className="w-6 h-4 object-cover rounded-sm shrink-0 border border-wc-border"
                                />
                                <span className="text-xs font-medium truncate">{team.name}</span>
                                {round.key === "round_32" && (
                                  <span className="text-[10px] text-gray-500 ml-auto">{team.group_letter}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={saveAdvancing}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Avances y Recalcular Puntos
              </>
            )}
          </button>
        </div>
      )}

      {/* Awards Tab */}
      {tab === "awards" && (
        <div className="space-y-4">
          {AWARD_TYPES.map((award) => {
            const val = awards[award.key] || { player_name: "", total_goals: "" };

            return (
              <div key={award.key} className="bg-wc-card border border-wc-border rounded-xl p-4">
                <label className="text-sm font-semibold text-white mb-2 block">{award.label}</label>
                {award.isPlayer ? (
                  <input
                    type="text"
                    placeholder="Nombre del jugador"
                    value={val.player_name}
                    onChange={(e) =>
                      setAwards((prev) => ({
                        ...prev,
                        [award.key]: { ...prev[award.key], player_name: e.target.value, total_goals: "" },
                      }))
                    }
                    className="w-full bg-wc-darker border border-wc-border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    placeholder="Total de goles del torneo"
                    value={val.total_goals}
                    onChange={(e) =>
                      setAwards((prev) => ({
                        ...prev,
                        [award.key]: { ...prev[award.key], total_goals: e.target.value, player_name: "" },
                      }))
                    }
                    className="w-full bg-wc-darker border border-wc-border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50"
                  />
                )}
              </div>
            );
          })}

          <button
            onClick={saveAwards}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Premios y Recalcular Puntos
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
