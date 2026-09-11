import { NextRequest, NextResponse } from "next/server";
import { getRecentPairs } from "@/lib/dexscreener";
import { scorePair } from "@/lib/riskScore";

// GET /api/tokens?chain=solana&seed=SOL
// Returns recent pairs for a chain, each annotated with a risk score.
// The "seed" query is a workaround for Dexscreener's free tier not
// exposing a pure "new pairs" firehose — see lib/dexscreener.ts for notes
// on upgrading this to a real-time on-chain feed.
export async function GET(req: NextRequest) {
  const chain = req.nextUrl.searchParams.get("chain") ?? "solana";
  const seed = req.nextUrl.searchParams.get("seed") ?? "SOL";

  try {
    const pairs = await getRecentPairs(chain, seed);
    const annotated = pairs.slice(0, 30).map((pair) => ({
      pair,
      risk: scorePair(pair),
    }));
    return NextResponse.json({ tokens: annotated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch token data", detail: String(err) },
      { status: 502 }
    );
  }
}
