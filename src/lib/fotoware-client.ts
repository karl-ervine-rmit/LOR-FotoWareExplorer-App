// fotoware-client utility for interacting with the FotoWare API
// TODO: Implement API client logic

import type { FotoWareArchive, FotoWareAlbum, FotoWareAsset } from '../types/index.d.ts';

const API_URL = process.env.FOTOWARE_API_URL;
const API_TOKEN = process.env.FOTOWARE_API_TOKEN;

function isApiReady() {
  return Boolean(API_URL && API_TOKEN);
}

async function fetchFromFotoWare<T>(endpoint: string): Promise<T> {
  if (!isApiReady()) {
    console.warn('FotoWare API URL or token not set. Returning empty data for development.');
    // @ts-expect-error: Return empty array/object for dev
    return Array.isArray([]) ? [] : {};
  }
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`FotoWare API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getArchives(): Promise<FotoWareArchive[]> {
  if (!isApiReady()) return [];
  return fetchFromFotoWare<FotoWareArchive[]>('/archives');
}

export async function getAlbums(archiveId: string): Promise<FotoWareAlbum[]> {
  if (!isApiReady()) return [];
  return fetchFromFotoWare<FotoWareAlbum[]>(`/archives/${archiveId}/albums`);
}

export async function getAssets(archiveId: string, albumId?: string): Promise<FotoWareAsset[]> {
  if (!isApiReady()) return [];
  const path = albumId
    ? `/archives/${archiveId}/albums/${albumId}/assets`
    : `/archives/${archiveId}/assets`;
  return fetchFromFotoWare<FotoWareAsset[]>(path);
}

export async function getAsset(archiveId: string, assetId: string): Promise<FotoWareAsset | null> {
  if (!isApiReady()) return null;
  return fetchFromFotoWare<FotoWareAsset>(`/archives/${archiveId}/assets/${assetId}`);
}