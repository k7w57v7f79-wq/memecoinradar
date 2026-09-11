import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Memecoin Radar</h1>
        <p className="text-gray-400 mb-8">
          Live token feed, auto-scored for risk. Built as an MVP scaffold —
          see the README for what's stubbed vs. real.
        </p>
        <Link
          href="/radar"
          className="inline-block bg-accent text-black font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Open the Radar →
        </Link>
      </div>
    </main>
  );
}
