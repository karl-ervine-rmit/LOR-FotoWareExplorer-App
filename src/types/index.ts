export interface FotoWareArchive {
  id: string;
  name: string;
  description?: string;
  href: string;
  assetCount: number;
  totalAssetCount?: number;
  created: string;
  modified: string;
  data: Record<string, unknown>;
  links: Record<string, unknown>;
  archiveHREF: string;
  archiveId: string;
  linkstance: string;
  isVersioningEnabled: boolean;
  permissions: string[];
  canHaveChildren: boolean;
  isSearchable: boolean;
  isSelectable: boolean;
  isLinkCollection: boolean;
  hasChildren: boolean;
  canCopyTo: boolean;
  canMoveTo: boolean;
  canUploadTo: boolean;
  canCreateFolders: boolean;
  canIngestToChildren: boolean;
  canBeDeleted: boolean;
  canBeArchived: boolean;
  isFolderNavigationEnabled: boolean;
  isSmartFolderNavigationEnabled: boolean;
  canSelect: boolean;
  isConsentManagementEnabled: boolean;
  isConsentStatusFilterEnabled: boolean;
}

export interface FotoWareAsset {
  id: string;
  name: string;
  description?: string;
  href: string;
  created: string;
  modified: string;
  data: Record<string, unknown>;
  links: Record<string, unknown>;
  metadata: Record<string, unknown>;
  archiveHREF: string;
  archiveId: string;
  linkstance: string;
  isVersioningEnabled: boolean;
  permissions: string[];
  canHaveChildren: boolean;
  isSearchable: boolean;
  isSelectable: boolean;
  isLinkCollection: boolean;
  hasChildren: boolean;
  canCopyTo: boolean;
  canMoveTo: boolean;
  canUploadTo: boolean;
  canCreateFolders: boolean;
  canIngestToChildren: boolean;
  canBeDeleted: boolean;
  canBeArchived: boolean;
  isFolderNavigationEnabled: boolean;
  isSmartFolderNavigationEnabled: boolean;
  canSelect: boolean;
  isConsentManagementEnabled: boolean;
  isConsentStatusFilterEnabled: boolean;
}

export interface FotoWareResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  links: Record<string, unknown>;
}