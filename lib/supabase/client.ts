export type SupabaseAuthResponse<TData = unknown> = {
  data: TData | null;
  error: { message: string } | null;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
} & Record<string, unknown>;

export type SupabaseClient = {
  auth: {
    signUp: (credentials: {
      email: string;
      password: string;
      options?: { emailRedirectTo?: string };
    }) => Promise<SupabaseAuthResponse<{ session: SupabaseSession | null }>>;
    signInWithPassword: (credentials: {
      email: string;
      password: string;
    }) => Promise<SupabaseAuthResponse<{ session: SupabaseSession | null }>>;
    signInWithOAuth: (config: {
      provider: string;
      options?: { redirectTo?: string; queryParams?: Record<string, string> };
    }) => Promise<SupabaseAuthResponse<unknown>>;
    getSession: () => Promise<SupabaseAuthResponse<{ session: SupabaseSession | null }>>;
  };
};

let clientPromise: Promise<SupabaseClient> | null = null;

async function loadSupabaseBrowserClient(): Promise<SupabaseClient> {
  if (typeof window === "undefined") {
    throw new Error("Supabase client can only be initialised in the browser.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
  }

  const module = (await import(
    /* webpackIgnore: true */ "https://esm.sh/@supabase/supabase-js@2?bundle"
  )) as {
    createClient: (
      url: string,
      key: string,
      config: { auth: { persistSession: boolean; autoRefreshToken: boolean } },
    ) => SupabaseClient;
  };

  return module.createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export function getSupabaseBrowserClient(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = loadSupabaseBrowserClient();
  }

  return clientPromise;
}
