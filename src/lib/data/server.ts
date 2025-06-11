'use server';

import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import type { Archive, Asset, FotoWareAsset, AssetFlag } from './types';

const ARCHIVES_DIR = path.join(process.cwd(), 'src/lib/data/archives');
const ASSETS_DIR = path.join(process.cwd(), 'src/lib/data/assets');
const FOTOWARE_BASE_URL = process.env.NEXT_PUBLIC_FOTOWARE_BASE_URL || 'https://rmit.fotoware.cloud';

/**
 * Read an archive file
 */
export const getArchive = cache(async (archiveId: string): Promise<Archive | null> => {
  try {
    const archivePath = path.join(ARCHIVES_DIR, `archive-${archiveId}.json`);
    console.log('Reading archive file:', archivePath);
    const fileContent = fs.readFileSync(archivePath, 'utf-8');
    console.log('File content length:', fileContent.length);
    const archiveData = JSON.parse(fileContent);
    const archive: Archive = {
      ...archiveData,
      id: archiveId,
    };
    console.log('Parsed archive name:', archive.name);
    return archive;
  } catch (error) {
    console.error(`Error reading archive ${archiveId}:`, error);
    return null;
  }
});

/**
 * Get all archives
 */
export const getArchives = cache(async (): Promise<Archive[]> => {
  try {
    const files = fs.readdirSync(ARCHIVES_DIR);
    const archives = await Promise.all(
      files
        .filter(file => file.startsWith('archive-') && file.endsWith('.json'))
        .map(async file => {
          const archiveId = file.replace('archive-', '').replace('.json', '');
          const archive = await getArchive(archiveId);
          if (archive) {
            // Ensure the archive has a valid ID
            return {
              ...archive,
              id: archiveId,
            };
          }
          return null;
        })
    );
    return archives.filter((archive): archive is Archive => archive !== null);
  } catch (error) {
    console.error('Error reading archives:', error);
    return [];
  }
});

/**
 * Get assets for an archive
 */
export const getArchiveAssets = cache(async (archiveId: string): Promise<Asset[]> => {
  const archive = await getArchive(archiveId);
  if (!archive) return [];

  return archive.assets.data.map(asset => {
    const thumbnailUrl = asset.previews.find(p => p.size === 800)?.href;
    const previewUrl = asset.previews.find(p => p.size === 1200)?.href;
    const embedUrl = asset.renditions.find(r => r.original)?.href;
    const assetId = asset.href.split('/').pop()?.replace('.info', '') || '';

    // Create a new metadata object that includes all original fields
    const metadata = {
      ...asset.metadata,
      // Add URL fields as MetadataValue objects
      thumbnailUrl: { value: thumbnailUrl ? `${FOTOWARE_BASE_URL}${thumbnailUrl}` : '' },
      previewUrl: { value: previewUrl ? `${FOTOWARE_BASE_URL}${previewUrl}` : '' },
      embedUrl: { value: embedUrl ? `${FOTOWARE_BASE_URL}${embedUrl}` : '' },
      // Ensure title is included
      title: asset.metadata['5'] || { value: asset.filename },
    };

    return {
      id: `${archiveId} ${assetId}`, // Include archive ID in the asset ID
      name: asset.filename,
      type: asset.doctype,
      href: asset.href,
      metadata,
      created: asset.created,
      modified: asset.modified,
      isCulturallySensitive: asset.metadata['429']?.value === 'Culturally Sensitive',
      isSuperseded: asset.metadata['602']?.value === 'Superseded',
      isFeatured: asset.metadata['611']?.value === 'Featured',
      flags: [
        asset.metadata['429']?.value === 'Culturally Sensitive' ? {
          type: 'cultural',
          label: 'Culturally sensitive content',
          icon: 'EyeOff'
        } : null,
        asset.metadata['602']?.value === 'Superseded' ? {
          type: 'superseded',
          label: 'This asset has been superseded',
          icon: 'Info'
        } : null,
        asset.metadata['611']?.value === 'Featured' ? {
          type: 'featured',
          label: 'Featured asset',
          icon: 'Star'
        } : null
      ].filter((flag): flag is AssetFlag => flag !== null)
    };
  });
});

/**
 * Get a single asset by ID
 */
