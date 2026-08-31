import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Desteklenen diller
  locales: ["tr", "en"],
  // Varsayılan dil: Türkçe (kök URL prefix'siz)
  defaultLocale: "tr",
  // TR prefix'siz (/), EN prefix'li (/en/...)
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
