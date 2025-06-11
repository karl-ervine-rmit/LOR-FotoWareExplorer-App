// TODO: Future: Use generateMetadata for dynamic SEO when archive data is fetched.
// Page for a single archive, listing albums and assets
// TODO: Implement archive detail UI and data fetching

import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/seo";
import ArchiveDetailClient from "./_client";
import { getArchive, getArchiveAssets } from "@/lib/data";

interface PageProps {
  params: Promise<{
    archiveId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const archive = await getArchive(resolvedParams.archiveId);

  const title = archive?.name || 'Archive';
  const description = archive?.description || SEO_DEFAULTS.description;

  return {
    title: `${title} | ${SEO_DEFAULTS.siteName}`,
    description,
    openGraph: {
      title: `${title} | ${SEO_DEFAULTS.siteName}`,
      description,
      url: `${SITE_URL}/archives/${resolvedParams.archiveId}`,
      siteName: SEO_DEFAULTS.siteName,
      images: [
        {
          url: SEO_DEFAULTS.image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: SEO_DEFAULTS.locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SEO_DEFAULTS.siteName}`,
      description,
      images: [SEO_DEFAULTS.image],
      creator: SEO_DEFAULTS.twitterHandle,
    },
    alternates: {
      canonical: `${SITE_URL}/archives/${resolvedParams.archiveId}`,
    },
  };
}

export default async function ArchivePage({ params }: PageProps) {
  const resolvedParams = await params;
  const archive = await getArchive(resolvedParams.archiveId);
  const assets = await getArchiveAssets(resolvedParams.archiveId);

  if (!archive) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Archive not found
        </div>
      </div>
    );
  }

  return <ArchiveDetailClient archiveId={resolvedParams.archiveId} archive={archive} assets={assets} />;
}