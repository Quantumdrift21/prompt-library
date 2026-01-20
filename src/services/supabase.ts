import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// TODO: Replace with your Supabase project credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configuration
const isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY;

// Create client only if configured
export const supabase = isConfigured
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export const isSupabaseConfigured = (): boolean => isConfigured;
