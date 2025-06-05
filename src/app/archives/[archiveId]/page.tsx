// TODO: Future: Use generateMetadata for dynamic SEO when archive data is fetched.
// Page for a single archive, listing albums and assets
// TODO: Implement archive detail UI and data fetching

import type { Metadata } from "next";

import ArchiveDetailClient from './_client';

export const metadata: Metadata = {
  title: "Archive | FotoWare Explorer",
  description: "Browse a curated collection of learning resources in this archive. All content uses Australian spelling and meets accessibility standards.",
  openGraph: {
    title: "Archive | FotoWare Explorer",
    description: "Browse a curated collection of learning resources in this archive. All content uses Australian spelling and meets accessibility standards.",
    url: "https://your-site.com/archives/[archiveId]",
    siteName: "FotoWare Explorer",
    images: [
      {
        url: "https://your-site.com/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "FotoWare Explorer archive share image"
      }
    ],
    locale: "en_AU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Archive | FotoWare Explorer",
    description: "Browse a curated collection of learning resources in this archive. All content uses Australian spelling and meets accessibility standards.",
    images: ["https://your-site.com/images/og-default.jpg"],
    creator: "@yourhandle"
  },
  alternates: {
    canonical: "https://your-site.com/archives/[archiveId]"
  }
};

export default async function ArchiveDetailPage() {
  const archiveId = 'example-archive';
  const assets = [
    {
      id: 'a1',
      name: 'Farmhouse_at_Kelvin_A._Lewis_farm_in_Creeds_13.jpg',
      imageUrl: '/images/Farmhouse_at_Kelvin_A._Lewis_farm_in_Creeds_13.jpg',
      isCulturallySensitive: true,
      isSuperseded: false,
      isFeatured: true,
      type: 'image',
      date: '2024-06-01',
      meta: { title: 'Farmhouse at Kelvin Lewis Farm with a Very Long Title That Should Span Over Three Lines for Alignment Testing Purposes', type: 'Image', date: '2024-06-01' },
    },
    {
      id: 'a2',
      name: 'Landscape_Arnisee-region.jpg',
      imageUrl: '/images/Landscape_Arnisee-region.jpg',
      isCulturallySensitive: false,
      isSuperseded: true,
      isFeatured: false,
      type: 'image',
      date: '2023-12-15',
      meta: { title: 'Arnisee Region Landscape', type: 'Image', date: '2023-12-15' },
    },
    {
      id: 'a3',
      name: 'Censorshiplolcat_(censored).jpg',
      imageUrl: '/images/Censorshiplolcat_(censored).jpg',
      isCulturallySensitive: true,
      isSuperseded: true,
      isFeatured: false,
      type: 'image',
      date: '2022-09-10',
      meta: { title: 'Censored Cat Meme', type: 'Image', date: '2022-09-10' },
    },
    {
      id: 'a4',
      name: 'Large_cloud_over_Mexican_landscape.jpg',
      imageUrl: '/images/Large_cloud_over_Mexican_landscape.jpg',
      isCulturallySensitive: false,
      isSuperseded: false,
      isFeatured: true,
      type: 'image',
      date: '2024-01-20',
      meta: { title: 'Cloud Over Mexican Landscape', type: 'Image', date: '2024-01-20' },
    },
    {
      id: 'a5',
      name: 'Hosta_two-tone_3.jpg',
      imageUrl: '/images/Hosta_two-tone_3.jpg',
      isCulturallySensitive: false,
      isSuperseded: false,
      isFeatured: false,
      type: 'image',
      date: '2021-05-05',
      meta: { title: 'Two-tone Hosta Plant', type: 'Image', date: '2021-05-05' },
    },
    {
      id: 'a6',
      name: 'Man_enjoying_ketchup_chips.jpg',
      imageUrl: '/images/Man_enjoying_ketchup_chips.jpg',
      isCulturallySensitive: false,
      isSuperseded: true,
      isFeatured: true,
      type: 'image',
      date: '2023-03-12',
      meta: { title: 'Man Enjoying Ketchup Chips', type: 'Image', date: '2023-03-12' },
    },
    {
      id: 'a7',
      name: 'Passion_Vine_NBG_LR.jpg',
      imageUrl: '/images/Passion_Vine_NBG_LR.jpg',
      isCulturallySensitive: true,
      isSuperseded: false,
      isFeatured: false,
      type: 'image',
      date: '2024-07-01',
      meta: { title: 'Passion Vine Flower', type: 'Image', date: '2024-07-01' },
    },
    {
      id: 'a8',
      name: 'Pyrus_pyrifolia_fruit_on_tree_PS_2z_LR.jpg',
      imageUrl: '/images/Pyrus_pyrifolia_fruit_on_tree_PS_2z_LR.jpg',
      isCulturallySensitive: true,
      isSuperseded: false,
      isFeatured: false,
      type: 'image',
      date: '2024-07-02',
      meta: { title: 'Asian Pear Fruit on Tree', type: 'Image', date: '2024-07-02' },
    },
  ];
  return <ArchiveDetailClient archiveId={archiveId} assets={assets} />;
}