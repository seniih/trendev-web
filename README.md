# TrendEv (trendev-web)

**TrendEv villa projelerini tanıtan, iki dilli (TR/EN) kurumsal web sitesi.** Proje içerikleri **trendarsa-admin** panelinden girilir ve trendarsa-app ile ortak Supabase veritabanından okunur; sayfalar ISR ile periyodik olarak yenilenir.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)

> 🚧 **Durum:** Aktif geliştirme. Site yayında; içerik ve özellikler sürekli güncelleniyor.

---

## TrendArsa ekosistemi

Bu repo, ortak bir Supabase veritabanını ve Cloudflare R2 görsel deposunu paylaşan dört parçalı bir sistemin parçasıdır:

| Repo | Rol |
|---|---|
| [trendarsa-app](https://github.com/seniih/trendarsa-app) | Flutter mobil uygulama (iOS/Android); Supabase şeması, RLS ve Edge Function'ların kaynağı |
| [trendarsa-admin](https://github.com/seniih/trendarsa-admin) | Web içerik paneli — ilanlar, villa projeleri, site içeriği |
| [trendarsa-web](https://github.com/seniih/trendarsa-web) | Arsa projeleri sitesi (TR/EN) |
| **trendev-web** (bu repo) | Villa projeleri sitesi (TR/EN) |

## Özellikler

- **Villa projeleri** — liste ve detay sayfaları; fiyat/parsel bilgileri, kat planları (oda bazında m²), kapak ve galeri görselleri
- **İki dil** — `next-intl` ile TR/EN, locale bazlı yönlendirme (`proxy.ts`, `i18n/`)
- **Admin panelinden yönetilen içerik** — açılış (hero) bölümü, rakam şeridi, harita, iletişim bilgileri
- **ISR** — sayfalar `revalidate = 60` ile yenilenir; panelde yapılan değişiklik yeniden deploy gerektirmeden ~1 dakika içinde siteye yansır
- **SEO** — `sitemap.ts`, `robots.ts`, JSON-LD yapılandırılmış veri (`components/JsonLd.tsx`)
- **Görseller** — proje görselleri Cloudflare R2'den, `next/image` ile optimize edilerek sunulur

## İçerik nereden geliyor

| Sayfa parçası | Kaynak |
|---|---|
| Villa projeleri (liste + detay) | `projects`, `project_floors`, `project_floor_rooms`, `project_images` tabloları — `publish_targets` içinde `trendev-web` olanlar (`data/villas.ts`) |
| Açılış (hero) ve harita bloğu | `site_sections` (`data/site-content.ts`) |
| Rakam şeridi | `site_stats` |
| Telefon, WhatsApp, e-posta, adres, harita konumu | `site_settings` |
| Diğer sabit metinler (menü, "Neden TrendEv", "Hakkımızda"…) | `messages/tr.json` · `messages/en.json` |
| Site geneli görseller (hero, sayfa başlıkları) | `public/images/site/` |

Veritabanında satır yoksa veya alan boşsa çeviri dosyaları ve `data/site.ts` içindeki varsayılan değerler kullanılır. İçerik ve görsel güncelleme rehberi: [`docs/ICERIK-REHBERI.md`](docs/ICERIK-REHBERI.md).

## Proje yapısı

```
app/[locale]/     # sayfalar: ana sayfa, projeler, neden-trendev, hakkimizda, iletisim
components/       # UI bileşenleri (VillaCard, VillasExplorer, MapEmbed, ...)
data/             # Supabase'den veri okuma + önbellek (villas, site-content)
i18n/, messages/  # next-intl yapılandırması ve çeviri dosyaları
lib/              # Supabase istemcisi, R2 URL yardımcıları
scripts/          # tek seferlik veri taşıma (seed) betiği
docs/             # içerik rehberi ve katalog metni
```

## Kurulum

### Gereksinimler

- Node.js 20+
- trendarsa-app migration'ları uygulanmış bir Supabase projesi

### Çalıştırma

```bash
git clone https://github.com/seniih/trendev-web.git
cd trendev-web
npm install
cp .env.example .env      # Supabase URL/anon key + R2 public base URL
npm run dev               # http://localhost:3002
```

`SUPABASE_URL` / `SUPABASE_ANON_KEY` tanımlı değilse build hata verir (bkz. `lib/supabase.ts`). Anon key yalnızca sunucu tarafında kullanılır; okuma yetkisi Supabase RLS politikalarıyla sınırlıdır.

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu (port 3002) |
| `npm run build` / `npm start` | Production build ve sunucu |
| `npm run lint` | ESLint |
| `npm run seed` | Eski statik villa verisini Supabase'e taşıyan tek seferlik betik |

### Seed betiği

`scripts/seed-supabase.ts`, `scripts/seed-data/` içindeki eski statik villa verisini `projects` tablolarına yazar (slug üzerinden upsert, tekrar çalıştırılabilir). `SUPABASE_SERVICE_ROLE_KEY` ve `SEED_ADMIN_ID` gerektirir — service role anahtarı **yalnızca yerelde** kullanılır, hiçbir zaman commit'lenmez veya deploy ortamına eklenmez.

## Deploy

Site **Cloudflare** üzerinde yayınlanır (`output: "standalone"`). Build ortamında tanımlanması gereken değişkenler:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `R2_PUBLIC_BASE_URL`

## Yol haritası

- [x] Villa projelerinin statik dosyalardan Supabase'e taşınması
- [x] Hero, rakam şeridi, harita ve iletişim bilgilerinin admin panelinden yönetilmesi
- [x] ISR ile yeniden deploy gerektirmeyen içerik güncellemesi
- [ ] "Neden TrendEv", "Hakkımızda" gibi sabit sayfaların panelden yönetilmesi (şu an çeviri dosyalarında)
- [ ] Site geneli görsellerin (`public/images/site/`) panelden yüklenebilmesi

## Lisans

Bu proje özel (proprietary) bir projedir; tüm hakları saklıdır.
