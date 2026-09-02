import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Villa proje görselleri Supabase'den gelen R2 URL'leri — site görselleri
// (hero, ikonlar vb.) hâlâ public/images altından yerel servis ediliyor.
const r2Hostname = process.env.R2_PUBLIC_BASE_URL
  ? new URL(process.env.R2_PUBLIC_BASE_URL).hostname
  : undefined;

// Cloudflare Pages bazı preset'lerde NEXT_EXPORT=1 inject eder ve bu
// next.config.ts'deki output: "standalone" ayarını override eder.
// Bunu silerek Next.js'in config'i doğru okumasını sağlıyoruz.
delete process.env.NEXT_EXPORT;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: r2Hostname ? [{ protocol: "https", hostname: r2Hostname }] : [],
  },
};

export default withNextIntl(nextConfig);
