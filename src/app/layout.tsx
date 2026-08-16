import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fanasha Divine Limited | Building Spaces, Creating Wealth",
  description: "Ghana's trusted ecosystem for Real Estate, Land Sales, Pawn Shop, and Work & Pay financing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        <Navbar />
        <main className="pt-20 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
