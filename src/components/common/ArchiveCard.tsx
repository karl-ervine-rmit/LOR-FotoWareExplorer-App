'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FotoWareArchive } from "@/types";

interface ArchiveCardProps {
  archive: FotoWareArchive;
}

export default function ArchiveCard({ archive }: ArchiveCardProps) {
  return (
    <Link
      href={`/archives/${archive.href.split('/').pop()}`}
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">{archive.name}</h3>
          {archive.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">{archive.description}</p>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {archive.assetCount?.toLocaleString() || 0} assets
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-blue-600">
          <span className="text-sm font-medium">View archive</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}