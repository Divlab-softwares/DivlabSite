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
  title: {
    default: "DIVLAB | Formation, IA et Solutions Web",
    template: "%s | DIVLAB",
  },
  description:
    "DIVLAB est une structure tech spécialisée en formation data science, intelligence artificielle, création de sites web et design graphique au Cameroun.",
  keywords: [
    "DIVLAB",
    "formation data science Cameroun",
    "intelligence artificielle",
    "Design graphique",
    "création site web",
  ],
  metadataBase: new URL("https://divlabs-tech.com"),
  openGraph: {
    title: "DIVLAB",
    description:
      "Formations pratiques en data science, IA et services informatiques au Cameroun.",
    url: "https://divlabs-tech.com",
    siteName: "DIVLAB",
    images: [
      {
        url: "/og-image.jpg", // image dans /public
        width: 1200,
        height: 630,
        alt: "DIVLAB - Formation et IA",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en" >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DIVLAB",
              url: "https://divlabs-tech.com",
              logo: "https://divlabs-tech.com/logo.png",
              sameAs: [
                "https://facebook.com/divlab",
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
