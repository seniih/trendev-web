import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { routing } from "@/i18n/routing";
import { site, whatsappLink, telLink } from "@/data/site";
import { Container, Section, buttonClass } from "@/components/ui";
import { PageHeader } from "@/components/PageHeader";
import { MapEmbed } from "@/components/MapEmbed";
import { WhatsAppIcon } from "@/components/FloatingContact";
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
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const rows = [
    {
      icon: Phone,
      label: t("phone"),
      value: site.phoneDisplay,
      href: telLink(),
    },
    {
      icon: Mail,
      label: t("email"),
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MapPin,
      label: t("address"),
      value: `${site.address.line}, ${site.address.district} / ${site.address.city}`,
    },
    { icon: Clock, label: t("hours"), value: t("hoursValue") },
  ];

  return (
    <>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/site/iletisim-baslik.jpg"
      />

      <Section className="bg-cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <ul className="space-y-6">
                {rows.map(({ icon: Icon, label, value, href }, i) => (
                  <Reveal key={label} delay={i * 0.06}>
                    <li className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-leaf-500/15 text-leaf-600 ring-1 ring-leaf-500/20">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-ink-soft">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            className="mt-1 block font-display text-lg text-forest-900 transition-colors hover:text-leaf-800"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="mt-1 font-display text-lg text-forest-900">
                            {value}
                          </p>
                        )}
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink(t("whatsappMsg"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass(
                    "gold",
                    "bg-[#25D366] text-white hover:bg-[#20bd5a]",
                  )}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {t("whatsapp")}
                </a>
                <a href={telLink()} className={buttonClass("primary")}>
                  <Phone className="h-4 w-4" />
                  {t("phone")}
                </a>
              </div>

              <div className="mt-8">
                <p className="text-sm font-medium uppercase tracking-wide text-ink-soft">
                  {t("social")}
                </p>
                <div className="mt-3 flex gap-3">
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream transition-colors hover:bg-leaf-500 hover:text-forest-950"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream transition-colors hover:bg-leaf-500 hover:text-forest-950"
                  >
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl border border-forest-900/10 shadow-cine">
                <MapEmbed
                  lat={site.address.lat}
                  lng={site.address.lng}
                  label={site.name}
                  zoom={15}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
