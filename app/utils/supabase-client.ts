import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Get Supabase URL and Key from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL or Key is missing. Please provide both.');
}

// Create and export Supabase client
export const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY);
