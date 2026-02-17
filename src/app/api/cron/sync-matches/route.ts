import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchWorldCupMatches, mapApiStatus } from "@/lib/football-api";

export async function POST(request: Request) {
  // Verify cron secret or admin token
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const apiMatches = await fetchWorldCupMatches();

    let updated = 0;

    for (const apiMatch of apiMatches) {
      const status = mapApiStatus(apiMatch.status);
      const homeScore = apiMatch.score.fullTime.home;
      const awayScore = apiMatch.score.fullTime.away;

      // Find match by external_id
      const { data: existingMatch } = await supabase
        .from("matches")
        .select("id, status, home_score, away_score, manual_override")
        .eq("external_id", apiMatch.id)
        .single();

      if (!existingMatch) continue;

      // Skip score update for manually overridden matches (still allow status updates)
      if (existingMatch.manual_override) {
        if (existingMatch.status !== status) {
          await supabase
            .from("matches")
            .update({ status })
            .eq("id", existingMatch.id);
          updated++;
        }
        continue;
      }

      // Only update if something changed
      const needsUpdate =
        existingMatch.status !== status ||
        existingMatch.home_score !== homeScore ||
        existingMatch.away_score !== awayScore;

      if (!needsUpdate) continue;

      await supabase
        .from("matches")
        .update({
          home_score: homeScore,
          away_score: awayScore,
          status,
        })
        .eq("id", existingMatch.id);

      // If match just finished, calculate points for predictions
      if (status === "finished" && homeScore !== null && awayScore !== null) {
        const { data: predictions } = await supabase
          .from("match_predictions")
          .select("*")
          .eq("match_id", existingMatch.id);

        if (predictions) {
          for (const pred of predictions) {
            let points = 0;
            if (pred.home_score === homeScore && pred.away_score === awayScore) {
              points = 5;
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
      }

      updated++;
    }

    // Recalculate leaderboard after all updates
    if (updated > 0) {
      await supabase.rpc("recalculate_leaderboard");
    }

    return NextResponse.json({
      message: `Sincronización completada. ${updated} partidos actualizados.`,
      updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sync error:", message);
    return NextResponse.json(
      { error: "Error de sincronización", details: message },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel Cron
export async function GET(request: Request) {
  return POST(request);
}
