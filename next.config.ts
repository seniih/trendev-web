import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Villa proje görselleri Supabase'den gelen R2 URL'leri — site görselleri
// (hero, ikonlar vb.) hâlâ public/images altından yerel servis ediliyor.
const r2Hostname = process.env.R2_PUBLIC_BASE_URL
  ? new URL(process.env.R2_PUBLIC_BASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2Hostname ? [{ protocol: "https", hostname: r2Hostname }] : [],
  },
};

export default withNextIntl(nextConfig);
