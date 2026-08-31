"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { site, whatsappLink, telLink } from "@/data/site";
import { Mascot } from "./Mascot";

/** Sağ-alt sabit WhatsApp + tıkla-ara butonları (mobil öncelikli). */
export function FloatingContact() {
  const t = useTranslations("contact");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Mascot
        variant="peek"
        alt=""
        sizes="56px"
        className="hidden w-14 -mb-1 mr-1 pointer-events-none drop-shadow-[0_8px_16px_rgba(6,26,16,0.35)] sm:block"
      />
      <a
        href={telLink()}
        aria-label={t("phone")}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf-500 text-forest-950 shadow-[var(--shadow-leaf)] transition-transform hover:scale-105"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={whatsappLink(t("whatsappMsg"))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-soft transition-transform hover:scale-105"
      >
        <WhatsAppIcon className="h-6 w-6" />
        <span className="hidden text-sm sm:inline">{site.phoneDisplay}</span>
      </a>
    </div>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}
