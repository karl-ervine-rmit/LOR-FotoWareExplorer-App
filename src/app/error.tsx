'use client';
// TODO: Future: Add animation or helpful resources. Ensure minimal SEO meta is always present.
import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Error | ${SEO_DEFAULTS.siteName}`,
  description: "Sorry, something went wrong on our end.",
  openGraph: {
    title: `Error | ${SEO_DEFAULTS.siteName}`,
    description: "Sorry, something went wrong on our end.",
    url: `${SITE_URL}/error`,
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
    title: `Error | ${SEO_DEFAULTS.siteName}`,
    description: "Sorry, something went wrong on our end.",
    images: [SEO_DEFAULTS.image],
    creator: SEO_DEFAULTS.twitterHandle
  },
  alternates: {
    canonical: `${SITE_URL}/error`
  }
};

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
      <h1 className="text-5xl font-bold mb-4">Something Went Wrong</h1>
      <p className="text-lg text-muted-foreground mb-8">Sorry, something went wrong on our end.</p>
      <button
        onClick={reset}
        className="inline-block px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition"
      >
        Try Again
      </button>
    </div>
  );
}