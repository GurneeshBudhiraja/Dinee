import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Poppins } from "next/font/google";
import { AppProvider } from "@/contexts/AppProvider";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import "../../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ConvexClientProvider>
          <AppProvider>{children}</AppProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
