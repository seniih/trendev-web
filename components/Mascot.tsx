import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * `aspectClass` sabit bir metin olmalı (değişkenden birleştirilerek üretilmemeli) —
 * Tailwind'in derleme zamanı tarayıcısı dinamik olarak kurulan arbitrary-value
 * class'ları göremez.
 */
const SOURCES = {
  full: { src: "/images/mascot/mascot-full.png", aspectClass: "aspect-[900/755]" },
  peek: { src: "/images/mascot/mascot-peek.png", aspectClass: "aspect-[511/520]" },
} as const;

/** Trend Ev sincap maskotu — tam gövde (`full`) veya baş/omuz (`peek`) kesiti. */
export function Mascot({
  variant = "full",
  alt,
  className,
  sizes = "300px",
  priority,
}: {
  variant?: keyof typeof SOURCES;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { src, aspectClass } = SOURCES[variant];
  return (
    <div className={cn("relative", aspectClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className="select-none object-contain"
      />
    </div>
  );
}
