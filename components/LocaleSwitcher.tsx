"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** TR / EN dil değiştirici — mevcut sayfada kalarak dili değiştirir. */
export function LocaleSwitcher({ invert = false }: { invert?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full p-0.5 text-xs font-semibold",
        invert ? "bg-cream/15" : "bg-forest-900/8",
      )}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-3.5 py-2.5 uppercase transition-colors",
              active
                ? "bg-leaf-500 text-forest-950"
                : invert
                  ? "text-cream/70 hover:text-cream"
                  : "text-forest-700 hover:text-forest-900",
            )}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
