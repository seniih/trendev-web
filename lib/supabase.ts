import { createClient } from "@supabase/supabase-js";

/**
 * Sadece sunucu tarafında (build/generateStaticParams/Server Component)
 * kullanılır — anon key ile, RLS herkese açık `select` izni veriyor
 * (bkz. trendarsa-app/supabase/migrations). İstemciye hiç sızmaz çünkü
 * site tamamen statik/sunucu tarafında render ediliyor.
 */
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export function r2Url(storageKey: string | null | undefined): string | null {
  if (!storageKey) return null;
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${storageKey}`;
}
