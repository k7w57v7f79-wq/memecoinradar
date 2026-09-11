export default function TickerBanner({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="border-y border-line bg-panel overflow-hidden whitespace-nowrap py-2">
      <div className="inline-flex animate-marquee">
        {loop.map((item, i) => (
          <span key={i} className="mx-6 font-num text-sm text-gain tracking-wide">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
