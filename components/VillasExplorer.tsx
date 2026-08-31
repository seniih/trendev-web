"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { VillaProject, Locale } from "@/data/villas";
import { VillaCard } from "./VillaCard";
import { Reveal } from "./Reveal";
import { Mascot } from "./Mascot";
import { cn } from "@/lib/utils";

/**
 * İlçeye göre filtrelenebilir proje listesi.
 * `posterExists`, her projenin kapak fotoğrafının gerçekten eklenip
 * eklenmediğini gösterir (Server Component tarafında `imageExists()` ile
 * önceden hesaplanır — bu bileşen Client Component olduğu için dosya
 * sistemine doğrudan bakamaz).
 */
export function VillasExplorer({
  projects,
  locale,
  posterExists,
}: {
  projects: VillaProject[];
  locale: Locale;
  posterExists: Record<string, boolean>;
}) {
  const t = useTranslations("projectsPage");
  const districts = useMemo(
    () => Array.from(new Set(projects.map((p) => p.district))),
    [projects],
  );
  const [district, setDistrict] = useState<string>("all");

  const filtered =
    district === "all"
      ? projects
      : projects.filter((p) => p.district === district);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={district === "all"} onClick={() => setDistrict("all")}>
          {t("all")}
        </FilterChip>
        {districts.map((d) => (
          <FilterChip key={d} active={district === d} onClick={() => setDistrict(d)}>
            {d}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-forest-900/15 bg-sand/60 px-6 py-14 text-center">
          <Mascot variant="peek" alt={t("emptyAlt")} sizes="128px" className="w-28 opacity-90 sm:w-32" />
          <p className="text-ink-soft">{t("empty")}</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <VillaCard project={p} locale={locale} posterExists={posterExists[p.slug] ?? false} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-leaf-500 text-forest-950 shadow-[var(--shadow-leaf)]"
          : "bg-cream text-forest-800 ring-1 ring-forest-900/15 hover:ring-leaf-500",
      )}
    >
      {children}
    </button>
  );
}
