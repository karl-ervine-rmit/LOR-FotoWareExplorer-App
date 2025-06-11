/**
 * Build Data Script for FotoWare Explorer
 *
 * This script fetches data from FotoWare API public endpoints and creates a local static data store.
 * It's designed to work with public endpoints only, requiring no API token.
 *
 * Directory Structure:
 * - lib/data/
 *   ├── archives/
 *   │   └── archive-[archiveid].json    # Individual archive data
 *   ├── assets/
 *   │   └── [assetid].json             # Individual asset data
 *   └── index/
 *       └── index.json                  # Index of all archives with metadata
 *
 * Environment Requirements:
 * - NEXT_PUBLIC_API_URL: Base URL for the FotoWare API (e.g., https://rmit.fotoware.cloud/fotoweb)
 * - NODE_ENV: Set to 'development' for local development
 *
 * Usage:
 * 1. Ensure .env.local file is configured with required variables
 * 2. Run: NODE_ENV=development npm run build-data
 *
 * The script will:
 * 1. Fetch all archives from the public API
 * 2. For each archive:
 *    - Save archive data to archive-[archiveid].json
 *    - Fetch and save all assets to [assetid].json
 * 3. Create an index.json with metadata about all archives
 *
 * Note: This script uses pagination to handle large datasets and includes error handling
 * for failed requests.
 */

import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Create directories if they don't exist
const DATA_DIR = path.join(process.cwd(), 'src/lib/data');
const ARCHIVES_DIR = path.join(DATA_DIR, 'archives');
const ASSETS_DIR = path.join(DATA_DIR, 'assets');
const INDEX_DIR = path.join(DATA_DIR, 'index');

// Ensure directories exist
[ARCHIVES_DIR, ASSETS_DIR, INDEX_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define interfaces for our data structures
interface AssetDetails {
  id: string;
  filename: string;
  href: string;
  metadata: {
    [key: string]: {
      value: string | string[];
    };
  };
  archives: string[];
  uniqueId: string; // This will be the metadata field 187 value
}

interface Archive {
  id: string;
  name: string;
  description: string;
  href: string;
  assets?: {
    data: Array<{
      id: string;
      filename: string;
      href: string;
    }>;
  };
}

const CONFIG = {
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  TIMEOUT: 30000
};

// Ensure the base URL ends with /fotoweb
function getBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set in environment variables');
  }
  return baseUrl.endsWith('/fotoweb') ? baseUrl : `${baseUrl}/fotoweb`;
}

