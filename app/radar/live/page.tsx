"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LiveLaunchCard from "@/components/LiveLaunchCard";
import { PUMPPORTAL_WS_URL, isNewTokenEvent, type NewTokenEvent } from "@/lib/pumpportal";

const MAX_TOKENS = 60;

export default function LiveLaunchesPage() {
  const [tokens, setTokens] = useState<NewTokenEvent[]>([]);
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      const ws = new WebSocket(PUMPPORTAL_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setStatus("live");
        // Subscribe to new-token creation events across pump.fun.
        ws.send(JSON.stringify({ method: "subscribeNewToken" }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (isNewTokenEvent(data)) {
            setTokens((prev) => [data, ...prev].slice(0, MAX_TOKENS));
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onerror = () => {
        if (!cancelled) setStatus("error");
      };

      ws.onclose = () => {
        if (cancelled) return;
        setStatus("connecting");
        // Auto-reconnect after a short delay if the connection drops.
        setTimeout(() => {
          if (!cancelled) connect();
        }, 3000);
      };
    }

    connect();
    return () => {
      cancelled = true;
      wsRef.current?.close();
    };
  }, []);

  return (
    <main className="min-h-screen bg-bg px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Live Launches</h1>
            <p className="text-gray-500 text-sm">
              Real-time new token creations on pump.fun (Solana).
            </p>
          </div>
          <Link href="/radar" className="text-sm text-gray-400 hover:text-white underline">
            ← Search view
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-6 text-xs">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              status === "live" ? "bg-accent animate-pulse" : status === "error" ? "bg-danger" : "bg-warn"
            }`}
          />
          <span className="text-gray-500">
            {status === "live" ? "Connected — streaming live" : status === "error" ? "Connection error, retrying..." : "Connecting..."}
          </span>
        </div>

        {tokens.length === 0 && status === "live" && (
          <p className="text-gray-500">Waiting for the next launch...</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token, i) => (
            <LiveLaunchCard key={`${token.mint}-${i}`} token={token} />
          ))}
        </div>
      </div>
    </main>
  );
}
