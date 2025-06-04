'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs: Crumb[] = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment.replace(/-/g, ' ');
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex space-x-2 text-sm text-gray-600">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            {i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
              </Link>
            ) : (
              <span aria-current="page">
                {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;