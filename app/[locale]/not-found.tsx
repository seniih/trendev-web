import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, buttonClass } from "@/components/ui";
import { Mascot } from "@/components/Mascot";
import { Reveal } from "@/components/Reveal";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Reveal>
        <Mascot variant="full" alt={t("mascotAlt")} priority sizes="256px" className="w-48 sm:w-64" />
      </Reveal>
      <p className="mt-4 font-display text-7xl font-semibold text-gold-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest-900">
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-soft">{t("text")}</p>
      <Link href="/" className={buttonClass("primary", "mt-8")}>
        {t("home")}
      </Link>
    </Container>
  );
}
