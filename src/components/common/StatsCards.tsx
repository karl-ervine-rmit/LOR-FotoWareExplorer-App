import { Archive, Image as ImageIcon, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  archivesCount: number;
  assetsCount: number;
  recentCount: number;
}

export default function StatsCards({ archivesCount, assetsCount, recentCount }: StatsCardsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="tracking-tight text-sm font-medium">Total Archives</div>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{archivesCount}</div>
          <p className="text-xs text-muted-foreground">Digital asset collections</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="tracking-tight text-sm font-medium">Total Assets</div>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{assetsCount}</div>
          <p className="text-xs text-muted-foreground">Images, videos, and documents</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="tracking-tight text-sm font-medium">Recent Assets</div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{recentCount}</div>
          <p className="text-xs text-muted-foreground">Recently added or updated</p>
        </div>
      </div>
    </section>
  );
}