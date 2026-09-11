// PumpPortal (pumpportal.fun) runs a free, public WebSocket feed of
// real-time activity on pump.fun — the platform most new Solana
// memecoins actually launch through. No API key needed for this
// read-only data stream (their paid tier is only for trade execution).
// Docs: https://pumpportal.fun/data-api/real-time

export type NewTokenEvent = {
  txType: "create";
  mint: string;
  traderPublicKey: string;
  name: string;
  symbol: string;
  uri?: string;
  initialBuy?: number;
  marketCapSol?: number;
  vSolInBondingCurve?: number;
  vTokensInBondingCurve?: number;
  pool?: string;
  signature?: string;
};

export const PUMPPORTAL_WS_URL = "wss://pumpportal.fun/api/data";

export function isNewTokenEvent(data: unknown): data is NewTokenEvent {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as Record<string, unknown>).txType === "create" &&
    typeof (data as Record<string, unknown>).mint === "string"
  );
}
