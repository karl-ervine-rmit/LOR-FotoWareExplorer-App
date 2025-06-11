'use server';

import fs from 'fs';
import path from 'path';

const ARCHIVES_DIR = path.join(process.cwd(), 'src/lib/data/archives');
const ASSETS_DIR = path.join(process.cwd(), 'src/lib/data/assets');
const FOTOWARE_BASE_URL = 'https://fotoware.lor.vic.edu.au';

// Metadata field mappings for future use
export const METADATA_FIELD_MAPPINGS: Record<string, string> = {
  "5": "Title",
  "25": "Tags",
  "116": "Copyright",
  "120": "Description",
  "187": "Unique ID",
  "201": "Source URL",
  "300": "Country",
  "302": "Publisher",
  "350": "Date",
  "360": "Contact Email",
  "361": "Contact Name",
  "362": "Last Modified",
  "427": "Resource Types",
  "429": "Access Level",
  "432": "Subjects",
  "602": "Status",
  "604": "Publisher",
  "605": "Audience",
  "611": "Visibility",
  "821": "Education Level",
  "822": "Language",
  "823": "Accessibility Features",
  "830": "Expiry Date",
  "840": "Publisher",
  "841": "Contributors",
  "842": "Embed Code",
  "844": "Technical Notes",
  "846": "Review Notes",
  "847": "Contact",
  "858": "UUID",
  "859": "Publisher",
  "860": "Creator",
  "862": "Resource Types",
  "863": "License",
  "864": "Creator",
};

interface Preview {
  size: number;
  href: string;
}

interface Rendition {
  original: boolean;
  href: string;
}

interface FotoWareAsset {
  href: string;
  filename: string;
  doctype: string;
  created: string;
  modified: string;
  metadata: Record<string, { value: string | string[] }>;
  previews: Preview[];
  renditions: Rendition[];
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  href: string;
  metadata: Record<string, { value: string | string[] }>;
  thumbnailUrl?: string;
  previewUrl?: string;
  embedUrl?: string;
  created?: string;
  modified?: string;
}

export interface Archive {
  id: string;
  name: string;
  description?: string;
  created?: string;
  modified?: string;
  metadata: Record<string, unknown>;
}

/**
 * Get all archives
 */
export async function getArchives(): Promise<Archive[]> {
  const archiveFiles = await fs.promises.readdir(ARCHIVES_DIR);
  const archives: Archive[] = [];

  for (const file of archiveFiles) {
    if (!file.endsWith('.json')) continue;

    const archivePath = path.join(ARCHIVES_DIR, file);
    const archiveContent = await fs.promises.readFile(archivePath, 'utf-8');
    const archive = JSON.parse(archiveContent);

    archives.push({
      id: archive.id,
      name: archive.name,
      description: archive.description,
      created: archive.created,
      modified: archive.modified,
      metadata: archive.metadata || {},
    });
  }

  return archives;
}

/**
 * Get a single archive by ID
 */
export async function getArchive(archiveId: string): Promise<Archive | null> {
  const archivePath = path.join(ARCHIVES_DIR, `${archiveId}.json`);

  try {
    const archiveContent = await fs.promises.readFile(archivePath, 'utf-8');
    const archive = JSON.parse(archiveContent);

    return {
      id: archive.id,
      name: archive.name,
      description: archive.description,
      created: archive.created,
      modified: archive.modified,
      metadata: archive.metadata || {},
    };
  } catch {
    return null;
  }
}

/**
 * Get assets for a specific archive
 */
