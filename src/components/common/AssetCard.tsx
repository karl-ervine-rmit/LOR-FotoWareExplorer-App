import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
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

interface CulturallySensitiveMaskProps {
  onReveal: () => void;
  variant?: 'card' | 'detail';
  className?: string;
  style?: React.CSSProperties;
}

export function CulturallySensitiveMask({ onReveal, variant = 'card', className, style }: CulturallySensitiveMaskProps) {
  // Variant-based styles
  const isCard = variant === 'card';
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center text-center bg-black/95 rounded-lg z-20',
        isCard ? 'px-4 py-4 md:px-2 md:py-2' : 'px-8 py-12 md:px-12 md:py-16',
        className
      )}
      style={{ width: '100%', height: '100%', ...style }}
      aria-label="Culturally sensitive content. Content is hidden for cultural safety."
      role="img"
    >
      <AlertTriangle className={isCard ? 'h-8 w-8 text-yellow-400 mb-2 md:h-6 md:w-6 md:mb-1 sm:h-5 sm:w-5' : 'h-12 w-12 text-yellow-400 mb-4'} aria-hidden />
      <span className={isCard ? 'text-white font-semibold text-base md:text-sm sm:text-xs leading-tight' : 'text-white font-semibold text-xl md:text-2xl leading-tight mb-2'}>Culturally sensitive content</span>
      <span className={isCard ? 'text-white text-xs mt-1 mb-2 md:mt-0.5 md:mb-1 sm:text-[11px]' : 'text-white text-base mb-4'}>Content is hidden for cultural safety</span>
      <Button
        variant="outline"
        size={isCard ? 'sm' : 'lg'}
        className={isCard ? 'mt-2 md:mt-1 px-3 py-1 text-xs md:text-xs sm:text-[11px] h-7 md:h-6' : 'mt-2 px-6 py-2 text-base h-11'}
        onClick={onReveal}
        aria-label="Show this content"
      >
        Show this content
      </Button>
    </div>
  );
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
  // const maskLabel = isCulturallySensitive
  //   ? 'Culturally sensitive content. Image is hidden for cultural safety.'
  //   : undefined;

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
        'p-0'
      )}
      aria-label={title}
      onClick={onClick}
    >
      {/* Image area with markers and mask overlay */}
      <div className="relative w-full aspect-[4/3] bg-black overflow-hidden">
        {/* Markers always rendered, absolutely positioned, clickable */}
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
        {/* Mask overlay if masked, else image (image/link only if not masked) */}
        {isMasked ? (
          <CulturallySensitiveMask onReveal={() => setRevealed(true)} variant="card" />
        ) : (
          href ? (
            <Link href={href} tabIndex={-1} aria-label={title} className="block w-full h-full">
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
            </Link>
          ) : (
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
          )
        )}
      </div>
      {/* Title and meta */}
      {href ? (
        <Link href={href} tabIndex={-1} aria-label={title} className="block group/card-content focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <CardContent className="flex flex-col pt-4 pb-5 px-5 md:pt-3 md:pb-4 md:px-4 sm:pt-2 sm:pb-3 sm:px-3 gap-2">
            <div className="font-semibold text-base md:text-sm sm:text-xs mb-2 truncate leading-tight" title={title} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</div>
            {meta && (
              <div className="flex flex-wrap gap-2 mb-3 md:gap-1 md:mb-2 sm:gap-0.5 sm:mb-1">
                {Object.entries(meta)
                  .filter(([key]) => key !== 'title')
                  .map(([key, value]) => (
                    <span key={key} className="text-xs md:text-[11px] sm:text-[10px] text-muted-foreground bg-muted rounded px-2 py-0.5 md:px-1.5 md:py-0.5 sm:px-1 sm:py-0.5 truncate max-w-full" style={{ maxWidth: '100%' }}>
                      <span className="font-medium capitalize">{key}:</span> {value}
                    </span>
                  ))}
              </div>
            )}
            {/* Prominent View details visually styled as a button */}
            <span className={buttonVariants({ variant: 'outline', size: 'default' }) + ' mt-auto w-full text-center cursor-pointer select-none'}>View details</span>
          </CardContent>
        </Link>
      ) : (
        <CardContent className="flex flex-col pt-4 pb-5 px-5 md:pt-3 md:pb-4 md:px-4 sm:pt-2 sm:pb-3 sm:px-3 gap-2">
          <div className="font-semibold text-base md:text-sm sm:text-xs mb-2 truncate leading-tight" title={title} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</div>
          {meta && (
            <div className="flex flex-wrap gap-2 mb-3 md:gap-1 md:mb-2 sm:gap-0.5 sm:mb-1">
              {Object.entries(meta)
                .filter(([key]) => key !== 'title')
                .map(([key, value]) => (
                  <span key={key} className="text-xs md:text-[11px] sm:text-[10px] text-muted-foreground bg-muted rounded px-2 py-0.5 md:px-1.5 md:py-0.5 sm:px-1 sm:py-0.5 truncate max-w-full" style={{ maxWidth: '100%' }}>
                    <span className="font-medium capitalize">{key}:</span> {value}
                  </span>
                ))}
            </div>
          )}
          {/* Disabled View details visually styled as a button */}
          <span className={buttonVariants({ variant: 'outline', size: 'default' }) + ' mt-auto w-full text-center cursor-not-allowed select-none opacity-60'} aria-disabled="true">View details</span>
        </CardContent>
      )}
    </Card>
  );

  return cardContent;
}