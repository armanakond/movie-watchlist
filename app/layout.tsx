import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar'

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "800"],
});

const rajdhani = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Watchlist",
  description: "Personal movie watchlist app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-void text-ink font-body">
        <Navbar />
        {children}
      </body>
    </html>
  );
}