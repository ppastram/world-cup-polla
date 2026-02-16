import { SCORING } from "./constants";

/**
 * Calculate points for a match prediction.
 * This mirrors the SQL function calculate_match_points().
 */
export function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  // Exact score
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return SCORING.EXACT_SCORE;
  }

  const predictedDiff = predictedHome - predictedAway;
  const actualDiff = actualHome - actualAway;
  const predictedResult = Math.sign(predictedDiff);
  const actualResult = Math.sign(actualDiff);

  // Correct result (W/D/L)
  if (predictedResult === actualResult) {
    // Also correct goal difference
    if (predictedDiff === actualDiff) {
      return SCORING.CORRECT_RESULT_AND_DIFF;
    }
    return SCORING.CORRECT_RESULT;
  }

  return 0;
}

/**
 * Calculate points for an advancing team prediction.
 */
export function calculateAdvancingPoints(round: string): number {
  const roundPoints: Record<string, number> = {
    round_32: SCORING.ROUND_32,
    round_16: SCORING.ROUND_16,
    quarter: SCORING.QUARTER,
    semi: SCORING.SEMI,
    final: SCORING.FINAL,
    champion: SCORING.CHAMPION,
  };
  return roundPoints[round] ?? 0;
}

/**
 * Calculate points for total goals prediction.
 */
export function calculateTotalGoalsPoints(
  predicted: number,
  actual: number
): number {
  const diff = Math.abs(predicted - actual);
  if (diff === 0) return SCORING.TOTAL_GOALS_EXACT;
  if (diff <= 3) return SCORING.TOTAL_GOALS_WITHIN_3;
  if (diff <= 5) return SCORING.TOTAL_GOALS_WITHIN_5;
  return 0;
}

/**
 * Calculate points for an individual award prediction.
 */
export function calculateAwardPoints(
  awardType: string,
  predictedPlayer: string | null,
  actualPlayer: string | null
): number {
  if (!predictedPlayer || !actualPlayer) return 0;
  if (predictedPlayer.toLowerCase().trim() !== actualPlayer.toLowerCase().trim()) return 0;

  const awardPoints: Record<string, number> = {
    golden_ball: SCORING.GOLDEN_BALL,
    golden_boot: SCORING.GOLDEN_BOOT,
    golden_glove: SCORING.GOLDEN_GLOVE,
    best_young: SCORING.BEST_YOUNG,
  };
  return awardPoints[awardType] ?? 0;
}
