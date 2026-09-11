"use client";

import { useEffect, useState } from "react";
import type { NewTokenEvent } from "@/lib/pumpportal";
import TokenAvatar from "@/components/TokenAvatar";

// pump.fun's bonding curve graduates to a DEX around ~85 SOL raised.
// Used only to render a rough progress bar — not an exact on-chain read.
const CURVE_TARGET_SOL = 85;

const imageCache = new Map<string, string | null>();

function useTokenImage(uri?: string) {
  const [image, setImage] = useState<string | null>(uri ? imageCache.get(uri) ?? null : null);

  useEffect(() => {
    if (!uri || imageCache.has(uri)) return;
    let cancelled = false;
    fetch(uri)
      .then((r) => r.json())
      .then((meta) => {
        const img = typeof meta?.image === "string" ? meta.image : null;
        imageCache.set(uri, img);
        if (!cancelled) setImage(img);
      })
      .catch(() => {
        imageCache.set(uri, null);
      });
    return () => {
      cancelled = true;
    };
  }, [uri]);

  return image;
}

function useElapsed(since: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - since) / 1000)), 1000);
    return () => clearInterval(id);
  }, [since]);
  return elapsed;
}

export default function LiveLaunchCard({ token, seenAt }: { token: NewTokenEvent; seenAt: number }) {
  const image = useTokenImage(token.uri);
  const elapsed = useElapsed(seenAt);
  const marketCap = token.marketCapSol ?? 0;
  const solInCurve = token.vSolInBondingCurve ?? 0;
  const curveProgress = Math.min(100, Math.round((solInCurve / CURVE_TARGET_SOL) * 100));
  const pumpUrl = `https://pump.fun/coin/${token.mint}`;

  return (
    <a
      href={pumpUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-panel border border-line rounded p-4 hover:border-gain/60 transition-colors animate-glowIn"
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <TokenAvatar symbol={token.symbol} imageUrl={image} />
          <div className="min-w-0">
            <div className="font-display text-base text-ink truncate">{token.symbol}</div>
            <div className="text-xs text-mute truncate">{token.name}</div>
            <div className="text-[10px] text-mute/70 font-num truncate">{token.mint}</div>
          </div>
        </div>
        <span className="shrink-0 text-[10px] px-2 py-1 rounded bg-gain text-void font-num font-semibold">
          {elapsed}s
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-2 font-num text-[13px] mb-2">
        <div>
          <div className="text-mute text-[10px] uppercase">Mkt Cap</div>
          <div className="text-ink">{marketCap.toFixed(2)} SOL</div>
        </div>
        <div>
          <div className="text-mute text-[10px] uppercase">Liquidity</div>
          <div className="text-ink">{solInCurve.toFixed(2)} SOL</div>
        </div>
      </div>

      <div className="mb-1">
        <div className="flex justify-between text-[10px] text-mute uppercase mb-1">
          <span>Curve progress</span>
          <span>{curveProgress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-panel2 overflow-hidden">
          <div className="bg-gain h-full transition-all" style={{ width: `${curveProgress}%` }} />
        </div>
      </div>

      <div className="text-[11px] text-mute border-t border-line pt-2 mt-2">
        Holders / buy-sell ratio: not available yet (needs live trade subscription)
      </div>
    </a>
  );
}
