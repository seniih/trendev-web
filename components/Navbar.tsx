"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Phone } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { telLink } from "@/data/site";
import type { SiteInfo } from "@/data/site-content";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { buttonClass } from "./ui";
import { cn } from "@/lib/utils";

export function Navbar({ site }: { site: SiteInfo }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rota değişince mobil menüyü kapat — render sırasında state ayarlama
  // (bkz. react-hooks/set-state-in-effect: efekt içinde senkron setState yerine
  // React'ın önerdiği "prop değiştiğinde state sıfırlama" deseni).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const links = [
    { href: "/", label: t("home") },
    { href: "/projeler", label: t("projects") },
    { href: "/neden-trendev", label: t("why") },
    { href: "/hakkimizda", label: t("about") },
    { href: "/iletisim", label: t("contact") },
  ] as const;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-cream/90 backdrop-blur-md shadow-[0_2px_20px_-8px_rgba(15,46,34,0.25)]"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={site.name}>
          <span
            className={cn(
              "font-display text-xl font-semibold tracking-tight sm:text-2xl",
              scrolled || open ? "text-forest-900" : "text-cream",
            )}
          >
            Trend<span className="text-leaf-500">Ev</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled
                  ? "text-forest-800 hover:text-leaf-800"
                  : "text-cream/90 hover:text-cream",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher invert={!scrolled} />
          <a href={telLink(site.phoneIntl)} className={buttonClass("primary", "px-5 py-2.5")}>
            <Phone className="h-4 w-4" />
            {site.phoneDisplay}
          </a>
        </div>

        <button
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
            scrolled || open ? "text-forest-900" : "text-cream",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobil menü */}
      {open && (
        <div className="lg:hidden">
          <div className="mx-4 mb-4 rounded-2xl border border-forest-900/10 bg-cream p-4 shadow-soft">
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-forest-900 hover:bg-sand"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-forest-900/10 pt-4">
              <LocaleSwitcher />
              <a href={telLink(site.phoneIntl)} className={buttonClass("primary", "flex-1")}>
                <Phone className="h-4 w-4" />
                {t("call")}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
