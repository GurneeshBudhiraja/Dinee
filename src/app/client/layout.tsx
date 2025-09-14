import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/contexts/AppProvider";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import "../../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Restaurant Call Management",
  description: "Manage AI agent calls and orders for your restaurant",
};

/**
 * Root layout component that wraps all client pages
 * Provides Convex client and app context providers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ConvexClientProvider>
          <AppProvider>{children}</AppProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
