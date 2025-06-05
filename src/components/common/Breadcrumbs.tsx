'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
import React from 'react';

const ITEMS_TO_DISPLAY = 2;

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment.replace(/-/g, ' ');
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
                          {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
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
                          {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
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
                    {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>
                  {crumb.label.charAt(0).toUpperCase() + crumb.label.slice(1)}
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