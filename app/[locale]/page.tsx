import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  ArrowRight,
  Phone,
  Wallet,
  ShieldCheck,
  Route,
  Home as HomeIcon,
  Search,
  Pencil,
  FileCheck,
  CreditCard,
  KeyRound,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/data/villas";
import { getFeaturedVillaProjects } from "@/data/villas";
import { site, whatsappLink, telLink } from "@/data/site";
import { imageExists } from "@/lib/images";
import {
  Container,
  Section,
  SectionHeading,
  Eyebrow,
  buttonClass,
  GrainOverlay,
} from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Stat } from "@/components/Stat";
import { VideoHero } from "@/components/VideoHero";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VillaCard } from "@/components/VillaCard";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Mascot } from "@/components/Mascot";

const HERO_IMAGE = "/images/site/hero.jpg";
const TRUST_IMAGE = "/images/site/tanitim-video.jpg";
const PROJECTS_MAP_IMAGE = "/images/site/projeler-haritasi.jpg";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;

  const t = await getTranslations();
  const featured = getFeaturedVillaProjects();

  // Hero videosu eklendiğinde: videoSrc="/videos/hero.mp4"
  return (
    <>
      {/* HERO */}
      <VideoHero poster={HERO_IMAGE} hasPoster={imageExists(HERO_IMAGE)}>
        <Container className="pt-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf-400 shadow-[0_0_10px_2px_var(--leaf-glow)]" />
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-7 text-[2.6rem] font-semibold leading-[1.03] text-cream sm:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/85">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/projeler" className={buttonClass("primary")}>
                {t("hero.ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={telLink()} className={buttonClass("ghost")}>
                <Phone className="h-4 w-4" />
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </div>
        </Container>
      </VideoHero>

      {/* STATS */}
      <div className="relative border-b border-forest-900/10 bg-cream">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf-500/60 to-transparent" />
        <Container>
          <dl className="grid grid-cols-2 divide-forest-900/10 py-10 sm:grid-cols-4 sm:divide-x">
            <Stat value={t("stats.projectsValue")} label={t("stats.projects")} />
            <Stat value={t("stats.districtsValue")} label={t("stats.districts")} />
            <Stat value={t("stats.parcelsValue")} label={t("stats.parcels")} />
            <Stat value={t("stats.secureValue")} label={t("stats.secure")} />
          </dl>
        </Container>
      </div>

      {/* PROJECTS MAP */}
      <Section className="bg-sand">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow={t("projectsMap.eyebrow")}
              title={t("projectsMap.title")}
              subtitle={t("projectsMap.subtitle")}
            />
            <Reveal>
              <Link
                href="/projeler"
                className="group block overflow-hidden rounded-2xl border border-forest-900/10 shadow-[0_2px_20px_-12px_rgba(6,26,16,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:border-leaf-500/40 hover:shadow-cine"
              >
                <div className="relative aspect-video w-full">
                  {imageExists(PROJECTS_MAP_IMAGE) ? (
                    <Image
                      src={PROJECTS_MAP_IMAGE}
                      alt={t("projectsMap.alt")}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <ImagePlaceholder path={PROJECTS_MAP_IMAGE} />
                  )}
                </div>
              </Link>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* FEATURED PROJECTS */}
      <Section id="projeler" className="bg-cream">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t("featured.eyebrow")}
              title={t("featured.title")}
              subtitle={t("featured.subtitle")}
            />
            <Link
              href="/projeler"
              className={buttonClass("outline", "hidden sm:inline-flex")}
            >
              {t("common.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <VillaCard project={p} locale={locale} posterExists={imageExists(p.poster)} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* WHY TRENDEV */}
      <Section className="relative overflow-hidden bg-forest-950 text-cream">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/85 to-forest-950" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full opacity-30 blur-[110px] [background:radial-gradient(circle,rgba(97,188,69,0.5),transparent_65%)]"
        />
        <GrainOverlay className="opacity-[0.08]" />
        <Container className="relative">
          <Reveal>
            <Mascot
              variant="full"
              alt={t("why.mascotAlt")}
              sizes="256px"
              className="pointer-events-none absolute -right-2 -top-20 hidden w-56 opacity-95 drop-shadow-[0_24px_48px_rgba(6,26,16,0.5)] lg:block xl:-right-6 xl:w-64"
            />
          </Reveal>
          <SectionHeading
            eyebrow={t("why.eyebrow")}
            title={t("why.title")}
            subtitle={t("why.subtitle")}
            align="center"
            invert
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wallet, k: "value" },
              { icon: ShieldCheck, k: "secure" },
              { icon: Route, k: "infra" },
              { icon: CreditCard, k: "payment" },
            ].map(({ icon: Icon, k }, i) => (
              <Reveal key={k} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-leaf-500/40">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-500/15 text-leaf-400 ring-1 ring-leaf-500/20 shadow-[0_0_24px_-6px_var(--leaf-glow)] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-cream">
                    {t(`why.items.${k}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/70">
                    {t(`why.items.${k}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* STEPS */}
      <Section className="bg-cream">
        <Container>
          <SectionHeading
            eyebrow={t("steps.eyebrow")}
            title={t("steps.title")}
            align="center"
          />
          <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-leaf-500/30 to-transparent lg:block"
            />
            {[
              { icon: Search, k: "one" },
              { icon: Pencil, k: "two" },
              { icon: FileCheck, k: "three" },
              { icon: CreditCard, k: "four" },
              { icon: KeyRound, k: "five" },
            ].map(({ icon: Icon, k }, i) => (
              <Reveal key={k} delay={i * 0.08} className="relative">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-500 text-forest-950 shadow-[var(--shadow-leaf)] ring-4 ring-cream">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pointer-events-none absolute -top-3 right-2 font-display text-6xl font-semibold text-forest-900/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-forest-900">
                    {t(`steps.items.${k}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {t(`steps.items.${k}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* TRUST + VIDEO */}
      <Section className="bg-sand">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              {imageExists(TRUST_IMAGE) ? (
                <VideoPlayer poster={TRUST_IMAGE} label={t("trust.title")} />
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                  <ImagePlaceholder path={TRUST_IMAGE} />
                </div>
              )}
            </Reveal>
            <div>
              <SectionHeading eyebrow={t("trust.eyebrow")} title={t("trust.title")} />
              <ul className="mt-8 space-y-4">
                {["one", "two", "three", "four", "five", "six"].map((k) => (
                  <li key={k} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-500 text-forest-950 shadow-[0_0_16px_-4px_var(--leaf-glow)]">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-forest-900">{t(`trust.items.${k}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section className="relative overflow-hidden bg-forest-950 text-cream">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-950/70 to-forest-950/95" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[130px] [background:radial-gradient(circle,rgba(97,188,69,0.6),transparent_65%)]"
        />
        <GrainOverlay className="opacity-[0.08]" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow tone="leaf" invert>
                <span className="inline-flex items-center gap-1.5">
                  <HomeIcon className="h-3.5 w-3.5" />
                  {site.name}
                </span>
              </Eyebrow>
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-cream sm:text-[2.6rem]">
              {t("finalCta.title")}
            </h2>
            <p className="mt-5 text-lg text-cream/80">{t("finalCta.subtitle")}</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={whatsappLink(t("contact.whatsappMsg"))}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("primary")}
              >
                {t("finalCta.whatsapp")}
              </a>
              <a href={telLink()} className={buttonClass("ghost")}>
                <Phone className="h-4 w-4" />
                {site.phoneDisplay}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
