# FotoWare Front-End MVP Plan (Next.js)

## Table of Contents

1. [Overview](#overview)
2. [Core Goals](#core-goals)
3. [Tech Stack](#tech-stack)
4. [Architecture & Project Structure](#architecture--project-structure)
    - [Frontend Framework](#frontend-framework)
    - [Rendering Strategy](#rendering-strategy)
    - [State Management](#state-management)
    - [Authentication](#authentication)
    - [Breadcrumb Component](#breadcrumb-component)
    - [Analytics Event Plan](#analytics-event-plan)
5. [Embed System (MVP)](#embed-system-mvp)
6. [Search Implementation Strategy](#search-implementation-strategy)
7. [Internationalisation Strategy](#internationalisation-strategy)
8. [Accessibility & Neurodivergent Design](#accessibility--neurodivergent-design)
9. [Folder Structure](#folder-structure)
10. [Caching & Performance Strategy](#caching--performance-strategy)
11. [Vercel Deployment Setup](#vercel-deployment-setup)
12. [Testing Strategy (MVP)](#testing-strategy-mvp)
13. [Phase Breakdown](#phase-breakdown)
14. [Appendix](#appendix)
    - [Component Examples](#component-examples)
    - [API Routes & Config](#api-routes--config)
    - [Accessibility Components](#accessibility-components)

---

## Overview

A focused MVP front-end for browsing and searching digital assets via the FotoWare API. Built with **Next.js 15.3** and **React 19.1**, it provides:
- Secure connection to FotoWare API (authentication via API token)
- Image galleries, embedded media, and PDF previews
- Simple, high-performance search and filtering
- Core accessibility and cultural safety design considerations
- Basic analytics to track user interactions

---

## Core Goals

- Connect to FotoWare API to list archives, albums, and assets.
- Enable browsing asset thumbnails and viewing details (image, video, PDF, pedestal 3D).
- Provide a search bar with basic filtering.
- Deliver accessible UI with keyboard navigation and screen-reader support.
- Capture minimal analytics events.
- Deploy on Vercel with SSG + ISR for performance.

---

## Tech Stack

| Layer            | Tool / Library                                     |
|------------------|-----------------------------------------------------|
| Framework        | Next.js 15.3 (App Router)                           |
| UI Library       | React 19.1                                           |
| Styling          | Tailwind CSS v4 + shadcn/ui                         |
| State Management | Zustand v4                                           |
| Data Fetching    | React Query v5                                       |
| Embeds & Media   | `next/image`, `<iframe>`, `<model-viewer>` for 3D   |
| Accessibility    | shadcn/ui components (Radix UI primitives)          |
| Animations       | Framer Motion v11 (minimal)                         |
| Testing (MVP)    | Jest (unit)                                         |
| Deployment       | Vercel (free tier)                                  |
| CI/CD            | Vercel auto-build on `main`                         |

---

## Architecture & Project Structure

### Frontend Framework

- **Next.js 15.3** with App Router.
  - Supports server components, SSG, ISR.
  - Built-in bundler (SWC/Wasm; no custom Webpack unless strictly needed).

- **React 19.1** used for client-side components.

- **TypeScript** for static typing across components, hooks, and API handlers.

### Rendering Strategy

1. **SSG** (default):
   - Public pages (e.g., album lists, asset pages) built at build time.
   - Revalidate every hour (`revalidate: 3600` seconds) / possibly less.
   - On-demand revalidation via webhook for content changes / forced update scenario.

2. **Client-Side Fetching**:
   - Use React Query for dynamic data (e.g., search results) after initial load.
   - Skeleton loaders for perceived performance.

3. **SSR** only if strictly necessary (e.g., special real-time pages). MVP does not require custom SSR.

### State Management

- **Zustand v4** single store for:
  - UI state (e.g., theme, filters).
  - Search query string.
  - Client-side caching of light user preferences.

- Persist minimal state (e.g., theme) via `zustand/persist`.

### Authentication

- For MVP, use a simple **API token** (stored in environment variable) to connect to FotoWare API.
- No user login or wishlist in MVP—users browse anonymously.
- Phase 2 may add OAuth2 login and personalisation.

### Breadcrumb Component

- Provide users context of navigation (e.g., "Home / Archive / Asset").
- Implement a reusable `<Breadcrumbs />` component in `components/common/Breadcrumbs.tsx`.
- Generate crumbs from Next.js App Router params.

### Analytics Event Plan

For the MVP, we'll leverage Google Analytics 4 (GA4) to capture minimal usage data rather than building a custom backend endpoint. This keeps setup simple and uses Google's existing analytics infrastructure.

---

#### 1. Set up GA4

1. **Create a GA4 Property**
   - In your Google Analytics console, create a new GA4 property.
   - Under "Data Streams," add a Web data stream for your MVP's production URL (e.g., `https://your-app.vercel.app`) and note the Measurement ID (format: `G-XXXXXXXXXX`).

2. **Add the GA4 Snippet to Next.js**
   - Install `next/script` (if not already available):
     ```bash
     npm install next
     ```
   - In your top-level layout file (`app/layout.tsx`), inject the GA4 snippet. For example:
     ```tsx
     // app/layout.tsx
     import { ReactNode } from 'react'
     import Script from 'next/script'

     const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

     export default function RootLayout({ children }: { children: ReactNode }) {
       return (
         <html lang="en">
           <head>
             {GA_MEASUREMENT_ID && (
               <>
                 {/* Global Site Tag (gtag.js) - Google Analytics */}
                 <Script
                   src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                   strategy="afterInteractive"
                 />
                 <Script id="gtag-init" strategy="afterInteractive">
                   {`
                     window.dataLayer = window.dataLayer || [];
                     function gtag(){dataLayer.push(arguments);}
                     gtag('js', new Date());
                     gtag('config', '${GA_MEASUREMENT_ID}', {
                       page_path: window.location.pathname,
                     });
                   `}
                 </Script>
               </>
             )}
           </head>
           <body>{children}</body>
         </html>
       )
     }
     ```
   - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` to your `.env.local` (and configure the same in Vercel's Environment Variables).

---

#### 2. Track Custom Events

Instead of a custom `useAnalytics` hook, call `gtag('event', …)` directly when a relevant user action occurs. Below is a small helper you can drop into `lib/analytics.ts`:

```ts
// lib/analytics.ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!

interface GtagEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export function trackEvent({ action, category, label, value }: GtagEvent) {
  if (!window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
```

---

## Embed System (MVP)

Support a limited set of embed types to reduce complexity and testing overhead. For MVP, support:

- **images** (JPEG, PNG, WebP) via `next/image`
- **video** (MP4) via HTML5 `<video>` or `<iframe>` for external video
- **PDF** via `<iframe>`
- **iframe** (generic embed, e.g., YouTube/Vimeo/Pedestal)
- **3D** via `<model-viewer>`

Defer other embed types (audio, office documents, code snippets, maps) to Phase 2.

The core component lives in `components/common/UniversalEmbed.tsx`.

---

## Search Implementation Strategy

1. **MVP**:
   - Use a **single Fuse.js index** on the server (run at build time or via API route).
   - Serve search results via Next.js API route `/api/search?query=…`.
   - Client calls `/api/search`. React Query caches results.

2. **Phase 2** (After validating basic search):
   - Implement **web worker** for client-side Fuse.js to prevent blocking.
   - Shard indexes by date ranges or media type.
   - Incremental indexing and caching.

Search filter UI:
- Simple text input + optional dropdown / drawer / facet for file type (Image / Video / PDF).
- Filters applied client-side on results.

---

## Internationalisation Strategy

- **MVP**: English only.
- **Phase 2**: Add i18n via Next.js built-in i18n routing.
  - Example second language: **Vietnamese**.
  - Folder structure:
    ```
    /app
      /[locale]
        /archive
        /asset
    ```
  - Use `next-intl` or Next.js native support.

---

## Accessibility Design

1. **WCAG 2.1 AA Compliance**:
   - Ensure all interactive elements have keyboard focus, ARIA labels.
   - Contrast ratios ≥ 4.5:1 for normal text.

2. **Semantic HTML & ARIA**:
   - Use proper landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`).
   - Label forms and input fields.

3. **Keyboard Navigation**:
   - Skip links at the top to jump to main content.
   - Focus indicators for buttons and links.
   - Logical tab order.

4. **Motion & Animation**:
   - Respect `prefers-reduced-motion`.
   - Use Framer Motion sparingly; wrap animations in conditional checks.

   ```tsx
   // Example: Respect reduced motion
   import { useReducedMotion } from 'framer-motion';
   const shouldReduce = useReducedMotion();

   <motion.div
     initial={shouldReduce ? {} : { opacity: 0 }}
     animate={shouldReduce ? {} : { opacity: 1 }}
     transition={shouldReduce ? {} : { duration: 0.3 }}
   />
   ```

5. **Neurodivergent Considerations**:
   - Adjustable **font size** (80%–200%) via slider in UI.
   - **Dyslexia-friendly** font option in Phase 2.
   - Clear visual hierarchy and minimal distractions.

6. **Accessibility Testing**:
   - Automated: `jest-axe` in unit tests - TBC.
   - Manual: NVDA, VoiceOver, keyboard-only navigation.
   - Continuous audits.

---

## Folder Structure

```
/app
  layout.tsx
  page.tsx                     # Homepage (list of archives)
/app/archives
  page.tsx                     # List all archives
  /[archiveId]
    page.tsx                   # Album contents (thumbnails + filters)
    /[assetId]
      page.tsx                 # Asset details (embed + metadata)
  /components
    /common
      Breadcrumbs.tsx
      UniversalEmbed.tsx
      FilterPanel.tsx
      MetadataSidebar.tsx
      ErrorFallback.tsx
       …
  /hooks
    useAnalytics.ts
    useDebounce.ts
  /lib
    fotoware-client.ts         # API wrapper using fetch and token
    search.ts                  # Search logic (Fuse.js wrapper)
    utils.ts                   # Helper functions
  /styles
    globals.css
  /types
    index.d.ts                 # shared TS types (Asset, Archive, Metadata[])

/public
  /images                      # Static assets (logos, placeholders)
/scripts
  generate-search-index.ts     # Node script to build Fuse.js index at build time
```

---

## Caching & Performance Strategy

1. **Client-Side**:
   - **React Query**:
     - `staleTime`: 5 minutes, `cacheTime`: 10 minutes - TBC.
     - Background refetch on stale.
   - **Local Storage**: persist theme & user preferences.

2. **Server-Side**:
   - **SSG + ISR**: revalidate every hour - TBC.
   - **Next.js Image Optimisation**: automatic `next/image`.
   - **HTTP Headers**:
     ```
     Cache-Control: public, s-maxage=3600, stale-while-revalidate=300
     ```

3. **Bundle Optimisation**:
   - **Code Splitting**: dynamic imports for heavy components (e.g., 3D viewer).
   - **Tree Shaking**: enabled by default.
   - **Compression**: Brotli/Gzip via Vercel.

4. **Fonts**:
   - Use `next/font/google` for automatic font subset & preload.

5. **Monitoring**:
   - **Vercel Analytics** for Core Web Vitals.
   - **Sentry** integration for error tracking (Phase 2).

---

## Vercel Deployment Setup

### Free Tier Usage

- For an MVP with moderate traffic (< 100k visits/month, limited serverless invocations), the **free tier** is sufficient.
- **Limits**:
  - 100 GB bandwidth/month
  - 100 hours of serverless function execution
  - 1 GB serverless function memory

- For production, monitor usage. If you exceed free tier limits, consider upgrading to a paid plan.

### Configuration

1. **Link GitHub Repo** to Vercel.
2. Set environment variables in Vercel dashboard:
   ```
   FOTOWARE_API_TOKEN=your_token_here
   NEXT_PUBLIC_BASE_URL=https://your-production-url.vercel.app
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   REVALIDATE_SECRET=your_revalidate_secret
   ```
3. Build Command: `npm run generate-search-index && npm run build`
4. Output Directory: `.next`

### Preview Deployments

- Every PR triggers a preview build.
- Shareable URLs for QA.

### Production Deployments

- Merge into `main` triggers production build & deploy.
- **No additional GitHub Actions** pipeline needed; Vercel auto-builds on push.

---

## Testing Strategy (MVP)

1. **Unit Testing (MVP) - TBC**:
   - Use **Jest** + React Testing Library for core components:
     - Test `<Breadcrumbs>`, `<FilterPanel>`, `<UniversalEmbed>`, `<MetadataSidebar>`, and data-fetch hooks.
   - Include `jest-axe` for accessibility unit tests on key components (e.g., ensuring no critical a11y violations).

2. **End-to-End / Visual Regression  - TBC**:
   - Deferred to Phase 2.
   - Later adopt **Cypress** for E2E and **Chromatic** for visual testing.

3. **Linting & Type Checking**:
   - ESLint with Next.js recommended rules.
   - Prettier for formatting.
   - `npm run lint` and `npm run type-check` in CI via Vercel.

---

## Phase Breakdown

### Phase 1: MVP (Weeks 1–6)

- **Setup**:
  - Initialise Next.js 15.3 + Tailwind CSS.
  - Configure environment variables, TypeScript, linting.
  - Run `npm install` and smoke test to confirm compatibility of dependencies.
- **Core UI & Layout**:
  - Implement global layout, header, footer, and `<Breadcrumbs>`.
  - Basic theme toggle (light/dark).
- **API Integration**:
  - Build `fotoware-client.ts` with token-based requests.
  - Fetch archives and assets.
- **Embed System**:
  - Build `<UniversalEmbed>` supporting image, video, PDF, iframe, 3D.
- **Search**:
  - Create Fuse.js index at build time (script `generate-search-index.ts`).
  - API route `/api/search` returns filtered results.
  - UI: search bar + simple filters.
- **Asset Pages**:
  - Asset thumbnails grid; clicking opens asset detail with embed + metadata.
- **Accessibility**:
  - Skip link, ARIA labels, focus states, `prefers-reduced-motion`.
- **Analytics**:
  - Integrate Google Analytics 4 (GA4) by adding the GA script snippet in `app/layout.tsx`.
  - Create a simple `trackEvent` helper (e.g. in `lib/analytics.ts`) that calls `window.gtag('event', …)`.
  - Use `trackEvent({ action: 'search_performed', category: 'search', label: query })` when a search is submitted.
  - Use `trackEvent({ action: 'asset_viewed', category: 'assets', label: assetId })` on the asset details page.
  - Add an opt-out toggle UI (e.g., `components/common/AnalyticsOptOut.tsx`) that sets `localStorage.disableAnalytics`.
- **Deployment**:
  - Deploy to Vercel, verify SSG & ISR, test in production preview.
- **Testing**:
  - Write Jest tests for core components, include `jest-axe` a11y checks - TBC.

### Phase 2: Post-MVP (Weeks 7–12)

- **Authentication & Personalisation**:
  - Add OAuth2 login via FotoWare (PKCE flow) - TBC if required.
  - Implement wishlist and recently viewed persistence.
- **Internationalisation**:
  - Add Vietnamese locale - TBC.
  - Migrate content to `/[locale]/…` folder structure.
- **Enhanced Search**:
  - Move search to client-side Web Worker with sharded Fuse.js.
  - Add advanced filters (date ranges, file type facets).
- **Additional Embed Types**:
  - Audio, office docs (Google Docs viewer), maps, code snippets - TBC.
- **E2E & Visual Tests**:
  - Integrate Cypress for user flows - TBC.
  - Add Chromatic for visual regression in Storybook - TBC.
- **Analytics Expansion**:
  - Capture additional events (filter_applied, login_success, asset_shared).
  - Dashboard for analytics data.
- **Performance & Monitoring**:
  - Sentry integration - TBC.
  - Lighthouse CI in CI pipeline - TBC.
- **Continuous Optimisation**:
  - Image lazy loading improvements.
  - Preload critical assets.
  - Bundle analysis and budget enforcement.

---

## Appendix

### Appendix Table of Contents

- [Component Examples](#component-examples)
  - [1. Breadcrumbs](#1-breadcrumbs)
  - [2. UniversalEmbed](#2-universalembed)
  - [3. FilterPanel](#3-filterpanel)
  - [4. MetadataSidebar](#4-metadatasidebar)
  - [5. ErrorFallback](#5-errorfallback)
- [API Routes & Config](#api-routes--config)
  - [1. Search API Route](#1-search-api-route)
  - [2. Analytics API Route](#2-analytics-api-route)
  - [3. ISR Revalidation Webhook](#3-isr-revalidation-webhook)
- [Accessibility Components](#accessibility-components)
  - [1. Skip Link](#1-skip-link)

---

## Component Examples

### 1. Breadcrumbs

```tsx
// components/common/Breadcrumbs.tsx
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
```

### 2. UniversalEmbed

```tsx
// components/common/UniversalEmbed.tsx
import Image from 'next/image';
import { cn } from '@/lib/utils';

type EmbedType = 'image' | 'video' | 'iframe' | 'pdf' | 'model3d';

interface UniversalEmbedProps {
  type: EmbedType;
  src: string;
  title: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  allowFullScreen?: boolean;
}

export function UniversalEmbed({
  type,
  src,
  title,
  className,
  width = '100%',
  height = '500px',
  allowFullScreen = true,
}: UniversalEmbedProps) {
  const baseClass = 'rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800';

  const renderEmbed = () => {
    switch (type) {
      case 'image':
        return (
          <div className={cn('relative', baseClass, className)}>
            <Image
              src={src}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            />
          </div>
        );
      case 'video':
        return (
          <video
            controls
            src={src}
            className={cn('w-full', baseClass, className)}
            style={{ width, height }}
          >
            Your browser does not support the video tag.
          </video>
        );
      case 'iframe':
        return (
          <iframe
            src={src}
            title={title}
            className={cn('w-full h-full', baseClass, className)}
            style={{ width, height }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={allowFullScreen}
          />
        );
      case 'pdf':
        return (
          <iframe
            src={src}
            title={title}
            className={cn('w-full h-full', baseClass, className)}
            style={{ width, height }}
          />
        );
      case 'model3d':
        return (
          <div className={cn('w-full h-full', baseClass, className)}>
            <model-viewer
              src={src}
              alt={title}
              auto-rotate
              camera-controls
              shadow-intensity="1"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        );
      default:
        return (
          <div className={baseClass}>
            <a href={src} target="_blank" rel="noopener noreferrer">
              View {title} (opens in new tab)
            </a>
          </div>
        );
    }
  };

  return (
    <div className={cn('not-prose', className)}>
      {renderEmbed()}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  );
}
```

### 3. FilterPanel

```tsx
// components/common/FilterPanel.tsx
'use client';

import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function FilterPanel({ options, selected, onChange }: FilterPanelProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selected);

  const toggleOption = (value: string) => {
    if (localSelected.includes(value)) {
      setLocalSelected(localSelected.filter((v) => v !== value));
    } else {
      setLocalSelected([...localSelected, value]);
    }
  };

  const applyFilters = () => {
    onChange(localSelected);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-sm font-medium">Filters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={localSelected.includes(opt.value)}
              onChange={() => toggleOption(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      <button
        onClick={applyFilters}
        className="px-3 py-1 bg-primary text-white rounded hover:opacity-90"
      >
        Apply
      </button>
    </div>
  );
}
```

### 4. MetadataSidebar

```tsx
// components/common/MetadataSidebar.tsx
'use client';

interface MetadataSidebarProps {
  metadata: Record<string, string>;
  groups?: string[];
}

export function MetadataSidebar({ metadata, groups }: MetadataSidebarProps) {
  return (
    <aside className="w-full md:w-64 p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-medium">Metadata</h3>
      <dl className="space-y-2">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <dt className="font-semibold">{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
```

### 5. ErrorFallback

```tsx
// components/common/ErrorFallback.tsx
'use client';

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div role="alert" className="p-4 border rounded-lg bg-red-50 text-red-900">
      <p className="font-bold">Something went wrong:</p>
      <pre className="mt-2 text-sm">{error.message}</pre>
      <button
        onClick={reset}
        className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
```

---

## API Routes & Config

### 1. Search API Route

```ts
// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Fuse from 'fuse.js';
import indexData from '../../public/search-index.json';
import type { Asset } from '@/types';

const fuse = Fuse.parse(indexData as Fuse.FuseIndex<Asset>);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query = '' } = req.query;
  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query' });
  }
  const results = fuse.search(query).map((r) => r.item);
  res.status(200).json({ results });
}
```

### 2. Analytics API Route (Optional)

> **Note**: If relying solely on GA4 client events, you can remove this route. Otherwise, keep for file-based logging.

```ts
// pages/api/analytics.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { appendFileSync } from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const event = req.body;
    const filePath = path.join(process.cwd(), 'analytics.log');
    appendFileSync(filePath, JSON.stringify(event) + '\n');
    return res.status(200).json({ success: true });
  }
  res.setHeader('Allow', 'POST');
  res.status(405).end('Method Not Allowed');
}
```

### 3. ISR Revalidation Webhook

```ts
// pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { secret, path } = req.body;
    if (secret !== process.env.REVALIDATE_SECRET) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    try {
      await res.revalidate(path);
      return res.json({ revalidated: true });
    } catch (err) {
      return res.status(500).send('Error revalidating');
    }
  }
  res.setHeader('Allow', 'POST');
  res.status(405).end('Method Not Allowed');
}
```

---

## Accessibility Components

### 1. Skip Link

```tsx
// components/accessibility/SkipLink.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SkipLink() {
  const pathname = usePathname();

  // Refocus skip link after navigation
  useEffect(() => {
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          (document.getElementById('main-content') as HTMLElement)?.focus();
        }
      });
    }
  }, [pathname]);

  return (
    <a
      href="#main-content"
      id="skip-link"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded"
    >
      Skip to main content
    </a>
  );
}
```

---

### Sample Search Index Generation Script

```ts
// scripts/generate-search-index.ts
import fs from 'fs';
import path from 'path';
import { Fuse } from 'fuse.js';
import type { Asset } from '@/types';

async function loadAssets(): Promise<Asset[]> {
  const data = fs.readFileSync(path.join(process.cwd(), 'data/assets.json'), 'utf-8');
  return JSON.parse(data) as Asset[];
}

async function buildIndex() {
  const assets = await loadAssets();
  const fuse = new Fuse(assets, {
    keys: ['filename', 'metadata.title', 'metadata.description'],
    threshold: 0.3,
  });
  const indexJson = JSON.stringify(fuse.toJSON());
  fs.writeFileSync(path.join(process.cwd(), 'public/search-index.json'), indexJson);
  console.log('Search index generated.');
}

buildIndex().catch(console.error);
```

---

## Low-Res Blur Preview Automation

A script (`npm run generate-blur-previews`) automatically generates 16x16px low-res versions of all images in `public/images/` and saves them to `public/images/blur/`. These are used for culturally sensitive asset previews (`blurPreviewUrl`). The script runs before every build.

---
