import { createClient } from '@supabase/supabase-js';

// ──────────────────────────────────────────────────────────
// Supabase Configuration
// ──────────────────────────────────────────────────────────
// These values come from your Supabase project dashboard:
//   → Settings → API → Project URL & anon/public key
//
// For security, we read them from environment variables.
// Create a `.env` file in the frontend/ root with:
//   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key-here
// ──────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Missing Supabase environment variables!\n' +
    'Create a .env file in frontend/ with:\n' +
    '  VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
