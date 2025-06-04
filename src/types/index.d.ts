// index.d.ts for shared TypeScript types
// TODO: Define types for archives, albums, assets, and API responses

// Types for FotoWare API entities

export interface FotoWareArchive {
  id: string;
  name: string;
  description?: string;
  // Add more fields as needed from the API
}

export interface FotoWareAlbum {
  id: string;
  name: string;
  description?: string;
  archiveId: string;
  // Add more fields as needed from the API
}

export interface FotoWareAsset {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  mediaType: 'image' | 'video' | 'pdf' | '3d' | 'other';
  embedUrl: string;
  archiveId: string;
  albumId?: string;
  // Add more fields as needed from the API
}