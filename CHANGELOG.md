# Changelog
## [1.2.1] - 2025-10-21
- Fixed sitemap issues replacing `em dashes` with `regular dashes`, and replacing `&` to `&amp;`
- Updated Last modified dates for all galleries where new images were added
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
