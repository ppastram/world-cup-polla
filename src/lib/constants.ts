export const PREDICTION_DEADLINE = new Date("2026-06-04T23:59:59-05:00");
export const TOURNAMENT_START = new Date("2026-06-11T00:00:00-05:00");

export const SCORING = {
  // Match predictions (group stage)
  EXACT_SCORE: 5,
  CORRECT_RESULT_AND_DIFF: 3,
  CORRECT_RESULT: 2,

  // Advancing teams
  ROUND_32: 2,
  ROUND_16: 3,
  QUARTER: 5,
  SEMI: 8,
  FINAL: 12,
  CHAMPION: 20,

  // Awards
  GOLDEN_BALL: 10,
  GOLDEN_BOOT: 8,
  GOLDEN_GLOVE: 8,
  BEST_YOUNG: 8,
  TOTAL_GOALS_EXACT: 15,
  TOTAL_GOALS_WITHIN_3: 8,
  TOTAL_GOALS_WITHIN_5: 4,
} as const;

export const ADVANCING_ROUND_POINTS: Record<string, number> = {
  round_32: SCORING.ROUND_32,
  round_16: SCORING.ROUND_16,
  quarter: SCORING.QUARTER,
  semi: SCORING.SEMI,
  final: SCORING.FINAL,
  champion: SCORING.CHAMPION,
};

export const GROUPS = [
  "A", "B", "C", "D", "E", "F",
  "G", "H", "I", "J", "K", "L",
] as const;

export const STAGES_LABELS: Record<string, string> = {
  group: "Fase de Grupos",
  round_32: "Dieciseisavos de Final",
  round_16: "Octavos de Final",
  quarter: "Cuartos de Final",
  semi: "Semifinales",
  third_place: "Tercer Puesto",
  final: "Final",
};

export const ENTRY_FEE_COP = 300_000;

export const PRIZE_POOL = {
  entry_fee: ENTRY_FEE_COP,
  first_place_pct: 0.7,
  second_place_pct: 0.15,
  third_place_return: true, // gets entry fee back
};

export const NEQUI_NUMBER = process.env.NEXT_PUBLIC_NEQUI_NUMBER || "";

/**
 * Calculate prize amounts based on number of paid participants.
 */
export function calculatePrizes(paidCount: number) {
  const totalPool = paidCount * ENTRY_FEE_COP;
  return {
    totalPool,
    firstPlace: Math.floor(totalPool * PRIZE_POOL.first_place_pct),
    secondPlace: Math.floor(totalPool * PRIZE_POOL.second_place_pct),
    thirdPlace: ENTRY_FEE_COP, // gets entry fee back
    paidCount,
  };
}
