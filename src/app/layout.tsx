import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibePrompt Hub | Discovery",
  description: "The definitive interface for technical aestheticists. High-density prompt engineering with real-time vector visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <SupabaseProvider>
        <html
          lang="en"
          className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
          <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased select-none">
            {children}
          </body>
        </html>
      </SupabaseProvider>
    </ClerkProvider>
  );
}


