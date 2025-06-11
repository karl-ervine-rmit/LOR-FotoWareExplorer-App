// src/app/archives/[archiveId]/_client.tsx

"use client";
import { useState } from 'react';
import { AssetCard } from '@/components/common/AssetCard';
import { Archive } from '@/lib/data/types';
import { Asset } from '@/lib/data/types';
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import Script from "next/script";
import { SITE_URL, SEO_DEFAULTS } from '@/lib/seo';

interface ArchiveDetailClientProps {
  archiveId: string;
  archive: Archive;
  assets: Asset[];
}

// Helper function to get string value from metadata
const getStringValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'value' in value) {
    const val = (value as { value: string | string[] }).value;
    return Array.isArray(val) ? val[0] : val;
  }
  return undefined;
};

export default function ArchiveDetailClient({
  archiveId,
  archive,
  assets,
}: ArchiveDetailClientProps) {
  const [showCulturallySensitive, setShowCulturallySensitive] = useState(false);
  const [filters, setFilters] = useState({
    type: new Set<string>(),
    date: new Set<string>(),
    culturallySensitive: false,
    superseded: false,
    featured: false,
  });

  // Filter and sort assets
  const filteredAssets = assets
    .filter((asset) => {
      const matchesFilters = (
        (filters.type.size === 0 || filters.type.has(asset.type)) &&
        (filters.date.size === 0 || filters.date.has(getStringValue(asset.metadata?.['350']) || '')) &&
        (!filters.culturallySensitive || asset.isCulturallySensitive) &&
        (!filters.superseded || asset.isSuperseded) &&
        (!filters.featured || asset.isFeatured)
      );

      return matchesFilters;
    })
    .sort((a, b) => {
      return (getStringValue(a.metadata?.['5']) || a.name).localeCompare(getStringValue(b.metadata?.['5']) || b.name);
    });

  return (
    <>
      <Script id="schema-collection" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${archive.name} | FotoWare Explorer`,
          description: archive.description || "Browse a curated collection of learning resources in this archive.",
          url: `${SITE_URL}/archives/${archiveId}`,
          image: SEO_DEFAULTS.image,
          inLanguage: "en-AU",
          hasPart: assets.slice(0, 2).map((asset) => ({
            "@type": "LearningResource",
            name: getStringValue(asset.metadata?.['5']) || asset.name,
            url: `${SITE_URL}/archives/${archiveId}/${asset.id}`,
          })),
        })}
      </Script>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Filters</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="culturally-sensitive"
                          checked={showCulturallySensitive}
                          onCheckedChange={setShowCulturallySensitive}
                        />
                        <label htmlFor="culturally-sensitive" className="text-sm">
                          Show culturally sensitive content
                        </label>
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="type">
                      <AccordionTrigger>Type</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {Array.from(new Set(assets.map(a => a.type))).map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`type-${type}`}
                                checked={filters.type.has(type)}
                                onCheckedChange={(checked) => {
                                  const newTypes = new Set(filters.type);
                                  if (checked) {
                                    newTypes.add(type);
                                  } else {
                                    newTypes.delete(type);
                                  }
                                  setFilters({ ...filters, type: newTypes });
                                }}
                              />
                              <label htmlFor={`type-${type}`} className="text-sm">
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold leading-tight mb-2">
                    {archive.name}
                  </h1>
                  <p className="text-muted-foreground text-base mb-0">
                    {archive.description || "No description available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-y-6 gap-x-6">
                  {filteredAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
