// src/app/archives/[archiveId]/[assetId]/page.tsx

// Page for a single asset detail view
// ----------------------------------------------------------------
// - By declaring `params` as `any`, TypeScript won't try to match
//   Next's internal PageProps exactly, and we avoid "invalid default export".
// - The function is `async`, so if Next passes `params` wrapped in a Promise,
//   `await params` correctly unwraps it. If Next passes a plain object, `await`
//   simply gives us that object.
// - We no longer declare `searchParams` at all, so there's no "unused var" error.
// ----------------------------------------------------------------

import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/seo";
import AssetDetailClient from "./_client";
import { getAsset } from "@/lib/data";
import { getStringValue } from "@/lib/utils";

interface PageProps {
  params: {
    archiveId: string;
    assetId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  // Combine archiveId and assetId to match the format used in getArchiveAssets
  const combinedAssetId = `${resolvedParams.archiveId} ${resolvedParams.assetId}`;
  const asset = await getAsset(combinedAssetId);

  const title = asset?.metadata?.title ? getStringValue(asset.metadata.title) : asset?.name || 'Asset';
  const description = asset?.metadata?.description ? getStringValue(asset.metadata.description) : SEO_DEFAULTS.description;
  const thumbnailUrl = asset?.metadata?.thumbnailUrl ? getStringValue(asset.metadata.thumbnailUrl) : SEO_DEFAULTS.image;

  return {
    title: `${title} | ${SEO_DEFAULTS.siteName}`,
    description,
    openGraph: {
      title: `${title} | ${SEO_DEFAULTS.siteName}`,
      description,
      url: `${SITE_URL}/archives/${resolvedParams.archiveId}/${resolvedParams.assetId}`,
      siteName: SEO_DEFAULTS.siteName,
      images: [
        {
          url: thumbnailUrl,
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
      images: [thumbnailUrl],
      creator: SEO_DEFAULTS.twitterHandle,
    },
    alternates: {
      canonical: `${SITE_URL}/archives/${resolvedParams.archiveId}/${resolvedParams.assetId}`,
    },
  };
}

interface AssetDetailPageProps {
  params: {
    archiveId: string;
    assetId: string;
  };
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const resolvedParams = await params;
  // Combine archiveId and assetId to match the format used in getArchiveAssets
  const combinedAssetId = `${resolvedParams.archiveId} ${resolvedParams.assetId}`;
  const asset = await getAsset(combinedAssetId);

  if (!asset) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Asset not found
        </div>
      </div>
    );
  }

  return <AssetDetailClient assetId={combinedAssetId} />;
}
