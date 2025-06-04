import Link from 'next/link';
import { Archive, Search, TrendingUp } from 'lucide-react';

export default function QuickActions() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <Link href="/archives" className="block">
          <Archive className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Browse Archives</h3>
          <p className="text-sm text-muted-foreground">Explore organised collections of digital assets</p>
        </Link>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <Link href="/search" className="block">
          <Search className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Advanced Search</h3>
          <p className="text-sm text-muted-foreground">Find specific assets with powerful search filters</p>
        </Link>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="block">
          <TrendingUp className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">View the latest additions and modifications</p>
        </div>
      </div>
    </section>
  );
}