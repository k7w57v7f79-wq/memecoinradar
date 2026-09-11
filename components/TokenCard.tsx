import type { DexPair } from "@/lib/dexscreener";
import type { RiskResult } from "@/lib/riskScore";
import TokenAvatar from "@/components/TokenAvatar";

const riskColors: Record<string, string> = {
  low: "bg-gain/15 text-gain border-gain/40",
  medium: "bg-gold/15 text-gold border-gold/40",
  high: "bg-hot/15 text-hot border-hot/40",
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}

function formatAge(createdAt?: number): string {
  if (!createdAt) return "—";
  const mins = Math.floor((Date.now() - createdAt) / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function TokenCard({ pair, risk }: { pair: DexPair; risk: RiskResult }) {
  const priceChange = pair.priceChange?.h1 ?? 0;
  const liquidity = pair.liquidity?.usd ?? 0;
  const marketCap = pair.fdv ?? pair.marketCap ?? 0;
  const volume24h = pair.volume?.h24 ?? 0;
  const buys = pair.txns?.h24?.buys ?? 0;
  const sells = pair.txns?.h24?.sells ?? 0;
  const totalTxns = buys + sells;
  const buyRatio = totalTxns > 0 ? Math.round((buys / totalTxns) * 100) : null;

  return (
    <a
      href={pair.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-panel border border-line rounded p-4 hover:border-gain/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <TokenAvatar symbol={pair.baseToken.symbol} imageUrl={pair.info?.imageUrl} />
          <div className="min-w-0">
            <div className="font-display text-base text-ink truncate">
              {pair.baseToken.symbol}
              <span className="text-mute font-body font-normal text-sm"> / {pair.quoteToken.symbol}</span>
            </div>
            <div className="text-xs text-mute truncate">{pair.baseToken.name}</div>
          </div>
        </div>
        <span className={`shrink-0 text-[10px] px-2 py-1 rounded border font-num font-semibold ${riskColors[risk.level]}`}>
          {risk.level.toUpperCase()} {risk.score}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-y-2 gap-x-2 font-num text-[13px] mb-2">
        <div>
          <div className="text-mute text-[10px] uppercase">Price</div>
          <div className="text-ink">${Number(pair.priceUsd).toPrecision(4)}</div>
        </div>
        <div>
          <div className="text-mute text-[10px] uppercase">1h</div>
          <div className={priceChange >= 0 ? "text-gain" : "text-hot"}>
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-mute text-[10px] uppercase">Age</div>
          <div className="text-ink">{formatAge(pair.pairCreatedAt)}</div>
        </div>
        <div>
          <div className="text-mute text-[10px] uppercase">Liquidity</div>
          <div className="text-ink">{formatCompact(liquidity)}</div>
        </div>
        <div>
          <div className="text-mute text-[10px] uppercase">Mkt Cap</div>
          <div className="text-ink">{formatCompact(marketCap)}</div>
        </div>
        <div>
          <div className="text-mute text-[10px] uppercase">Vol 24h</div>
          <div className="text-ink">{formatCompact(volume24h)}</div>
        </div>
      </div>

      {buyRatio !== null && (
        <div className="mb-2">
          <div className="flex justify-between text-[10px] text-mute uppercase mb-1">
            <span>Buys {buys}</span>
            <span>Sells {sells}</span>
          </div>
          <div className="h-1.5 rounded-full bg-panel2 overflow-hidden flex">
            <div className="bg-gain h-full" style={{ width: `${buyRatio}%` }} />
            <div className="bg-hot h-full" style={{ width: `${100 - buyRatio}%` }} />
          </div>
        </div>
      )}

      <div className="text-[11px] text-mute border-t border-line pt-2 mt-2 flex justify-between">
        <span>Holders: not available (needs on-chain indexer)</span>
      </div>

      {risk.flags.length > 0 && (
        <ul className="text-xs text-mute space-y-0.5 mt-2">
          {risk.flags.slice(0, 3).map((flag, i) => (
            <li key={i}>⚠ {flag}</li>
          ))}
        </ul>
      )}
    </a>
  );
}
