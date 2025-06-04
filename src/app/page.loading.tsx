import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-12 w-2/3 mb-4" /> {/* Main heading */}
        <Skeleton className="h-8 w-1/2 mb-4" /> {/* Subtitle */}
        <Skeleton className="h-10 w-full max-w-2xl mb-4" /> {/* Search bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}