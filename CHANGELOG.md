# Changelog

## [1.6.0] - 2026-10-06
- Links that leave the site now ask first, so a stray tap can't throw a visitor into the Instagram app. Clicking one shows an "Open Instagram?" card with **Stay here** (the default) and **Open Instagram**, in [`ExternalLinkGuard`](src/components/ExternalLinkGuard.tsx). It covers the footer icons and every link in the Instagram section, and is named after where the link goes ("Open Facebook?", or the site's name for anything else). Email links ask too ("Open email?"), naming the address it will write to.
- One listener on the document catches every link to another site, including ones added later or inside the notes, via [`getExternalLinkTarget()`](src/lib/externalLink.ts). Links within the site, and Ctrl/Cmd/Shift or middle clicks (which are deliberate), skip the question.
- The card is a native modal dialog, so Escape or a click outside cancels, the page behind it can't be scrolled or tabbed into, and focus returns to the link afterwards. It starts on **Stay here** so a stray Enter keeps the visitor on the site.

## [1.5.1] - 2026-10-05
- Fixed gallery pages requesting their photo list over and over when it failed to load. The page re-ran its loader every time it got an empty list back, so a dropped connection meant a blank gallery and a request about every second (35 in 12 seconds in testing). [`GalleryCategory`](src/pages/GalleryCategory.tsx) now loads only its own gallery, shows a placeholder grid while loading, and shows a "Try Again" message if the list can't load. Unknown gallery links now redirect with `<Navigate>` instead of navigating during render.
- Photos that fail to load are now retried once after 1.5 seconds before showing a fallback, via [`useImageRetry()`](src/lib/useImageRetry.ts). This covers the gallery grid, the lightbox, the Home and Gallery cover tiles, and the Instagram section. A photo that still fails shows a soft "Photo unavailable" tile instead of a broken image, and is reported to Sentry once as a warning (skipped when the visitor is offline), so a genuinely broken file shows up.
- The Instagram section now gives up on a feed that takes more than 8 seconds and shows gallery photos instead, in [`getInstagramFeed()`](src/lib/instagram.ts).
- Stopped reporting errors from Vercel's comment toolbar to Sentry, via `denyUrls` in [`Sentry.init()`](src/index.tsx). It is injected into preview deployments, so its errors (like `Cannot read properties of null (reading 'getItem')`) weren't from our code.
- Sentry events now carry the Vercel environment (`production` or `preview`), so preview testing no longer shows up as production errors.
- The chunk-reload guard in [`index.tsx`](src/index.tsx) no longer crashes in browsers where `sessionStorage` is blocked or `null`, and skips the reload when it can't save its flag, to avoid a reload loop.

## [1.5.0] - 2026-10-02
- Added a "Follow Along on Instagram" section above the footer on every page, in [`InstagramFeed`](src/components/InstagramFeed.tsx). It shows the latest posts from @littlebloom.photos (up to 50) in a looping carousel that glides one post at a time. Visitors can swipe it on mobile or use the arrows on desktop. It pauses on hover, keyboard focus, offscreen, and for reduced motion, and stops once the visitor takes over. Reels and multi-photo posts get Instagram's small corner icons.
- The feed comes from the Instagram API through [`api/instagram.js`](api/instagram.js), cached at Vercel's edge for an hour. Images are served from our own domain by [`api/instagram-image.js`](api/instagram-image.js), because Instagram's CDN can block them on other sites. That endpoint only serves URLs the feed signed.
- The access token is kept alive by a daily Vercel cron calling [`api/instagram-refresh.js`](api/instagram-refresh.js), which refreshes it weekly and stores it in a new Supabase `instagram_token` table.
- Until Instagram is connected, or if it fails, the section shows photos from the four galleries instead, via [`getInstagramFeed()`](src/lib/instagram.ts).
- Setup steps (Instagram token, Supabase table, Vercel env vars) are in [`docs/instagram-feed.md`](docs/instagram-feed.md).
- Replaced `.clinerules` with [`CLAUDE.md`](CLAUDE.md), so Claude Code picks up the project's code style rules.

## [1.4.2] - 2026-10-01
- Gallery photo listings now retry once after a second when the connection drops (`Failed to fetch`, or `Load failed` on Safari), in [`listGalleryImageFiles()`](src/lib/supabase.ts). These were the `StorageUnknownError` reports in Sentry, caused by visitors' flaky mobile connections rather than by Supabase.
- Gallery errors caused by a dropped connection are now reported to Sentry as warnings instead of errors, via [`reportGalleryError()`](src/lib/supabase.ts). Other storage errors are still reported as errors.
- A gallery whose photos failed to load is no longer cached as empty in [`getGalleryImages()`](src/data/galleries.ts), so it can load again later in the same visit without a refresh.

## [1.4.1] - 2026-09-27
- The current gallery cover is now shown first in its gallery, followed by the other photos in filename order, in [`getGalleryImages()`](src/lib/supabase.ts). Galleries without a `cover…` file are unchanged, since `00.jpg` already sorts first.

## [1.4.0] - 2026-09-27
- Gallery covers can now be set by uploading an image whose name starts with `cover` (e.g. `cover-2.jpg`) to the gallery's folder in the `albums` bucket, resolved in [`getGalleryCoverUrl()`](src/lib/supabase.ts). The cover stays in the gallery with the other photos. If several `cover…` files exist, the most recently uploaded wins; with none, the cover falls back to `00.jpg`. Using a new filename for each cover avoids the Supabase CDN serving a stale copy after overwriting a file.
- Home and Gallery page tiles now render their covers through [`GalleryCover`](src/components/GalleryCover.tsx), and the cover lookup shares one cached folder listing with the gallery images.

## [1.3.4] - 2026-09-12
- Removed the browser's "Install Little Bloom Photography" prompt on mobile by changing `display` from `standalone` to `browser` in [`site.webmanifest`]

## [1.3.3] - 2026-09-01
- Updated pricing png files

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
