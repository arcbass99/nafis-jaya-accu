import { normalizeText } from "@/lib/utils";
import type {
  BatteryItem,
  BatterySearchFilters,
  BatterySortOption,
} from "@/types/battery";

export const QUICK_SEARCH_KEYWORDS = [
  "Avanza",
  "Brio",
  "Innova",
  "NMAX",
  "Vario",
  "Beat",
  "NS40",
  "GTZ5",
] as const;

interface IndexedBattery {
  item: BatteryItem;
  index: number;
  codeCompact: string;
  vehicleWords: string[];
  vehicleCompacts: string[];
  otherWords: string[];
  fullCompact: string;
}

/** Strip diacritics, lowercase, and remove all non-alphanumeric separators. */
export function normalizeCompact(value: string): string {
  return normalizeText(value).replace(/[^a-z0-9]/g, "");
}

/** Parse numeric Ah rating from capacity labels like "32 Ah" or "12V 12Ah". */
export function extractCapacityAh(capacity: string): number | null {
  const match = capacity.match(/(\d+(?:\.\d+)?)\s*ah\b/i);
  return match ? Number(match[1]) : null;
}

/** Check Optimal String Alignment (Damerau-Levenshtein) distance <= maxDist. */
export function editDistanceWithin(a: string, b: string, maxDist: number): boolean {
  if (Math.abs(a.length - b.length) > maxDist) return false;
  if (a === b) return true;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    let rowMin = Infinity;
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, dp[i - 2][j - 2] + 1);
      }
      dp[i][j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist) return false;
  }

  return dp[a.length][b.length] <= maxDist;
}

