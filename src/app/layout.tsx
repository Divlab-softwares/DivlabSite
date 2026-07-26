import Providers from "@/app/Components/Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageLoader from "./Components/pageLoader";
import { SessionProvider } from "next-auth/react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://divlabs-tech.com"),
  title: {
    default: "DIVLAB | Applications web, plateformes SaaS et solutions IA",
    template: "%s | DIVLAB",
  },
  description:
    "Studio digital camerounais, DIVLAB conçoit des sites web, applications métier, plateformes SaaS et solutions IA sur mesure pour l'Afrique francophone.",
  applicationName: "DIVLAB",
  authors: [{ name: "DIVLAB", url: "https://divlabs-tech.com" }],
  creator: "DIVLAB",
  publisher: "DIVLAB",
  category: "technology",
  keywords: [
    "DIVLAB",
    "DIVLAB Cameroun",
    "studio digital Cameroun",
    "agence web Cameroun",
    "création site web Cameroun",
    "création site internet Douala",
    "développement application web",
    "développement web sur mesure",
    "création plateforme SaaS",
    "création MVP Cameroun",
    "application métier sur mesure",
    "automatisation processus métier",
    "intégration Mobile Money",
    "UI UX design Cameroun",
    "transformation digitale Afrique francophone",
    "formation data science Cameroun",
    "solutions intelligence artificielle",
  ],
  openGraph: {
    title: "DIVLAB | De l'idée au produit digital",
    description:
      "Sites web, applications métier, plateformes SaaS et solutions IA conçus au Cameroun pour les entreprises et organisations d'Afrique francophone.",
    url: "https://divlabs-tech.com",
    siteName: "DIVLAB",
    locale: "fr_CM",
    images: [
      {
        url: "/og-image.jpg", // image dans /public
        width: 1200,
        height: 630,
        alt: "DIVLAB, studio de produits digitaux au Cameroun",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIVLAB | De l'idée au produit digital",
    description:
      "Applications web, plateformes SaaS et solutions IA sur mesure pour les entreprises et organisations.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="fr-CM" >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DIVLAB",
              url: "https://divlabs-tech.com",
              logo: "https://divlabs-tech.com/logo.jpg",
              description:
                "Studio digital camerounais spécialisé dans les applications web, plateformes SaaS, solutions IA et formations technologiques.",
              areaServed: ["CM", "Afrique francophone"],
              knowsAbout: [
                "Développement web sur mesure",
                "Applications métier",
                "Plateformes SaaS",
                "Intelligence artificielle",
                "UI/UX design",
                "Formation technologique",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>{children}</Providers>
        <PageLoader />
        {/* <script type="text/javascript" src="https://fr.monetbil.com/widget/v2/monetbil.min.js"></script> */}

      </body>
    </html>
  );
}
