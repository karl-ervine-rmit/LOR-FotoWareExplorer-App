import { Metadata } from 'next';
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';
import HomeClient from './_client';
import { getArchives, getArchiveStats } from '@/lib/data';

export const metadata: Metadata = {
  title: SEO_DEFAULTS.title,
  description: SEO_DEFAULTS.description,
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: SITE_URL,
    siteName: SEO_DEFAULTS.siteName,
    images: [
      {
        url: SEO_DEFAULTS.image,
        width: 1200,
        height: 630,
        alt: 'FotoWare Explorer share image'
      }
    ],
    locale: SEO_DEFAULTS.locale,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    images: [SEO_DEFAULTS.image],
    creator: SEO_DEFAULTS.twitterHandle
  },
  alternates: {
    canonical: SITE_URL
  }
};

export default async function Home() {
  const [archives, stats] = await Promise.all([
    getArchives(),
    getArchiveStats()
  ]);

  return (
    <HomeClient
      archives={archives}
      stats={stats}
    />
  );
}
