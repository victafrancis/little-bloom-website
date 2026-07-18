# Changelog

## [1.3.2] - 2026-07-18
- Fixed `Importing a module script failed` errors on mobile Safari by replacing the lazy-loaded routes in [`AppRoutes`](src/routes/router.tsx:26) with eager imports. Returning to a tab left open across a deploy meant fetching route chunks that no longer existed. The ten route chunks were only ~10 KB gzipped against a ~170 KB vendor baseline, so this partially reverses the route splitting from 1.2.5 for ~9 KB of first-load weight, and removes the network round trip on every navigation. The `Suspense` fallback was removed with them.
- Fixed the reload guard in [`safelyReloadAfterChunkError()`](src/index.tsx:38) added in 1.2.7, which was only cleared after a second failure. One recovered reload left the flag set for the rest of the session, so any later chunk error skipped its recovery attempt. It is now cleared once the document boots.
- Stopped reporting browser-extension errors to Sentry via `ignoreErrors` and `denyUrls` in [`Sentry.init()`](src/index.tsx:78). Extensions inject scripts into the page, so failures like `Invalid call to runtime.sendMessage()` reached our global handlers despite not being our code.

## [1.3.1] - 2026-07-14
- Fixed a bug in the butterfly sprite animation where an unhandled `InvalidStateError` could be thrown (and reported to Sentry) if the sprite image failed to load. Added a guard so the animation only draws once the sprite has successfully loaded, preventing `drawImage` from running on a broken image.

## [1.3.0] - 2026-07-13
- Added animated butterflies in [`ButterfliesAnimation`](src/components/ButterfliesAnimation.tsx): the brand's line-art butterflies flutter along gentle looping paths on the Home page and in the mobile hamburger menu, starting at 25% and 75% of the canvas facing each other
- Added living footer in [`FooterFlowers`](src/components/FooterFlowers.tsx): the footer flowers sway in a travelling wind wave with gusts (stems rooted, tops swaying) while a small bee periodically flies in, lands on a random flower head, rides its sway, and leaves out the other side
- Animations are canvas-based with transparent backgrounds (no GIFs), scale responsively to viewport width, pause when offscreen or the tab is hidden, and fall back to the original static artwork for users with reduced motion enabled

## [1.2.8] - 2026-07-11
- Updated content on pricing page

## [1.2.7] - 2026-03-11
- Added client-side chunk/module load recovery in [`safelyReloadAfterChunkError()`](src/index.tsx:38) to auto-refresh once when browsers hit stale hashed assets (for errors like `Importing a module script failed`).
- Added targeted Sentry diagnostics for chunk-load failures in [`Sentry.captureMessage()`](src/index.tsx:48) with request context (`pathname`, `userAgent`, source event type, and reload-attempt state).
- Added Vercel cache headers in [`vercel.json`](vercel.json) so [`index.html`](index.html) is not cached while hashed files under [`/assets`](vercel.json:12) stay long-lived immutable, reducing stale HTML → missing-chunk mismatches after deploys.
- Removed server-only/manual chunk entries from [`manualChunks`](vite.config.ts:10): dropped [`@sentry/node`](package.json:13) from browser vendor chunking and removed unused `vendor-resend` browser chunk to reduce noisy build externals and avoid empty client chunks.

## [1.2.6] - 2026-02-26
- Fixed contact form API stability by adding a safe fallback when [`Sentry.withSentryApiHandler`](api/send-email.js:146) is unavailable in the current [`@sentry/node`](package.json:13) runtime.
- Improved contact form error handling in [`handleSubmit`](src/components/ContactForm.tsx:20) to safely parse non-JSON API responses and avoid UI crashes like `Unexpected token ... is not valid JSON`.
- Added temporary diagnostics for API response metadata and server module initialization to speed up email form and Sentry troubleshooting.
## [1.2.5] - 2026-01-22
- Improved INP score by updating the following:
    - Implemented lazy loading for all routes to reduce initial JavaScript bundle size by 97%
    - Added advanced bundle splitting to separate vendor libraries (React, Supabase, Framer Motion, Sentry) into individual chunks for better caching and loading performance
    - Optimized gallery data loading to load images on-demand instead of upfront, improving initial page load speed
    - Reduced main JavaScript bundle from 608KB to 14KB (187KB to 5KB gzipped) for significantly improved INP scores
- Improved CLS (Cumulative Layout Shift) score by optimizing image dimensions and space reservation:
    - Added proper aspect ratios to prevent layout shifts on image load
## [1.2.4] - 2026-01-20
- Fixed issue where dark mode is being forced on the site by cetain mobile browsers like DuckDuckGo
- Updated hero images from jpg to webp for faster loading
- Optimized font-loading and pre-loaded hero image for faster loading
## [1.2.3] - 2026-01-19
- Ran `npm audit fix` to fix critical issues
- Fixed project architecture by removing nested `src` folders
- Added Sentry monitoring for email contact form submission errors
## [1.2.2] - 2026-01-18
- Added Sentry monitoring for proper error logging
- Added `.clinerules` file and `sentry-rules.md` doc
## [1.2.1] - 2025-10-21
- Fixed sitemap issues replacing `em dashes` with `regular dashes`, and replacing `&` to `&amp;`
- Updated Last modified dates for all galleries where new images were added
- Removed duplicate SEO `jsonLd` property and updated schema.org business `@type`
- Added Google ID to `sameAs` in structured data
## [1.2.0] - 2025-10-16
- Migrated all gallery images from local storage to Supabase storage for better performance and reduced repo size
- Implemented dynamic image loading from Supabase 'albums' bucket with automatic folder discovery
- Added Supabase client configuration and environment variables for storage integration
- Updated all gallery cover images to use standardized naming (00.jpg for all album covers)
- Added Row Level Security policy for anonymous access to Supabase storage objects
- Converted static gallery data to async loading with caching for improved performance
- Removed public images stored in the repo
## [1.1.0] - 2025-10-09
- Added "image loading" spinner on gallery view images while loading
## [1.0.1] - 2025-10-07
- Fixed mobile lightbox image view fast swiping issue where fast swiping stays on the same image
- Added Google Analytics
- Added Structured Data on pages for more optimized SEO
## [1.0.0] - 2025-09-24
- Website officially launched and deployed: Little Bloom Photography website
- Added vercel.json configuration file for deployment
