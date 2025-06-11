import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from "@/lib/data/types";
import { getStringValue } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { AssetFlags } from './AssetFlags';

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const title = asset.metadata.title ? getStringValue(asset.metadata.title) : asset.name;
  const thumbnailUrl = asset.metadata.thumbnailUrl ? getStringValue(asset.metadata.thumbnailUrl) : '';
  const [imageLoaded, setImageLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Get the archive ID and actual asset ID from the combined ID (format: "archiveId assetId")
  const [archiveId, actualAssetId] = asset.id.split(' ');

  return (
    <Card
      className="group relative overflow-hidden transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 20 }}
        >
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </motion.div>
      </div>
      <Link
        href={`/archives/${archiveId}/${actualAssetId}`}
        className="block group/card-content focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-medium line-clamp-2">
              {title}
            </h3>
            {asset.metadata.type && (
              <Badge variant="secondary" className="text-xs">
                {getStringValue(asset.metadata.type)}
              </Badge>
            )}
            {asset.flags && <AssetFlags flags={asset.flags} />}
            <span className={buttonVariants({ variant: 'outline', size: 'default' }) + ' mt-auto w-full text-center cursor-pointer select-none'}>
              View details
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}