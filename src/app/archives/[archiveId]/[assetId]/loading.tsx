import { Skeleton } from "@/components/ui/skeleton";

export default function AssetDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2 mb-4" /> {/* Heading */}
        <Skeleton className="h-64 w-full rounded mb-4" /> {/* Asset preview */}
        <Skeleton className="h-6 w-1/4 mb-2" /> {/* Type */}
        <Skeleton className="h-6 w-1/4 mb-2" /> {/* ID */}
        <Skeleton className="h-6 w-1/4" /> {/* Archive */}
      </div>
    </main>
  );
}