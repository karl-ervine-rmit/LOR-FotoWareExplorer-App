'use client';
// Page for a single asset detail view
// TODO: Implement asset detail UI and data fetching

// import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
// import { UniversalEmbed } from '../../../../components/common/UniversalEmbed'; // Uncomment when implemented
import { useParams } from 'next/navigation';

export default function AssetDetailPage() {
  const params = useParams();
  const { archiveId, assetId } = params || {};
  // Placeholder asset data
  const asset = {
    id: assetId || 'unknown',
    name: 'Sydney Opera House.jpg',
    type: 'image',
    src: '/images/sydney-opera-house.jpg',
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Asset: {asset.name}</h1>
      {/* <UniversalEmbed type={asset.type} src={asset.src} title={asset.name} /> */}
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded mb-4">
        <span className="text-gray-500">[Asset preview placeholder]</span>
      </div>
      <p>Type: {asset.type}</p>
      <p>ID: {asset.id}</p>
      <p>Archive: {archiveId}</p>
    </>
  );
}