async function fetchArchives() {
  try {
    const response = await fetch(`${getBaseUrl()}/archives/`, {
      headers: CONFIG.HEADERS,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching archives:', error);
    throw error;
  }
}

async function fetchArchiveDetails(archiveId: string) {
  try {
    const response = await fetch(`${getBaseUrl()}/archives/${archiveId}/`, {
      headers: CONFIG.HEADERS,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching archive details for ${archiveId}:`, error);
    throw error;
  }
}

async function fetchAssetDetails(archiveId: string, asset: {
  href: string;
  filename: string;
  metadata?: {
    '187'?: { value: string };
  };
}) {
  try {
    // Use the .info URL directly
    const assetInfoUrl = asset.href;

    // Remove the leading /fotoweb/ from the path since it's already in the base URL
    const assetPath = assetInfoUrl.startsWith('/fotoweb/') ? assetInfoUrl.slice(8) : assetInfoUrl;

    const url = `${getBaseUrl()}${assetPath}`;

    console.log('Attempting to fetch asset with:');
    console.log('URL:', url);
    console.log('Headers:', CONFIG.HEADERS);

    const response = await fetch(url, {
      headers: CONFIG.HEADERS,
    });

    if (response.status === 404) {
      console.warn(`Asset ${asset.filename} not found in archive ${archiveId}`);
      console.warn('Full URL that failed:', url);
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const assetData = await response.json();

    // Get the unique identifier from metadata - try both the asset's metadata and the response metadata
    const uniqueId = asset.metadata?.['187']?.value || assetData.metadata?.['187']?.value;
    if (!uniqueId) {
      console.warn(`No unique identifier found for asset ${asset.filename} in archive ${archiveId}`);
      console.warn('Asset metadata:', JSON.stringify(asset.metadata, null, 2));
      console.warn('Response metadata:', JSON.stringify(assetData.metadata, null, 2));
      return null;
    }

    // Add the unique identifier and archive info to the asset data
    return {
      ...assetData,
      uniqueId,
      archives: [archiveId],
      href: asset.href // Preserve the original href
    };
  } catch (error) {
    console.error(`Error fetching asset ${asset.filename}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

// Add this function near the top with other utility functions
function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function buildData() {
  const startTime = Date.now();
  console.log('Starting data build process...');
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  });

  try {
    // Create index structure
    const index = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalArchives: 0,
        totalAssets: 0,
        buildTime: 0
      },
      archives: {} as Record<string, {
        id: string;
        name: string;
        description: string;
        href: string;
        assetCount: number;
        assets: string[]; // Array of asset IDs (metadata field 187 values)
      }>
    };

    // Keep track of unique assets with a size limit
    const uniqueAssets = new Map<string, AssetDetails>();
    const MAX_MEMORY_ASSETS = 100; // Process in chunks to manage memory

    // Fetch all archives
    const archives = await fetchArchives();
    index.metadata.totalArchives = archives.data.length;
    console.log(`Found ${archives.data.length} archives`);

    // Process each archive
    for (const archive of archives.data) {
      const archiveId = archive.id;
      console.log(`\nProcessing archive: ${archive.name} (${archiveId})`);

      try {
        const archiveDetails = await fetchArchiveDetails(archiveId);

        // Initialize archive in index
        index.archives[archiveId] = {
          id: archiveId,
          name: archive.name,
          description: archive.description || '',
          href: archive.href,
          assetCount: 0,
          assets: []
        };

        // Write archive file
        fs.writeFileSync(
          path.join(ARCHIVES_DIR, `archive-${archiveId}.json`),
          JSON.stringify(archiveDetails, null, 2)
        );
        console.log(`Wrote archive data to archive-${archiveId}.json`);

        // Process assets
        if (archiveDetails.assets?.data) {
          const assetCount = archiveDetails.assets.data.length;
          console.log(`Found ${assetCount} assets in archive ${archive.name}`);
          index.archives[archiveId].assetCount = assetCount;

          let processedCount = 0;
          // Process assets sequentially
          for (const asset of archiveDetails.assets.data) {
            try {
              const assetData = await fetchAssetDetails(archiveId, asset);
              if (assetData) {
                const uniqueId = assetData.uniqueId;

                // Update unique assets map
                if (!uniqueAssets.has(uniqueId)) {
                  uniqueAssets.set(uniqueId, assetData);
                } else {
                  const existingAsset = uniqueAssets.get(uniqueId)!;
                  if (!existingAsset.archives.includes(archive.id)) {
                    existingAsset.archives.push(archive.id);
                  }
                }

                // Update index - only store asset ID in archive
                index.archives[archiveId].assets.push(uniqueId);
                index.metadata.totalAssets = uniqueAssets.size;

                // Write asset file immediately if we have too many in memory
                if (uniqueAssets.size >= MAX_MEMORY_ASSETS) {
                  const assetToWrite = uniqueAssets.get(uniqueId)!;
                  const assetPath = path.join(ASSETS_DIR, `${uniqueId}.json`);
                  ensureDirectoryExists(assetPath);
                  fs.writeFileSync(assetPath, JSON.stringify(assetToWrite, null, 2));
                  uniqueAssets.delete(uniqueId);
                }
              }
              processedCount++;
              if (processedCount % 50 === 0) {
                console.log(`Processed ${processedCount}/${assetCount} assets in archive ${archive.name}`);
              }
            } catch (error) {
              console.error(`Error processing asset in archive ${archiveId}:`, error);
            }
          }
        } else {
          console.warn(`No assets found in archive ${archiveId}`);
        }

        // Write index file after each archive
        fs.writeFileSync(
          path.join(INDEX_DIR, 'index.json'),
          JSON.stringify(index, null, 2)
        );
        console.log(`Updated index.json with archive ${archive.name} data (assetCount: ${index.archives[archiveId].assetCount})`);
      } catch (error) {
        console.error(`Error processing archive ${archive.name}:`, error);
      }
    }

    // Write any remaining unique asset files
    console.log('\nWriting remaining unique asset files...');
    for (const [assetId, asset] of uniqueAssets.entries()) {
      try {
        const assetPath = path.join(ASSETS_DIR, `${assetId}.json`);
        ensureDirectoryExists(assetPath);
        fs.writeFileSync(assetPath, JSON.stringify(asset, null, 2));
      } catch (error) {
        console.error(`Error writing asset file for ${assetId}:`, error);
      }
    }

    // Update build time
    index.metadata.buildTime = Date.now() - startTime;

    // Write final index file
    fs.writeFileSync(
      path.join(INDEX_DIR, 'index.json'),
      JSON.stringify(index, null, 2)
    );
    console.log('\nWrote final index file to index.json');

    console.log('\nBuild completed successfully!');
    console.log('Summary:', {
      totalArchives: index.metadata.totalArchives,
      totalAssets: index.metadata.totalAssets,
      lastUpdated: index.metadata.lastUpdated,
      buildTime: `${(index.metadata.buildTime / 1000).toFixed(2)}s`
    });
  } catch (error) {
    console.error('Error building data:', error);
    process.exit(1);
  }
}

// Run the build
buildData();