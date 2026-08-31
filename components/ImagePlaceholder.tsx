import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Henüz eklenmemiş bir fotoğrafın yerini tutan kutu.
 * Beklenen dosya yolunu doğrudan ekranda gösterir — böylece hangi dosyayı
 * hangi isimle eklemeniz gerektiği sitenin kendisinden anlaşılır.
 */
export function ImagePlaceholder({
  path,
  className,
}: {
  /** public/ köküne göre beklenen yol, örn. "/images/projeler/dagyoncali/kapak.jpg" */
  path: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-forest-900/20 bg-sand p-4 text-center",
        className,
      )}
    >
      <ImageOff className="h-7 w-7 text-forest-900/30" />
      <p className="text-xs font-medium text-forest-800/70">Fotoğraf eklenecek</p>
      <code className="rounded bg-forest-900/5 px-2 py-1 text-[11px] text-forest-900/60 break-all">
        public{path}
      </code>
    </div>
  );
}
