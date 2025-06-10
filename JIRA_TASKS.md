## Sprint 1: Project Setup & Infrastructure
**Start:** 2025-06-10 • **Due:** 2025-06-17 • _labels: phase1, infra_

### Epic: Project Setup & CI/CD
**Start:** 2025-06-10 • **Due:** 2025-06-17 • _labels: phase1, infra, frontend_

#### Story: As a developer, I can scaffold and deploy the project
- **Task:** Initialize Git repo with Next.js 15.3 + Tailwind CSS starter
- **Task:** Configure Vercel preview builds on PRs and production on `main`
- **Task:** Add build command `npm run generate-search-index && npm run build` in Vercel settings
- **Task:** Define required environment variables in Vercel (`FOTOWARE_API_TOKEN`, etc.)
- **Task:** Define `/app`, `/components`, `/hooks`, `/lib`, `/styles`, `/types` layout in README
- **Task:** Document shadcn/ui import paths and naming conventions
- **Task:** Enforce ESLint/TypeScript rules: no `any`, prefix unused vars with `_`, use `.tsx` for JSX files
- **Task:** Write "Local Build" section in README
- **Task:** Write "Vercel Build" section in README
- **Task:** Add troubleshooting tips & developer guidelines

### Epic: Core Infrastructure Setup
**Start:** 2025-06-10 • **Due:** 2025-06-17 • _labels: phase1, infra_

#### Story: As a developer, I can set up the core infrastructure
- **Task:** Create environment variable validation in `lib/env.ts`
- **Task:** Set up search index generation script
- **Task:** Implement revalidation webhook for ISR
- **Task:** Configure error boundary and fallback UI
- **Task:** Set up health check endpoints
- **Task:** Create API client wrapper structure

## Sprint 2: Core UI & Navigation
**Start:** 2025-06-17 • **Due:** 2025-06-24 • _labels: phase1, frontend_

### Epic: Global UI & Theme Management
**Start:** 2025-06-17 • **Due:** 2025-06-24 • _labels: phase1, frontend_

#### Story: As a user, I can toggle light/dark themes
- **Task:** Build ThemeToggle component; persist to localStorage
- **Task:** Apply theme classes/data-attributes on `<html>`

#### Story: As a neurodivergent user, I can adjust UI settings
- **Task:** Create AccessibilityToolbar with font-size slider
- **Task:** Add high-contrast & reduced-motion toggles
- **Task:** Integrate dyslexia-friendly font option

### Epic: Core UI Components
**Start:** 2025-06-17 • **Due:** 2025-06-24 • _labels: phase1, frontend_

#### Story: As a user, I can navigate the application easily
- **Task:** Implement breadcrumb component
- **Task:** Create navigation header with search
- **Task:** Add footer with essential links
- **Task:** Implement responsive navigation

#### Story: As a user, I see a clear homepage
- **Task:** Implement `<Header>` and `<Footer>` with nav links
- **Task:** Build hero block with large + small featured cards
- **Task:** Add "Featured Archives" & "Recent Uploads" sections
- **Task:** Place SearchBar in header and hero
- **Task:** Ensure mobile/tablet/desktop breakpoints

## Sprint 3: API & Data Layer
**Start:** 2025-06-24 • **Due:** 2025-07-01 • _labels: phase1, api_

### Epic: FotoWare API Integration
**Start:** 2025-06-24 • **Due:** 2025-07-01 • _labels: phase1, api_

#### Story: As a developer, I can interact with the FotoWare API
- **Task:** Create `fotoware-client.ts` wrapper with token injection
- **Task:** Implement archive and album fetching
- **Task:** Add asset detail fetching with metadata
- **Task:** Set up error handling for API failures
- **Task:** Implement retry logic for failed requests
- **Task:** Add rate limiting for API calls

#### Story: As a user, I can view and interact with media assets
- **Task:** Implement universal embed system for all media types
- **Task:** Add support for large media file handling
- **Task:** Implement lazy loading for media assets
- **Task:** Add fallback UI for unsupported media types

## Sprint 4: Search & Filtering
**Start:** 2025-07-01 • **Due:** 2025-07-08 • _labels: phase1, search_

### Epic: Search Implementation
**Start:** 2025-07-01 • **Due:** 2025-07-08 • _labels: phase1, search_

#### Story: As a developer, I can implement efficient search
- **Task:** Create search index generation script
- **Task:** Implement Fuse.js search integration
- **Task:** Set up search API route with caching
- **Task:** Add search result pagination
- **Task:** Implement search result caching

#### Story: As a user, I can search and filter assets
- **Task:** Build search bar component with debounce
- **Task:** Implement filter panel with taxonomy support
- **Task:** Add date range filtering
- **Task:** Implement file type filtering
- **Task:** Add search result highlighting

