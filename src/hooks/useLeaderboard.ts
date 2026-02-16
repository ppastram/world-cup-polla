"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/lib/types";

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("leaderboard")
      .select("*, profile:profiles(*)")
      .order("rank", { ascending: true });

    if (data) {
      setEntries(
        data.map((d) => ({
          ...d,
          profile: d.profile,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard();

    const supabase = createClient();
    const channel = supabase
      .channel("leaderboard-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leaderboard" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  return { entries, loading, refresh: fetchLeaderboard };
}
