/**
 * Supabase Admin Client
 *
 * Use this client ONLY in:
 * - Server-side operations that need to bypass RLS
 * - Seed scripts
 * - Admin operations
 *
 * ⚠️ WARNING: This client has full database access
 * Never use in Client Components or expose to browser
 * Only use in secure server-side code
 */

import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
