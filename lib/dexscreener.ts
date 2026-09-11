// Thin client around Dexscreener's public API.
// Docs: https://docs.dexscreener.com/api/reference
// No API key needed for these endpoints, but they're rate-limited —
// don't poll faster than once every few seconds per IP.

export type DexPair = {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  liquidity?: { usd: number };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  volume?: { h24: number; h6: number; h1: number };
  priceChange?: { h24: number; h6: number; h1: number };
  txns?: {
    h24: { buys: number; sells: number };
    h1: { buys: number; sells: number };
  };
  info?: { imageUrl?: string };
  url: string;
};

const BASE_URL = "https://api.dexscreener.com";

/**
 * Search pairs by a free-text query (token name, symbol, or address).
 * Useful for the risk-check tool where a user pastes a contract address.
 */
export async function searchPairs(query: string): Promise<DexPair[]> {
  const res = await fetch(`${BASE_URL}/latest/dex/search?q=${encodeURIComponent(query)}`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) throw new Error(`Dexscreener search failed: ${res.status}`);
  const data = await res.json();
  return data.pairs ?? [];
}

/**
 * Get the freshest pairs for a given chain, sorted client-side by creation time.
 * Dexscreener doesn't have a dedicated "new pairs" endpoint on the free tier,
 * so this pulls a broad set (e.g. by a common quote token) and filters/sorts.
 * For production-grade "first to know" speed, swap this for a direct
 * on-chain indexer (Helius webhooks on Solana, or a QuickNode stream on EVM).
 */
export async function getRecentPairs(chainId: string, seedQuery: string): Promise<DexPair[]> {
  const pairs = await searchPairs(seedQuery);
  return pairs
    .filter((p) => p.chainId === chainId)
    .sort((a, b) => (b.pairCreatedAt ?? 0) - (a.pairCreatedAt ?? 0));
}

/**
 * Approximates a "trending" list since Dexscreener's free tier has no
 * dedicated trending endpoint. Pulls pairs across a handful of popular
 * seed terms for the chain, dedupes by pair address, and sorts by 24h
 * volume — a reasonable proxy for "what's actually getting traded
 * right now" versus a raw new-launch firehose.
 */
export async function getTrendingPairs(chainId: string): Promise<DexPair[]> {
  const seeds = ["SOL", "USDC", "pump", "meme", "pepe"];
  const results = await Promise.all(seeds.map((s) => searchPairs(s).catch(() => [])));

  const seen = new Map<string, DexPair>();
  for (const pairs of results) {
    for (const p of pairs) {
      if (p.chainId === chainId && !seen.has(p.pairAddress)) {
        seen.set(p.pairAddress, p);
      }
    }
  }

  return Array.from(seen.values()).sort(
    (a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0)
  );
}
