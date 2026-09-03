import { getSiteInfo } from "@/data/site-content";

/** RealEstateAgent / LocalBusiness yapılandırılmış verisi (SEO). */
export async function OrganizationJsonLd() {
  const site = await getSiteInfo();
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.legalName,
    url: site.url,
    email: site.email,
    telephone: site.phoneIntl,
    image: `${site.url}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    areaServed: site.address.city,
    sameAs: [site.social.instagram, site.social.facebook],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
