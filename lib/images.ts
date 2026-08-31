import { existsSync } from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * `public/` klasörü altındaki bir görsel dosyası gerçekten eklenmiş mi?
 * (Build/sunucu tarafında dosya sistemine bakarak kontrol eder — bu yüzden
 * bileşenler bu fonksiyonu Client Component içinde değil, Server Component
 * tarafında çağırmalı.)
 *
 * "http(s)://" ile başlayan dış bağlantılar her zaman "var" kabul edilir.
 */
export function imageExists(publicPath: string | undefined | null): publicPath is string {
  if (!publicPath) return false;
  if (/^https?:\/\//.test(publicPath)) return true;
  if (!publicPath.startsWith("/")) return false;
  return existsSync(path.join(PUBLIC_DIR, publicPath));
}
