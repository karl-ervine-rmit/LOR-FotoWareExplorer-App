# FotoWare Front-End MVP: Build & Deployment Notes

---

## 🚦 Quick Reference (Read This First!)

- [Environment Variables](#environment-variables)
- [Build Process (Local)](#build-process-local)
- [Build Process (Vercel)](#build-process-vercel)
- [Client vs Server Components](#recent-build--deployment-fixes-june-2024)
- [TypeScript & Linting](#recent-build--deployment-fixes-june-2024)
- [Troubleshooting](#troubleshooting)
- [Accessibility & Australian English](#accessibility--australian-english)
- [SEO & Canonical URLs](#seo-metadata--canonical-urls)

---

## ⚠️ Special Notes for Cursor & Windsurf Developers

- **Never mark a Client Component as `async`.**
- **Do all data fetching in Server Components, then pass results as props to Client Components.**
- **Do not use `any` types—always use specific interfaces.**
- **Remove or prefix unused variables with `_` to avoid lint errors.**
- **Always use `.tsx` for files containing JSX.**
- **Ensure `tsconfig.json` has `"jsx": "react-jsx"`.**
- **Keep `@types/react` up to date and compatible with your React version.**
- **All user-facing content must use Australian spelling.**
- **Accessibility is not optional—follow all ARIA and keyboard navigation guidelines.**

---

## Build & Deployment Overview

This project uses Next.js 15.3 with the App Router, React 19.1, Tailwind CSS v4, shadcn/ui, Zustand, React Query, and more. It is designed for static site generation (SSG) with Incremental Static Regeneration (ISR) for public pages, and client-side fetching for dynamic data (e.g., search).

---

## Environment Variables

Create a `.env.local` file in the project root with:

```
FOTOWARE_API_URL=https://your-fotoware-instance.example.com
FOTOWARE_API_TOKEN=your_api_token_here
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_BASE_URL=https://your-site.example.com
```

- If the API token is missing, the app will show empty data for development.
- Set these variables in Vercel dashboard for production.

---

## Build Process (Local)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Generate the search index (if using search):**
   ```bash
   npm run generate-search-index
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```
5. **Start the production server:**
   ```bash
   npm start
   ```

---

## Build Process (Vercel)

- Vercel will automatically run the following build command:
  ```bash
  npm run generate-search-index && npm run build
  ```
- Output directory: `.next`
- Set environment variables in the Vercel dashboard.
- ISR is enabled by default for all pages with `export const revalidate = 3600;` (revalidates every hour).

---

## Static Generation & ISR

- Pages like the home page, archives, albums, and asset details are statically generated at build time.
- Pages are revalidated every hour (or as configured in the `revalidate` export).
- On-demand revalidation can be triggered via webhook (see `/api/revalidate`).

---

## Client-Side Fetching

- Use React Query only in client components (e.g., search bar, filter panel).
- Do not use React Query in server components or at the top level of page files.

---

## Accessibility & Australian English

- All user-facing content uses Australian spelling.
- Accessibility is a core requirement: keyboard navigation, ARIA labels, skip links, and adjustable font sizes are supported.

### Accessibility & Theme System

- **Theme Detection & Override**
  - On first visit, the site uses the user's system colour theme (light/dark).
  - If the user selects a theme, their choice is saved in localStorage and overrides the system setting on future visits.
  - The theme is applied via the `<html>` element's class and `data-theme` attribute for full Tailwind and CSS variable support.

- **Accessibility Toolbar**
  - Users can adjust text size, enable high contrast mode, reduce motion, and switch to a dyslexic-friendly font.
  - All settings are saved in localStorage and persist across page navigation and reloads.
  - High contrast mode, reduced motion, and dyslexic font are applied globally via data attributes on `<html>`.

- **Popup Accessibility**
  - The accessibility popup is a true dialog (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
  - Focus is trapped within the popup when open, and Escape closes it.
  - The close button is always accessible by keyboard and screen reader.
  - State changes (e.g., toggling high contrast) are announced via an ARIA live region.

- **High Contrast & Visual Styles**
  - High contrast mode uses black, white, and yellow for maximum readability.
  - All shadcn/ui components have custom high contrast styles using `data-slot` selectors.

- **Persistence**
  - All user settings persist via localStorage and React context, so preferences carry across all pages and reloads.

### Layout Consistency & Accessibility Controls

- The Navbar (navigation) and AccessibilityToolbar (accessibility controls) **must always be included in the global layout** (e.g., `src/app/layout.tsx`).
- Do **not** add these components to individual pages. This ensures all pages have consistent navigation and accessibility features.
- The Skip Link should also be included in the layout for accessibility.

---

This approach ensures the site is accessible, user-friendly, and meets Australian accessibility standards. For further details, see the relevant code in `ThemeProvider.tsx`, `AccessibilityToolbar.tsx`, and `globals.css`.

---

## Skeleton Loading & Loading States

- For every new page or component that fetches data, create a `loading.tsx` file (or a loading skeleton component) in the same directory.
- Use the reusable `<Skeleton />` component from `src/components/ui/skeleton.tsx` to provide a consistent loading experience.
- This ensures users see a smooth, accessible loading state while data is being fetched or during navigation.
- See the `archives`, `archives/[archiveId]`, and `archives/[archiveId]/[assetId]` directories for examples.

---

## Troubleshooting

- If you see errors about missing environment variables, check your `.env.local` or Vercel dashboard.
- If you see errors about React Query hooks, ensure they are only used in client components.

---

## References
- Next.js SSG/ISR: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
- Vercel Environment Variables: https://vercel.com/docs/projects/environment-variables
- Australian English: https://www.macquariedictionary.com.au/

## shadcn/ui Component Import Path

When using shadcn/ui components, always import from the correct path:

- For example, the breadcrumb component should be imported from:
  ```ts
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from '@/components/ui/breadcrumb'
  ```

- Do not import from 'lucide-react' unless you are using Lucide icons directly.

This ensures all shadcn/ui components are used consistently and avoids module not found errors.

---

## Future Enhancements & Improvements

- **Dynamic Open Graph Images:**
  - Review the option to generate dynamic Open Graph images for assets and collections at build time or on-demand. This can improve social sharing and engagement but is currently on hold due to budget and complexity. Revisit after MVP launch.
  - TODO: Add implementation reminder in relevant SEO/meta components.

- **Dynamic Metadata with generateMetadata:**
  - For pages where the title, description, or image depend on fetched data (e.g., asset or archive details), consider using Next.js's `export async function generateMetadata(params)` to generate metadata at runtime. This allows for fully dynamic SEO based on API or database content, and is recommended for highly dynamic or user-generated content.
  - TODO: Add implementation reminder in archive and asset page components.

- **404 Page Enhancements:**
  - Update the 404 page template to include a visually engaging animation and links to useful resources (e.g., help, search, or popular archives) to improve user experience and navigation when a page is not found.
  - TODO: Add implementation reminder in `src/app/not-found.tsx`.

- **Error Page SEO:**
  - Error pages (e.g., 404, 500) should include minimal SEO metadata to provide a clear title and description for users and crawlers.
  - Example: title "Page Not Found | FotoWare Explorer", description "Sorry, the page you are looking for could not be found."
  - This helps ensure a consistent user experience and prevents search engines from indexing error content as valid pages.
  - TODO: Add implementation reminder in `src/app/not-found.tsx` and `src/app/error.tsx`.

- **3D and Map Embed Support:**
  - Support for 3D models (e.g., <model-viewer>) and interactive map embeds will be added in a future release.
  - See the TODO in `src/components/common/UniversalEmbed.tsx` for implementation notes.

> TODO comments have been added to the relevant components as reminders for these enhancements.

---

## Structured Data & Schema.org Usage

- **Schema.org Markup:**
  - The site uses Schema.org structured data to improve search engine understanding and discoverability of educational resources.
  - **Where:**
    - On individual asset pages (`archives/[archiveId]/[assetId]`), we use the `LearningResource` type to describe each learning object.
    - On archive/collection pages (`archives/[archiveId]`), we use the `CollectionPage` type, listing representative learning objects with `hasPart`.
  - **Why:**
    - This helps search engines (including Google) better index and present our educational content, potentially enabling rich results and improving visibility for relevant queries.
    - It also supports accessibility and discoverability for educators and learners searching for Australian educational resources.

## SEO Metadata & Canonical URLs

- **Centralised SEO Config:**
  - All SEO metadata (title, description, Open Graph, Twitter, canonical URLs) is managed via a central config in `src/lib/seo.ts`.
  - The site URL is set using the `NEXT_PUBLIC_BASE_URL` environment variable in `.env.local` and Vercel dashboard. This ensures all canonical and share URLs are correct for each environment.
  - The config exports `SITE_URL` and `SEO_DEFAULTS` (site name, description, default image, etc.), which are imported into each page's `metadata` export.
  - This approach means you only need to update your site URL or branding in one place, and all pages will use the correct values at build time.
  - When adding new pages or layouts, import from `@/lib/seo` and follow the same pattern for consistent, maintainable SEO.

---

## Recent Build & Deployment Fixes (June 2024)

### Why These Changes Were Needed

- **Next.js Client/Server Component Rules:**
  - Next.js requires that only Server Components (no `'use client'` at the top) can be `async`. Client Components must be synchronous. Some components were incorrectly marked as `async` Client Components, causing build errors.
- **TypeScript Strictness:**
  - The codebase uses strict TypeScript settings, which disallow `any` types and unused variables. Lint errors were triggered by explicit `any` usage and unused parameters.
- **React/JSX Type Errors:**
  - Errors like `JSX element implicitly has type 'any'` and missing React hooks were caused by incorrect TypeScript config, missing types, or improper imports.

### What Was Fixed

- **Client Component Async Functions:**
  - All Client Components (those with `'use client'`) were refactored to be synchronous. Any data fetching or async logic was moved to Server Components or handled before passing props to Client Components.
- **TypeScript Linting:**
  - Replaced all explicit `any` types with more specific types or interfaces.
  - Removed or renamed unused variables (e.g., `_searchParams`) to avoid lint errors.
- **React/JSX Imports:**
  - Ensured all React hooks (`useState`, `useEffect`, etc.) are imported correctly.
  - Checked that all files using JSX have the `.tsx` extension and that `tsconfig.json` includes `"jsx": "react-jsx"`.
  - Verified that `@types/react` is installed and matches the React version.

### If You Need to Make Similar Changes in the Future

- **Client vs Server Components:**
  - Only Server Components can be `async`. If you need to fetch data, do it in a Server Component and pass the result as props to a Client Component.
  - Never mark a Client Component as `async`.
- **TypeScript Best Practices:**
  - Avoid using `any`. Always define and use specific types or interfaces.
  - Remove or prefix unused variables with `_` to avoid lint errors.
- **React/JSX Setup:**
  - Always use `.tsx` for files containing JSX.
  - Ensure your `tsconfig.json` has `"jsx": "react-jsx"`.
  - Keep `@types/react` up to date and compatible with your React version.

### What These Fixes Achieved

- **Successful Build & Deployment:**
  - The app now builds and deploys cleanly on both local and Vercel environments.
- **Cleaner, More Maintainable Code:**
  - TypeScript and linting errors are resolved, making the codebase easier to maintain and extend.
- **Future-Proofing:**
  - Following these patterns will help avoid similar issues as Next.js and TypeScript evolve.

---

## 📝 Outstanding TODOs & Implementation Reminders

- **API Client Logic:** Implement the FotoWare API client in `src/lib/fotoware-client.ts`.
- **Error Fallback UI:** Complete the error fallback UI in `src/components/common/ErrorFallback.tsx`.
- **Debounce Hook:** Implement debounce logic in `src/hooks/useDebounce.ts`.
- **Type Definitions:** Define all shared types for archives, albums, assets, and API responses in `src/types/index.d.ts`. Avoid using `any`.
- **UniversalEmbed:** Only MVP embed types are supported; defer others to Phase 2 as per the MVP plan.
- **Error & Not-Found Pages:** Add animation and helpful resources to `src/app/error.tsx` and `src/app/not-found.tsx`. Ensure minimal SEO metadata is always present.
- **Testing:** Add unit and accessibility tests for new components as planned in the MVP.
- **Analytics:** If using only GA4, you may remove the analytics API route.
- **Accessibility & SEO:** For all new features, ensure accessibility, SEO, and Australian English compliance.
- **Global Layout:** Do not add Navbar or AccessibilityToolbar to individual pages—only include them in the global layout.
- **Check for TODOs:** Review code comments marked `TODO` for further reminders and outstanding work.

---