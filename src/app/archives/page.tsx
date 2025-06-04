'use client';
// Page for listing FotoWare archives
// TODO: Implement archives list UI and data fetching

import { Archive, ArchiveIcon, Grid3X3, List, Search, ArrowRight, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

function ArchiveCard({ archive }: { archive: { id: string; name: string; description?: string } }) {
  return (
    <Card className="flex flex-col h-full shadow-sm transition-shadow hover:shadow-md border border-border bg-background">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Archive className="h-5 w-5 text-primary" />
          {archive.name}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 w-full">
        <p className="text-muted-foreground mb-4 min-h-[2.5rem]">
          {archive.description || "No description available."}
        </p>
        <div className="mt-auto">
          <Link
            href={`/archives/${archive.id}`}
            className="inline-flex items-center gap-1 text-primary underline font-medium hover:text-primary/80 transition"
          >
            View archive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ArchivesPage() {
  // Placeholder data
  const archives = [
    { id: '1', name: 'Photo Archive', description: 'A collection of photographs from across Australia.' },
    { id: '2', name: 'Video Archive', description: 'Videos documenting Australian events and landscapes.' },
  ];

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ArchiveIcon className="h-8 w-8 text-primary" />
            Archives
          </h1>
          <p className="text-muted-foreground mt-2 text-base">Browse and explore digital asset collections</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button
            variant="secondary"
            aria-label="Grid view"
            className="inline-flex items-center justify-center h-12 w-12 p-0 rounded-md"
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="outline"
            aria-label="List view"
            className="inline-flex items-center justify-center h-12 w-12 p-0 rounded-md"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>
      <Card className="bg-card text-card-foreground shadow-sm border border-border !py-0">
        <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 h-[3rem] w-full text-base"
              placeholder="Search archives..."
              aria-label="Search archives"
            />
          </div>
          <div className="flex gap-2 w-full sm:flex-row sm:gap-2 sm:w-auto">
            <Select>
              <SelectTrigger className="flex-1 h-[3rem] min-h-[3rem] !py-0 flex items-center text-base sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="assetCount">Asset Count</SelectItem>
                <SelectItem value="lastSynced">Last Updated</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              aria-label={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
              className={`h-[3rem] min-h-[3rem] !py-0 w-12 flex items-center justify-center sm:w-auto px-4`}
              onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
            >
              {sortDirection === 'asc' ? (
                <ArrowUpNarrowWide className="h-5 w-5" />
              ) : (
                <ArrowDownWideNarrow className="h-5 w-5" />
              )}
              <span className="sr-only">{sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
        <span>{archives.length} archives</span>
        <span>Total: {archives.length * 10} assets</span> {/* Placeholder asset count */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archives.map((archive) => (
          <div key={archive.id} className="h-full">
            <ArchiveCard archive={archive} />
          </div>
        ))}
      </div>
    </div>
  );
}