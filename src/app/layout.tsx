// Root layout for the application, includes global styles and accessibility helpers
import './globals.css';
import { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "./providers";
import { ThemeProvider } from "../components/common/ThemeProvider";
import Navbar from "../components/common/Navbar";
import AccessibilityToolbar from "../components/common/AccessibilityToolbar";
import SkipLink from "../components/common/SkipLink";
import Footer from "../components/common/Footer";
import Script from 'next/script';
import { env } from '@/lib/env';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FotoWare Explorer",
  description: "Browse and search digital learning resources with Australian accessibility standards.",
  openGraph: {
    title: "FotoWare Explorer",
    description: "Browse and search digital learning resources with Australian accessibility standards.",
    url: "https://your-site.com",
    siteName: "FotoWare Explorer",
    images: [
      {
        url: "https://your-site.com/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "FotoWare Explorer default share image"
      }
    ],
    locale: "en_AU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FotoWare Explorer",
    description: "Browse and search digital learning resources with Australian accessibility standards.",
    images: ["https://your-site.com/images/og-default.jpg"],
    creator: "@yourhandle"
  },
  alternates: {
    canonical: "https://your-site.com"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AppProviders>
            <SkipLink />
            <Navbar />
            <main id="main-content" className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <AccessibilityToolbar />
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
