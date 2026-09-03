import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { telLink } from "@/data/site";
import type { SiteInfo } from "@/data/site-content";
import { Container } from "./ui";
import { InstagramIcon, FacebookIcon } from "./BrandIcons";

export function Footer({ site }: { site: SiteInfo }) {
  const t = useTranslations();
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  const explore = [
    { href: "/projeler", label: nav("projects") },
    { href: "/neden-trendev", label: nav("why") },
  ] as const;
  const corporate = [
    { href: "/hakkimizda", label: nav("about") },
    { href: "/iletisim", label: nav("contact") },
  ] as const;

  return (
    <footer className="mt-auto bg-forest-950 text-cream/80">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <span className="font-display text-2xl font-semibold text-cream">
              Trend<span className="text-leaf-500">Ev</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 text-sm italic text-gold-400">
              &ldquo;{t("common.slogan")}&rdquo;
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-cream">
              {t("footer.explore")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-leaf-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-cream">
              {t("footer.corporate")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {corporate.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-leaf-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold text-cream">
              {t("footer.contact")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>
                  {site.address.line}, {site.address.district} / {site.address.city}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold-500" />
                <a href={telLink(site.phoneIntl)} className="hover:text-leaf-400">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold-500" />
                <a href={`mailto:${site.email}`} className="hover:text-leaf-400">
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 hover:bg-leaf-500 hover:text-forest-950"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 hover:bg-leaf-500 hover:text-forest-950"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/60 sm:flex-row">
          <p>
            © {year} {site.legalName}. {t("footer.rights")}
          </p>
          <p>{t("footer.madeWith")}</p>
        </div>
      </Container>
    </footer>
  );
}