function splitAlphaNumWords(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function buildIndex(item: BatteryItem, index: number): IndexedBattery {
  const vehicleWords = item.commonVehicles.flatMap(splitAlphaNumWords);
  const vehicleCompacts = item.commonVehicles.map(normalizeCompact).filter(Boolean);
  const otherWords = [
    ...splitAlphaNumWords(item.code),
    ...splitAlphaNumWords(item.capacity),
    ...splitAlphaNumWords(item.categoryLabel),
    ...splitAlphaNumWords(item.typeLabel),
    ...item.keywords.flatMap(splitAlphaNumWords),
  ];

  const fullCompact = normalizeCompact(
    [
      item.code,
      item.capacity,
      item.categoryLabel,
      item.typeLabel,
      ...item.commonVehicles,
      ...item.keywords,
    ].join(" "),
  );

  return {
    item,
    index,
    codeCompact: normalizeCompact(item.code),
    vehicleWords,
    vehicleCompacts,
    otherWords,
    fullCompact,
  };
}

function scoreDirectToken(entry: IndexedBattery, token: string): number {
  const compactToken = normalizeCompact(token);
  if (!compactToken) return 0;

  if (entry.codeCompact === compactToken) return 120;
  if (entry.codeCompact.startsWith(compactToken)) return 95;
  if (entry.codeCompact.includes(compactToken)) return 75;

  if (entry.vehicleWords.some((w) => w === compactToken) || entry.vehicleCompacts.includes(compactToken)) {
    return 70;
  }

  const isNumericToken = /^\d+$/.test(compactToken);
  if (!isNumericToken && compactToken.length >= 2) {
    if (entry.vehicleWords.some((w) => w.startsWith(compactToken))) return 55;
  }
  if (!isNumericToken && compactToken.length >= 3) {
    if (entry.vehicleCompacts.some((w) => w.includes(compactToken))) return 45;
  }

  if (entry.otherWords.some((w) => w === compactToken)) return 40;
  if (!isNumericToken && compactToken.length >= 2) {
    if (entry.otherWords.some((w) => w.startsWith(compactToken))) return 30;
  }
  if (!isNumericToken && compactToken.length >= 3) {
    if (entry.fullCompact.includes(compactToken)) return 20;
  }

  return 0;
}

function scoreFuzzyToken(entry: IndexedBattery, token: string): number {
  // Never run fuzzy matching on numeric/code tokens so NS40 never matches NS60.
  if (/\d/.test(token) || token.length < 4) return 0;
  const maxDist = token.length >= 7 ? 2 : 1;

  if (entry.vehicleWords.some((w) => !/\d/.test(w) && editDistanceWithin(token, w, maxDist))) {
    return 14;
  }
  if (entry.otherWords.some((w) => !/\d/.test(w) && editDistanceWithin(token, w, maxDist))) {
    return 8;
  }
  return 0;
}

function matchesFacetFilters(item: BatteryItem, filters: BatterySearchFilters): boolean {
  if (filters.vehicle !== "all" && item.vehicleType !== filters.vehicle) return false;
  if (filters.onlyPopular && !item.isPopular) return false;

  if (filters.tech === "mf") {
    return item.technology === "maintenance-free" || item.technology === "motorcycle-mf";
  }
  if (filters.tech === "dry-charge") {
    return item.technology === "dry-charge";
  }
  return true;
}

function compareByCapacity(a: BatteryItem, b: BatteryItem, ascending: boolean, fallbackCompare: number): number {
  const ahA = extractCapacityAh(a.capacity);
  const ahB = extractCapacityAh(b.capacity);

  if (ahA !== null && ahB !== null) {
    if (ahA !== ahB) return ascending ? ahA - ahB : ahB - ahA;
    return fallbackCompare;
  }
  if (ahA !== null) return -1;
  if (ahB !== null) return 1;
  return fallbackCompare;
}

/**
 * Filter, match, score, and sort battery items with multi-token + digit-guarded typo fallback.
 */
export function searchAndSortBatteries(
  items: readonly BatteryItem[],
  params: {
    query: string;
    filters: BatterySearchFilters;
    sort: BatterySortOption;
  },
): BatteryItem[] {
  const indexed = items.map(buildIndex);
  const queryTokens = splitAlphaNumWords(params.query);
  const queryCompact = normalizeCompact(params.query);
  const hasCompactCodeQuery =
    queryTokens.length >= 2 &&
    queryCompact.length >= 3 &&
    /[a-z]/.test(queryCompact) &&
    /\d/.test(queryCompact) &&
    indexed.some((entry) => entry.codeCompact === queryCompact || entry.codeCompact.startsWith(queryCompact));

  const directHitsByToken = queryTokens.map((token) =>
    indexed.some((entry) => scoreDirectToken(entry, token) > 0),
  );

  const scored = indexed
    .filter((entry) => matchesFacetFilters(entry.item, params.filters))
    .map((entry) => {
      if (queryTokens.length === 0) {
        return { entry, score: entry.item.isPopular ? 10 : 0, matched: true };
      }

      if (hasCompactCodeQuery) {
        if (entry.codeCompact === queryCompact) {
          return { entry, score: 200 + (entry.item.isPopular ? 5 : 0), matched: true };
        }
        if (entry.codeCompact.startsWith(queryCompact)) {
          return { entry, score: 140 + (entry.item.isPopular ? 5 : 0), matched: true };
        }
        return { entry, score: 0, matched: false };
      }

      let totalScore = entry.codeCompact === queryCompact ? 150 : entry.codeCompact.startsWith(queryCompact) ? 60 : 0;

      for (let i = 0; i < queryTokens.length; i += 1) {
        const token = queryTokens[i];
        const directScore = scoreDirectToken(entry, token);
        if (directScore > 0) {
          totalScore += directScore;
          continue;
        }
        if (!directHitsByToken[i]) {
          const fuzzyScore = scoreFuzzyToken(entry, token);
          if (fuzzyScore > 0) {
            totalScore += fuzzyScore;
            continue;
          }
        }
        return { entry, score: 0, matched: false };
      }

      if (entry.item.isPopular) totalScore += 5;
      return { entry, score: totalScore, matched: true };
    })
    .filter((row) => row.matched);

  scored.sort((a, b) => {
    const defaultOrder = a.entry.index - b.entry.index;
    const popularTie = Number(Boolean(b.entry.item.isPopular)) - Number(Boolean(a.entry.item.isPopular));

    switch (params.sort) {
      case "popular":
        return popularTie || defaultOrder;
      case "capacity-asc":
        return compareByCapacity(a.entry.item, b.entry.item, true, popularTie || defaultOrder);
      case "capacity-desc":
        return compareByCapacity(a.entry.item, b.entry.item, false, popularTie || defaultOrder);
      case "code-asc":
        return a.entry.item.code.localeCompare(b.entry.item.code) || defaultOrder;
      case "relevance":
      default:
        return b.score - a.score || popularTie || defaultOrder;
    }
  });

  return scored.map((row) => row.entry.item);
}
