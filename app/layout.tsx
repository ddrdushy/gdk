import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/auth-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TrustPass AI — The Digital Passport for Trusted Innovation Ecosystems",
    template: "%s · TrustPass AI",
  },
  description:
    "TrustPass AI verifies startups and mentors, issues digital passports with stamps and badges, and helps innovation ecosystems activate trusted linkages across programmes, partners, and regions.",
  keywords: [
    "startup verification",
    "mentor verification",
    "innovation ecosystem",
    "digital passport",
    "AI verification",
    "accelerator",
    "trust infrastructure",
  ],
  authors: [{ name: "TrustPass AI" }],
  openGraph: {
    title: "TrustPass AI — Verify once. Connect everywhere.",
    description:
      "AI-powered digital passports for startups and mentors. Trusted by innovation ecosystems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
