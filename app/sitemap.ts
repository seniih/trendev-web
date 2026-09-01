import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getVillaProjects } from "@/data/villas";
import { routing } from "@/i18n/routing";

const staticPaths = ["", "/projeler", "/neden-trendev", "/hakkimizda", "/iletisim"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getVillaProjects();
  const dynamicPaths = projects.map((p) => `/projeler/${p.slug}`);
  const allPaths = [...staticPaths, ...dynamicPaths];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of allPaths) {
    for (const locale of routing.locales) {
      // TR (varsayılan) prefix'siz, EN /en ile
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      entries.push({
        url: `${site.url}${prefix}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }
  return entries;
}
