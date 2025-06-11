import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AssetNotFound() {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <h2 className="text-lg font-semibold mb-2">Asset Not Found</h2>
        <p className="mb-4">
          We couldn&apos;t find the asset you&apos;re looking for. It may have been moved or deleted.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/archives">
              Back to Archives
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}