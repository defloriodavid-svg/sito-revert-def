import { useEffect } from "react";

const SITE_NAME = "REVERT";
const FALLBACK_DESCRIPTION = "REVERT: streetwear italiano, t-shirt grafiche, longsleeve e trucker hat. Scopri la collezione e contatta _revert_ su Instagram.";
const INSTAGRAM_URL = "https://www.instagram.com/_revert_/";

function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return window.location.origin;
}

function absoluteUrl(value, base) {
  if (!value) return `${base}/og-image.jpg`;
  try { return new URL(value, `${base}/`).href; } catch { return value; }
}

function setMeta(attr, key, content) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function Seo({ title, description = FALLBACK_DESCRIPTION, image = "/og-image.jpg", path = "", product }) {
  useEffect(() => {
    const base = getSiteUrl();
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const pageUrl = `${base}${cleanPath === "/" ? "/" : cleanPath}`;
    const imageUrl = absoluteUrl(image, base);
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    document.title = fullTitle;
    document.documentElement.lang = "it";
    setMeta("name", "description", description);
    setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("property", "og:locale", "it_IT");
    setMeta("property", "og:type", product ? "product" : "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:image:alt", product?.title || "REVERT streetwear");
    setMeta("property", "og:url", pageUrl);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    let jsonLd = document.head.querySelector('script[data-revert-seo="jsonld"]');
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.dataset.revertSeo = "jsonld";
      document.head.appendChild(jsonLd);
    }

    const graph = [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: SITE_NAME,
        url: `${base}/`,
        logo: `${base}/images/revert-logo.webp`,
        sameAs: [INSTAGRAM_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: SITE_NAME,
        inLanguage: "it-IT",
        publisher: { "@id": `${base}/#organization` },
      },
    ];

    if (product) {
      graph.push({
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: product.title,
        description,
        image: [imageUrl],
        url: pageUrl,
        brand: { "@type": "Brand", name: SITE_NAME },
      });
    }

    jsonLd.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  }, [title, description, image, path, product]);

  return null;
}
