import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memecoin Radar",
  description: "Live token feed with automatic risk scoring",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
