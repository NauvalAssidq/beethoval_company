import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beethoval.dev"),
  title: {
    template: "%s | Beethoval.dev",
    default: "Beethoval.dev - Top Web Developer & Software House in Banda Aceh",
  },
  description: "High-performance web applications and professional grade interfaces. Beethoval is the premier software house and freelance web developer based in Banda Aceh, Aceh.",
  applicationName: "Beethoval.dev",
  keywords: ["Web Developer Banda Aceh", "Software House Aceh", "Aplikasi Web Aceh", "Jasa Pembuatan Website Banda Aceh", "Programmer Aceh", "React Developer Banda Aceh", "Next.js Indonesia"],
  authors: [{ name: "Beethoval" }],
  creator: "Beethoval",
  publisher: "Beethoval",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "Beethoval.dev | Software House Banda Aceh",
    description: "Crafting digital experiences and high-performance web applications in Banda Aceh, Aceh.",
    url: "https://beethoval.dev",
    siteName: "Beethoval.dev",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beethoval.dev | Web Developer Banda Aceh",
    description: "High-performance web applications from Banda Aceh.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", sans.variable, serif.variable, mono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Beethoval.dev",
              "image": "https://beethoval.dev/logo.png",
              "@id": "https://beethoval.dev",
              "url": "https://beethoval.dev",
              "description": "High-performance web applications and professional grade interfaces. Premier software house and freelance web developer based in Banda Aceh, Aceh.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Banda Aceh",
                "addressRegion": "Aceh",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 5.548290,
                "longitude": 95.323753
              },
              "priceRange": "$$"
            })
          }}
        />
      </body>
    </html>
  );
}