export const getAsset = cache(async (assetId: string): Promise<Asset | null> => {
  // Extract the actual asset ID from the combined ID (format: "archiveId assetId")
  const [archiveId, actualAssetId] = assetId.split(' ');

  // First try to load from individual asset file
  try {
    const assetPath = path.join(ASSETS_DIR, `${actualAssetId}.json`);
    const assetContent = await fs.promises.readFile(assetPath, 'utf-8');
    const asset = JSON.parse(assetContent) as FotoWareAsset;

    const thumbnailUrl = asset.previews.find(p => p.size === 800)?.href;
    const previewUrl = asset.previews.find(p => p.size === 1200)?.href;
    const embedUrl = asset.renditions.find(r => r.original)?.href;

    // Create a new metadata object that includes all original fields
    const metadata = {
      ...asset.metadata,
      // Add URL fields as MetadataValue objects
      thumbnailUrl: { value: thumbnailUrl ? `${FOTOWARE_BASE_URL}${thumbnailUrl}` : '' },
      previewUrl: { value: previewUrl ? `${FOTOWARE_BASE_URL}${previewUrl}` : '' },
      embedUrl: { value: embedUrl ? `${FOTOWARE_BASE_URL}${embedUrl}` : '' },
      // Ensure title is included
      title: asset.metadata['5'] || { value: asset.filename },
    };

    const flags: AssetFlag[] = [];
    if (asset.metadata['429']?.value === 'Culturally Sensitive') {
      flags.push({
        type: 'cultural',
        label: 'Culturally sensitive content',
        icon: 'EyeOff'
      });
    }
    if (asset.metadata['602']?.value === 'Superseded') {
      flags.push({
        type: 'superseded',
        label: 'This asset has been superseded',
        icon: 'Info'
      });
    }
    if (asset.metadata['611']?.value === 'Featured') {
      flags.push({
        type: 'featured',
        label: 'Featured asset',
        icon: 'Star'
      });
    }

    return {
      id: assetId, // Keep the combined ID
      name: asset.filename,
      type: asset.doctype,
      href: asset.href,
      metadata,
      created: asset.created,
      modified: asset.modified,
      isCulturallySensitive: asset.metadata['429']?.value === 'Culturally Sensitive',
      isSuperseded: asset.metadata['602']?.value === 'Superseded',
      isFeatured: asset.metadata['611']?.value === 'Featured',
      flags
    };
  } catch {
    console.log(`Asset file not found for ${actualAssetId}, searching in archives...`);
  }

  // If not found in individual file, search through archives
  try {
    // First try the specific archive from the URL
    const archivePath = path.join(ARCHIVES_DIR, `archive-${archiveId}.json`);
    try {
      const archiveContent = await fs.promises.readFile(archivePath, 'utf-8');
      const archive = JSON.parse(archiveContent) as Archive;
      const asset = archive.assets.data.find(a =>
        a.href.split('/').pop()?.replace('.info', '') === actualAssetId
      );

      if (asset) {
        const thumbnailUrl = asset.previews.find(p => p.size === 800)?.href;
        const previewUrl = asset.previews.find(p => p.size === 1200)?.href;
        const embedUrl = asset.renditions.find(r => r.original)?.href;

        // Create a new metadata object that includes all original fields
        const metadata = {
          ...asset.metadata,
          // Add URL fields as MetadataValue objects
          thumbnailUrl: { value: thumbnailUrl ? `${FOTOWARE_BASE_URL}${thumbnailUrl}` : '' },
          previewUrl: { value: previewUrl ? `${FOTOWARE_BASE_URL}${previewUrl}` : '' },
          embedUrl: { value: embedUrl ? `${FOTOWARE_BASE_URL}${embedUrl}` : '' },
          // Ensure title is included
          title: asset.metadata['5'] || { value: asset.filename },
        };

        const flags: AssetFlag[] = [];
        if (asset.metadata['429']?.value === 'Culturally Sensitive') {
          flags.push({
            type: 'cultural',
            label: 'Culturally sensitive content',
            icon: 'EyeOff'
          });
        }
        if (asset.metadata['602']?.value === 'Superseded') {
          flags.push({
            type: 'superseded',
            label: 'This asset has been superseded',
            icon: 'Info'
          });
        }
        if (asset.metadata['611']?.value === 'Featured') {
          flags.push({
            type: 'featured',
            label: 'Featured asset',
            icon: 'Star'
          });
        }

        return {
          id: assetId, // Keep the combined ID
          name: asset.filename,
          type: asset.doctype,
          href: asset.href,
          metadata,
          created: asset.created,
          modified: asset.modified,
          isCulturallySensitive: asset.metadata['429']?.value === 'Culturally Sensitive',
          isSuperseded: asset.metadata['602']?.value === 'Superseded',
          isFeatured: asset.metadata['611']?.value === 'Featured',
          flags
        };
      }
    } catch (error) {
      console.error(`Error reading archive ${archiveId}:`, error);
    }

    // If not found in the specific archive, search through all archives
    const files = fs.readdirSync(ARCHIVES_DIR);
    for (const file of files) {
      if (!file.startsWith('archive-') || !file.endsWith('.json')) continue;

      const archivePath = path.join(ARCHIVES_DIR, file);
      const archiveContent = await fs.promises.readFile(archivePath, 'utf-8');
      const archive = JSON.parse(archiveContent) as Archive;
      const asset = archive.assets.data.find(a =>
        a.href.split('/').pop()?.replace('.info', '') === actualAssetId
      );

      if (asset) {
        const thumbnailUrl = asset.previews.find(p => p.size === 800)?.href;
        const previewUrl = asset.previews.find(p => p.size === 1200)?.href;
        const embedUrl = asset.renditions.find(r => r.original)?.href;

        // Create a new metadata object that includes all original fields
        const metadata = {
          ...asset.metadata,
          // Add URL fields as MetadataValue objects
          thumbnailUrl: { value: thumbnailUrl ? `${FOTOWARE_BASE_URL}${thumbnailUrl}` : '' },
          previewUrl: { value: previewUrl ? `${FOTOWARE_BASE_URL}${previewUrl}` : '' },
          embedUrl: { value: embedUrl ? `${FOTOWARE_BASE_URL}${embedUrl}` : '' },
          // Ensure title is included
          title: asset.metadata['5'] || { value: asset.filename },
        };

        const flags: AssetFlag[] = [];
        if (asset.metadata['429']?.value === 'Culturally Sensitive') {
          flags.push({
            type: 'cultural',
            label: 'Culturally sensitive content',
            icon: 'EyeOff'
          });
        }
        if (asset.metadata['602']?.value === 'Superseded') {
          flags.push({
            type: 'superseded',
            label: 'This asset has been superseded',
            icon: 'Info'
          });
        }
        if (asset.metadata['611']?.value === 'Featured') {
          flags.push({
            type: 'featured',
            label: 'Featured asset',
            icon: 'Star'
          });
        }

        return {
          id: assetId, // Keep the combined ID
          name: asset.filename,
          type: asset.doctype,
          href: asset.href,
          metadata,
          created: asset.created,
          modified: asset.modified,
          isCulturallySensitive: asset.metadata['429']?.value === 'Culturally Sensitive',
          isSuperseded: asset.metadata['602']?.value === 'Superseded',
          isFeatured: asset.metadata['611']?.value === 'Featured',
          flags
        };
      }
    }
  } catch (error) {
    console.error('Error searching archives:', error);
  }

  return null;
});

