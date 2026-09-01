/**
 * ARŞİV — sadece `scripts/seed-supabase.ts` tarafından tek seferlik veri
 * taşıma için kullanılır. Site artık bu dosyayı DEĞİL, Supabase'i okuyor
 * (bkz. `data/villas.ts`). Buradaki `poster`/`gallery` alanları seed script
 * tarafından kasıtlı olarak atlanır — fotoğraflar admin panelden yüklenecek.
 *
 * Kaynak: trendev-web/data/katalog.md (trendarsa-katalog.pdf'in tam dönüşümü).
 * ---------------------------------------------------------------------------
 *
 * Bilinen kaynak tutarsızlıkları (PDF'in kendisinde var, burada düzeltilmedi,
 * sadece not düşüldü — detaylar için katalog.md):
 * - Gölce: başlıkta "125 m²" yazıyor ama kat alanları toplamı (103+77) 180 m².
 * - Büyükyanık: başlıkta "177 m²" yazıyor ama kat alanları toplamı (73+73) 146 m².
 * - Çatalköprü / Yuvalak: başlıkta "160 m²" yazıyor ama kat alanları toplamı
 *   (83+57) 140 m².
 * - Sivritepe: "Parsel Alanları" kutusunda 83 m² yazıyor; bu muhtemelen villa
 *   taban alanı, gerçek parsel ~320 m² civarı olmalı (açıklama metnine göre).
 * - Kusca çatı katı oda listesi PDF'te "2 Yatak Odası, 2 Yatak Odası, Banyo"
 *   şeklinde tekrarlanarak basılmış; burada diğer tüm 57 m² çatı katlarıyla
 *   tutarlı olacak şekilde "2 Yatak Odası, Banyo" olarak normalize edildi.
 */

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
  /** Broşürde basılı villa tipi başlığı (bkz. dosya başındaki tutarsızlık notu) */
  totalAreaM2: number;
  floors: VillaFloor[];
  travelTime: { toSakaryaMin: number; toIstanbulHour: number };
  highlights: Record<Locale, string[]>;
  excerpt: Record<Locale, string>;
  description: Record<Locale, string[]>;
  poster: string;
  gallery: string[];
}

/**
 * Bir projenin fotoğraflarının bulunması gereken sabit yolları üretir.
 * Gerçek dosyaları `public/images/projeler/<slug>/` altına, tam bu isimlerle
 * eklemeniz yeterlidir (bkz. ICERIK-REHBERI.md). Dosya henüz eklenmemişse
 * sitede otomatik olarak "Fotoğraf eklenecek" kutusu gösterilir.
 */
function projectImages(slug: string, galleryCount = 3) {
  return {
    poster: `/images/projeler/${slug}/kapak.jpg`,
    gallery: Array.from(
      { length: galleryCount },
      (_, i) => `/images/projeler/${slug}/galeri-${i + 1}.jpg`,
    ),
  };
}

