import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Package.json Analyzer - Analyze Your Dependencies Instantly",
  description:
    "A fast, private, and secure tool to analyze your package.json file directly in your browser. Get insights into dependencies, scripts, and more.",
  keywords: [
    "package.json",
    "analyzer",
    "dependencies",
    "npm",
    "javascript",
    "typescript",
  ],
  authors: [{ name: "Package Analyzer" }],
  openGraph: {
    title: "Package.json Analyzer",
    description: "Analyze your package.json file instantly in your browser",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
