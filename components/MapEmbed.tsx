/** API anahtarı gerektirmeyen Google Haritalar gömme. */
export function MapEmbed({
  lat,
  lng,
  label,
  zoom = 13,
}: {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
}) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  return (
    <iframe
      title={label ?? "Harita"}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-[360px] w-full border-0"
      allowFullScreen
    />
  );
}
