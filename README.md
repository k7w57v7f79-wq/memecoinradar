# Memecoin Radar — MVP Scaffold

A starting point for the "token radar + risk scanner" piece of the
platform we mapped out: a live feed of token pairs, each auto-annotated
with a heuristic risk score.

## What's real vs. what's stubbed

**Real and working (once you run it):**
- Live data from Dexscreener's free public API (no key needed)
- A working risk-scoring heuristic based on liquidity, pair age, buy/sell
  imbalance, and volatility
- A polling feed (every 15s) with a chain selector and search seed
- A standalone risk-check API route (`/api/risk-check?q=<address>`) you
  can point a future "paste a contract, get a score" page at

**Deliberately stubbed — these are the next real milestones:**
1. **True "new pair" firehose.** Dexscreener's free tier doesn't expose
   a pure new-pairs stream, so `getRecentPairs()` fakes it by searching
   a seed term and sorting by creation time. For real first-to-know
   speed, swap this for a direct on-chain indexer — Helius webhooks
   (Solana) or a QuickNode/Alchemy stream (EVM chains) that fires the
   moment a new liquidity pool is created.
2. **Real contract-level risk checks.** The current risk score only
   uses market data (liquidity, age, volume). It does NOT check mint
   authority, LP lock status, or simulate a buy/sell to catch
   honeypots. Layer in something like the GoPlus Security API (EVM) or
   direct Solana program reads for that.
3. **Persistence.** Nothing is stored — every page load re-fetches.
   Add Postgres once you want history, alerts, or user accounts.
4. **Websockets instead of polling.** 15-second polling is fine for an
   MVP but not "first to know." Once you're on a real indexer, push
   updates over a websocket instead.

## Running it locally

This environment has no network access, so dependencies haven't been
installed or tested here — do this on your own machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 and click through to `/radar`.

## Suggested build order from here

1. Get this running locally and confirm the Dexscreener feed works
2. Swap the seed-search hack for a real on-chain indexer (Helius is the
   easiest on-ramp for Solana)
3. Add the contract-level risk API (GoPlus or similar) alongside the
   existing heuristic score
4. Add Postgres + a simple watchlist/alerts feature
5. Only then move on to the wallet tracker or paper trading pieces —
   this radar + risk pipeline is meant to be the shared foundation both
   of those build on top of
