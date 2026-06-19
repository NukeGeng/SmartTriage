import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SmartTriage | AI-assisted student issue triage",
  description: "Mascot-led AI triage command center for student reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
