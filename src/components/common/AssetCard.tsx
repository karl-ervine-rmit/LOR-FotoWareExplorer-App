import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export interface AssetFlag {
  type: string;
  label: string;
  icon: React.ReactNode;
}

interface AssetCardProps {
  imageUrl: string;
  flags?: AssetFlag[];
  isCulturallySensitive?: boolean;
  showCulturallySensitive?: boolean;
  href?: string;
  meta?: Record<string, string>;
  onClick?: () => void;
}

export function AssetCard({
  imageUrl,
  flags = [],
  isCulturallySensitive = false,
  showCulturallySensitive = false,
  href,
  meta = {},
  onClick,
}: AssetCardProps) {
  // Use meta.title as the card title
  const title = meta.title || '';
  // For accessibility: describe mask
  const maskLabel = isCulturallySensitive
    ? 'Culturally sensitive content. Image is hidden for cultural safety.'
    : undefined;

  // Local state for per-asset reveal
  const [revealed, setRevealed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  // Card content
  const isMasked = isCulturallySensitive && !showCulturallySensitive && !revealed;
  const cardContent = (
    <Card
      tabIndex={0}
      className={cn(
        'group relative flex flex-col overflow-hidden shadow-md transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 gap-0',
        'hover:shadow-lg',
        'h-full',
        onClick && 'cursor-pointer',
        'p-0',
        isMasked ? 'pointer-events-none' : '' // Prevent interaction with card/link when masked
      )}
      aria-label={title}
      onClick={onClick}
    >
      {/* Image with mask and markers */}
      <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
        {/* Only render the image if not culturally sensitive, or if user has opted to show globally or locally */}
        {(!isCulturallySensitive || showCulturallySensitive || revealed) && (
          <>
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
                src={imageUrl}
                alt={title}
                fill
                className="object-cover w-full h-full transition-all duration-300"
                draggable={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                onLoad={() => setImageLoaded(true)}
                onLoadingComplete={() => setImageLoaded(true)}
                priority={false}
              />
            </motion.div>
          </>
        )}
        {/* Cultural sensitive mask overlay */}
        {isMasked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            className={cn(
              'absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-black pointer-events-auto',
              'px-4 py-4 md:px-2 md:py-2'
            )}
            aria-label={maskLabel}
            role="img"
          >
            <AlertTriangle className="h-8 w-8 text-yellow-400 mb-2 md:h-6 md:w-6 md:mb-1 sm:h-5 sm:w-5" aria-hidden />
            <span className="text-white font-semibold text-base md:text-sm sm:text-xs leading-tight">Culturally sensitive content</span>
            <span className="text-white text-xs mt-1 mb-2 md:mt-0.5 md:mb-1 sm:text-[11px]">Image is hidden for cultural safety</span>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 md:mt-1 px-3 py-1 text-xs md:text-xs sm:text-[11px] h-7 md:h-6"
              onClick={() => setRevealed(true)}
              aria-label="Show this image"
            >
              Show this image
            </Button>
          </motion.div>
        )}
        {/* Floating markers */}
        {flags.length > 0 && (
          <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 items-end pointer-events-auto">
            <TooltipProvider>
              {flags.map((flag, i) => (
                <Tooltip key={flag.type + i}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      tabIndex={0}
                      aria-label={flag.label}
                      className="flex items-center gap-1 px-2 py-1 text-xs shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {flag.icon}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs text-sm">
                    {flag.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        )}
      </div>
      {/* Title and meta */}
      <CardContent className="flex flex-col pt-3 pb-4 px-4 md:pt-2 md:pb-3 md:px-3 sm:pt-1 sm:pb-2 sm:px-2">
        <div className="font-semibold text-base md:text-sm sm:text-xs mb-1 truncate leading-tight" title={title} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</div>
        {meta && (
          <div className="flex flex-wrap gap-2 mb-2 md:gap-1 md:mb-1 sm:gap-0.5 sm:mb-1">
            {Object.entries(meta)
              .filter(([key]) => key !== 'title')
              .map(([key, value]) => (
                <span key={key} className="text-xs md:text-[11px] sm:text-[10px] text-muted-foreground bg-muted rounded px-2 py-0.5 md:px-1.5 md:py-0.5 sm:px-1 sm:py-0.5 truncate max-w-full" style={{ maxWidth: '100%' }}>
                  <span className="font-medium capitalize">{key}:</span> {value}
                </span>
              ))}
          </div>
        )}
        {/* Optional: View details button */}
        {href && (
          <Link href={href} tabIndex={-1} className="mt-auto">
            <Button variant="outline" className="w-full text-sm md:text-xs sm:text-[11px] h-9 md:h-8 sm:h-7" tabIndex={0}>
              View details
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );

  // If href and no onClick, make the whole card a link
  if (href && !onClick) {
    // Only wrap in a link if not masked
    if (!isMasked) {
      return (
        <Link href={href} className="block h-full group" tabIndex={0} aria-label={title}>
          {cardContent}
        </Link>
      );
    }
    // If masked, just render the card (no link)
    return cardContent;
  }
  return cardContent;
}