'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from './Breadcrumbs';

export function ArchiveBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const [archiveName, setArchiveName] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchiveName = async () => {
      const archiveIndex = segments.findIndex(segment => segment === 'archives');
      if (archiveIndex !== -1 && segments[archiveIndex + 1]) {
        const archiveId = segments[archiveIndex + 1];
        console.log('Fetching archive name for ID:', archiveId);
        try {
          const response = await fetch(`/api/archives/${archiveId}`);
          if (response.ok) {
            const archive = await response.json();
            console.log('Received archive data:', archive);
            setArchiveName(archive.name);
          } else {
            console.error('Failed to fetch archive:', response.status);
          }
        } catch (error) {
          console.error('Error fetching archive:', error);
        }
      }
    };

    fetchArchiveName();
  }, [segments]);

  // If we're on an archive page and have the name, use it
  if (archiveName) {
    const archiveIndex = segments.findIndex(segment => segment === 'archives');
    if (archiveIndex !== -1) {
      const newSegments = [...segments];
      newSegments[archiveIndex + 1] = archiveName;
      return <Breadcrumbs segments={newSegments} />;
    }
  }

  return <Breadcrumbs segments={segments} />;
}