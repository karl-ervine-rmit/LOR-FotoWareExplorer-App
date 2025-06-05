// UniversalEmbed component for embedding images, video, PDF, 3D, and generic iframes
// TODO: Implement universal media embedding logic

import Image from 'next/image';
import { cn } from '@/lib/utils';
import React from 'react';
import { CulturallySensitiveMask } from './AssetCard';

export type EmbedType =
  | 'image'
  | 'video'
  | 'youtube'
  | 'vimeo'
  | 'pdf'
  | 'audio'
  | 'epub'
  | 'document'
  | 'code'
  | 'iframe'
  | 'fallback';

export interface UniversalEmbedProps {
  type: EmbedType;
  src: string;
  title?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  allowFullScreen?: boolean;
  allow?: string;
  sandbox?: string;
  fallback?: string;
  isCulturallySensitive?: boolean;
  showCulturallySensitive?: boolean;
  [key: string]: unknown;
}

export default function UniversalEmbed({
  type,
  src,
  title = '',
  className,
  width = '100%',
  height = 400,
  allowFullScreen = true,
  allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms',
  fallback,
  isCulturallySensitive = false,
  showCulturallySensitive = false,
  ...props
}: UniversalEmbedProps) {
  const baseClass = 'rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800';
  const [hasError, setHasError] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  const isMasked = isCulturallySensitive && !showCulturallySensitive && !revealed;

  // Helper for fallback rendering
  const renderFallback = () => (
    <div className={cn('flex flex-col items-center justify-center p-4', baseClass, className)} style={{ width, height }}>
      {fallback ? (
        <Image
          src={fallback}
          alt={title ? `Preview thumbnail for ${title}` : 'Preview thumbnail'}
          width={typeof width === 'number' ? width : undefined}
          height={typeof height === 'number' ? height : undefined}
          className="object-contain mb-2"
        />
      ) : null}
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View {title || 'file'} (opens in new tab)
      </a>
      <span className="text-xs text-gray-500 mt-2">Could not display this media. Please try again or download the file.</span>
    </div>
  );

  // Mask overlay for culturally sensitive content
  if (isMasked) {
    return (
      <div className={cn('relative', className)} style={{ width, height }}>
        <CulturallySensitiveMask onReveal={() => setRevealed(true)} variant="detail" />
      </div>
    );
  }

  const renderEmbed = () => {
    if (hasError) return renderFallback();
    switch (type) {
      case 'youtube': {
        let youtubeId = '';
        if (src.includes('youtu.be/')) {
          youtubeId = src.split('youtu.be/')[1].split('?')[0];
        } else {
          try {
            youtubeId = new URL(src).searchParams.get('v') || '';
          } catch {}
        }
        const youtubeSrc = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`;
        return (
          <iframe
            src={youtubeSrc}
            title={title}
            allow={allow}
            allowFullScreen={allowFullScreen}
            className={cn('w-full aspect-video', baseClass)}
            onError={() => setHasError(true)}
            {...props}
          />
        );
      }
      case 'vimeo': {
        let vimeoId = '';
        if (src.includes('vimeo.com/')) {
          vimeoId = src.split('vimeo.com/')[1].split('?')[0];
        }
        const vimeoSrc = `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`;
        return (
          <div className={cn('relative pt-[56.25%]', baseClass, className)}>
            <iframe
              src={vimeoSrc}
              title={title}
              allow={allow}
              allowFullScreen={allowFullScreen}
              className="absolute top-0 left-0 w-full h-full"
              onError={() => setHasError(true)}
              {...props}
            />
          </div>
        );
      }
      case 'pdf':
        return (
          <div className={cn('w-full h-full min-h-[500px]', baseClass, className)}>
            <iframe
              src={src}
              title={title}
              className="w-full h-full"
              onError={() => setHasError(true)}
              {...props}
            />
          </div>
        );
      case 'image':
        return (
          <div className={cn('relative', baseClass, className)} style={{ width, height }}>
            <Image
              src={src}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              onError={() => setHasError(true)}
              {...props}
            />
          </div>
        );
      case 'video':
        return (
          <video
            controls
            src={src}
            className={cn('w-full', baseClass, className)}
            style={{ width, height }}
            onError={() => setHasError(true)}
            {...props}
          >
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className={cn('p-4', baseClass, className)}>
            <audio
              controls
              src={src}
              className="w-full"
              onError={() => setHasError(true)}
              {...props}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'document':
        return (
          <div className={cn('w-full h-[600px]', baseClass, className)}>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`}
              title={title}
              className="w-full h-full"
              onError={() => setHasError(true)}
              {...props}
            />
          </div>
        );
      case 'code':
        return (
          <div className={cn('p-4 overflow-auto', baseClass, className)}>
            <pre className="whitespace-pre-wrap break-words">
              <code>{src}</code>
            </pre>
          </div>
        );
      case 'iframe':
        return (
          <div className={cn('w-full h-full min-h-[400px]', baseClass, className)}>
            <iframe
              src={src}
              title={title}
              allow={allow}
              sandbox={sandbox}
              allowFullScreen={allowFullScreen}
              className="w-full h-full"
              onError={() => setHasError(true)}
              {...props}
            />
          </div>
        );
      // TODO: Add support for '3d' and 'map' embed types in the future. See BUILD_NOTES.md for details.
      case 'fallback':
      default:
        return renderFallback();
    }
  };

  return (
    <div className={cn('not-prose', className)}>
      {renderEmbed()}
      {title && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>
      )}
    </div>
  );
}