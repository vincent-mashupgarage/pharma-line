/**
 * Supabase Browser Client
 *
 * Use this client in Client Components ('use client')
 * This client uses localStorage for session persistence
 * Safe to use in browser environment
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
