import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SmartTriage",
  description: "Student feedback triage with machine learning",
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
