import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MetadataValue } from './data/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStringValue(value: MetadataValue | string | string[] | number | boolean | null | undefined): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    if ('value' in value) {
      const metadataValue = value.value;
      if (Array.isArray(metadataValue)) {
        return metadataValue.join(', ');
      }
      return String(metadataValue);
    }
    return JSON.stringify(value);
  }
  return '';
}
