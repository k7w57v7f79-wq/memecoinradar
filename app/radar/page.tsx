"use client";

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import TokenCard from "@/components/TokenCard";
import type { DexPair } from "@/lib/dexscreener";
import type { RiskResult } from "@/lib/riskScore";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type TokenEntry = { pair: DexPair; risk: RiskResult };

export default function RadarPage() {
  const [chain, setChain] = useState("solana");
  const [seed, setSeed] = useState("SOL");

  // Polls every 15s. Tune this based on your Dexscreener rate limits —
  // for a real "first to know" feed, replace this with a websocket
  // subscription to an on-chain indexer instead of polling.
  const { data, error, isLoading } = useSWR(
    `/api/tokens?chain=${chain}&seed=${encodeURIComponent(seed)}`,
    fetcher,
    { refreshInterval: 15000 }
  );

  const tokens: TokenEntry[] = data?.tokens ?? [];

  return (
    <main className="min-h-screen bg-void px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-ink">TOKEN SEARCH</h1>
            <p className="text-mute text-sm mt-1">Search-based pairs, auto-scored for risk. Refreshes every 15s.</p>
            <Link href="/radar/live" className="text-xs text-gain hover:underline">
              → want actual new memecoin launches? try the live feed
            </Link>
          </div>
          <div className="flex gap-2">
            <select
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              className="bg-panel border border-line rounded px-3 py-2 text-sm text-ink"
            >
              <option value="solana">Solana</option>
              <option value="ethereum">Ethereum</option>
              <option value="base">Base</option>
              <option value="bsc">BSC</option>
            </select>
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="seed query (e.g. SOL, USDC)"
              className="bg-panel border border-line rounded px-3 py-2 text-sm w-48 text-ink placeholder:text-mute"
            />
          </div>
        </div>

        {isLoading && <p className="text-mute">Loading...</p>}
        {error && <p className="text-hot">Failed to load token data.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((t) => (
            <TokenCard key={t.pair.pairAddress} pair={t.pair} risk={t.risk} />
          ))}
        </div>

        {!isLoading && tokens.length === 0 && (
          <p className="text-mute mt-8 text-center">
            No pairs found for this seed query. Try a different chain or seed term.
          </p>
        )}
      </div>
    </main>
  );
}
