import { NextRequest, NextResponse } from "next/server";
import { getTrendingPairs } from "@/lib/dexscreener";
import { scorePair } from "@/lib/riskScore";

// GET /api/trending?chain=solana
export async function GET(req: NextRequest) {
  const chain = req.nextUrl.searchParams.get("chain") ?? "solana";

  try {
    const pairs = await getTrendingPairs(chain);
    const annotated = pairs.slice(0, 24).map((pair) => ({
      pair,
      risk: scorePair(pair),
    }));
    return NextResponse.json({ tokens: annotated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch trending data", detail: String(err) },
      { status: 502 }
    );
  }
}
