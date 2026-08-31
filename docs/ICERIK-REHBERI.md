# TrendEv — İçerik Rehberi

Bu dosya, siteye **gerçek fotoğrafları ve gerçek metinleri** nereye ekleyeceğinizi
gösterir. Teknik bilgi gerektirmez; sadece doğru dosyayı doğru yere koymanız
yeterli.

Değişiklik yaptıktan sonra kontrol etmek için: `npm run dev` çalıştırıp
tarayıcıda `http://localhost:3000` adresini yenileyin — kod dosyalarındaki
değişiklikler otomatik yansır.

---

## 1. Fotoğraf Ekleme

Tüm fotoğraflar `public/images/` klasörünün altında yaşar. **Dosya adları
aşağıdaki gibi birebir aynı olmalı** (büyük/küçük harf dahil), yoksa site o
fotoğrafı bulamaz ve yerine "Fotoğraf eklenecek" kutusu gösterir. (Bu kutu
sitede zaten var — hangi dosyayı eklemeniz gerektiğini üzerinde yazan yoldan
görebilirsiniz.)

**Önerilen format:** `.jpg`, boyut oranı yaklaşık 4:3 (örn. 1600×1200 px),
dosya boyutu birkaç MB'ı geçmesin (gerekirse sıkıştırın).

### 1a. Her proje için fotoğraf klasörü

Her projenin kendi klasörü var: `public/images/projeler/<proje-kodu>/`

| Proje | Klasör |
|---|---|
| Dağyoncalı (Serdivan) | `public/images/projeler/dagyoncali/` |
| Çubuklu (Serdivan) | `public/images/projeler/cubuklu/` |
| Gölce (Kaynarca) | `public/images/projeler/golce/` |
| Büyükyanık (Kaynarca) | `public/images/projeler/buyukyanik/` |
| Akçakamış (Söğütlü) | `public/images/projeler/akcakamis/` |
| Kusca (Ferizli) | `public/images/projeler/kusca/` |
| Çatalköprü (Akyazı) | `public/images/projeler/catalkopru/` |
| Yuvalak (Akyazı) | `public/images/projeler/yuvalak/` |
| Ahmediye (Karapürçek) | `public/images/projeler/ahmediye/` |
| İkbaliye (Hendek) | `public/images/projeler/ikbaliye/` |
| Sivritepe (Hendek) | `public/images/projeler/sivritepe/` |
| Yarıca (Hendek) | `public/images/projeler/yarica/` |
| Epçeler (Geyve) | `public/images/projeler/epceler/` |
| Kızılkaya (Geyve) | `public/images/projeler/kizilkaya/` |

Her klasörün içine **tam olarak şu isimlerle** dosya koyun:

- `kapak.jpg` → Proje kartında ve detay sayfasında görünen ana/kapak fotoğrafı
- `galeri-1.jpg`, `galeri-2.jpg`, `galeri-3.jpg` → Detay sayfasındaki galeri
  fotoğrafları (3 tane bekleniyor; daha fazla eklemek isterseniz haber verin,
  kodda `galeri-4.jpg` gibi genişletilir)

Örnek: Dağyoncalı projesinin kapak fotoğrafı için dosyanızı şuraya koyun:
`public/images/projeler/dagyoncali/kapak.jpg`

### 1b. Site geneli fotoğraflar

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

## 3. Proje Bilgileri (her projenin adı, açıklaması, fiyatı, oda sayıları)

Dosya: **`data/villas.ts`**

Bu dosyada 14 proje art arda listelenmiş. Her biri `slug: "dagyoncali"` gibi
bir satırla başlıyor — düzenlemek istediğiniz projeyi bu koddan bulun (aynı
kodlar yukarıdaki fotoğraf tablosuyla birebir aynı).

Her projede düzenleyebileceğiniz ana alanlar:

- `title: { tr: "...", en: "..." }` → Proje başlığı (Türkçe / İngilizce)
- `excerpt: { tr: "...", en: "..." }` → Proje kartında görünen kısa (1 cümle)
  özet
- `description: { tr: [...], en: [...] }` → Detay sayfasındaki uzun açıklama.
  Köşeli parantez `[...]` içinde **her paragraf ayrı bir tırnaklı metin**
  olarak yazılır, aralarına virgül konur:
  ```
  description: {
    tr: [
      "Birinci paragraf metni.",
      "İkinci paragraf metni.",
    ],
    ...
  }
  ```
- `highlights: { tr: [...], en: [...] }` → Detay sayfasında küçük rozet
  olarak çıkan kısa maddeler (örn. "Sakarya Üniversitesi 20 dk"). Boş
  bırakmak isterseniz `[]` yazın.
- `priceRangeTRY: { min: 3000000, max: 3500000 }` → Fiyat aralığı (TL, nokta/
  virgül kullanmadan sadece rakam)
- `adaParsel`, `projectAreaM2`, `parcelCount`, `parcelAreaRange` → Ada-parsel,
  proje alanı, parsel sayısı ve parsel alanı gibi resmi rakamlar
- `travelTime: { toSakaryaMin: 10, toIstanbulHour: 1.5 }` → Sakarya'ya kaç
  dakika, İstanbul'a kaç saat
- `floors` → Kat planı (zemin kat / 1. kat / çatı katı, oda sayıları). Bunlar
  zaten kataloğunuzdaki resmi verilerden dolduruldu; bir hata görürseniz
  düzeltebilirsiniz ama genelde dokunmanız gerekmez.

**Dikkat:** Bu dosya kod dosyası olduğu için her satırın sonunda virgül,
her metnin başında/sonunda tırnak işareti olmalı. Bir satırı silerken/
eklerken bu işaretleri bozmamaya dikkat edin. Emin olamadığınız bir
değişikliği bana söylerseniz ben yapabilirim.

---

## 4. Yeni proje eklemek / proje kaldırmak

Bunlar için bana söylemeniz yeterli — `data/villas.ts` içindeki dizi yapısını
bozmadan yeni bir blok eklemek teknik bir işlem, ben hallederim. Siz sadece
fotoğrafları ve metinleri hazırlayın.
