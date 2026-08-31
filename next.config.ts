import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Tüm görseller public/images altından yerel olarak servis edilir —
  // dış (uzak) görsel kaynağı kullanılmıyor.
};

export default withNextIntl(nextConfig);
