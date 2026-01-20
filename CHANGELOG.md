# Changelog
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
