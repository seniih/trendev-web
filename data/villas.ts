/**
 * Trend Ev — ev/villa projeleri verisi.
 * Kaynak: Supabase'deki `projects` tablosu (kategori: `ev`), trendarsa-app ile
 * ortak veritabanı. İçerik artık admin panelden (bkz. trend-admin) veya
 * trendarsa-app'in Flutter admin ekranlarından girilip düzenlenir — bu dosya
 * sadece tipleri tanımlar ve Supabase satırlarını `VillaProject` şekline
 * eşler. İlk içerik `docs/katalog.md`'den (trendarsa-katalog.pdf) tek seferlik
 * bir seed script ile (`scripts/seed-supabase.ts`) taşındı.
 */

import { supabase, r2Url } from "@/lib/supabase";

export type Locale = "tr" | "en";

export type RoomKey =
  | "room"
  | "bedroom"
  | "livingRoom"
  | "kitchen"
  | "bathroom"
  | "masterBathroom"
  | "dressingRoom"
  | "hall";

export interface RoomItem {
  key: RoomKey;
  count: number;
}

export type OutdoorKind = "veranda" | "terrace";

export interface VillaFloor {
  key: "ground" | "first" | "roof";
  areaM2: number;
  outdoor?: { kind: OutdoorKind; areaM2?: number };
  rooms: RoomItem[];
}

export type ParcelKind = "villa" | "twinVilla";

export interface VillaProject {
  slug: string;
  featured: boolean;
  status: "available" | "reserved" | "sold";
  title: Record<Locale, string>;
  district: string; // İlçe
  neighborhood: string; // Mahalle
  city: string;
  adaParsel: string;
  projectAreaM2: number;
  parcelCount: number;
  parcelKind: ParcelKind;
  parcelAreaRange: { min: number; max: number };
  priceRangeTRY: { min: number; max: number };
  totalAreaM2: number;
  floors: VillaFloor[];
  travelTime: { toSakaryaMin: number; toIstanbulHour: number };
  highlights: Record<Locale, string[]>;
  excerpt: Record<Locale, string>;
  description: Record<Locale, string[]>;
  /** R2 üzerindeki kapak fotoğrafı — admin panelden eklenene kadar `null`. */
  poster: string | null;
  gallery: string[];
}

interface ProjectFloorRoomRow {
  room_key: RoomKey;
  count: number;
  position: number;
}

interface ProjectFloorRow {
  key: VillaFloor["key"];
  area_m2: number;
  outdoor_kind: OutdoorKind | null;
  outdoor_area_m2: number | null;
  position: number;
  project_floor_rooms: ProjectFloorRoomRow[];
}

interface ProjectImageRow {
  storage_key: string;
  position: number;
}

interface ProjectRow {
  slug: string | null;
  featured: boolean;
  status: VillaProject["status"] | null;
  title_tr: string | null;
  title_en: string | null;
  excerpt_tr: string | null;
  excerpt_en: string | null;
  description_tr: string[] | null;
  description_en: string[] | null;
  highlights_tr: string[] | null;
  highlights_en: string[] | null;
  district: string | null;
  neighborhood: string | null;
  city: string | null;
  ada_parsel: string | null;
  project_area_m2: number | null;
  parcel_count: number | null;
  parcel_kind: ParcelKind | null;
  parcel_area_min: number | null;
  parcel_area_max: number | null;
  price_range_min: number | null;
  price_range_max: number | null;
  total_area_m2: number | null;
  travel_to_sakarya_min: number | null;
  travel_to_istanbul_hour: number | null;
  cover_image_key: string | null;
  project_floors: ProjectFloorRow[];
  project_images: ProjectImageRow[];
}

const PROJECT_SELECT = `
  slug, featured, status, title_tr, title_en, excerpt_tr, excerpt_en,
  description_tr, description_en, highlights_tr, highlights_en,
  district, neighborhood, city, ada_parsel, project_area_m2, parcel_count,
  parcel_kind, parcel_area_min, parcel_area_max, price_range_min, price_range_max,
  total_area_m2, travel_to_sakarya_min, travel_to_istanbul_hour, cover_image_key,
  project_floors ( key, area_m2, outdoor_kind, outdoor_area_m2, position,
    project_floor_rooms ( room_key, count, position ) ),
  project_images ( storage_key, position )
`;

function mapRow(row: ProjectRow): VillaProject {
  const floors: VillaFloor[] = [...row.project_floors]
    .sort((a, b) => a.position - b.position)
    .map((floor) => ({
      key: floor.key,
      areaM2: floor.area_m2,
      outdoor: floor.outdoor_kind
        ? { kind: floor.outdoor_kind, areaM2: floor.outdoor_area_m2 ?? undefined }
        : undefined,
      rooms: [...floor.project_floor_rooms]
        .sort((a, b) => a.position - b.position)
        .map((r) => ({ key: r.room_key, count: r.count })),
    }));

  const gallery = [...row.project_images]
    .sort((a, b) => a.position - b.position)
    .map((img) => r2Url(img.storage_key))
    .filter((url): url is string => url !== null);

  return {
    slug: row.slug ?? "",
    featured: row.featured,
    status: row.status ?? "available",
    title: { tr: row.title_tr ?? "", en: row.title_en ?? "" },
    district: row.district ?? "",
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "Sakarya",
    adaParsel: row.ada_parsel ?? "",
    projectAreaM2: row.project_area_m2 ?? 0,
    parcelCount: row.parcel_count ?? 0,
    parcelKind: row.parcel_kind ?? "villa",
    parcelAreaRange: { min: row.parcel_area_min ?? 0, max: row.parcel_area_max ?? 0 },
    priceRangeTRY: { min: row.price_range_min ?? 0, max: row.price_range_max ?? 0 },
    totalAreaM2: row.total_area_m2 ?? 0,
    floors,
    travelTime: {
      toSakaryaMin: row.travel_to_sakarya_min ?? 0,
      toIstanbulHour: row.travel_to_istanbul_hour ?? 0,
    },
    highlights: { tr: row.highlights_tr ?? [], en: row.highlights_en ?? [] },
    excerpt: { tr: row.excerpt_tr ?? "", en: row.excerpt_en ?? "" },
    description: { tr: row.description_tr ?? [], en: row.description_en ?? [] },
    poster: r2Url(row.cover_image_key),
    gallery,
  };
}

let projectsCache: Promise<VillaProject[]> | null = null;

async function fetchAllProjects(): Promise<VillaProject[]> {
  if (!projectsCache) {
    projectsCache = (async () => {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "ev")
        .single();
      if (categoryError || !category) {
        throw new Error(
          `'ev' kategorisi Supabase'de bulunamadı (migration/seed çalıştırıldı mı?): ${categoryError?.message}`,
        );
      }

      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_SELECT)
        .eq("category_id", category.id)
        .not("slug", "is", null)
        .order("created_at", { ascending: true });
      if (error) throw new Error(`Supabase villa projeleri sorgusu başarısız: ${error.message}`);

      return (data as unknown as ProjectRow[]).map(mapRow);
    })();
  }
  return projectsCache;
}

export async function getVillaProjects(): Promise<VillaProject[]> {
  return fetchAllProjects();
}

export async function getFeaturedVillaProjects(): Promise<VillaProject[]> {
  return (await fetchAllProjects()).filter((p) => p.featured);
}

export async function getVillaProject(slug: string): Promise<VillaProject | undefined> {
  return (await fetchAllProjects()).find((p) => p.slug === slug);
}
