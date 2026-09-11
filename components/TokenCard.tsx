import type { DexPair } from "@/lib/dexscreener";
import type { RiskResult } from "@/lib/riskScore";

const riskColors: Record<string, string> = {
  low: "bg-accent/20 text-accent border-accent/40",
  medium: "bg-warn/20 text-warn border-warn/40",
  high: "bg-danger/20 text-danger border-danger/40",
};

export default function TokenCard({ pair, risk }: { pair: DexPair; risk: RiskResult }) {
  const priceChange = pair.priceChange?.h1 ?? 0;
  const liquidity = pair.liquidity?.usd ?? 0;

  return (
    <a
      href={pair.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-panel border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-white">
            {pair.baseToken.symbol}
            <span className="text-gray-500 font-normal"> / {pair.quoteToken.symbol}</span>
          </div>
          <div className="text-xs text-gray-500">{pair.baseToken.name}</div>
        </div>
        <span className={`text-xs px-2 py-1 rounded border ${riskColors[risk.level]}`}>
          {risk.level.toUpperCase()} · {risk.score}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm mb-2">
        <div>
          <div className="text-gray-500 text-xs">Price</div>
          <div>${Number(pair.priceUsd).toPrecision(4)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">1h Change</div>
          <div className={priceChange >= 0 ? "text-accent" : "text-danger"}>
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Liquidity</div>
          <div>${liquidity >= 1000 ? (liquidity / 1000).toFixed(1) + "k" : liquidity.toFixed(0)}</div>
        </div>
      </div>

      {risk.flags.length > 0 && (
        <ul className="text-xs text-gray-400 space-y-0.5">
          {risk.flags.slice(0, 3).map((flag, i) => (
            <li key={i}>⚠ {flag}</li>
          ))}
        </ul>
      )}
    </a>
  );
}
