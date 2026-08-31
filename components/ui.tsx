import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "gold",
  invert = false,
}: {
  children: React.ReactNode;
  tone?: "gold" | "leaf";
  /** Koyu (forest) zeminde mi kullanılıyor — açık zeminde metin kontrastı için daha koyu ton seçer. */
  invert?: boolean;
}) {
  const leaf = tone === "leaf";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.28em]",
        leaf
          ? invert
            ? "text-leaf-600"
            : "text-leaf-800"
          : invert
            ? "text-gold-600"
            : "text-gold-700",
      )}
    >
      <span
        className={cn("h-px w-7", leaf ? "bg-leaf-500" : "bg-gold-500")}
        aria-hidden
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <Eyebrow invert={invert}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "mt-5 text-3xl font-semibold leading-[1.1] sm:text-[2.6rem]",
          invert ? "text-cream" : "text-forest-900",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            invert ? "text-cream/80" : "text-ink-soft",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

type Variant = "primary" | "gold" | "outline" | "ghost";

export function buttonClass(variant: Variant = "primary", className?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream";
  const variants: Record<Variant, string> = {
    // Canlı marka CTA — koyu forest metin WCAG için (beyaz #61BC45 üstünde yetersiz kontrast).
    primary:
      "bg-leaf-500 text-forest-950 hover:bg-leaf-400 hover:-translate-y-0.5 shadow-[var(--shadow-leaf)]",
    gold: "bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-[0_8px_24px_-10px_rgba(198,163,90,0.6)]",
    outline:
      "border border-forest-800/25 text-forest-900 hover:border-leaf-500 hover:bg-leaf-500 hover:text-forest-950",
    ghost:
      "text-cream/90 hover:text-cream border border-cream/25 hover:border-leaf-400/70 hover:bg-cream/5",
  };
  return cn(base, variants[variant], className);
}

/** Sinematik film greni katmanı — koyu görsel/section üstüne doku için. */
export function GrainOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "cine-grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay",
        className,
      )}
    />
  );
}

/** Çok katmanlı degrade karartma — full-bleed görseller üstünde metin okunabilirliği. */
export function Scrim({ className }: { className?: string }) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950/75 via-forest-950/45 to-forest-950/90",
          className,
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-950/70 to-transparent"
      />
      {/* Vinyet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_120%_at_50%_35%,transparent_55%,rgba(6,26,16,0.55)_100%)]"
      />
    </>
  );
}

export function Badge({
  children,
  tone = "sand",
}: {
  children: React.ReactNode;
  tone?: "sand" | "gold" | "green" | "muted";
}) {
  const tones: Record<string, string> = {
    sand: "bg-sand text-forest-800",
    gold: "bg-gold-500/15 text-gold-700 ring-1 ring-gold-500/30",
    green: "bg-leaf-500/15 text-leaf-800 ring-1 ring-leaf-500/30",
    muted: "bg-ink/8 text-ink-soft",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
