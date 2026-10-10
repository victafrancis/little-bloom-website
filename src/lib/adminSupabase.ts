import { createClient, processLock } from '@supabase/supabase-js';

// Only the album manager loads this, so visitors never run the login session code.
// It keeps its own storage key, and an in-page lock instead of the browser lock
// that crashed on some browsers (see the visitor client in supabase.ts).
export const adminSupabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    storageKey: 'lb-album-manager-auth',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    lock: processLock
  }
});
