import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scouts Sint-Jan Diest",
  description:
    "De officiële website van Scouts Sint-Jan Diest: takken, activiteiten, kampinfo, foto's en contact.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
