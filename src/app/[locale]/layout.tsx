import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ClientToaster } from "@/components/providers/ClientToaster";
import { CookiesBanner } from "@/components/ui/cookies-banner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
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
    template: "Beethoval.dev | %s",
    default: "Beethoval - Web Dev Aceh & Indonesia",
  },
  description:
    "beethoval.dev — Web development studio founded by Nauval Dhonand Sidiq. We build premium websites and high-performance web applications with React, Next.js, Laravel & modern UI/UX design for businesses in Aceh, Indonesia, and beyond.",
  applicationName: "beethoval.dev",
  keywords: [
    "beethoval.dev",
    "Nauval Dhonand Sidiq",
    "web dev aceh",
    "web dev indonesia",
    "web developer aceh",
    "web developer banda aceh",
    "web developer indonesia",
    "jasa pembuatan website aceh",
    "jasa pembuatan website banda aceh",
    "jasa web indonesia",
    "software house aceh",
    "aplikasi web aceh",
    "fullstack developer indonesia",
    "react developer indonesia",
    "nextjs developer indonesia",
    "laravel developer indonesia",
    "freelance web developer indonesia",
    "ui ux designer indonesia",
    "web development studio indonesia",
    "developer website banda aceh",
  ],
  authors: [{ name: "Nauval Dhonand Sidiq", url: "https://beethoval.dev" }],
  creator: "Nauval Dhonand Sidiq",
  publisher: "beethoval.dev",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "https://beethoval.dev",
    languages: {
      en: "https://beethoval.dev/en",
      id: "https://beethoval.dev/id",
    },
  },
  verification: {
    google: [
      "tS6otYTT_IvP3n7DoNVZxyjQtO9h7GlU2k9vyBPGme0",
      "yGK-t8YDL-XrOSoRZxDxUIf7mcmoUe4Tx_P9qxxv0Cs",
    ],
  },
  other: {
    "geo.region": "ID-AC",
    "geo.placename": "Banda Aceh",
    "geo.position": "5.5483;95.3238",
    ICBM: "5.5483, 95.3238",
    "content-language": "en, id",
  },
  openGraph: {
    title: "Beethoval - Web Dev Aceh & Indonesia",
    description:
      "beethoval.dev — Web development studio by Nauval Dhonand Sidiq. Premium websites & web applications built with React, Next.js, Laravel & modern UI/UX in Aceh and Indonesia.",
    url: "https://beethoval.dev",
    siteName: "beethoval.dev",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    type: "website",
    images: [
      {
        url: "https://raw.githubusercontent.com/NauvalAssidq/portofolio_laravel/refs/heads/main/public/storage/image.png",
        width: 1200,
        height: 630,
        alt: "beethoval.dev — Web Development Studio by Nauval Dhonand Sidiq",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beethoval - Web Dev Aceh & Indonesia",
    description:
      "beethoval.dev — Web development studio by Nauval Dhonand Sidiq. Premium websites & apps serving Aceh and Indonesia.",
    images: [
      "https://raw.githubusercontent.com/NauvalAssidq/portofolio_laravel/refs/heads/main/public/storage/image.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn("h-full", "antialiased", sans.variable, serif.variable, mono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookiesBanner />
          <ClientToaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "beethoval.dev",
                alternateName: "Beethoval",
                url: "https://beethoval.dev/",
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "Beethoval.dev",
                image: "https://beethoval.dev/logo.png",
                "@id": "https://beethoval.dev",
                url: "https://beethoval.dev",
                description:
                  "High-performance web applications and professional grade interfaces. Premier software house and freelance web developer based in Banda Aceh, Aceh.",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Banda Aceh",
                  addressRegion: "Aceh",
                  addressCountry: "ID",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 5.54829,
                  longitude: 95.323753,
                },
                priceRange: "$$",
              },
            ]),
          }}
        />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
