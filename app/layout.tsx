import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/sonner";

// Inter as primary font (Google Sans alternative)
const inter = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Roboto as secondary font
const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PharmaLine - Your Trusted Online Pharmacy",
  description: "Order prescription medicines, health products, and vitamins online. Fast delivery across the Philippines.",
  keywords: "pharmacy, online pharmacy, medicines, prescription drugs, health products, vitamins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${roboto.variable} font-sans antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
