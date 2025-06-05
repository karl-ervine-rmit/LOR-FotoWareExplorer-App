import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';
import { Archive, ArchiveIcon, Grid3X3, List, Search, ArrowRight, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import ArchivesPageClient from './_client';

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

export default function ArchivesPage() {
  // Placeholder data (could be fetched server-side if needed)
  const archives = [
    { id: '1', name: 'Photo Archive', description: 'A collection of photographs from across Australia.' },
    { id: '2', name: 'Video Archive', description: 'Videos documenting Australian events and landscapes.' },
  ];
  return <ArchivesPageClient archives={archives} />;
}