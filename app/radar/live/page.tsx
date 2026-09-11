"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LiveLaunchCard from "@/components/LiveLaunchCard";
import { PUMPPORTAL_WS_URL, isNewTokenEvent, type NewTokenEvent } from "@/lib/pumpportal";

const MAX_TOKENS = 60;

type TrackedToken = NewTokenEvent & { _seenAt: number };


export default function LiveLaunchesPage() {
  const [tokens, setTokens] = useState<TrackedToken[]>([]);
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
            setTokens((prev) => [{ ...data, _seenAt: Date.now() }, ...prev].slice(0, MAX_TOKENS));
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
    <main className="min-h-screen bg-void px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="font-display text-3xl text-ink">LIVE LAUNCHES</h1>
            <p className="text-mute text-sm mt-1">
              Every new pump.fun token, the second it's created.
            </p>
          </div>
          <Link href="/radar" className="text-sm text-mute hover:text-ink underline underline-offset-4">
            search view
          </Link>
        </div>

        <div className="flex items-center gap-2 mt-5 mb-6 text-xs font-num">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              status === "live" ? "bg-gain animate-pulse" : status === "error" ? "bg-hot" : "bg-gold"
            }`}
          />
          <span className="text-mute uppercase tracking-wide">
            {status === "live" ? "LIVE — STREAMING" : status === "error" ? "CONNECTION ERROR — RETRYING" : "CONNECTING"}
          </span>
        </div>

        {tokens.length === 0 && status === "live" && (
          <p className="text-mute font-num text-sm">waiting for the next launch...</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token, i) => (
            <LiveLaunchCard key={`${token.mint}-${i}`} token={token} seenAt={token._seenAt} />
          ))}
        </div>
      </div>
    </main>
  );
}
