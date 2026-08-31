import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Wallet, ShieldCheck, Route, CreditCard } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Container, Section, SectionHeading } from "@/components/ui";
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
  const t = await getTranslations({ locale, namespace: "whyPage" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function WhyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("whyPage");
  const why = await getTranslations("why");

  const faq = ["1", "2", "3", "4"];

  return (
    <>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/site/neden-trendev-baslik.jpg"
      />

      <Section className="bg-cream">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wallet, k: "value" },
              { icon: ShieldCheck, k: "secure" },
              { icon: Route, k: "infra" },
              { icon: CreditCard, k: "payment" },
            ].map(({ icon: Icon, k }, i) => (
              <Reveal key={k} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-forest-900/10 bg-cream p-6 shadow-[0_2px_20px_-12px_rgba(6,26,16,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-leaf-500/40 hover:shadow-cine">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-500/15 text-leaf-600 ring-1 ring-leaf-500/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-forest-900">
                    {why(`items.${k}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {why(`items.${k}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-sand !pt-4">
        <Container className="max-w-3xl">
          <SectionHeading title={t("faqTitle")} align="center" />
          <div className="mt-10 space-y-4">
            {faq.map((n, i) => (
              <Reveal key={n} delay={i * 0.05}>
                <details className="group rounded-2xl border border-forest-900/10 bg-cream p-5 transition-colors duration-300 open:border-leaf-500/40 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-medium text-forest-900">
                    {t(`faq.q${n}`)}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-500/15 text-leaf-800 transition-transform duration-300 group-open:rotate-45 group-open:bg-leaf-500 group-open:text-forest-950">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {t(`faq.a${n}`)}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
