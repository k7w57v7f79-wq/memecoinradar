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
