import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio — Digital Marketing",
  description: "Data-driven digital marketing campaigns that convert.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-canvas text-cream antialiased font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
