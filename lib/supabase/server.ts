/**
 * Supabase Server Client
 *
 * Use this client in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * This client uses cookies for session persistence
 * Properly handles SSR and authentication
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Handle error when called from Server Component
            // Cookies can only be set in Server Actions or Route Handlers
          }
        },
      },
    }
  );
}
