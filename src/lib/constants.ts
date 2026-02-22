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
  THIRD_PLACE: 10,
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
  third_place: SCORING.THIRD_PLACE,
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

export const FIXED_PRIZES = {
  firstPlace: 20_000_000,
  secondPlace: 5_000_000,
  thirdPlace: 300_000,
};

export const NEQUI_NUMBER = process.env.NEXT_PUBLIC_NEQUI_NUMBER || "";

// ---------------------------------------------------------------------------
// FIFA 2026 Bracket mapping
// ---------------------------------------------------------------------------

/**
 * Maps each knockout match number to where its winner advances.
 * Based on the official FIFA World Cup 2026 fixture schedule.
 */
export const ADVANCE_MAP: Record<number, { nextMatch: number; slot: 'home' | 'away' }> = {
  // R32 → R16
  74: { nextMatch: 89, slot: 'home' },
  77: { nextMatch: 89, slot: 'away' },
  73: { nextMatch: 90, slot: 'home' },
  75: { nextMatch: 90, slot: 'away' },
  76: { nextMatch: 91, slot: 'home' },
  78: { nextMatch: 91, slot: 'away' },
  79: { nextMatch: 92, slot: 'home' },
  80: { nextMatch: 92, slot: 'away' },
  83: { nextMatch: 93, slot: 'home' },
  84: { nextMatch: 93, slot: 'away' },
  81: { nextMatch: 94, slot: 'home' },
  82: { nextMatch: 94, slot: 'away' },
  86: { nextMatch: 95, slot: 'home' },
  88: { nextMatch: 95, slot: 'away' },
  85: { nextMatch: 96, slot: 'home' },
  87: { nextMatch: 96, slot: 'away' },
  // R16 → QF
  89: { nextMatch: 97, slot: 'home' },
  90: { nextMatch: 97, slot: 'away' },
  93: { nextMatch: 98, slot: 'home' },
  94: { nextMatch: 98, slot: 'away' },
  91: { nextMatch: 99, slot: 'home' },
  92: { nextMatch: 99, slot: 'away' },
  95: { nextMatch: 100, slot: 'home' },
  96: { nextMatch: 100, slot: 'away' },
  // QF → SF
  97: { nextMatch: 101, slot: 'home' },
  98: { nextMatch: 101, slot: 'away' },
  99: { nextMatch: 102, slot: 'home' },
  100: { nextMatch: 102, slot: 'away' },
  // SF → Final
  101: { nextMatch: 104, slot: 'home' },
  102: { nextMatch: 104, slot: 'away' },
};

/**
 * Visual bracket display order — match numbers arranged so that
 * vertically adjacent pairs correctly feed into the next round.
 */
export const BRACKET_DISPLAY_ORDER = {
  left: {
    r32: [74, 77, 73, 75, 83, 84, 81, 82],
    r16: [89, 90, 93, 94],
    qf: [97, 98],
    sf: [101],
  },
  right: {
    r32: [76, 78, 79, 80, 86, 88, 85, 87],
    r16: [91, 92, 95, 96],
    qf: [99, 100],
    sf: [102],
  },
};

/**
 * Calculate prize amounts based on number of paid participants.
 */
export function calculatePrizes(paidCount: number) {
  const totalPool = paidCount * ENTRY_FEE_COP;
  return {
    totalPool,
    firstPlace: FIXED_PRIZES.firstPlace,
    secondPlace: FIXED_PRIZES.secondPlace,
    thirdPlace: FIXED_PRIZES.thirdPlace,
    paidCount,
  };
}
