import Link from "next/link";
import TickerBanner from "@/components/TickerBanner";

const hypeItems = [
  "NEW TOKENS EVERY FEW SECONDS",
  "LIVE ON-CHAIN DATA",
  "RISK-SCORED IN REAL TIME",
  "DON'T MISS THE NEXT ONE",
  "SOLANA · PUMP.FUN · LIVE FEED",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-void flex flex-col">
      <TickerBanner items={hypeItems} />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] text-ink mb-4">
            CATCH IT<br />
            <span className="text-hot">BEFORE</span> IT<br />
            <span className="text-gain">PUMPS</span>
          </h1>
          <p className="text-mute text-base mb-10 max-w-sm mx-auto">
            Every new memecoin launch, streamed live the second it hits the chain.
            Risk-scored. Zero delay.
          </p>
          <Link
            href="/radar/live"
            className="inline-block bg-hot text-void font-display text-sm px-8 py-4 rounded hover:brightness-110 transition"
          >
            ENTER THE FEED →
          </Link>
          <div className="mt-4">
            <Link href="/radar" className="text-mute text-sm hover:text-ink underline underline-offset-4">
              or search a specific token
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
