/**
 * Ana sayfadaki açılış (hero) ve harita bloklarının metinleri, rakam şeridi ve
 * iletişim bilgileri artık Supabase'de (`site_sections`, `site_stats`,
 * `site_settings`) tutuluyor ve admin panelden düzenleniyor.
 *
 * DB'de satır yoksa ya da alan boşsa `messages/*.json` ile `data/site.ts`
 * içindeki mevcut değerlere düşülür; böylece veritabanı boşken de site dolu
 * görünür ve build kırılmaz.
 */

import { supabase, r2Url } from "@/lib/supabase";
import { site as siteDefaults } from "./site";

export type Locale = "tr" | "en";

/** Bu sitenin `site_*` tablolarındaki kimliği. */
const SITE_KEY = "trendev-web";

export type SectionKey = "hero" | "projectsMap";

export interface SectionContent {
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  ctaPrimary: string | null;
  ctaSecondary: string | null;
  /** Tam URL (R2) — yoksa null, sayfa kendi statik görselini kullanır. */
  image: string | null;
  imageAlt: string | null;
  enabled: boolean;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface SiteInfo {
  name: string;
  legalName: string;
  url: string;
  phoneIntl: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: {
    line: string;
    district: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    zoom: number;
  };
  social: { instagram: string; facebook: string };
}

const STATIC_INFO: SiteInfo = {
  name: siteDefaults.name,
  legalName: siteDefaults.legalName,
  url: siteDefaults.url,
  phoneIntl: siteDefaults.phoneIntl,
  phoneDisplay: siteDefaults.phoneDisplay,
  whatsapp: siteDefaults.whatsapp,
  email: siteDefaults.email,
  address: { ...siteDefaults.address, zoom: 13 },
  social: { ...siteDefaults.social },
};

/** Boş metinleri "değer yok" sayar; böylece fallback devreye girer. */
function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pick(tr: string | null | undefined, en: string | null | undefined, locale: Locale) {
  return locale === "en" ? text(en) ?? text(tr) : text(tr);
}

interface SectionRow {
  key: string;
  eyebrow_tr: string | null;
  eyebrow_en: string | null;
  title_tr: string | null;
  title_en: string | null;
  subtitle_tr: string | null;
  subtitle_en: string | null;
  cta_primary_tr: string | null;
  cta_primary_en: string | null;
  cta_secondary_tr: string | null;
  cta_secondary_en: string | null;
  image_key: string | null;
  image_alt_tr: string | null;
  image_alt_en: string | null;
  enabled: boolean;
}

let sectionsCache: Promise<SectionRow[]> | null = null;

function fetchSections(): Promise<SectionRow[]> {
  if (!sectionsCache) {
    sectionsCache = (async () => {
      const { data, error } = await supabase
        .from("site_sections")
        .select(
          `key, eyebrow_tr, eyebrow_en, title_tr, title_en, subtitle_tr, subtitle_en,
           cta_primary_tr, cta_primary_en, cta_secondary_tr, cta_secondary_en,
           image_key, image_alt_tr, image_alt_en, enabled`,
        )
        .eq("site", SITE_KEY);
      if (error) throw new Error(`site_sections okunamadı: ${error.message}`);
      return (data ?? []) as SectionRow[];
    })();
  }
  return sectionsCache;
}

export async function getSection(key: SectionKey, locale: Locale): Promise<SectionContent | null> {
  const row = (await fetchSections()).find((r) => r.key === key);
  if (!row) return null;
  return {
    eyebrow: pick(row.eyebrow_tr, row.eyebrow_en, locale),
    title: pick(row.title_tr, row.title_en, locale),
    subtitle: pick(row.subtitle_tr, row.subtitle_en, locale),
    ctaPrimary: pick(row.cta_primary_tr, row.cta_primary_en, locale),
    ctaSecondary: pick(row.cta_secondary_tr, row.cta_secondary_en, locale),
    image: r2Url(row.image_key),
    imageAlt: pick(row.image_alt_tr, row.image_alt_en, locale),
    enabled: row.enabled,
  };
}

let statsCache: Promise<StatItem[]> | null = null;

/** Rakam şeridi — DB boşsa boş dizi döner, sayfa çeviri dosyasına düşer. */
export async function getStats(locale: Locale): Promise<StatItem[]> {
  if (!statsCache) {
    statsCache = (async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("value_tr, value_en, label_tr, label_en, position")
        .eq("site", SITE_KEY)
        .order("position", { ascending: true });
      if (error) throw new Error(`site_stats okunamadı: ${error.message}`);
      return (data ?? []).map((row) => ({
        value: pick(row.value_tr, row.value_en, locale) ?? "",
        label: pick(row.label_tr, row.label_en, locale) ?? "",
      }));
    })();
  }
  return statsCache;
}

let infoCache: Promise<SiteInfo> | null = null;

/** İletişim bilgileri + harita konumu; DB'de eksik alan varsa statik değere düşer. */
export async function getSiteInfo(): Promise<SiteInfo> {
  if (!infoCache) {
    infoCache = (async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("site", SITE_KEY)
        .maybeSingle();
      if (error) throw new Error(`site_settings okunamadı: ${error.message}`);
      if (!data) return STATIC_INFO;
      return {
        name: text(data.brand_name) ?? STATIC_INFO.name,
        legalName: text(data.legal_name) ?? STATIC_INFO.legalName,
        url: text(data.site_url) ?? STATIC_INFO.url,
        phoneIntl: text(data.phone_intl) ?? STATIC_INFO.phoneIntl,
        phoneDisplay: text(data.phone_display) ?? STATIC_INFO.phoneDisplay,
        whatsapp: text(data.whatsapp) ?? STATIC_INFO.whatsapp,
        email: text(data.email) ?? STATIC_INFO.email,
        address: {
          line: text(data.address_line) ?? STATIC_INFO.address.line,
          district: text(data.address_district) ?? STATIC_INFO.address.district,
          city: text(data.address_city) ?? STATIC_INFO.address.city,
          country: text(data.address_country) ?? STATIC_INFO.address.country,
          lat: data.map_lat ?? STATIC_INFO.address.lat,
          lng: data.map_lng ?? STATIC_INFO.address.lng,
          zoom: data.map_zoom ?? STATIC_INFO.address.zoom,
        },
        social: {
          instagram: text(data.instagram_url) ?? STATIC_INFO.social.instagram,
          facebook: text(data.facebook_url) ?? STATIC_INFO.social.facebook,
        },
      } satisfies SiteInfo;
    })();
  }
  return infoCache;
}
