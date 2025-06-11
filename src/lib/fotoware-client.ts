// fotoware-client utility for interacting with the FotoWare API
// TODO: Implement API client logic

import { env } from './env';
import type { FotoWareArchive, FotoWareAlbum, FotoWareAsset } from '../types';

const API_URL = env.FOTOWARE_API_URL;
const API_TOKEN = env.FOTOWARE_API_TOKEN;

function isApiReady() {
  return Boolean(API_URL && API_TOKEN);
}

async function fetchFromFotoWare<T>(endpoint: string): Promise<T> {
  if (!isApiReady()) {
    console.warn('FotoWare API URL or token not set. Returning empty data for development.');
    // Return appropriate empty value based on expected type
    if (endpoint.includes('/archives')) {
      return [] as T;
    }
    if (endpoint.includes('/assets/')) {
      return null as T;
    }
    return {} as T;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`FotoWare API error: ${res.status} ${res.statusText}`);
      // Return appropriate empty value based on expected type
      if (endpoint.includes('/archives')) {
        return [] as T;
      }
      if (endpoint.includes('/assets/')) {
        return null as T;
      }
      return {} as T;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid response type from FotoWare API:', contentType);
      // Return appropriate empty value based on expected type
      if (endpoint.includes('/archives')) {
        return [] as T;
      }
      if (endpoint.includes('/assets/')) {
        return null as T;
      }
      return {} as T;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching from FotoWare:', error);
    // Return appropriate empty value based on expected type
    if (endpoint.includes('/archives')) {
      return [] as T;
    }
    if (endpoint.includes('/assets/')) {
      return null as T;
    }
    return {} as T;
  }
}

export async function getArchives(): Promise<FotoWareArchive[]> {
  return fetchFromFotoWare<FotoWareArchive[]>('/archives');
}

export async function getAlbums(archiveId: string): Promise<FotoWareAlbum[]> {
  return fetchFromFotoWare<FotoWareAlbum[]>(`/archives/${archiveId}/albums`);
}

export async function getAssets(archiveId: string, albumId?: string): Promise<FotoWareAsset[]> {
  const path = albumId
    ? `/archives/${archiveId}/albums/${albumId}/assets`
    : `/archives/${archiveId}/assets`;
  return fetchFromFotoWare<FotoWareAsset[]>(path);
}

export async function getAsset(archiveId: string, assetId: string): Promise<FotoWareAsset | null> {
  return fetchFromFotoWare<FotoWareAsset | null>(`/archives/${archiveId}/assets/${assetId}`);
}