export const villaProjects: VillaProject[] = [
  {
    slug: "dagyoncali",
    featured: true,
    status: "available",
    title: { tr: "Dağyoncalı Projesi", en: "Dağyoncalı Project" },
    district: "Serdivan",
    neighborhood: "Dağyoncalı",
    city: "Sakarya",
    adaParsel: "5210 - 479/480",
    projectAreaM2: 610,
    parcelCount: 12,
    parcelKind: "villa",
    parcelAreaRange: { min: 500, max: 600 },
    priceRangeTRY: { min: 3_000_000, max: 3_500_000 },
    totalAreaM2: 180,
    floors: [
      {
        key: "ground",
        areaM2: 103,
        outdoor: { kind: "veranda", areaM2: 28 },
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "livingRoom", count: 1 },
          { key: "kitchen", count: 1 },
          { key: "hall", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "first",
        areaM2: 77,
        rooms: [
          { key: "bedroom", count: 3 },
          { key: "masterBathroom", count: 1 },
          { key: "dressingRoom", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 10, toIstanbulHour: 1.5 },
    highlights: {
      tr: [
        "Adatıp Hastanesi 10 dk",
        "Serdivan'daki AVM'ler 12 dk",
        "Sakarya Üniversitesi 20 dk",
        "Sapanca Gölü 20 dk",
      ],
      en: [
        "Adatıp Hospital 10 min",
        "Serdivan malls 12 min",
        "Sakarya University 20 min",
        "Lake Sapanca 20 min",
      ],
    },
    excerpt: {
      tr: "Serdivan'ın en özel lokasyonunda; yeşillikler içinde, bahçeli ve havuzlu villa fırsatı.",
      en: "A gardened, pool villa opportunity in Serdivan's most exclusive location, surrounded by greenery.",
    },
    description: {
      tr: [
        "Şehrin gürültüsünden uzak, doğayla iç içe müstakil villa hayatına hazır mısın?",
        "Serdivan'ın en özel lokasyonunda; yeşillikler içinde, bahçeli ve havuzlu villa fırsatı seni bekliyor. Üstelik TrendEv güvencesiyle maliyetine sahip olma imkânı!",
        "Akşam evine ulaştığında… Yıldızların altında havuzuna girip kahveni yudumlarken günün yorgunluğunu geride bırak. Seçkin komşuların ve prestijli yaşamın buluştuğu bu özel projede, sen de yerini hemen al.",
      ],
      en: [
        "Ready for a detached villa life, away from the city noise and immersed in nature?",
        "In Serdivan's most exclusive location, a gardened, pool villa opportunity awaits among the greenery — with TrendEv's assurance, at cost price.",
        "Come home in the evening, slip into your pool under the stars and leave the day's fatigue behind. Take your place in a project where distinguished neighbors and a prestigious lifestyle meet.",
      ],
    },
    ...projectImages("dagyoncali"),
  },
  {
    slug: "cubuklu",
    featured: false,
    status: "available",
    title: { tr: "Çubuklu Projesi", en: "Çubuklu Project" },
    district: "Serdivan",
    neighborhood: "Çubuklu",
    city: "Sakarya",
    adaParsel: "2295-55",
    projectAreaM2: 2976,
    parcelCount: 10,
    parcelKind: "villa",
    parcelAreaRange: { min: 500, max: 500 },
    priceRangeTRY: { min: 4_750_000, max: 6_500_000 },
    totalAreaM2: 203,
    floors: [
      {
        key: "ground",
        areaM2: 105,
        outdoor: { kind: "veranda", areaM2: 28 },
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "livingRoom", count: 1 },
          { key: "kitchen", count: 1 },
          { key: "hall", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "first",
        areaM2: 98,
        rooms: [
          { key: "bedroom", count: 3 },
          { key: "masterBathroom", count: 1 },
          { key: "dressingRoom", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 10, toIstanbulHour: 1.5 },
    highlights: {
      tr: [
        "Kırantepe'de yamaç paraşütü",
        "Serdivan Gölpark'ta keyifli zamanlar",
        "Doğa yürüyüşleri ve kamp rotaları",
      ],
      en: [
        "Paragliding at Kırantepe",
        "Leisure time at Serdivan Gölpark",
        "Nature walking and camping routes",
      ],
    },
    excerpt: {
      tr: "Sakarya'nın yıldızı parlayan bölgesi Çubuklu'da, şehre yakın ama karmaşasından uzak bir yaşam.",
      en: "In Çubuklu, Sakarya's rising star district — close to the city yet far from its chaos.",
    },
    description: {
      tr: [
        "Sakarya'nın yıldızı parlayan bölgesi: ÇUBUKLU. Şehrin hemen yanında… Ama şehrin karmaşasından kilometrelerce uzak bir his.",
        "Serdivan'a bağlı Çubuklu Mahallesi; doğası, temiz havası ve gelişen yapısıyla son dönemde yatırımcıların radarına girmiş durumda. İmar gelişimiyle değer kazanan bölge, ormanla iç içe huzurlu yaşam isteyenlerin yeni gözdesi oluyor.",
        "Hem yatırım yapabileceğiniz, hem de nefes alabileceğiniz özel bir lokasyon. Bugün keşfedenler, yarının avantajını yakalıyor.",
      ],
      en: [
        "Çubuklu is Sakarya's rising star district — right next to the city, yet miles away in feeling from its chaos.",
        "Part of Serdivan, Çubuklu has recently caught investors' attention with its nature, clean air and growing infrastructure. Gaining value with zoning development, it's becoming the new favorite for those seeking a peaceful life close to the forest.",
        "A special location for both investment and fresh air — those who discover it today capture tomorrow's advantage.",
      ],
    },
    ...projectImages("cubuklu"),
  },
  {
    slug: "golce",
    featured: false,
    status: "available",
    title: { tr: "Gölce Projesi", en: "Gölce Project" },
    district: "Kaynarca",
    neighborhood: "Gölce",
    city: "Sakarya",
    adaParsel: "961-400",
    projectAreaM2: 7500,
    parcelCount: 10,
    parcelKind: "villa",
    parcelAreaRange: { min: 375, max: 885 },
    priceRangeTRY: { min: 1_800_000, max: 3_500_000 },
    totalAreaM2: 125,
    floors: [
      {
        key: "ground",
        areaM2: 103,
        outdoor: { kind: "veranda", areaM2: 28 },
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "livingRoom", count: 1 },
          { key: "kitchen", count: 1 },
          { key: "hall", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "first",
        areaM2: 77,
        rooms: [
          { key: "bedroom", count: 3 },
          { key: "masterBathroom", count: 1 },
          { key: "dressingRoom", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 10, toIstanbulHour: 1.5 },
    highlights: { tr: [], en: [] },
    excerpt: {
      tr: "Kaynarca Gölce'de, doğanın kalbinde yeşillikler içinde bahçeli villa fırsatı.",
      en: "A gardened villa opportunity amid greenery in the heart of nature, Kaynarca Gölce.",
    },
    description: {
      tr: [
        "Şehrin gürültüsünden uzak, doğayla iç içe müstakil villa hayatına hazır mısın?",
        "Kaynarca Gölce'de, doğanın kalbinde; yeşillikler içinde, bahçeli villa fırsatı seni bekliyor. Üstelik TrendEv güvencesiyle maliyetine sahip olma imkânı!",
        "Günün yorgunluğunu, akşam yıldızların altında kendi havuzunda at… Kahveni yudumlarken doğanın sessizliğini hisset. Seçkin komşularla prestijli bir yaşam için şimdi yerini al!",
      ],
      en: [
        "Ready for a detached villa life, away from the city noise and immersed in nature?",
        "In the heart of nature at Kaynarca Gölce, a gardened villa opportunity awaits among the greenery — with TrendEv's assurance, at cost price.",
        "Shake off the day's fatigue in your own pool under the evening stars… sip your coffee and feel nature's silence. Take your place now for a prestigious life among distinguished neighbors.",
      ],
    },
    ...projectImages("golce"),
  },
  {
    slug: "buyukyanik",
    featured: false,
    status: "available",
    title: { tr: "Büyükyanık Projesi", en: "Büyükyanık Project" },
    district: "Kaynarca",
    neighborhood: "Büyükyanık",
    city: "Sakarya",
    adaParsel: "110-30",
    projectAreaM2: 5640,
    parcelCount: 18,
    parcelKind: "villa",
    parcelAreaRange: { min: 600, max: 600 },
    priceRangeTRY: { min: 2_000_000, max: 3_500_000 },
    totalAreaM2: 177,
    floors: [
      {
        key: "ground",
        areaM2: 73,
        outdoor: { kind: "veranda", areaM2: 18 },
        rooms: [
          { key: "room", count: 1 },
          { key: "livingRoom", count: 1 },
          { key: "kitchen", count: 1 },
          { key: "hall", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "first",
        areaM2: 73,
        outdoor: { kind: "terrace", areaM2: 11 },
        rooms: [
          { key: "bedroom", count: 3 },
          { key: "masterBathroom", count: 1 },
          { key: "dressingRoom", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 30, toIstanbulHour: 2 },
    highlights: {
      tr: [
        "Karasu'ya Denizköy Plajı 12 km",
        "Acarlar Longozu 12 km",
        "Müstakil yaşam ve arsa yatırımı için yükselen bölge",
      ],
      en: [
        "Denizköy Beach in Karasu 12 km",
        "Acarlar Floodplain Forest 12 km",
        "A rising district for detached living and land investment",
      ],
    },
    excerpt: {
      tr: "Sakarya'nın yükselen huzur noktası Büyükyanık'ta, Karadeniz kültürüyle yeşilin buluştuğu özel bir lokasyon.",
      en: "Büyükyanık, Sakarya's rising point of peace — where Black Sea culture meets green tranquility.",
    },
    description: {
      tr: [
        "Sakarya'nın yükselen huzur noktası: BÜYÜKYANIK. Şehrin stresinden uzak… Doğanın tam içinde, sakin ve gerçek bir yaşam.",
        "Kaynarca'ya bağlı Büyükyanık Mahallesi; Karadeniz kültürünün sıcaklığını, yeşilin huzuruyla birleştiren özel bir lokasyon olarak dikkat çekiyor.",
        "Bahçeli yaşam hayali kuranlar, şehirden uzaklaşıp nefes almak isteyenler ve doğru lokasyonda yatırım arayanlar için bölgenin değeri her geçen gün artıyor. Hem huzurlu bir yaşam, hem de geleceğe değer katacak güçlü bir yatırım fırsatı.",
      ],
      en: [
        "Büyükyanık is Sakarya's rising point of peace — far from city stress, a calm and genuine life right in the middle of nature.",
        "Part of Kaynarca, Büyükyanık stands out as a special location that blends the warmth of Black Sea culture with the peace of greenery.",
        "For those dreaming of a gardened life, wanting to get away from the city, or looking for the right investment location, the district's value keeps rising — a peaceful life and a strong investment opportunity for the future.",
      ],
    },
    ...projectImages("buyukyanik"),
  },
  {
    slug: "akcakamis",
    featured: false,
    status: "available",
    title: { tr: "Akçakamış Projesi", en: "Akçakamış Project" },
    district: "Söğütlü",
    neighborhood: "Akçakamış",
    city: "Sakarya",
    adaParsel: "0-2104/2105",
    projectAreaM2: 8000,
    parcelCount: 12,
    parcelKind: "villa",
    parcelAreaRange: { min: 650, max: 650 },
    priceRangeTRY: { min: 2_500_000, max: 3_000_000 },
    totalAreaM2: 160,
    floors: [
      {
        key: "ground",
        areaM2: 103,
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "livingRoom", count: 1 },
          { key: "kitchen", count: 1 },
          { key: "hall", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "first",
        areaM2: 57,
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 30, toIstanbulHour: 1.5 },
    highlights: { tr: [], en: [] },
    excerpt: {
      tr: "Akçakamış'ın eşsiz doğasında, yeşilin her tonunu ve huzurun en sade halini bulacağınız bir yaşam.",
      en: "In Akçakamış's unique nature, a life where you'll find every shade of green and the simplest form of peace.",
    },
    description: {
      tr: [
        "Akçakamış'ın eşsiz doğasında, yeşilin her tonunu ve huzurun en sade halini bulacağınız bir yaşam sizi bekliyor. Şehrin karmaşasından uzak, kuş sesleri ve temiz havayla çevrili bu özel bölgede, doğayla iç içe bir hayatın kapılarını aralayın.",
        "Her anı dinginlik ve konforla buluşturan bu yaşam alanı; sadece bir yatırım değil, aynı zamanda kendinize ve sevdiklerinize armağan edeceğiniz değerli bir gelecek sunar. Ömrünüze ömür katacak mekanlar için, Akçakamış'ta yeni bir başlangıç yapın.",
      ],
      en: [
        "In Akçakamış's unique nature, a life awaits where you'll find every shade of green and the simplest form of peace — away from city chaos, surrounded by birdsong and clean air.",
        "This living space brings stillness and comfort together in every moment; it's not just an investment but a valuable future you give to yourself and your loved ones. Make a fresh start in Akçakamış.",
      ],
    },
    ...projectImages("akcakamis"),
  },
  {
    slug: "kusca",
    featured: true,
    status: "available",
    title: { tr: "Kusca Projesi", en: "Kusca Project" },
    district: "Ferizli",
    neighborhood: "Kusca",
    city: "Sakarya",
    adaParsel: "106-44/45",
    projectAreaM2: 9400,
    parcelCount: 12,
    parcelKind: "villa",
    parcelAreaRange: { min: 600, max: 890 },
    priceRangeTRY: { min: 2_500_000, max: 4_000_000 },
    totalAreaM2: 160,
    floors: [
      {
        key: "ground",
        areaM2: 103,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "hall", count: 1 },
        ],
      },
      {
        key: "roof",
        areaM2: 57,
        // Kaynak PDF'te "2 Yatak Odası, 2 Yatak Odası, Banyo" olarak tekrarlı
        // basılmış — diğer 57 m² çatı katlarıyla tutarlı biçimde normalize edildi.
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 28, toIstanbulHour: 1.5 },
    highlights: {
      tr: ["Sakarya merkeze 40 km", "İstanbul'a 150 km"],
      en: ["40 km to Sakarya center", "150 km to Istanbul"],
    },
    excerpt: {
      tr: "Ferizli Kusca'da, doğanın kalbinde yükselen 12 özel villa parseliyle yeni bir yaşam.",
      en: "A new life on 12 exclusive villa plots rising in the heart of nature, Ferizli Kusca.",
    },
    description: {
      tr: [
        "Eskiden köyden şehre göç vardı. Şimdi şehirden doğaya kaçış var.",
        "Ferizli Kusca'da, doğanın kalbinde yükselen 12 özel villa parseliyle yeni bir yaşam sizi bekliyor. Şehrin gürültüsünden uzak, temiz hava, yeşilin her tonu ve huzurun gerçek hali burada.",
        "Tüm altyapısı hazır, yapı ruhsatı alınmış bu arsalarla vakit kaybetmeden hayalinizi kurmaya başlayabilirsiniz. Üstelik ekstra proje masrafı olmadan, ister bizimle ister dilediğiniz firmayla hemen inşaata geçin.",
      ],
      en: [
        "Once people migrated from village to city. Now there's an escape from city to nature.",
        "In Ferizli Kusca, a new life awaits on 12 exclusive villa plots rising in the heart of nature — clean air, every shade of green and real peace, far from city noise.",
        "With infrastructure ready and building permits obtained, you can start building your dream without wasting time — with no extra project cost, start construction right away, with us or any firm you choose.",
      ],
    },
    ...projectImages("kusca"),
  },
  {
    slug: "catalkopru",
    featured: false,
    status: "available",
    title: { tr: "Çatalköprü Projesi", en: "Çatalköprü Project" },
    district: "Akyazı",
    neighborhood: "Çatalköprü",
    city: "Sakarya",
    adaParsel: "113-32/33",
    projectAreaM2: 7500,
    parcelCount: 12,
    parcelKind: "villa",
    parcelAreaRange: { min: 535, max: 535 },
    priceRangeTRY: { min: 1_900_000, max: 2_500_000 },
    totalAreaM2: 160,
    floors: [
      {
        key: "ground",
        areaM2: 83,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "first",
        areaM2: 57,
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 30, toIstanbulHour: 1.5 },
    highlights: { tr: [], en: [] },
    excerpt: {
      tr: "İstanbul'a 1,5 saat mesafede, Akyazı'nın yemyeşil doğasında bahçeli eve maliyetine sahip olma fırsatı.",
      en: "A chance to own a garden home at cost price in Akyazı's lush nature, 1.5 hours from Istanbul.",
    },
    description: {
      tr: [
        "İstanbul'a 1.5 Saat Mesafede Bahçeli Eve Maliyetine Sahip Olma Fırsatı.",
        "Akyazı'nın yemyeşil doğasında, kuş sesleri ve temiz havayla çevrili ayrıcalıklı bir yaşam sizi bekliyor. Her biri 535 m² olan 12 villa parseliyle hem ferah hem özgür bir yaşam alanına sahip olabilirsiniz. İstanbul'a sadece 1,5 saat, Sakarya merkeze 20 dakika mesafede.",
        "Modern yaşamın konforunu, doğanın huzuruyla birleştiren bu özel fırsat; ister yaşamak ister yatırım yapmak isteyenler için ideal.",
      ],
      en: [
        "A chance to own a garden home at cost price, 1.5 hours from Istanbul.",
        "In Akyazı's lush nature, a privileged life surrounded by birdsong and clean air awaits. With 12 villa plots of 535 m² each, you can have a spacious, free living space — just 1.5 hours from Istanbul and 20 minutes from central Sakarya.",
        "This special opportunity, combining modern comfort with nature's peace, is ideal for both living and investing.",
      ],
    },
    ...projectImages("catalkopru"),
  },
  {
    slug: "yuvalak",
    featured: false,
    status: "available",
    title: { tr: "Yuvalak Projesi", en: "Yuvalak Project" },
    district: "Akyazı",
    neighborhood: "Yuvalak",
    city: "Sakarya",
    adaParsel: "0-108/112/113",
    projectAreaM2: 13800,
    parcelCount: 16,
    parcelKind: "villa",
    parcelAreaRange: { min: 375, max: 930 },
    priceRangeTRY: { min: 1_750_000, max: 3_500_000 },
    totalAreaM2: 160,
    floors: [
      {
        key: "ground",
        areaM2: 83,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "roof",
        areaM2: 57,
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 28, toIstanbulHour: 1.5 },
    highlights: {
      tr: ["Akyazı merkeze 3 km"],
      en: ["3 km to central Akyazı"],
    },
    excerpt: {
      tr: "Akyazı Yuvalak'ta ruhsatı hazır, imarlı arsa üzerinde İstanbul'a yakın bahçeli ev fırsatı.",
      en: "A ready-permitted, zoned garden home opportunity close to Istanbul, in Akyazı Yuvalak.",
    },
    description: {
      tr: [
        "İstanbul'a Yakın Bahçeli Ev, Ruhsat, Proje, Uğraş Yok… Yaşama Hazır!",
        "Akyazı Yuvalak Mahallesi'nde yer alan Parsel 113 üzerindeki toplam 6.700 m²'lik imarlı arsa, ev yapacaklar için mükemmel bir fırsat sunuyor. Proje kapsamında 6 adet kat irtifaklı villa parseli, Akyazı merkeze 3 km, İstanbul'a sadece 1,5 saat ve Sakarya merkezine ise 30 dakika uzaklıkta yer alıyor.",
        "Modern konforla doğal yaşamı birleştiren bu yatırım fırsatı, yaz gelmeden değerlendirmenize değer.",
      ],
      en: [
        "A garden home close to Istanbul — no permit hassle, no project hassle. Ready to live in!",
        "The 6,700 m² zoned land on Parcel 113 in Akyazı Yuvalak offers an excellent opportunity for those who want to build a home. The project includes 6 villa plots with floor-ownership deeds, 3 km from central Akyazı, just 1.5 hours from Istanbul and 30 minutes from central Sakarya.",
        "An investment opportunity worth evaluating before summer, combining modern comfort with natural living.",
      ],
    },
    ...projectImages("yuvalak"),
  },
  {
    slug: "ahmediye",
    featured: false,
    status: "available",
    title: { tr: "Ahmediye Projesi", en: "Ahmediye Project" },
    district: "Karapürçek",
    neighborhood: "Ahmediye",
    city: "Sakarya",
    adaParsel: "121-101/102",
    projectAreaM2: 5820,
    parcelCount: 12,
    parcelKind: "villa",
    parcelAreaRange: { min: 420, max: 420 },
    priceRangeTRY: { min: 1_750_000, max: 2_500_000 },
    totalAreaM2: 83,
    floors: [
      {
        key: "ground",
        areaM2: 83,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 35, toIstanbulHour: 1.5 },
    highlights: {
      tr: ["Karapürçek merkeze 7 km", "Sakarya merkeze 37 km", "İstanbul'a sadece 50 km"],
      en: ["7 km to central Karapürçek", "37 km to central Sakarya", "Only 50 km to Istanbul"],
    },
    excerpt: {
      tr: "Karapürçek Ahmediye'de, altyapısı tamamlanmış, ruhsatı hazır tek katlı bahçeli ev fırsatı.",
      en: "A single-story garden home opportunity with completed infrastructure and ready permits in Karapürçek Ahmediye.",
    },
    description: {
      tr: [
        "Hazır Ev Alma Devri Bitti! Maliyetine Bahçeli Ev Fırsatı…",
        "Karapürçek Ahmediye'de doğayla iç içe, planlı ve hazır bir yaşam fırsatı! 121 Ada 101 & 102 Parsel üzerinde konumlanan proje, 420 m² arsa içinde 83 m² ev projesine uygun 12 parsel sizleri bekliyor.",
        "Tüm altyapısı tamamlanmış, yapı ruhsatı hazır bu projede zaman kaybetmeden hayalinizdeki evi inşa edebilirsiniz.",
      ],
      en: [
        "The era of buying a ready-made home is over! A garden home opportunity at cost price…",
        "A planned, ready-to-build life amid nature in Karapürçek Ahmediye! Located on Block 121, Parcels 101 & 102, the project offers 12 plots of 420 m² each, suited to an 83 m² home design.",
        "With infrastructure fully completed and the building permit ready, you can build your dream home in this project without wasting any time.",
      ],
    },
    ...projectImages("ahmediye"),
  },
  {
    slug: "ikbaliye",
    featured: false,
    status: "available",
    title: { tr: "İkbaliye Projesi", en: "İkbaliye Project" },
    district: "Hendek",
    neighborhood: "İkbaliye",
    city: "Sakarya",
    adaParsel: "2965-42/43",
    projectAreaM2: 3900,
    parcelCount: 12,
    parcelKind: "twinVilla",
    parcelAreaRange: { min: 300, max: 300 },
    priceRangeTRY: { min: 1_700_000, max: 2_500_000 },
    totalAreaM2: 83,
    floors: [
      {
        key: "ground",
        areaM2: 83,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 28, toIstanbulHour: 1.5 },
    highlights: { tr: [], en: [] },
    excerpt: {
      tr: "Hendek İkbaliye'de, doğanın kalbinde 12 parselli ikiz villa arazisi.",
      en: "A 12-plot twin-villa land in the heart of nature, Hendek İkbaliye.",
    },
    description: {
      tr: [
        "Hazır Ev Alma Devri Bitti! Maliyetine Bahçeli Ev Fırsatı…",
        "Hendek İkbaliye'de, doğanın kalbinde yeni bir yaşam başlıyor. Kuş sesleriyle uyanacağınız, gökyüzünün derin maviliği ve yemyeşil doğanın içinde huzuru hissedeceğiniz özel bir alan.",
        "Şehrin karmaşasından uzak ama ihtiyaç duyduğunuz her yere yakın bu 12 parselli ikiz villa arazisi, size sade, sakin ve gerçek bir yaşam sunuyor.",
      ],
      en: [
        "The era of buying a ready-made home is over! A garden home opportunity at cost price…",
        "A new life begins in the heart of nature, Hendek İkbaliye. A special place where you'll wake to birdsong and feel peace amid deep blue skies and lush greenery.",
        "Far from city chaos yet close to everything you need, this 12-plot twin-villa land offers a simple, calm and genuine life.",
      ],
    },
    ...projectImages("ikbaliye"),
  },
  {
    slug: "sivritepe",
    featured: false,
    status: "available",
    title: { tr: "Sivritepe Projesi", en: "Sivritepe Project" },
    district: "Hendek",
    neighborhood: "Sivritepe",
    city: "Sakarya",
    adaParsel: "116-67/68",
    projectAreaM2: 4150,
    parcelCount: 12,
    parcelKind: "villa",
    // Bkz. dosya başındaki not: broşür kutusunda 83 m² yazıyor, muhtemelen
    // villa taban alanı — açıklama metnine göre gerçek parsel ~320 m².
    parcelAreaRange: { min: 83, max: 83 },
    priceRangeTRY: { min: 1_500_000, max: 2_000_000 },
    totalAreaM2: 83,
    floors: [
      {
        key: "ground",
        areaM2: 83,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 30, toIstanbulHour: 1.5 },
    highlights: {
      tr: ["Altyapı hazır", "Ruhsat alınmış", "İnşaata hemen uygun"],
      en: ["Infrastructure ready", "Permit obtained", "Ready for immediate construction"],
    },
    excerpt: {
      tr: "Hendek Sivritepe'de, İstanbul'a yakın, 320 m² arsa içinde 83 m² villa projesiyle bahçeli ev hayali.",
      en: "A garden home dream in Hendek Sivritepe — an 83 m² villa on a 320 m² plot, close to Istanbul.",
    },
    description: {
      tr: [
        "Hendek Sivritepe'de, İstanbul'a yakın bahçeli ev hayalin gerçeğe dönüşüyor!",
        "Doğanın kalbinde, sessiz ve huzurlu bir yaşam sunan projede; 320 m² arsa içinde 83 m² villa projesi 12 parsel seni bekliyor.",
        "TrendEv güvencesiyle, hayalindeki evi dilediğin gibi inşa et. Hafta sonu kaçışın değil, yeni yaşamın olsun!",
      ],
      en: [
        "In Hendek Sivritepe, your garden home dream close to Istanbul becomes reality!",
        "In a project offering a quiet, peaceful life in the heart of nature, 12 plots await you — each an 83 m² villa on a 320 m² lot.",
        "With TrendEv's assurance, build the home of your dreams as you wish. Let it be your new life, not just a weekend escape!",
      ],
    },
    ...projectImages("sivritepe"),
  },
  {
    slug: "yarica",
    featured: false,
    status: "available",
    title: { tr: "Yarıca Projesi", en: "Yarıca Project" },
    district: "Hendek",
    neighborhood: "Yarıca",
    city: "Sakarya",
    adaParsel: "2233-21",
    projectAreaM2: 9173,
    parcelCount: 6,
    parcelKind: "villa",
    parcelAreaRange: { min: 1150, max: 2000 },
    priceRangeTRY: { min: 2_450_000, max: 3_000_000 },
    totalAreaM2: 160,
    floors: [
      {
        key: "ground",
        areaM2: 103,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "roof",
        areaM2: 57,
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 30, toIstanbulHour: 1.5 },
    highlights: { tr: [], en: [] },
    excerpt: {
      tr: "Hendek Yarıca'da, eşsiz doğanın kalbinde huzurlu ve verimli bir yaşam için son fırsat.",
      en: "A last chance for a peaceful, fruitful life in the heart of unique nature, Hendek Yarıca.",
    },
    description: {
      tr: [
        "Hayalinizdeki müstakil villaya MALİYETİNE sahip olmak için SON FIRSAT.",
        "Hendek Yarıca'da, eşsiz doğanın kalbinde; huzurlu, sakin ve verimli bir yaşam sizi bekliyor. Toplam 6 parselden oluşan projede, her biri 160 m² villa için planlanan alanlar yer almakta olup; tüm altyapı çalışmaları tamamlanmış, ruhsat süreçleri sonuçlandırılmış ve inşaata hazır hale getirilmiştir.",
        "Hayalinizdeki yaşam için doğru yer, doğru zaman.",
      ],
      en: [
        "LAST CHANCE to own your dream detached villa at cost price.",
        "In the heart of unique nature, Hendek Yarıca offers a peaceful, calm and fruitful life. The project consists of 6 plots, each planned for a 160 m² villa; all infrastructure work is complete, permit processes finalized, and the site is ready for construction.",
        "The right place, the right time for the life of your dreams.",
      ],
    },
    ...projectImages("yarica"),
  },
  {
    slug: "epceler",
    featured: true,
    status: "available",
    title: { tr: "Epçeler Projesi", en: "Epçeler Project" },
    district: "Geyve",
    neighborhood: "Epçeler",
    city: "Sakarya",
    adaParsel: "736-15/29",
    projectAreaM2: 6450,
    parcelCount: 11,
    parcelKind: "villa",
    parcelAreaRange: { min: 375, max: 700 },
    priceRangeTRY: { min: 2_300_000, max: 3_500_000 },
    totalAreaM2: 100,
    floors: [
      {
        key: "ground",
        areaM2: 50,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "roof",
        areaM2: 50,
        rooms: [
          { key: "bedroom", count: 3 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 28, toIstanbulHour: 1.5 },
    highlights: { tr: [], en: [] },
    excerpt: {
      tr: "3+1 daire fiyatına, Geyve Boğazı'nda kendi müstakil villana sahip olma fırsatı.",
      en: "A chance to own your own detached villa in Geyve Boğazı, for the price of a 3-bedroom flat.",
    },
    description: {
      tr: [
        "3+1 daire fiyatına kendi müstakil villana sahip olmak ister misin?",
        "Geyve Boğazı'nın eşsiz atmosferinde, Türkiye'nin en temiz hava koridorlarından birinde konumlanan 6 özel villa arsası ile hayalleriniz gerçeğe dönüşüyor. Şehrin karmaşasından uzak, kuş sesleri ve doğanın ritmiyle uyanacağınız bir yaşam alanı…",
        "Ömrünüze ömür katacak, her anı keyifle yaşayacağınız bu eşsiz fırsatı kaçırmayın…",
      ],
      en: [
        "Would you like to own your own detached villa for the price of a 3-bedroom flat?",
        "In the unique atmosphere of Geyve Boğazı, located in one of Turkey's cleanest air corridors, 6 exclusive villa plots turn your dreams into reality — a living space far from city chaos, where you'll wake to birdsong and nature's rhythm.",
        "Don't miss this unique opportunity that will add years to your life and joy to every moment.",
      ],
    },
    ...projectImages("epceler"),
  },
  {
    slug: "kizilkaya",
    featured: true,
    status: "available",
    title: { tr: "Kızılkaya Projesi", en: "Kızılkaya Project" },
    district: "Geyve",
    neighborhood: "Kızılkaya",
    city: "Sakarya",
    adaParsel: "102-27/28/29",
    projectAreaM2: 15000,
    parcelCount: 22,
    parcelKind: "villa",
    parcelAreaRange: { min: 500, max: 770 },
    priceRangeTRY: { min: 1_500_000, max: 2_500_000 },
    totalAreaM2: 160,
    floors: [
      {
        key: "ground",
        areaM2: 103,
        outdoor: { kind: "veranda" },
        rooms: [
          { key: "livingRoom", count: 1 },
          { key: "bedroom", count: 2 },
          { key: "kitchen", count: 1 },
          { key: "bathroom", count: 1 },
        ],
      },
      {
        key: "roof",
        areaM2: 57,
        rooms: [
          { key: "bedroom", count: 2 },
          { key: "bathroom", count: 1 },
        ],
      },
    ],
    travelTime: { toSakaryaMin: 30, toIstanbulHour: 1.5 },
    highlights: { tr: [], en: [] },
    excerpt: {
      tr: "Geyve Kızılkaya'da, Türkiye'nin en temiz hava koridorlarından birinde yükselen 16 özel villa.",
      en: "16 exclusive villas rising in one of Turkey's cleanest air corridors, Geyve Kızılkaya.",
    },
    description: {
      tr: [
        "İstanbul'u Yaşayan Anlar… Doğaya Kaçış İçin Bahçeli Ev Fırsatı.",
        "Geyve Boğazı'nın tertemiz havası ve eşsiz tabiatı içinde konumlanan 16 özel villa, huzur, konfor ve doğallığı bir arada sunuyor. Şehrin gürültüsünden uzak ama hayata bir o kadar yakın bu özel proje, her sabah kuş sesleriyle uyanacak, gün boyu doğanın enerjisini hissedeceksiniz.",
        "Ömrünüze ömür katacak bir yaşam için doğru yerdesiniz. Geyve Kızılkaya'da yükselen bu ayrıcalıklı yaşam fırsatını kaçırmayın.",
      ],
      en: [
        "Moments living Istanbul… A garden home opportunity for an escape to nature.",
        "Situated in the pristine air and unique nature of Geyve Boğazı, 16 exclusive villas offer peace, comfort and naturalness together. Far from city noise yet just as close to life, this special project lets you wake to birdsong every morning and feel nature's energy all day.",
        "You're in the right place for a life that adds years to your years. Don't miss this privileged living opportunity rising in Geyve Kızılkaya.",
      ],
    },
    ...projectImages("kizilkaya"),
  },
];

export function getVillaProjects(): VillaProject[] {
  return villaProjects;
}

export function getFeaturedVillaProjects(): VillaProject[] {
  return villaProjects.filter((p) => p.featured);
}

export function getVillaProject(slug: string): VillaProject | undefined {
  return villaProjects.find((p) => p.slug === slug);
}
