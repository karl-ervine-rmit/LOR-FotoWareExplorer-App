import { Skeleton } from "@/components/ui/skeleton";

export default function ArchiveDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2 mb-4" /> {/* Heading */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      </div>
    </main>
  );
}