'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Asset } from '@/lib/data';
import { getAsset } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { METADATA_FIELD_MAPPINGS } from '@/lib/data';

interface AssetDetailProps {
  assetId: string;
}

export default function AssetDetail({ assetId }: AssetDetailProps) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAsset(assetId);
        setAsset(data);
      } catch (err) {
        setError('Failed to load asset details');
        console.error('Error loading asset:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [assetId, pathname]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Asset not found'}
        </div>
      </div>
    );
  }

  const getFieldName = (fieldId: string) => {
    return METADATA_FIELD_MAPPINGS[fieldId] || fieldId;
  };

  const formatMetadataValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  // Group metadata into categories
  const metadataGroups = {
    basic: ['5', '120', '350', '362'], // Title, Description, Date, Last Modified
    technical: ['187', '201', '842', '844'], // Unique ID, Source URL, Embed Code, Technical Notes
    rights: ['116', '429', '611', '863'], // Copyright, Access Level, Visibility, License
    content: ['25', '432', '427', '862'], // Tags, Subjects, Resource Types
    contact: ['360', '361', '847'], // Contact Email, Contact Name, Contact
    other: Object.keys(asset.metadata).filter(key =>
      !['5', '120', '350', '362', '187', '201', '842', '844', '116', '429', '611', '863', '25', '432', '427', '862', '360', '361', '847'].includes(key)
    ),
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{asset.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {asset.previewUrl ? (
              <img
                src={asset.previewUrl}
                alt={asset.name}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                No preview available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="all">All Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="space-y-2">
                  {metadataGroups.basic.map(fieldId => {
                    const value = asset.metadata[fieldId]?.value;
                    if (!value) return null;
                    return (
                      <div key={fieldId} className="grid grid-cols-2 gap-2">
                        <div className="font-medium">{getFieldName(fieldId)}:</div>
                        <div>{formatMetadataValue(value)}</div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="technical">
                <div className="space-y-2">
                  {metadataGroups.technical.map(fieldId => {
                    const value = asset.metadata[fieldId]?.value;
                    if (!value) return null;
                    return (
                      <div key={fieldId} className="grid grid-cols-2 gap-2">
                        <div className="font-medium">{getFieldName(fieldId)}:</div>
                        <div>{formatMetadataValue(value)}</div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="space-y-4">
                  {Object.entries(asset.metadata).map(([fieldId, { value }]) => (
                    <div key={fieldId} className="grid grid-cols-2 gap-2">
                      <div className="font-medium">
                        {getFieldName(fieldId)} (ID: {fieldId}):
                      </div>
                      <div>{formatMetadataValue(value)}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}