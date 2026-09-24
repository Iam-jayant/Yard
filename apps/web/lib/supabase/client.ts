// apps/web/lib/supabase/client.ts
// Browser-side Supabase client — for Client Components
// Uses createBrowserClient which handles cookies automatically

"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