export async function getArchiveAssets(archiveId: string): Promise<Asset[]> {
  const archivePath = path.join(ARCHIVES_DIR, `${archiveId}.json`);

  try {
    const archiveContent = await fs.promises.readFile(archivePath, 'utf-8');
    const archive = JSON.parse(archiveContent);
    const assets = archive.assets?.data || [];

    return assets.map((asset: FotoWareAsset) => {
      const thumbnailUrl = asset.previews.find((p: Preview) => p.size === 800)?.href;
      const previewUrl = asset.previews.find((p: Preview) => p.size === 1200)?.href;
      const embedUrl = asset.renditions.find((r: Rendition) => r.original)?.href;

      return {
        id: asset.href.split('/').pop()?.replace('.info', '') || '',
        name: asset.filename,
        type: asset.doctype,
        href: asset.href,
        metadata: asset.metadata,
        thumbnailUrl: thumbnailUrl ? `${FOTOWARE_BASE_URL}${thumbnailUrl}` : undefined,
        previewUrl: previewUrl ? `${FOTOWARE_BASE_URL}${previewUrl}` : undefined,
        embedUrl: embedUrl ? `${FOTOWARE_BASE_URL}${embedUrl}` : undefined,
        created: asset.created,
        modified: asset.modified,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Get a single asset by ID
 */
export async function getAsset(assetId: string): Promise<Asset | null> {
  // First try to load from individual asset file
  try {
    const assetPath = path.join(ASSETS_DIR, `${assetId}.json`);
    const assetContent = await fs.promises.readFile(assetPath, 'utf-8');
    const asset = JSON.parse(assetContent) as FotoWareAsset;

    const thumbnailUrl = asset.previews.find((p: Preview) => p.size === 800)?.href;
    const previewUrl = asset.previews.find((p: Preview) => p.size === 1200)?.href;
    const embedUrl = asset.renditions.find((r: Rendition) => r.original)?.href;

    return {
      id: asset.href.split('/').pop()?.replace('.info', '') || '',
      name: asset.filename,
      type: asset.doctype,
      href: asset.href,
      metadata: asset.metadata,
      thumbnailUrl: thumbnailUrl ? `${FOTOWARE_BASE_URL}${thumbnailUrl}` : undefined,
      previewUrl: previewUrl ? `${FOTOWARE_BASE_URL}${previewUrl}` : undefined,
      embedUrl: embedUrl ? `${FOTOWARE_BASE_URL}${embedUrl}` : undefined,
      created: asset.created,
      modified: asset.modified,
    };
  } catch {
    console.log(`Asset file not found for ${assetId}, searching in archives...`);
  }

  // If individual file not found, search through archives
  const archiveFiles = await fs.promises.readdir(ARCHIVES_DIR);

  for (const file of archiveFiles) {
    if (!file.endsWith('.json')) continue;

    const archivePath = path.join(ARCHIVES_DIR, file);
    const archiveContent = await fs.promises.readFile(archivePath, 'utf-8');
    const archive = JSON.parse(archiveContent);

    // Look for the asset in this archive
    const asset = archive.assets?.data?.find((a: FotoWareAsset) => {
      const assetHref = a.href.split('/').pop()?.replace('.info', '');
      return assetHref === assetId;
    });

    if (asset) {
      const thumbnailUrl = asset.previews.find((p: Preview) => p.size === 800)?.href;
      const previewUrl = asset.previews.find((p: Preview) => p.size === 1200)?.href;
      const embedUrl = asset.renditions.find((r: Rendition) => r.original)?.href;

      return {
        id: asset.href.split('/').pop()?.replace('.info', '') || '',
        name: asset.filename,
        type: asset.doctype,
        href: asset.href,
        metadata: asset.metadata,
        thumbnailUrl: thumbnailUrl ? `${FOTOWARE_BASE_URL}${thumbnailUrl}` : undefined,
        previewUrl: previewUrl ? `${FOTOWARE_BASE_URL}${previewUrl}` : undefined,
        embedUrl: embedUrl ? `${FOTOWARE_BASE_URL}${embedUrl}` : undefined,
        created: asset.created,
        modified: asset.modified,
      };
    }
  }

  return null;
}

/**
 * Search archives by name or description
 */
export async function searchArchives(searchTerm: string): Promise<Archive[]> {
  const archives = await getArchives();
  const searchTermLower = searchTerm.toLowerCase();

  return archives.filter(archive =>
    archive.name.toLowerCase().includes(searchTermLower) ||
    (archive.description?.toLowerCase().includes(searchTermLower) ?? false)
  );
}

/**
 * Sort archives by a specific field
 */
export async function sortArchives(archives: Archive[], field: keyof Archive, direction: 'asc' | 'desc' = 'asc'): Promise<Archive[]> {
  return [...archives].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue === null || bValue === null) return 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
}