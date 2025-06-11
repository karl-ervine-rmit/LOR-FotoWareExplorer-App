'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const ITEMS_TO_DISPLAY = 2;

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const [archiveName, setArchiveName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset states when pathname changes
  useEffect(() => {
    setArchiveName(null);
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    const archiveIndex = segments.findIndex(segment => segment === 'archives');
    const archiveId = archiveIndex !== -1 ? segments[archiveIndex + 1] : null;

    const fetchArchiveName = async () => {
      if (!archiveId || isLoading || archiveName) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/archives/${archiveId}`);
        if (response.ok) {
          const archive = await response.json();
          setArchiveName(archive.name);
        }
      } catch (error) {
        console.error('Error fetching archive:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchiveName();
  }, [pathname, segments, isLoading, archiveName]);

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    let label = segment.replace(/-/g, ' ');

    // Replace archive ID with archive name if available, or show loading state
    if (segment === segments[segments.findIndex(s => s === 'archives') + 1]) {
      if (isLoading) {
        return { label: <Skeleton className="h-4 w-24" />, href };
      }
      if (archiveName) {
        label = archiveName;
      }
    }

    return { label, href };
  });

  const [open, setOpen] = useState(false);
  const isLong = crumbs.length > ITEMS_TO_DISPLAY;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {isLong && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <div className="block md:hidden">
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="size-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>Select a page to navigate to.</DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {crumbs.slice(0, -ITEMS_TO_DISPLAY + 1).map((crumb, index) => (
                        <Link
                          key={index}
                          href={crumb.href}
                          className="py-1 text-sm"
                          onClick={() => setOpen(false)}
                        >
                          {typeof crumb.label === 'string'
                            ? crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)
                            : crumb.label}
                        </Link>
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1" aria-label="Toggle menu">
                    <BreadcrumbEllipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {crumbs.slice(0, -ITEMS_TO_DISPLAY + 1).map((crumb, index) => (
                      <DropdownMenuItem key={index} asChild>
                        <Link href={crumb.href}>
                          {typeof crumb.label === 'string'
                            ? crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)
                            : crumb.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </BreadcrumbItem>
          </>
        )}
        {crumbs.slice(isLong ? -ITEMS_TO_DISPLAY + 1 : 0).map((crumb, index, arr) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index < arr.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>
                    {typeof crumb.label === 'string'
                      ? crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)
                      : crumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>
                  {typeof crumb.label === 'string'
                    ? crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)
                    : crumb.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;