import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeWrapper } from "@/components/layout/theme-wrapper";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zorvyn Finance — Smart Dashboard",
  description:
    "Track your finances, explore transactions, and discover spending insights with a beautiful, modern dashboard.",
  keywords: ["finance", "dashboard", "transactions", "budgeting", "insights"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeWrapper>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeWrapper>
      </body>
    </html>
  );
}
