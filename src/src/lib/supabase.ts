import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getGalleryImages = async (slug: string): Promise<string[]> => {
  try {
    return await Sentry.startSpan(
      {
        op: 'http.client',
        name: `GET /storage/albums/${slug}`,
      },
      async (span) => {
        span.setAttribute('gallery_slug', slug);

        const { data, error } = await supabase.storage
          .from('albums')
          .list(slug, {
            limit: 100,
            offset: 0
          });

        if (error) {
          Sentry.captureException(error, {
            tags: { gallery_slug: slug, operation: 'list_images' },
            extra: { slug }
          });
          return [];
        }

        if (!data) {
          return [];
        }

        // Filter to get only image files (not folders)
        const imageFiles = data
          .filter(item => /\.(jpg|jpeg|png|webp|gif)$/i.test(item.name))
          .sort((a, b) => a.name.localeCompare(b.name));

        const urls = imageFiles.map(file => {
          const { data: urlData } = supabase.storage
            .from('albums')
            .getPublicUrl(`${slug}/${file.name}`);

          return urlData.publicUrl;
        });

        span.setAttribute('image_count', imageFiles.length);
        return urls;
      }
    );
  } catch (error) {
    Sentry.captureException(error, {
      tags: { gallery_slug: slug, operation: 'get_gallery_images' },
      extra: { slug }
    });
    return [];
  }
};

export const getCoverImageUrl = (slug: string, filename: string): string => {
  const { data } = supabase.storage
    .from('albums')
    .getPublicUrl(`${slug}/${filename}`);

  return data.publicUrl;
};
