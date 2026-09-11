const PALETTE = ["#FF3D71", "#C6FF3D", "#FFC53D", "#7C5CFF", "#3DDCFF", "#FF7A3D"];

function colorFor(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function TokenAvatar({
  symbol,
  imageUrl,
  size = 36,
}: {
  symbol: string;
  imageUrl?: string | null;
  size?: number;
}) {
  const initial = symbol?.[0]?.toUpperCase() ?? "?";

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={symbol}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0 bg-panel2"
        style={{ width: size, height: size }}
        onError={(e) => {
          // Fall back to hiding the broken image; the parent still shows the symbol text.
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center font-display text-void"
      style={{ width: size, height: size, background: colorFor(symbol || "?"), fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  );
}