## Sprint 5: Asset Management & Embeds
**Start:** 2025-07-08 • **Due:** 2025-07-15 • _labels: phase1, frontend_

### Epic: Asset Listing & Pagination
**Start:** 2025-07-08 • **Due:** 2025-07-15 • _labels: phase1, ux, frontend_

#### Story: As a user, I can browse assets
- **Task:** Create SSG + ISR page for `/archives/[archiveId]`
- **Task:** Build reusable `<Pagination>` component
- **Task:** Add `loading.tsx` skeleton placeholders
- **Task:** Implement asset grid with responsive layout

### Epic: Asset Detail & Universal Embeds
**Start:** 2025-07-08 • **Due:** 2025-07-15 • _labels: phase1, frontend, api_

#### Story: As a user, I can view asset details
- **Task:** Develop `<UniversalEmbed>` switching on `type` prop
- **Task:** Integrate `<model-viewer>` for 3D models
- **Task:** Build `MetadataSidebar` component
- **Task:** Implement MDX loader from `public/inject/{assetId}.md`
- **Task:** Wire LTI integration for Canvas users

## Sprint 6: Error Handling & Security
**Start:** 2025-07-15 • **Due:** 2025-07-22 • _labels: phase1, security_

### Epic: Error Handling & Recovery
**Start:** 2025-07-15 • **Due:** 2025-07-22 • _labels: phase1, error-handling_

#### Story: As a user, I experience graceful error handling
- **Task:** Implement global error boundary component
- **Task:** Create fallback UI states for failed API calls
- **Task:** Add retry mechanisms for failed requests
- **Task:** Implement toast notifications for user-facing errors
- **Task:** Create error logging strategy with Sentry
- **Task:** Add health check endpoints
- **Task:** Implement error tracking for client-side errors
- **Task:** Add error reporting to Sentry with proper context

### Epic: Security & Compliance
**Start:** 2025-07-15 • **Due:** 2025-07-22 • _labels: phase1, security_

#### Story: As a developer, I can ensure secure data handling
- **Task:** Implement CSRF protection for all API routes
- **Task:** Add rate limiting for search and API endpoints
- **Task:** Configure Content Security Policy (CSP) headers
- **Task:** Implement input sanitization for all user inputs
- **Task:** Add security headers
- **Task:** Set up API token validation and error handling

## Sprint 7: Testing & Documentation
**Start:** 2025-07-22 • **Due:** 2025-07-29 • _labels: phase1, qa_

### Epic: Testing Strategy (MVP)
**Start:** 2025-07-22 • **Due:** 2025-07-29 • _labels: phase1, qa_

#### Story: As a developer, I can verify component functionality
- **Task:** Write Jest + RTL tests for core components
- **Task:** Add `jest-axe` assertions for accessibility
- **Task:** Create test utilities for common patterns
- **Task:** Set up test coverage reporting
- **Task:** Add snapshot tests for UI components
- **Task:** Create API mock utilities for testing

#### Story: As a QA engineer, I can verify the application works
- **Task:** Create smoke test suite
- **Task:** Add integration tests for critical paths
- **Task:** Set up visual regression testing
- **Task:** Create performance test suite
- **Task:** Add accessibility test suite

### Epic: Documentation & Knowledge Base
**Start:** 2025-07-22 • **Due:** 2025-07-29 • _labels: phase1, docs_

#### Story: As a developer, I can find comprehensive documentation
- **Task:** Create API documentation with OpenAPI/Swagger
- **Task:** Write component documentation with examples
- **Task:** Document build and deployment process
- **Task:** Create troubleshooting guide
- **Task:** Add architecture diagrams
- **Task:** Document testing strategy
- **Task:** Create contribution guidelines

## Phase 2 (Enhancements & Scale)

### Epic: Advanced Internationalisation Features
**Start:** 2025-09-02 • **Due:** 2025-09-30 • _labels: phase2, i18n_

#### Story: As a content manager, I can manage translations efficiently
- **Task:** Implement translation management system
- **Task:** Add support for pluralization rules
- **Task:** Create translation workflow for content managers
- **Task:** Implement machine translation integration
- **Task:** Add support for regional variants (e.g., en-AU vs en-US)

#### Story: As a developer, I can easily add new languages
- **Task:** Create language pack system
- **Task:** Implement language-specific formatting rules
- **Task:** Add support for language-specific layouts
- **Task:** Create language switching animation
- **Task:** Implement language-specific SEO optimization

### Epic: Error Handling & Recovery
**Start:** 2025-06-24 • **Due:** 2025-07-01 • _labels: phase1, error-handling_

#### Story: As a user, I experience graceful error handling and recovery
- **Task:** Implement global error boundary component
- **Task:** Create fallback UI states for failed API calls
- **Task:** Add retry mechanisms for failed requests with exponential backoff
- **Task:** Implement toast notifications for user-facing errors
- **Task:** Create error logging strategy with Sentry
- **Task:** Add health check endpoints for critical services
- **Task:** Implement error tracking for client-side errors
- **Task:** Add error reporting to Sentry with proper context

