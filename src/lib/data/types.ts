// Types and constants for FotoWare data

export interface Preview {
  size: number;
  width: number;
  height: number;
  href: string;
  square: boolean;
}

export interface Rendition {
  display_name: string;
  description: string;
  width: number;
  height: number;
  href: string;
  default: boolean;
  original: boolean;
}

export interface MetadataValue {
  value: string | string[];
}

export interface FotoWareAsset {
  href: string;
  filename: string;
  doctype: string;
  created: string;
  modified: string;
  metadata: Record<string, MetadataValue>;
  previews: Preview[];
  renditions: Rendition[];
}

export interface Archive {
  name: string;
  description: string;
  href: string;
  id: string;
  type: string;
  created: string;
  modified: string;
  assetCount: number;
  assets: {
    data: Array<{
      href: string;
      archiveId: number;
      filename: string;
      doctype: string;
      created: string;
      modified: string;
      metadata: Record<string, MetadataValue>;
      previews: Preview[];
      renditions: Rendition[];
    }>;
  };
}

export interface AssetFlag {
  type: string;
  label: string;
  icon: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  href: string;
  metadata: Record<string, MetadataValue> & {
    title?: MetadataValue;
    thumbnailUrl?: MetadataValue;
    previewUrl?: MetadataValue;
    embedUrl?: MetadataValue;
  };
  created: string;
  modified: string;
  isCulturallySensitive?: boolean;
  isSuperseded?: boolean;
  isFeatured?: boolean;
  flags?: AssetFlag[];
}

// Metadata field mappings
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