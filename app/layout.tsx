import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SUGAM — Find Your Indian Standard in Seconds",
    template: "%s | SUGAM",
  },
  description:
    "SUGAM helps you find applicable Indian Standards, certification timelines, costs, and requirements in 11 Indian languages.",
  keywords: ["BIS", "Indian Standards", "ISI Mark", "Certification", "IS Number", "Bureau of Indian Standards", "SUGAM"],
  openGraph: {
    title: "SUGAM",
    description: "AI-powered Indian Standards and BIS certification guide",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SUGAM",
    description: "AI-powered Indian Standards and BIS certification guide",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased font-sans min-h-screen">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
