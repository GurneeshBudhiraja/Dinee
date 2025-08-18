import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/contexts/AppProvider";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Restaurant Call Management",
  description: "Manage AI agent calls and orders for your restaurant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <AppProvider>{children}</AppProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