/**
 * Get archive statistics
 */
export const getArchiveStats = cache(async () => {
  try {
    const archives = await getArchives();
    const totalArchives = archives.length;
    const totalAssets = archives.reduce((sum, archive) => sum + archive.assetCount, 0);
    const totalSize = archives.reduce((sum, archive) => {
      const archiveSize = archive.assets.data.reduce((assetSum, asset) => {
        const originalRendition = asset.renditions.find(r => r.original);
        return assetSum + (originalRendition?.width || 0) * (originalRendition?.height || 0);
      }, 0);
      return sum + archiveSize;
    }, 0);

    const fileTypes = new Map<string, number>();
    archives.forEach(archive => {
      archive.assets.data.forEach(asset => {
        const type = asset.doctype.toLowerCase();
        fileTypes.set(type, (fileTypes.get(type) || 0) + 1);
      });
    });

    const dateRange = archives.reduce((range, archive) => {
      const validDates = archive.assets.data
        .map(asset => {
          const date = new Date(asset.created);
          return isNaN(date.getTime()) ? null : date;
        })
        .filter((date): date is Date => date !== null);

      if (validDates.length > 0) {
        const minDate = new Date(Math.min(...validDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...validDates.map(d => d.getTime())));

        if (!range.earliest || minDate < range.earliest) {
          range.earliest = minDate;
        }
        if (!range.latest || maxDate > range.latest) {
          range.latest = maxDate;
        }
      }
      return range;
    }, { earliest: null as Date | null, latest: null as Date | null });

    return {
      totalArchives,
      totalAssets,
      lastUpdated: dateRange.latest?.toISOString() || new Date().toISOString(),
      totalSize,
      fileTypes: Object.fromEntries(fileTypes),
      dateRange: {
        earliest: dateRange.earliest?.toISOString() || null,
        latest: dateRange.latest?.toISOString() || null,
      },
    };
  } catch (error) {
    console.error('Error getting archive stats:', error);
    return {
      totalArchives: 0,
      totalAssets: 0,
      lastUpdated: new Date().toISOString(),
      totalSize: 0,
      fileTypes: {},
      dateRange: {
        earliest: null,
        latest: null,
      },
    };
  }
});