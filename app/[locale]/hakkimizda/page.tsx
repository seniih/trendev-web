import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Target, Eye, Check } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Container, Section, SectionHeading, GrainOverlay } from "@/components/ui";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("lead") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const trust = await getTranslations("trust");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("lead")}
        image="/images/site/hakkimizda-baslik.jpg"
      />

      <Section className="bg-cream">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest-950">
                <Image
                  src="/images/site/kurucu.png"
                  alt={t("founder")}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <p className="mt-3 text-center text-sm text-ink-soft">
                {t("founder")} — {t("founderRole")}
              </p>
            </Reveal>
            <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="relative overflow-hidden bg-forest-900 text-cream !py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-25 blur-[110px] [background:radial-gradient(circle,rgba(97,188,69,0.5),transparent_65%)]"
        />
        <GrainOverlay className="opacity-[0.07]" />
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-8 backdrop-blur-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-500/15 text-leaf-400 ring-1 ring-leaf-500/20 shadow-[0_0_24px_-6px_var(--leaf-glow)]">
                  <Target className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-cream">
                  {t("missionTitle")}
                </h3>
                <p className="mt-2 text-cream/75">{t("mission")}</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-8 backdrop-blur-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-500/15 text-leaf-400 ring-1 ring-leaf-500/20 shadow-[0_0_24px_-6px_var(--leaf-glow)]">
                  <Eye className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-cream">
                  {t("visionTitle")}
                </h3>
                <p className="mt-2 text-cream/75">{t("vision")}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="bg-sand">
        <Container>
          <SectionHeading
            eyebrow={trust("eyebrow")}
            title={trust("title")}
            align="center"
          />
          <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
            {["one", "two", "three", "four", "five", "six"].map((k, i) => (
              <Reveal key={k} delay={i * 0.05}>
                <li className="flex items-start gap-3 rounded-xl bg-cream p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-500 text-forest-950 shadow-[0_0_16px_-4px_var(--leaf-glow)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-forest-900">{trust(`items.${k}`)}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
