import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';
import ArchivesPageClient from './_client';
import fs from 'fs';
import path from 'path';

interface Archive {
  id: string;
  name: string;
  description?: string;
  assetCount: number;
  assets: string[];
}

interface IndexData {
  metadata: {
    totalArchives: number;
    totalAssets: number;
    lastUpdated: string;
  };
  archives: Record<string, Archive>;
}

export const metadata: Metadata = {
  title: `Archives | ${SEO_DEFAULTS.siteName}`,
  description: `Explore all archives. ${SEO_DEFAULTS.description}`,
  openGraph: {
    title: `Archives | ${SEO_DEFAULTS.siteName}`,
    description: `Explore all archives. ${SEO_DEFAULTS.description}`,
    url: `${SITE_URL}/archives`,
    siteName: SEO_DEFAULTS.siteName,
    images: [
      {
        url: SEO_DEFAULTS.image,
        width: 1200,
        height: 630,
        alt: 'FotoWare Explorer archives share image'
      }
    ],
    locale: SEO_DEFAULTS.locale,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Archives | ${SEO_DEFAULTS.siteName}`,
    description: `Explore all archives. ${SEO_DEFAULTS.description}`,
    images: [SEO_DEFAULTS.image],
    creator: SEO_DEFAULTS.twitterHandle
  },
  alternates: {
    canonical: `${SITE_URL}/archives`
  }
};

async function getIndexData(): Promise<IndexData> {
  try {
    const indexPath = path.join(process.cwd(), 'src/lib/data/index/index.json');
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as IndexData;
    return indexData;
  } catch (error) {
    console.error('Error reading index.json:', error);
    return {
      metadata: {
        totalArchives: 0,
        totalAssets: 0,
        lastUpdated: new Date().toISOString()
      },
      archives: {}
    };
  }
}

export default async function ArchivesPage() {
  const indexData = await getIndexData();
  const archives = Object.values(indexData.archives);
  return <ArchivesPageClient archives={archives} />;
}