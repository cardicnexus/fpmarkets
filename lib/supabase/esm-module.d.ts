declare module "https://esm.sh/@supabase/supabase-js@2?bundle" {
  export const createClient: (
    url: string,
    key: string,
    config: { auth: { persistSession: boolean; autoRefreshToken: boolean } },
  ) => import("./client").SupabaseClient;
}
