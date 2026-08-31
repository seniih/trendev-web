import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  MapPin,
  Maximize,
  Layers,
  Wallet,
  Phone,
  ArrowLeft,
  Clock,
  Check,
  X,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/data/villas";
import { getVillaProject, getVillaProjects } from "@/data/villas";
import { site, whatsappLink, telLink } from "@/data/site";
import { formatPriceTRY, cn } from "@/lib/utils";
import { imageExists } from "@/lib/images";
import { Container, Section, Badge, buttonClass, SectionHeading, GrainOverlay } from "@/components/ui";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VillaCard } from "@/components/VillaCard";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Reveal } from "@/components/Reveal";
import { routing } from "@/i18n/routing";
import { WhatsAppIcon } from "@/components/FloatingContact";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getVillaProjects().map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getVillaProject(slug);
  if (!project) return {};
  const l = locale as Locale;
  return {
    title: project.title[l],
    description: project.excerpt[l],
    openGraph: { images: [project.poster] },
  };
}

const floorLabelKey = { ground: "groundFloor", first: "firstFloor", roof: "roofFloor" } as const;

export default async function VillaDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const project = getVillaProject(slug);
  if (!project) notFound();

  const t = await getTranslations("projectDetail");
  const c = await getTranslations("common");
  const r = await getTranslations("rooms");
  const others = getVillaProjects().filter((p) => p.slug !== slug).slice(0, 3);
  const waMsg = t("whatsappMsg", { project: project.title[locale] });

  const parcelArea =
    project.parcelAreaRange.min === project.parcelAreaRange.max
      ? `${project.parcelAreaRange.min} m²`
      : `${project.parcelAreaRange.min}-${project.parcelAreaRange.max} m²`;

  const specs = [
    { icon: MapPin, label: c("region"), value: `${project.neighborhood} / ${project.district} · ${project.city}` },
    { icon: Layers, label: t("adaParsel"), value: project.adaParsel },
    { icon: Maximize, label: t("parcelArea"), value: parcelArea },
    { icon: Wallet, label: t("priceRange"), value: `${formatPriceTRY(project.priceRangeTRY.min)} - ${formatPriceTRY(project.priceRangeTRY.max)}` },
    {
      icon: Clock,
      label: t("distance"),
      value: `${t("toSakarya")} ${project.travelTime.toSakaryaMin} ${t("minutes")} · ${t("toIstanbul")} ${project.travelTime.toIstanbulHour} ${t("hours")}`,
    },
  ];

  return (
    <>
      <div className="pt-24 sm:pt-28">
        <Section className="bg-cream !pt-8 !pb-10">
          <Container>
            <Link
              href="/projeler"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 transition-colors hover:text-leaf-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </Link>

            <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              {/* Sol: medya + açıklama */}
              <div>
                {imageExists(project.poster) ? (
                  <VideoPlayer poster={project.poster} label={project.title[locale]} />
                ) : (
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                    <ImagePlaceholder path={project.poster} />
                  </div>
                )}

                {project.highlights[locale].length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.highlights[locale].map((h) => (
                      <Badge key={h} tone="green">
                        {h}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Kat Planı */}
                <div className="mt-10">
                  <h2 className="font-display text-xl font-semibold text-forest-900">
                    {t("floorPlan")}
                  </h2>
                  <div
                    className={cn(
                      "mt-4 grid gap-4",
                      project.floors.length > 1 ? "sm:grid-cols-2" : "",
                    )}
                  >
                    {project.floors.map((floor) => (
                      <div
                        key={floor.key}
                        className="rounded-xl border border-forest-900/10 bg-sand/60 p-5"
                      >
                        <div className="flex items-baseline justify-between">
                          <h3 className="font-display font-semibold text-forest-900">
                            {r(floorLabelKey[floor.key])}
                          </h3>
                          <span className="text-sm font-medium text-leaf-800">
                            {floor.areaM2} m²
                          </span>
                        </div>
                        <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                          {floor.rooms.map((room, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-leaf-600" />
                              {room.count} {r(room.key)}
                            </li>
                          ))}
                          {floor.outdoor && (
                            <li className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-leaf-600" />
                              {floor.outdoor.areaM2 ? `${floor.outdoor.areaM2} m² ` : ""}
                              {r(floor.outdoor.kind)}
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {project.gallery.length > 0 && (
                  <div className="mt-10">
                    <h2 className="font-display text-xl font-semibold text-forest-900">
                      {t("gallery")}
                    </h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {project.gallery.map((img, i) => (
                        <Reveal key={i} delay={i * 0.06}>
                          <div className="group relative aspect-[4/3] overflow-hidden rounded-xl">
                            {imageExists(img) ? (
                              <Image
                                src={img}
                                alt={`${project.title[locale]} ${i + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 40vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <ImagePlaceholder path={img} />
                            )}
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 space-y-4 text-lg leading-relaxed text-ink-soft">
                  {project.description[locale].map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Sağ: özet + CTA (yapışkan) */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="relative overflow-hidden rounded-2xl border border-forest-900/10 bg-cream p-6 shadow-cine">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-leaf-600 via-leaf-500 to-leaf-400" />
                  <h1 className="font-display text-2xl font-semibold leading-snug text-forest-900">
                    {project.title[locale]}
                  </h1>
                  <p className="mt-4 font-display text-2xl font-semibold text-forest-900">
                    {formatPriceTRY(project.priceRangeTRY.min)}
                    <span className="text-base font-normal text-ink-soft"> +</span>
                  </p>

                  <dl className="mt-6 space-y-3 border-t border-forest-900/10 pt-6">
                    {specs.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-3 text-sm">
                        <dt className="flex items-center gap-2 text-ink-soft">
                          <Icon className="h-4 w-4 shrink-0 text-leaf-600" />
                          {label}
                        </dt>
                        <dd className="text-right font-medium text-forest-900">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 space-y-3 border-t border-forest-900/10 pt-6">
                    <p className="text-sm font-medium text-forest-900">{t("ctaText")}</p>
                    <a
                      href={whatsappLink(waMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass("gold", "w-full bg-[#25D366] text-white hover:bg-[#20bd5a]")}
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      {c("whatsappCta")}
                    </a>
                    <a href={telLink()} className={buttonClass("primary", "w-full")}>
                      <Phone className="h-4 w-4" />
                      {site.phoneDisplay}
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </Section>
      </div>

      {/* Şehrin gürültüsünden doğanın sessizliğine */}
      <Section className="relative overflow-hidden bg-forest-950 text-cream">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/85 to-forest-950" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-[110px] [background:radial-gradient(circle,rgba(97,188,69,0.5),transparent_65%)]"
        />
        <GrainOverlay className="opacity-[0.08]" />
        <Container className="relative">
          <SectionHeading
            eyebrow={t("escape.eyebrow")}
            title={t("escape.title")}
            subtitle={t("escape.subtitle")}
            align="center"
            invert
          />

          <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.04] backdrop-blur-sm">
            <div className="grid grid-cols-2 border-b border-cream/10 text-center text-xs font-medium uppercase tracking-[0.2em] text-cream/50">
              <span className="border-r border-cream/10 py-3">{t("escape.cityLabel")}</span>
              <span className="py-3">{t("escape.hereLabel")}</span>
            </div>
            {(["one", "two", "three", "four"] as const).map((k, i) => (
              <Reveal key={k} delay={i * 0.06}>
                <div
                  className={cn(
                    "grid grid-cols-2",
                    i > 0 && "border-t border-cream/10",
                  )}
                >
                  <div className="flex items-center gap-2.5 border-r border-cream/10 px-5 py-4 text-sm text-cream/50 line-through decoration-cream/30">
                    <X className="h-4 w-4 shrink-0 text-cream/30" />
                    {t(`escape.items.${k}.city`)}
                  </div>
                  <div className="flex items-center gap-2.5 px-5 py-4 text-sm font-medium text-cream">
                    <Check className="h-4 w-4 shrink-0 text-leaf-400" />
                    {t(`escape.items.${k}.here`)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-xl text-center">
            <p className="text-lg text-cream/80">
              {t("escape.proximity", {
                hours: project.travelTime.toIstanbulHour,
                minutes: project.travelTime.toSakaryaMin,
              })}
            </p>
            <a
              href={whatsappLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonClass("primary"), "mt-8 inline-flex")}
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t("escape.cta")}
            </a>
          </div>
        </Container>
      </Section>

      {/* Diğer projeler */}
      <Section className="bg-sand !pt-14">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-forest-900">
            {t("otherProjects")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <VillaCard project={p} locale={locale} posterExists={imageExists(p.poster)} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
