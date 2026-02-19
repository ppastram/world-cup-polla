import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const AWARD_LABELS: Record<string, string> = {
  golden_ball: "Balon de Oro",
  golden_boot: "Bota de Oro",
  golden_glove: "Guante de Oro",
  best_young: "Mejor Jugador Joven",
  total_goals: "Goles Totales del Torneo",
};

const ROUND_LABELS: Record<string, string> = {
  round_32: "Dieciseisavos de Final",
  round_16: "Octavos de Final",
  quarter: "Cuartos de Final",
  semi: "Semifinales",
  final: "Final",
  third_place: "Tercer Puesto",
  champion: "Campeon",
};

const ROUND_ORDER = ["round_32", "round_16", "quarter", "semi", "final", "third_place", "champion"];

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get user email from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    if (authError || !authUser?.user?.email) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = authUser.user.email;

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .single();

    const displayName = profile?.display_name || "Participante";

    // Get all match predictions with team names
    const { data: matchPreds } = await supabase
      .from("match_predictions")
      .select("home_score, away_score, match:matches(match_number, group_letter, stage, match_date, home_team:teams!matches_home_team_id_fkey(name, code), away_team:teams!matches_away_team_id_fkey(name, code))")
      .eq("user_id", userId)
      .order("created_at");

    // Get advancing predictions with team names
    const { data: advPreds } = await supabase
      .from("advancing_predictions")
      .select("round, team:teams(name, code)")
      .eq("user_id", userId);

    // Get award predictions
    const { data: awardPreds } = await supabase
      .from("award_predictions")
      .select("award_type, player_name, total_goals_guess")
      .eq("user_id", userId);

    // Build match predictions HTML grouped by group
    const groupMatches: Record<string, string[]> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const pred of (matchPreds || []) as Record<string, any>[]) {
      const match = pred.match;
      if (!match || match.stage !== "group") continue;
      const group = match.group_letter || "?";
      if (!groupMatches[group]) groupMatches[group] = [];
      groupMatches[group].push(
        `<tr>
          <td style="padding:4px 8px;border-bottom:1px solid #2a2a3a;">${match.home_team?.name || "?"}</td>
          <td style="padding:4px 8px;border-bottom:1px solid #2a2a3a;text-align:center;font-weight:bold;">${pred.home_score} - ${pred.away_score}</td>
          <td style="padding:4px 8px;border-bottom:1px solid #2a2a3a;">${match.away_team?.name || "?"}</td>
        </tr>`
      );
    }

    let matchesHtml = "";
    for (const group of Object.keys(groupMatches).sort()) {
      matchesHtml += `
        <h3 style="color:#d4a843;margin:16px 0 8px;">Grupo ${group}</h3>
        <table style="width:100%;border-collapse:collapse;color:#e0e0e0;font-size:14px;">
          ${groupMatches[group].join("")}
        </table>`;
    }

    // Build advancing predictions HTML
    const advByRound: Record<string, string[]> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const pred of (advPreds || []) as Record<string, any>[]) {
      const round = pred.round;
      if (!advByRound[round]) advByRound[round] = [];
      advByRound[round].push(pred.team?.name || "?");
    }

    let advancingHtml = "";
    for (const round of ROUND_ORDER) {
      const teams = advByRound[round];
      if (!teams || teams.length === 0) continue;
      advancingHtml += `
        <h3 style="color:#d4a843;margin:16px 0 8px;">${ROUND_LABELS[round] || round}</h3>
        <p style="color:#e0e0e0;font-size:14px;margin:0;">${teams.sort().join(", ")}</p>`;
    }

    // Build awards HTML
    let awardsHtml = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const pred of (awardPreds || []) as Record<string, any>[]) {
      const label = AWARD_LABELS[pred.award_type] || pred.award_type;
      const value = pred.award_type === "total_goals"
        ? `${pred.total_goals_guess} goles`
        : pred.player_name || "-";
      awardsHtml += `
        <tr>
          <td style="padding:4px 8px;border-bottom:1px solid #2a2a3a;color:#d4a843;font-weight:bold;">${label}</td>
          <td style="padding:4px 8px;border-bottom:1px solid #2a2a3a;color:#e0e0e0;">${value}</td>
        </tr>`;
    }

    const timestamp = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });

    const html = `
    <div style="background:#0d0d1a;padding:32px;font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#d4a843;margin:0;">⚽ Ampolla Mundialista 2026</h1>
        <p style="color:#888;font-size:14px;margin:8px 0 0;">Comprobante de Predicciones</p>
      </div>

      <div style="background:#1a1a2e;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <p style="color:#e0e0e0;margin:0 0 4px;">
          <strong style="color:#d4a843;">Participante:</strong> ${displayName}
        </p>
        <p style="color:#888;font-size:12px;margin:0;">
          Guardado el ${timestamp} (hora Colombia)
        </p>
      </div>

      <!-- Match Predictions -->
      <div style="background:#1a1a2e;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#ffffff;margin:0 0 16px;">📋 Predicciones de Partidos</h2>
        ${matchesHtml || '<p style="color:#888;">Sin predicciones de partidos.</p>'}
      </div>

      <!-- Advancing Teams -->
      <div style="background:#1a1a2e;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#ffffff;margin:0 0 16px;">🏆 Equipos Clasificados</h2>
        ${advancingHtml || '<p style="color:#888;">Sin predicciones de clasificados.</p>'}
      </div>

      <!-- Awards -->
      <div style="background:#1a1a2e;border:1px solid #2a2a3a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#ffffff;margin:0 0 16px;">🥇 Premios Individuales</h2>
        ${awardPreds && awardPreds.length > 0
          ? `<table style="width:100%;border-collapse:collapse;font-size:14px;">${awardsHtml}</table>`
          : '<p style="color:#888;">Sin predicciones de premios.</p>'
        }
      </div>

      <div style="text-align:center;padding:16px;color:#555;font-size:11px;">
        <p>Este correo es un comprobante automatico de tus predicciones.</p>
        <p>Guardado el ${timestamp}</p>
      </div>
    </div>`;

    const { error: emailError } = await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Ampolla Mundialista <onboarding@resend.dev>",
      to: userEmail,
      subject: `🏆 Tus predicciones - Ampolla Mundialista 2026 (${timestamp})`,
      html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
