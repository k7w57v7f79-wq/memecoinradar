import { NextRequest, NextResponse } from "next/server";
import { searchPairs } from "@/lib/dexscreener";
import { scorePair } from "@/lib/riskScore";

// GET /api/risk-check?q=<contract address or symbol>
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query param 'q'" }, { status: 400 });
  }

  try {
    const pairs = await searchPairs(query);
    if (pairs.length === 0) {
      return NextResponse.json({ error: "No matching pairs found" }, { status: 404 });
    }
    const results = pairs.slice(0, 5).map((pair) => ({
      pair,
      risk: scorePair(pair),
    }));
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: "Risk check failed", detail: String(err) },
      { status: 502 }
    );
  }
}
