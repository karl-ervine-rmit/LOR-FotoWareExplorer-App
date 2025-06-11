'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StatsCards from '@/components/common/StatsCards';
import ArchiveCard from '@/components/common/ArchiveCard';
import SearchBar from '@/components/common/SearchBar';
import { env } from '@/lib/env';
import type { FotoWareArchive } from '@/types';

interface HomeClientProps {
  archives: FotoWareArchive[];
}

export default function HomeClient({ archives }: HomeClientProps) {
  const totalCount = archives.reduce((sum, archive) => sum + (archive.assetCount || 0), 0);
  const recentCount = 0; // TODO: Implement recent assets count

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">RMIT&apos;s FotoWare Explorer</h1>
        <p className="text-lg text-gray-600">
          Explore RMIT&apos;s digital archives and collections
        </p>
      </div>

      <div className="mb-8">
        <SearchBar />
      </div>

      {!env.FOTOWARE_API_TOKEN && (
        <Alert variant="destructive" className="mb-8">
          <div className="h-4 w-4" />
          <AlertTitle>API Credentials Missing</AlertTitle>
          <AlertDescription>
            The FotoWare API token is not configured. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      <StatsCards
        archivesCount={archives.length}
        assetsCount={totalCount}
        recentCount={recentCount}
      />

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Archives</h2>
          <Link
            href="/archives"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {archives.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No archives available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archives.map((archive) => (
              <ArchiveCard key={archive.href} archive={archive} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}