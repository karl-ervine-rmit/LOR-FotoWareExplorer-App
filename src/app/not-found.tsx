import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';

// TODO: Future: Add animation and links to useful resources. Ensure minimal SEO meta is always present.

export const metadata: Metadata = {
  title: `Page Not Found | ${SEO_DEFAULTS.siteName}`,
  description: "Sorry, the page you are looking for could not be found.",
  openGraph: {
    title: `Page Not Found | ${SEO_DEFAULTS.siteName}`,
    description: "Sorry, the page you are looking for could not be found.",
    url: `${SITE_URL}/404`,
    siteName: SEO_DEFAULTS.siteName,
    images: [
      {
        url: SEO_DEFAULTS.image,
        width: 1200,
        height: 630,
        alt: 'FotoWare Explorer error share image'
      }
    ],
    locale: SEO_DEFAULTS.locale,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Page Not Found | ${SEO_DEFAULTS.siteName}`,
    description: "Sorry, the page you are looking for could not be found.",
    images: [SEO_DEFAULTS.image],
    creator: SEO_DEFAULTS.twitterHandle
  },
  alternates: {
    canonical: `${SITE_URL}/404`
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
      <h1 className="text-5xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">Sorry, the page you are looking for could not be found.</p>
      <a href="/" className="inline-block px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition">Return to Home</a>
    </div>
  );
}