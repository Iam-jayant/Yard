// apps/web/app/layout.tsx
// Root layout — applies to every page in the app

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yard — An Open City for Developers",
  description:
    "Drop an idea, claim a plot, build it, prove it. A visual 3D city where developers turn ideas into real projects through verified work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
