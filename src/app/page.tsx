import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/seo";
import HomeClient from "./_client";
import { getArchives, getArchiveStats } from "@/lib/data";

export const metadata: Metadata = {
  title: SEO_DEFAULTS.siteName,
  description: SEO_DEFAULTS.description,
  openGraph: {
    title: SEO_DEFAULTS.siteName,
    description: SEO_DEFAULTS.description,
    url: SITE_URL,
    siteName: SEO_DEFAULTS.siteName,
    images: [
      {
        url: SEO_DEFAULTS.image,
        width: 1200,
        height: 630,
        alt: SEO_DEFAULTS.siteName,
      },
    ],
    locale: SEO_DEFAULTS.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.siteName,
    description: SEO_DEFAULTS.description,
    images: [SEO_DEFAULTS.image],
    creator: SEO_DEFAULTS.twitterHandle,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  const archives = await getArchives();
  const stats = await getArchiveStats();

  return <HomeClient archives={archives} stats={stats} />;
}
