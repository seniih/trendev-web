import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Maximize, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { VillaProject, Locale } from "@/data/villas";
import { formatPriceTRY } from "@/lib/utils";
import { Badge } from "./ui";
import { ImagePlaceholder } from "./ImagePlaceholder";

/**
 * `posterExists` bir Server Component tarafında `imageExists()` ile önceden
 * hesaplanıp buraya aktarılır — bu bileşen (bazı yerlerde bir Client
 * Component'in içinden render edildiği için) doğrudan dosya sistemine
 * bakamaz.
 */
export function VillaCard({
  project,
  locale,
  posterExists,
}: {
  project: VillaProject;
  locale: Locale;
  posterExists: boolean;
}) {
  const t = useTranslations("common");

  const statusTone =
    project.status === "available"
      ? "green"
      : project.status === "reserved"
        ? "gold"
        : "muted";
  const statusLabel =
    project.status === "available"
      ? t("available")
      : project.status === "reserved"
        ? t("reserved")
        : t("sold");

  return (
    <Link
      href={`/projeler/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest-900/10 bg-cream shadow-[0_2px_20px_-12px_rgba(6,26,16,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:border-leaf-500/40 hover:shadow-cine"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {posterExists ? (
          <Image
            src={project.poster!}
            alt={project.title[locale]}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
          />
        ) : (
          <ImagePlaceholder path={project.poster} />
        )}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Badge tone={statusTone}>{statusLabel}</Badge>
          <Badge tone="gold">{project.totalAreaM2} m²</Badge>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/70 via-leaf-600/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-leaf-800">
          <MapPin className="h-3.5 w-3.5" />
          {project.neighborhood} / {project.district} · {project.city}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-forest-900">
          {project.title[locale]}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-soft">
          {project.excerpt[locale]}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-forest-800">
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-leaf-600" />
            {project.parcelAreaRange.min === project.parcelAreaRange.max
              ? `${project.parcelAreaRange.min} m²`
              : `${project.parcelAreaRange.min}-${project.parcelAreaRange.max} m²`}
          </span>
          <span>
            {project.parcelCount} {t("parcels")}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-forest-900/10 pt-4">
          <span className="font-display text-lg font-semibold text-forest-900">
            {formatPriceTRY(project.priceRangeTRY.min)}
            <span className="text-ink-soft"> +</span>
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-leaf-800 transition-transform group-hover:translate-x-0.5">
            {t("viewDetails")}
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
