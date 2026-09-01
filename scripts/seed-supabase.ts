/**
 * Tek seferlik taşıma: scripts/seed-data/villas-source.ts (eski statik villa
 * verisi) içeriğini Supabase'deki `projects` (+ project_floors +
 * project_floor_rooms) tablolarına yazar.
 *
 * Görsel/video taşımaz (bkz. proje kararı — fotoğraflar admin panelden
 * eklenecek), bu yüzden `cover_image_key`/`project_images` hiç dokunulmaz.
 *
 * Kullanım:
 *   cp .env.example .env.local   # SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_ADMIN_ID doldurun
 *   npx tsx scripts/seed-supabase.ts
 *
 * SEED_ADMIN_ID: mevcut bir admin hesabının profiles.id'si — Supabase
 * Studio'da `select id, display_name from public.profiles;` ile bulunur.
 *
 * Yeniden çalıştırmak güvenlidir: `slug` üzerinden upsert yapar, floors/rooms
 * her seferinde silinip yeniden yazılır.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { villaProjects } from "./seed-data/villas-source";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SEED_ADMIN_ID = process.env.SEED_ADMIN_ID;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !SEED_ADMIN_ID) {
  console.error(
    "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ve SEED_ADMIN_ID .env.local içinde tanımlı olmalı (bkz. .env.example).",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "ev")
    .single();
  if (categoryError || !category) {
    throw new Error(`'ev' kategorisi bulunamadı — migration'lar uygulandı mı? ${categoryError?.message}`);
  }

  for (const p of villaProjects) {
    const { data: project, error: upsertError } = await supabase
      .from("projects")
      .upsert(
        {
          category_id: category.id,
          created_by: SEED_ADMIN_ID,
          slug: p.slug,
          featured: p.featured,
          status: p.status,
          name: p.title.tr,
          description: p.excerpt.tr,
          title_tr: p.title.tr,
          title_en: p.title.en,
          excerpt_tr: p.excerpt.tr,
          excerpt_en: p.excerpt.en,
          description_tr: p.description.tr,
          description_en: p.description.en,
          highlights_tr: p.highlights.tr,
          highlights_en: p.highlights.en,
          district: p.district,
          neighborhood: p.neighborhood,
          city: p.city,
          ada_parsel: p.adaParsel,
          project_area_m2: p.projectAreaM2,
          parcel_count: p.parcelCount,
          parcel_kind: p.parcelKind,
          parcel_area_min: p.parcelAreaRange.min,
          parcel_area_max: p.parcelAreaRange.max,
          price_range_min: p.priceRangeTRY.min,
          price_range_max: p.priceRangeTRY.max,
          total_area_m2: p.totalAreaM2,
          travel_to_sakarya_min: p.travelTime.toSakaryaMin,
          travel_to_istanbul_hour: p.travelTime.toIstanbulHour,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (upsertError || !project) {
      console.error(`✗ ${p.slug}: ${upsertError?.message}`);
      continue;
    }

    // Kat/oda kırılımını temizden yeniden yaz (idempotent yeniden çalıştırma için).
    await supabase.from("project_floors").delete().eq("project_id", project.id);

    for (const [floorIndex, floor] of p.floors.entries()) {
      const { data: floorRow, error: floorError } = await supabase
        .from("project_floors")
        .insert({
          project_id: project.id,
          key: floor.key,
          area_m2: floor.areaM2,
          outdoor_kind: floor.outdoor?.kind ?? null,
          outdoor_area_m2: floor.outdoor?.areaM2 ?? null,
          position: floorIndex,
        })
        .select("id")
        .single();

      if (floorError || !floorRow) {
        console.error(`  ✗ ${p.slug} kat ${floor.key}: ${floorError?.message}`);
        continue;
      }

      const roomRows = floor.rooms.map((room, roomIndex) => ({
        floor_id: floorRow.id,
        room_key: room.key,
        count: room.count,
        position: roomIndex,
      }));
      if (roomRows.length > 0) {
        const { error: roomsError } = await supabase.from("project_floor_rooms").insert(roomRows);
        if (roomsError) console.error(`  ✗ ${p.slug} kat ${floor.key} odalar: ${roomsError.message}`);
      }
    }

    console.log(`✓ ${p.slug}`);
  }

  console.log(`\nTamamlandı: ${villaProjects.length} proje işlendi.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
