# TrendEv — İçerik Rehberi

Bu dosya, siteye **gerçek fotoğrafları ve gerçek metinleri** nereye ekleyeceğinizi
gösterir.

**Önemli değişiklik:** proje bilgileri (başlık, açıklama, fiyat, kat planı) ve
proje fotoğrafları artık kod dosyalarında değil, **`trend-admin` web panelinde**
düzenleniyor — trendarsa-app (mobil admin) ile aynı ortak veritabanını kullanır,
oradan eklediğiniz bir proje bu sitede de otomatik görünür. Sadece firma
bilgileri (bölüm 2) ve site geneli görseller (bölüm 1) hâlâ bu repodaki
dosyalarda.

Kod dosyalarında değişiklik yaptıktan sonra kontrol etmek için: `npm run dev`
çalıştırıp tarayıcıda `http://localhost:3000` adresini yenileyin.

---

## 1. Site Geneli Fotoğraflar

`public/images/site/` klasörü altında:

| Dosya | Nerede kullanılıyor |
|---|---|
| `hero.jpg` | Ana sayfanın en üstündeki büyük görsel |
| `tanitim-video.jpg` | Ana sayfada "Neden Trend Ev" bölümündeki video/görsel alanı |
| `projeler-haritasi.jpg` | Ana sayfada, istatistiklerin altındaki "Projelerimiz Haritada" bölümü |
| `projeler-baslik.jpg` | Projeler listesi sayfasının üst görseli |
| `hakkimizda-baslik.jpg` | Hakkımızda sayfasının üst görseli |
| `neden-trendev-baslik.jpg` | Neden TrendEv sayfasının üst görseli |
| `iletisim-baslik.jpg` | İletişim sayfasının üst görseli |
| `kurucu.png` | **Zaten eklendi** — kurucunun katalogdan alınan gerçek fotoğrafı, dokunmanıza gerek yok |

Bu görseller eklenmeden önce site o bölgeleri sade koyu-yeşil bir zeminle
gösterir (bozuk resim göstermez) — yani fotoğrafları yavaş yavaş ekleseniz de
site her zaman düzgün görünür.

---

## 2. Firma Bilgileri (isim, telefon, adres, e-posta, sosyal medya)

Dosya: **`data/site.ts`**

Bu dosyanın en üstünde `export const site = { ... }` bloğu var. İçindeki
alanlar:

- `name` → Marka adı ("Trend Ev")
- `legalName` → Tabela/resmi isim ("Trend Ev Yatırım Ofisi")
- `domain`, `url` → Web sitesi adresiniz — ⚠️ şu an geçici `trendev.net`
  yazıyor, gerçek alan adınızı buraya yazmanız gerekiyor
- `phoneDisplay` → Sitede görünen telefon numarası
- `phoneIntl`, `whatsapp` → Aynı numaranın rakamlarla yazılmış hâli (boşluksuz,
  başında ülke kodu `90` ile — "Ara" ve "WhatsApp" butonları bunu kullanır)
- `email` → ⚠️ şu an TrendArsa'nın ortak e-postası yazıyor, TrendEv'e özel bir
  e-posta isterseniz burayı değiştirin
- `address.line`, `address.district`, `address.city` → Adres
- `social.instagram`, `social.facebook` → Sosyal medya linkleri

Değiştirirken sadece tırnak içindeki metni değiştirin, tırnakları (`"..."`) ve
virgülleri silmeyin.

---

## 3. Proje Bilgileri (her projenin adı, açıklaması, fiyatı, oda sayıları, fotoğrafları)

**Artık kod dosyasında değil — `trend-admin` web panelinden düzenlenir.**
Panele girip (giriş bilgileriniz için bana sorun) ilgili projeyi açtığınızda
aşağıdakilerin hepsini oradan değiştirebilirsiniz:

- Başlık, kısa özet, uzun açıklama (Türkçe / İngilizce)
- Öne çıkan maddeler (rozetler)
- Fiyat aralığı, ada-parsel, proje alanı, parsel sayısı/alanı
- Sakarya'ya / İstanbul'a mesafe
- Kat planı (zemin kat / 1. kat / çatı katı) ve oda sayıları
- Kapak fotoğrafı ve galeri fotoğrafları (doğrudan panelden yüklenir, dosya
  adı/klasör kuralı yok)

Panelden kaydettiğiniz bir değişiklik, sitede birkaç dakika içinde otomatik
görünür.

---

## 4. Yeni proje eklemek / proje kaldırmak

Bunlar da `trend-admin` panelinden yapılır — panelde "Yeni Proje" ile
ekleyebilir, mevcut bir projeyi silebilirsiniz. Teknik bir sorun yaşarsanız
bana söyleyin.
