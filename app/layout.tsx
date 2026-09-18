import type { Metadata } from "next";
import "./globals.css";
import "./landing.css";
import EnglishOnly from "@/components/shared/EnglishOnly";

export const metadata: Metadata = {
  title: "Capacity Connect — Organizational Capacity Intelligence",
  description:
    "Capacity Connect for SIH26075: adaptive competency assessment, skill-gap development paths, on-demand expert mentoring and organizational capacity intelligence.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased" dir="ltr" data-language="en"><EnglishOnly />{children}</body>
    </html>
  );
}
