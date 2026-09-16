import fs from "node:fs";
import path from "node:path";
import { products } from "../src/data/products.js";

const root = process.cwd();
const dist = path.join(root, "dist");
const siteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://www.revert-collection.it").trim().replace(/\/$/, "");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function replaceMeta(html, attr, key, value) {
  const escapedKey = key.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta([^>]*\\s${attr}=["']${escapedKey}["'][^>]*)>`, "i");
  return html.replace(pattern, (tag) => {
    if (/\scontent=["'][^"']*["']/i.test(tag)) {
      return tag.replace(/\scontent=["'][^"']*["']/i, ` content="${escapeHtml(value)}"`);
    }
    return tag.replace(/\s*\/?\>$/, ` content="${escapeHtml(value)}" />`);
  });
}

function renderPage({ pathName, title, description, image = "/og-image.jpg", type = "website", product }) {
  const url = new URL(pathName, `${siteUrl}/`).href;
  const imageUrl = new URL(image, `${siteUrl}/`).href;
  const fullTitle = title.includes("REVERT") ? title : `${title} | REVERT`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace(/<link rel=["']canonical["'] href=["'][^"']*["']\s*\/?>/i, `<link rel="canonical" href="${url}" />`)
    .replace(/<link rel=["']alternate["'][^>]*>/i, `<link rel="alternate" hreflang="it-IT" href="${url}" />`);

  for (const [attr, key, value] of [
    ["name", "description", description],
    ["property", "og:type", type],
    ["property", "og:title", fullTitle],
    ["property", "og:description", description],
    ["property", "og:url", url],
    ["property", "og:image", imageUrl],
    ["property", "og:image:alt", product?.title || "REVERT streetwear italiano"],
    ["name", "twitter:title", fullTitle],
    ["name", "twitter:description", description],
    ["name", "twitter:image", imageUrl],
  ]) {
    html = replaceMeta(html, attr, key, value);
  }

  const graph = [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "REVERT",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/images/revert-logo.webp`,
      sameAs: ["https://www.instagram.com/_revert_/"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "REVERT",
      inLanguage: "it-IT",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ];

  if (product) {
    graph.push({
      "@type": "Product",
      "@id": `${url}#product`,
      name: product.title,
      description,
      image: [imageUrl],
      url,
      category: product.category,
      brand: { "@type": "Brand", name: "REVERT" },
    });
  }

  html = html.replace(
    /<script type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`,
  );

  const outputDir = path.join(dist, pathName.replace(/^\//, ""));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), html);
}

renderPage({
  pathName: "/collection",
  title: "Collezione streetwear | REVERT",
  description: "Esplora la collezione REVERT: t-shirt grafiche, longsleeve e trucker hat del brand streetwear italiano indipendente.",
});

for (const product of products.filter((item) => !item.hidden)) {
  renderPage({
    pathName: `/product/${product.slug}`,
    title: product.title,
    description: `${product.title}: ${product.description}. Scopri il capo REVERT e contatta _revert_ su Instagram.`,
    image: product.image,
    type: "product",
    product,
  });
}

console.log(`Static SEO pages generated for ${products.filter((item) => !item.hidden).length + 1} routes`);
