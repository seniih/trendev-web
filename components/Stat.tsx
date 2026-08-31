"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

/**
 * İstatistik değeri. Değer sayı ile başlıyorsa (ör. "5+") görünürken
 * 0'dan hedefe sayarak belirir; aksi halde metin olduğu gibi gösterilir.
 */
export function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";

  const [display, setDisplay] = useState(
    target !== null && !reduce ? "0" : value,
  );

  useEffect(() => {
    if (target === null || reduce || !inView) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, target, suffix, reduce]);

  return (
    <div ref={ref} className="px-2 py-3 text-center sm:px-6">
      <dt className="font-display text-3xl font-semibold text-forest-900 sm:text-4xl">
        <span className="bg-gradient-to-br from-forest-800 to-leaf-600 bg-clip-text text-transparent">
          {display}
        </span>
      </dt>
      <dd className="mt-2 text-sm text-ink-soft">{label}</dd>
    </div>
  );
}