### Epic: Security & Compliance
**Start:** 2025-06-24 • **Due:** 2025-07-01 • _labels: phase1, security_

#### Story: As a developer, I can ensure secure data handling
- **Task:** Implement CSRF protection for all API routes
- **Task:** Add rate limiting for search and API endpoints
- **Task:** Configure Content Security Policy (CSP) headers
- **Task:** Implement input sanitization for all user inputs
- **Task:** Add security headers (X-Frame-Options, X-Content-Type-Options)
- **Task:** Set up API token validation and error handling

### Epic: Monitoring & Observability
**Start:** 2025-06-24 • **Due:** 2025-07-01 • _labels: phase1, monitoring_

#### Story: As a developer, I can monitor application health and performance
- **Task:** Set up performance monitoring with Core Web Vitals tracking
- **Task:** Implement user session tracking and analytics
- **Task:** Configure error logging with Sentry
- **Task:** Create health check endpoints for all critical services
- **Task:** Set up alerting for critical errors and performance issues
- **Task:** Implement bundle size monitoring

### Epic: Data Management & Backup
**Start:** 2025-07-01 • **Due:** 2025-07-08 • _labels: phase1, data_

#### Story: As a developer, I can ensure data integrity and recovery
- **Task:** Implement data backup procedures for search index
- **Task:** Define data retention policies for user preferences
- **Task:** Create cache invalidation strategy for search results
- **Task:** Implement large media file handling and optimization
- **Task:** Set up automated backup verification

### Epic: Mobile & Responsive Testing
**Start:** 2025-09-09 • **Due:** 2025-09-16 • _labels: phase1, mobile_

#### Story: As a mobile user, I have an optimized experience
- **Task:** Implement touch-specific interactions and gestures
- **Task:** Create mobile-specific UI adjustments
- **Task:** Optimize image loading for mobile networks
- **Task:** Test and optimize for various mobile devices
- **Task:** Implement responsive image handling with srcset

### Epic: Quality Assurance & Testing
**Start:** 2025-09-09 • **Due:** 2025-09-16 • _labels: phase1, qa_

#### Story: As a QA engineer, I can verify application quality
- **Task:** Set up E2E testing with Playwright
- **Task:** Implement visual regression testing
- **Task:** Create performance testing suite
- **Task:** Set up load testing for search functionality
- **Task:** Implement automated accessibility testing

### Epic: Documentation & Knowledge Base
**Start:** 2025-09-16 • **Due:** 2025-09-23 • _labels: phase1, docs_

#### Story: As a developer, I have comprehensive documentation
- **Task:** Create API documentation with OpenAPI/Swagger
- **Task:** Write deployment and rollback procedures
- **Task:** Create environment setup guide
- **Task:** Document security best practices
- **Task:** Create troubleshooting guide

### Epic: Performance Optimization
**Start:** 2025-07-29 • **Due:** 2025-08-05 • _labels: phase1, performance_

#### Story: As a developer, I can monitor and optimize bundle size
- **Task:** Set up bundle analysis with `@next/bundle-analyzer`
- **Task:** Configure performance budgets
- **Task:** Implement dynamic imports for heavy components
- **Task:** Set up Core Web Vitals monitoring
- **Task:** Configure React Query caching strategy

### Epic: Core Internationalisation
**Start:** 2025-06-24 • **Due:** 2025-07-01 • _labels: phase1, i18n_

#### Story: As a user, I can use the application in my preferred language
- **Task:** Scaffold `[locale]` folder structure under `/app`
- **Task:** Integrate Next.js i18n or `next-intl`
- **Task:** Implement RTL support for Arabic and Hebrew
- **Task:** Create strategy for handling dynamic content
- **Task:** Implement timezone-aware date/time handling
- **Task:** Add currency formatting by locale
- **Task:** Create language detection and fallback system
- **Task:** Format dates/numbers by locale

### Epic: Advanced Monitoring & Analytics
**Start:** 2025-09-02 • **Due:** 2025-09-30 • _labels: phase2, monitoring_

#### Story: As a product owner, I can track advanced metrics
- **Task:** Implement custom analytics dashboard
- **Task:** Add user journey tracking
- **Task:** Create performance reporting system
- **Task:** Set up A/B testing infrastructure
- **Task:** Implement advanced error tracking

### Epic: Enhanced Security Features
**Start:** 2025-09-02 • **Due:** 2025-09-30 • _labels: phase2, security_

#### Story: As a security engineer, I can implement advanced security features
- **Task:** Add OAuth2 authentication
- **Task:** Implement role-based access control
- **Task:** Add audit logging
- **Task:** Set up security scanning in CI/CD
- **Task:** Implement advanced rate limiting