// src/app/archives/_client.tsx

"use client";
import { useState } from "react";
import {
  ArchiveIcon,
  Grid3X3,
  List,
  Search,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ArchiveCard from "@/components/common/ArchiveCard";

interface Archive {
  id: string;
  name: string;
  description?: string;
  assetCount: number;
  assets: string[];
}

export default function ArchivesPageClient({
  archives,
}: {
  archives: Archive[];
}) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "assetCount" | "lastUpdated">("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort archives
  const filteredArchives = archives
    .filter((archive) =>
      archive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortBy) {
        case "name":
          return direction * a.name.localeCompare(b.name);
        case "assetCount":
          return direction * (a.assetCount - b.assetCount);
        case "lastUpdated":
          // TODO: Implement lastUpdated sorting when available
          return 0;
        default:
          return 0;
      }
    });

  const totalAssets = archives.reduce((sum, archive) => sum + archive.assetCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ArchiveIcon className="h-8 w-8 text-primary" />
            Archives
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Browse and explore digital asset collections
          </p>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:flex-row sm:gap-2 sm:w-auto">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="flex-1 h-[3rem] min-h-[3rem] !py-0 flex items-center text-base sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="assetCount">Asset Count</SelectItem>
                <SelectItem value="lastUpdated">Last Updated</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              aria-label={
                sortDirection === "asc" ? "Sort ascending" : "Sort descending"
              }
              className={`h-[3rem] min-h-[3rem] !py-0 w-12 flex items-center justify-center sm:w-auto px-4`}
              onClick={() =>
                setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
              }
            >
              {sortDirection === "asc" ? (
                <ArrowUpNarrowWide className="h-5 w-5" />
              ) : (
                <ArrowDownWideNarrow className="h-5 w-5" />
              )}
              <span className="sr-only">
                {sortDirection === "asc" ? "Sort ascending" : "Sort descending"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
        <span>{filteredArchives.length} archives</span>
        <span>Total: {totalAssets} assets</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArchives.map((archive) => (
          <div key={archive.id} className="h-full">
            <ArchiveCard archive={archive} />
          </div>
        ))}
      </div>
    </div>
  );
}
