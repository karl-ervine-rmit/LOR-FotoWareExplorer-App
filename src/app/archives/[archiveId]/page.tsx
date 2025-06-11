// TODO: Future: Use generateMetadata for dynamic SEO when archive data is fetched.
// Page for a single archive, listing albums and assets
// TODO: Implement archive detail UI and data fetching

import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';
import ArchiveDetailClient from './_client';
import { getArchive, getArchiveAssets } from '@/lib/data';

interface PageProps {
  params: {
    archiveId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const archive = await getArchive(resolvedParams.archiveId);

  return {
    title: `${archive?.name || 'Archive'} | ${SEO_DEFAULTS.siteName}`,
    description: archive?.description || SEO_DEFAULTS.description,
    openGraph: {
      title: `${archive?.name || 'Archive'} | ${SEO_DEFAULTS.siteName}`,
      description: archive?.description || SEO_DEFAULTS.description,
      url: `${SITE_URL}/archives/${resolvedParams.archiveId}`,
      siteName: SEO_DEFAULTS.siteName,
      images: [
        {
          url: SEO_DEFAULTS.image,
          width: 1200,
          height: 630,
          alt: "FotoWare Explorer archive share image"
        }
      ],
      locale: SEO_DEFAULTS.locale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${archive?.name || 'Archive'} | ${SEO_DEFAULTS.siteName}`,
      description: archive?.description || SEO_DEFAULTS.description,
      images: [SEO_DEFAULTS.image],
      creator: SEO_DEFAULTS.twitterHandle
    },
    alternates: {
      canonical: `${SITE_URL}/archives/${resolvedParams.archiveId}`
    }
  };
}

export default async function ArchiveDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const archive = await getArchive(resolvedParams.archiveId);
  const assets = await getArchiveAssets(resolvedParams.archiveId);

  if (!archive) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Archive not found</h1>
        <p className="mt-2">The requested archive could not be found.</p>
      </div>
    );
  }

  return <ArchiveDetailClient archiveId={resolvedParams.archiveId} archive={archive} assets={assets} />;
}