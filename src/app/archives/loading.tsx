import { Skeleton } from "@/components/ui/skeleton";

export default function ArchivesLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Heading and view toggles */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-4 w-56 mt-2" />
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Skeleton className="h-12 w-12 rounded-md" />
            <Skeleton className="h-12 w-12 rounded-md" />
          </div>
        </div>
        {/* Filter/search bar */}
        <div className="bg-card shadow-md border border-border rounded-lg">
          <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-12 w-full sm:max-w-md rounded-md" />
            <div className="flex gap-2 w-full sm:w-auto">
              <Skeleton className="h-12 w-40 rounded-md" />
              <Skeleton className="h-12 w-12 rounded-md" />
            </div>
          </div>
        </div>
        {/* Summary counts */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Archive cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}