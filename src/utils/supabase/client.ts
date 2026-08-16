import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  // During SSR / build, there is no browser. Return a placeholder.
  // The real client is only ever created & used in the browser
  // (inside useEffect and event handlers).
  if (typeof window === 'undefined') {
    return {} as SupabaseClient
  }

  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
