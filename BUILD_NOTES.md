# FotoWare Front-End MVP: Build & Deployment Notes

## Build & Deployment Overview

This project uses Next.js 15.3 with the App Router, React 19.1, Tailwind CSS v4, shadcn/ui, Zustand, React Query, and more. It is designed for static site generation (SSG) with Incremental Static Regeneration (ISR) for public pages, and client-side fetching for dynamic data (e.g., search).

---

## Environment Variables

Create a `.env.local` file in the project root with:

```
FOTOWARE_API_URL=https://your-fotoware-instance.example.com
FOTOWARE_API_TOKEN=your_api_token_here
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
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