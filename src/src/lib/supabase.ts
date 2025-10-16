import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getGalleryImages = async (slug: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('albums')
      .list(slug, {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Filter to get only image files (not folders)
    const imageFiles = data
      .filter(item => /\.(jpg|jpeg|png|webp|gif)$/i.test(item.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    return imageFiles.map(file => {
      const { data: urlData } = supabase.storage
        .from('albums')
        .getPublicUrl(`${slug}/${file.name}`);

      return urlData.publicUrl;
    });
  } catch (error) {
    console.error('Error in getGalleryImages:', error);
    return [];
  }
};

export const getCoverImageUrl = (slug: string, filename: string): string => {
  const { data } = supabase.storage
    .from('albums')
    .getPublicUrl(`${slug}/${filename}`);

  return data.publicUrl;
};
