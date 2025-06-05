// Page for a single asset detail view
// TODO: Future: Use generateMetadata for dynamic SEO when asset data is fetched.
// TODO: Implement asset detail UI and data fetching

// import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
// import { UniversalEmbed } from '../../../../components/common/UniversalEmbed'; // Uncomment when implemented
import { useParams } from 'next/navigation';
import type { Metadata } from "next";
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';
import Script from "next/script";
import AssetDetailClient from './_client';

export const metadata: Metadata = {
  title: `Asset Detail | ${SEO_DEFAULTS.siteName}`,
  description: SEO_DEFAULTS.description,
  openGraph: {
    title: `Asset Detail | ${SEO_DEFAULTS.siteName}`,
    description: SEO_DEFAULTS.description,
    url: `${SITE_URL}/archives/[archiveId]/[assetId]`,
    siteName: SEO_DEFAULTS.siteName,
    images: [
      {
        url: SEO_DEFAULTS.image,
        width: 1200,
        height: 630,
        alt: 'FotoWare Explorer asset share image'
      }
    ],
    locale: SEO_DEFAULTS.locale,
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: `Asset Detail | ${SEO_DEFAULTS.siteName}`,
    description: SEO_DEFAULTS.description,
    images: [SEO_DEFAULTS.image],
    creator: SEO_DEFAULTS.twitterHandle
  },
  alternates: {
    canonical: `${SITE_URL}/archives/[archiveId]/[assetId]`
  }
};

const mockAssets = [
  {
    id: 'a1',
    name: 'Farmhouse_at_Kelvin_A._Lewis_farm_in_Creeds_13.jpg',
    type: 'image',
    src: '/images/Farmhouse_at_Kelvin_A._Lewis_farm_in_Creeds_13.jpg',
    isCulturallySensitive: true,
    meta: { title: 'Farmhouse at Kelvin Lewis Farm', type: 'Image', date: '2024-06-01' },
  },
  {
    id: 'a2',
    name: 'Landscape_Arnisee-region.jpg',
    type: 'image',
    src: '/images/Landscape_Arnisee-region.jpg',
    isCulturallySensitive: false,
    meta: { title: 'Arnisee Region Landscape', type: 'Image', date: '2023-12-15' },
  },
  {
    id: 'a3',
    name: 'Censorshiplolcat_(censored).jpg',
    type: 'image',
    src: '/images/Censorshiplolcat_(censored).jpg',
    isCulturallySensitive: true,
    meta: { title: 'Censored Cat Meme', type: 'Image', date: '2022-09-10' },
  },
  {
    id: 'a4',
    name: 'Large_cloud_over_Mexican_landscape.jpg',
    type: 'image',
    src: '/images/Large_cloud_over_Mexican_landscape.jpg',
    isCulturallySensitive: false,
    meta: { title: 'Cloud Over Mexican Landscape', type: 'Image', date: '2024-01-20' },
  },
  {
    id: 'a5',
    name: 'Hosta_two-tone_3.jpg',
    type: 'image',
    src: '/images/Hosta_two-tone_3.jpg',
    isCulturallySensitive: false,
    meta: { title: 'Two-tone Hosta Plant', type: 'Image', date: '2021-05-05' },
  },
  {
    id: 'a6',
    name: 'Man_enjoying_ketchup_chips.jpg',
    type: 'image',
    src: '/images/Man_enjoying_ketchup_chips.jpg',
    isCulturallySensitive: false,
    meta: { title: 'Man Enjoying Ketchup Chips', type: 'Image', date: '2023-03-12' },
  },
  {
    id: 'a7',
    name: 'Passion_Vine_NBG_LR.jpg',
    type: 'image',
    src: '/images/Passion_Vine_NBG_LR.jpg',
    isCulturallySensitive: true,
    meta: { title: 'Passion Vine Flower', type: 'Image', date: '2024-07-01' },
  },
  {
    id: 'a8',
    name: 'Pyrus_pyrifolia_fruit_on_tree_PS_2z_LR.jpg',
    type: 'image',
    src: '/images/Pyrus_pyrifolia_fruit_on_tree_PS_2z_LR.jpg',
    isCulturallySensitive: true,
    meta: { title: 'Asian Pear Fruit on Tree', type: 'Image', date: '2024-07-02' },
  },
];

export default function AssetDetailPage({ params }: { params: { archiveId: string; assetId: string } }) {
  const { archiveId, assetId } = params;
  const asset = mockAssets.find(a => a.id === assetId) || {
    id: assetId,
    name: 'Unknown Asset',
    type: 'image',
    src: '/images/placeholder.jpg',
    meta: { title: 'Unknown', type: 'Image', date: '' },
  };
  return <AssetDetailClient archiveId={archiveId} asset={asset} />;
}