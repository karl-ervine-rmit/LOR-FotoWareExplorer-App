'use client';

import Link from "next/link";
import { Archive as ArchiveIcon, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export interface ArchiveCardProps {
  archive: {
    id: string;
    name: string;
    description?: string;
    assetCount: number;
  };
}

export default function ArchiveCard({ archive }: ArchiveCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-sm transition-shadow hover:shadow-md border border-border bg-background">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ArchiveIcon className="h-5 w-5 text-primary" />
          {archive.name}
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 w-full">
        <p className="text-muted-foreground mb-4 min-h-[2.5rem]">
          {archive.description || "No description available."}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {archive.assetCount} assets
          </span>
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