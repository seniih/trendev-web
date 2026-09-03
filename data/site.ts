/**
 * Trend Ev — merkezi site sabitleri. TÜM SAYFALAR bu dosyadan besleniyor;
 * marka adı, telefon, adres, e-posta gibi bilgileri değiştirmek için tek
 * yer burasıdır.
 *
 * TrendArsa Yatırım Ofisi'nin "Arsa Sizden Ev Bizden" sisteminin ev/villa
 * projelerini tanıttığı kardeş marka. Telefon, adres ve sosyal medya
 * TrendArsa ile aynı ofisten yürütüldüğü için birebir alındı — bunlar
 * kesinleşmiş, gerçek bilgilerdir.
 *
 * ⚠️ HENÜZ TEYİT EDİLMEMİŞ (aşağıda işaretli iki alan):
 *   - domain / url  → "trendev.net" şu an geçici bir varsayım. Gerçek alan
 *     adınız belli olunca burada değiştirin (satır 20-21).
 *   - email         → şimdilik TrendArsa'nın paylaşılan e-postası kullanılıyor.
 *     TrendEv'e özel bir e-posta istiyorsanız burada değiştirin (satır 24).
 *
 * ⚠️ Bu değerler artık yalnızca **yedek**: gerçek kaynak Supabase'deki
 * `site_settings` tablosu ve admin panelidir (bkz. `data/site-content.ts` →
 * `getSiteInfo`). Buradaki değerler DB'de satır/alan boş olduğunda devreye
 * girer.
 */

export const site = {
  name: "Trend Ev",
  legalName: "Trend Ev Yatırım Ofisi",
  domain: "trendev.net", // ⚠️ TEYİT EDİLMEDİ — gerçek alan adınızı buraya yazın
  url: "https://trendev.net", // ⚠️ TEYİT EDİLMEDİ — yukarıdaki domain ile birlikte güncelleyin
  // Uluslararası biçim (tel: ve wa.me için)
  phoneIntl: "+905541165154",
  phoneDisplay: "+90 554 116 51 54",
  whatsapp: "905541165154",
  email: "trendarsayatirimofisi@gmail.com", // ⚠️ TEYİT EDİLMEDİ — paylaşılan TrendArsa e-postası
  address: {
    line: "Erenler Mah. 1201 Sok. Meydan 54 İş Merkezi, B Blok No:28",
    district: "Erenler",
    city: "Sakarya",
    country: "Türkiye",
    // Erenler / Sakarya yaklaşık konumu (harita için)
    lat: 40.7639,
    lng: 30.4368,
  },
  social: {
    instagram: "https://www.instagram.com/trendarsayatirimofisi/",
    facebook: "https://www.facebook.com/trendarsa.com.tr",
  },
} as const;

/**
 * Önceden doldurulmuş mesajla WhatsApp bağlantısı üretir. Numara verilmezse
 * yukarıdaki statik değer kullanılır; sayfalar admin panelden gelen numarayı
 * (bkz. `data/site-content.ts` → `getSiteInfo`) ikinci parametreyle geçer.
 */
export function whatsappLink(message?: string, whatsapp: string = site.whatsapp): string {
  const base = `https://wa.me/${whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(phoneIntl: string = site.phoneIntl): string {
  return `tel:${phoneIntl}`;
}
