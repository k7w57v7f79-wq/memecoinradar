import type { NewTokenEvent } from "@/lib/pumpportal";

export default function LiveLaunchCard({ token }: { token: NewTokenEvent }) {
  const marketCap = token.marketCapSol ?? 0;
  const pumpUrl = `https://pump.fun/coin/${token.mint}`;

  return (
    <a
      href={pumpUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-panel border border-border rounded-lg p-4 hover:border-accent/50 transition-colors animate-[fadeIn_0.3s_ease-in]"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-white">
            {token.symbol}
            <span className="text-gray-500 font-normal text-sm"> {token.name}</span>
          </div>
          <div className="text-xs text-gray-600 truncate max-w-[220px]">{token.mint}</div>
        </div>
        <span className="text-xs px-2 py-1 rounded border bg-accent/20 text-accent border-accent/40 whitespace-nowrap">
          NEW
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-gray-500 text-xs">Market Cap</div>
          <div>{marketCap.toFixed(2)} SOL</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Initial Buy</div>
          <div>{(token.initialBuy ?? 0).toFixed(3)} SOL</div>
        </div>
      </div>
    </a>
  );
}
