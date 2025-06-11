'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AssetError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Asset detail page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <h2 className="text-lg font-semibold mb-2">Something went wrong!</h2>
        <p className="mb-4">We couldn't load the asset details. This might be due to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>The asset no longer exists</li>
          <li>You don't have permission to view this asset</li>
          <li>A temporary network issue</li>
        </ul>
        <Button
          onClick={reset}
          variant="outline"
          className="mt-2"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}