import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { metaTitle, metaDescription, faviconUrl, ogImage } = await getSettings();

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    // Custom favicon from Settings, else the default in /public.
    icons: { icon: faviconUrl || "/favicon.ico" },
  };

  if (ogImage) {
    metadata.openGraph = {
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    };
    metadata.twitter = {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    };
  }

  return metadata;
}

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
