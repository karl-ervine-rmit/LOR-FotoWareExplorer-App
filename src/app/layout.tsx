// Root layout for the application, includes global styles and accessibility helpers
import './globals.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "./providers";
import { ThemeProvider } from "../components/common/ThemeProvider";
import Navbar from "../components/common/Navbar";
import AccessibilityToolbar from "../components/common/AccessibilityToolbar";
import SkipLink from "../components/common/SkipLink";
import Footer from "../components/common/Footer";

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
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
