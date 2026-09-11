import type { DexPair } from "./dexscreener";

export type RiskLevel = "low" | "medium" | "high";

export type RiskResult = {
  level: RiskLevel;
  score: number; // 0 (safest) to 100 (most dangerous)
  flags: string[];
};

/**
 * Heuristic risk scoring from data Dexscreener already gives us.
 * This is NOT a substitute for a real contract-level scan (mint authority,
 * LP lock status, honeypot simulation) — those require reading the chain
 * directly. Treat this as the fast first-pass filter; wire in a real
 * on-chain check (e.g. via Helius for Solana, or GoPlus Security API for
 * EVM chains) as the next layer once this MVP is working.
 */
export function scorePair(pair: DexPair): RiskResult {
  const flags: string[] = [];
  let score = 0;

  const liquidityUsd = pair.liquidity?.usd ?? 0;
  const ageMs = pair.pairCreatedAt ? Date.now() - pair.pairCreatedAt : Infinity;
  const ageMinutes = ageMs / 60000;
  const buys = pair.txns?.h1?.buys ?? 0;
  const sells = pair.txns?.h1?.sells ?? 0;

  if (liquidityUsd < 2000) {
    flags.push("Very low liquidity (<$2k)");
    score += 30;
  } else if (liquidityUsd < 10000) {
    flags.push("Low liquidity (<$10k)");
    score += 15;
  }

  if (ageMinutes < 10) {
    flags.push("Pair created under 10 minutes ago");
    score += 20;
  }

  if (sells === 0 && buys > 5) {
    flags.push("No sells recorded yet despite buy activity — unverified exit");
    score += 15;
  }

  const change1h = pair.priceChange?.h1 ?? 0;
  if (change1h > 300) {
    flags.push("Price up >300% in the last hour — high volatility");
    score += 15;
  }

  if (!pair.fdv || pair.fdv < 1000) {
    flags.push("Missing or negligible FDV data");
    score += 10;
  }

  score = Math.min(score, 100);
  const level: RiskLevel = score >= 55 ? "high" : score >= 25 ? "medium" : "low";

  return { level, score, flags };
}
