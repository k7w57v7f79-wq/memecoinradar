"use client";

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import TokenCard from "@/components/TokenCard";
import type { DexPair } from "@/lib/dexscreener";
import type { RiskResult } from "@/lib/riskScore";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type TokenEntry = { pair: DexPair; risk: RiskResult };

export default function TrendingPage() {
  const [chain, setChain] = useState("solana");

  const { data, error, isLoading } = useSWR(`/api/trending?chain=${chain}`, fetcher, {
    refreshInterval: 30000,
  });

  const tokens: TokenEntry[] = data?.tokens ?? [];

  return (
    <main className="min-h-screen bg-void px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-ink">TRENDING</h1>
            <p className="text-mute text-sm mt-1">Ranked by 24h trading volume. Refreshes every 30s.</p>
            <div className="flex gap-3 mt-1">
              <Link href="/radar" className="text-xs text-gain hover:underline">
                search view
              </Link>
              <Link href="/radar/live" className="text-xs text-gain hover:underline">
                live launches
              </Link>
            </div>
          </div>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="bg-panel border border-line rounded px-3 py-2 text-sm text-ink h-fit"
          >
            <option value="solana">Solana</option>
            <option value="ethereum">Ethereum</option>
            <option value="base">Base</option>
            <option value="bsc">BSC</option>
          </select>
        </div>

        {isLoading && <p className="text-mute">Loading...</p>}
        {error && <p className="text-hot">Failed to load trending data.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((t, i) => (
            <div key={t.pair.pairAddress} className="relative">
              <span className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-gold text-void font-num font-bold text-xs flex items-center justify-center">
                {i + 1}
              </span>
              <TokenCard pair={t.pair} risk={t.risk} />
            </div>
          ))}
        </div>

        {!isLoading && tokens.length === 0 && (
          <p className="text-mute mt-8 text-center">No trending data available right now.</p>
        )}
      </div>
    </main>
  );
}
