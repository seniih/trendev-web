"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Merkezi video oynatıcı — poster + tıkla-oynat.
 * videoSrc yoksa yalnızca poster gösterilir (yer tutucu).
 * İleride Mux/YouTube gibi sağlayıcılar bu bileşende soyutlanabilir.
 */
export function VideoPlayer({
  poster,
  videoSrc,
  label,
  className = "",
}: {
  poster: string;
  videoSrc?: string;
  label?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl bg-forest-950 ${className}`}
    >
      {playing && videoSrc ? (
        <video
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={poster}
          controls
          autoPlay
          playsInline
        />
      ) : (
        <>
          <Image
            src={poster}
            alt={label ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-forest-950/15" />
          <button
            type="button"
            onClick={() => videoSrc && setPlaying(true)}
            disabled={!videoSrc}
            aria-label={label ?? "Play"}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500 text-forest-950 shadow-[var(--shadow-leaf)] ring-4 ring-leaf-500/20 transition-transform group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-current" />
            </span>
          </button>
          {!videoSrc && (
            <span className="absolute bottom-3 left-3 rounded-full bg-forest-950/70 px-3 py-1 text-xs text-cream/80">
              Video yakında
            </span>
          )}
        </>
      )}
    </div>
  );
}
