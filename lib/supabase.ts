import { createClient } from "@supabase/supabase-js";

/**
 * Sadece sunucu tarafında (build/generateStaticParams/Server Component)
 * kullanılır — anon key ile, RLS herkese açık `select` izni veriyor
 * (bkz. trendarsa-app/supabase/migrations). İstemciye hiç sızmaz çünkü
 * site tamamen statik/sunucu tarafında render ediliyor.
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "SUPABASE_URL / SUPABASE_ANON_KEY eksik — build ortamının (ör. Cloudflare Pages " +
      "Settings > Environment variables) bu değişkenleri tanımlaması gerekiyor. Bkz. .env.example.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function r2Url(storageKey: string | null | undefined): string | null {
  if (!storageKey) return null;
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${storageKey}`;
}
