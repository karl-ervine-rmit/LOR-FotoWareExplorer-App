"use client";
import Script from "next/script";
import UniversalEmbed from "@/components/common/UniversalEmbed";
import { AssetFlags } from "@/components/common/AssetFlags";
import type { Asset } from "@/lib/data";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactElement } from "react";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { METADATA_FIELD_MAPPINGS } from '@/lib/data';
import { getAsset } from '@/lib/data';

interface MetadataValue {
  value: string | string[];
}

type EmbedType = "image" | "video" | "youtube" | "vimeo" | "pdf" | "audio" | "epub" | "document" | "code" | "iframe" | "fallback";

// Helper function to format metadata values
const formatMetadataValue = (value: string | string[]): ReactElement => {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    );
  }
  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        {value}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  return <>{value}</>;
};

// Helper function to get field name
const getFieldName = (fieldId: string): string => {
  return METADATA_FIELD_MAPPINGS[fieldId] || `Field ${fieldId}`;
};

// Helper function to check if a metadata value is a MetadataValue object
const isMetadataValue = (value: unknown): value is MetadataValue => {
  return typeof value === 'object' && value !== null && 'value' in value;
};

// Helper function to get metadata value for display
const getMetadataValue = (value: unknown): string | string[] | undefined => {
  if (typeof value === 'string') return value;
  if (isMetadataValue(value)) return value.value;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    return (value as { value: string | string[] }).value;
  }
  return undefined;
};

// Helper function to get string value from metadata
const getStringValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (isMetadataValue(value)) return Array.isArray(value.value) ? value.value[0] : value.value;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    const val = (value as { value: string | string[] }).value;
    return Array.isArray(val) ? val[0] : val;
  }
  return undefined;
};

interface AssetDetailClientProps {
  assetId: string;
}

export default function AssetDetailClient({ assetId }: AssetDetailClientProps) {
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

  const handleCopyEmbedCode = () => {
    const embedUrl = getStringValue(asset?.metadata.embedUrl);
    if (embedUrl) {
      navigator.clipboard.writeText(embedUrl);
      toast.success('Embed code copied to clipboard');
    }
  };

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

  // Group metadata into categories
  const metadataGroups = {
    basic: ['5', '120', '350', '362'], // Title, Description, Date, Last Modified
    technical: ['187', '201', '842', '844'], // Unique ID, Source URL, Embed Code, Technical Notes
    rights: ['116', '429', '611', '863'], // Copyright, Access Level, Visibility, License
    content: ['25', '432', '427', '862'], // Tags, Subjects, Resource Types
    contact: ['360', '361', '847'], // Contact Email, Contact Name, Contact
    all: Object.keys(asset.metadata), // All metadata fields
  };

  const previewUrl = getStringValue(asset.metadata.previewUrl);
  const embedUrl = getStringValue(asset.metadata.embedUrl);

  return (
    <>
      <Script id="schema-asset" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: getStringValue(asset.metadata.title) || asset.name,
          description: getStringValue(asset.metadata.description) || "",
          url: `${SITE_URL}/archives/${pathname.split('/')[2]}/${asset.id}`,
          image: getStringValue(asset.metadata.thumbnailUrl) || SEO_DEFAULTS.image,
          inLanguage: "en-AU",
          dateCreated: asset.created,
          dateModified: asset.modified,
          author: {
            "@type": "Organization",
            name: "RMIT University",
          },
        })}
      </Script>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                {getStringValue(asset.metadata.title) || asset.name}
              </h1>
              {asset.flags && <AssetFlags flags={asset.flags} />}
            </div>
            <div className="flex gap-2">
              {embedUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEmbedCode}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy Embed Code
                </Button>
              )}
              {previewUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center gap-1"
                >
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    View Original
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <UniversalEmbed
                  src={previewUrl || ''}
                  type={asset.type as EmbedType}
                  title={getStringValue(asset.metadata.title) || asset.name}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList>
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="rights">Rights</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="all">All Metadata</TabsTrigger>
                  </TabsList>
                  {Object.entries(metadataGroups).map(([group, fields]) => (
                    <TabsContent key={group} value={group}>
                      <div className="space-y-4">
                        {fields.map(fieldId => {
                          const value = asset.metadata[fieldId];
                          if (!value) return null;
                          return (
                            <div key={fieldId} className="space-y-1">
                              <div className="text-sm font-medium text-gray-500">
                                {getFieldName(fieldId)}
                              </div>
                              <div className="text-sm">
                                {formatMetadataValue(getMetadataValue(value) || '')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
