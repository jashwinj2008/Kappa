import type { Metadata } from "next";
import { Playfair_Display, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kappa Fashion Store | Warm Editorial & Dresses",
  description: "Explore the sophisticated, minimalist collection of women's and men's dresses at Kappa Fashion Store. Featuring warm mustard aesthetics, elegant layouts, and express shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf8f5] text-[#1c1917]">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
