import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const productsFile = fs.readFileSync(path.join(root, "src/data/products.js"), "utf8");
const slugs = [...productsFile.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const rawSiteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL || "https://revert-clothing.it";
const siteUrl = rawSiteUrl.trim().replace(/\/$/, "");

if (!/^https:\/\//i.test(siteUrl)) {
  throw new Error("VITE_SITE_URL deve iniziare con https://");
}

const lastmod = new Date().toISOString().slice(0, 10);
const pages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/collection", priority: "0.9", changefreq: "weekly" },
  ...slugs.map((slug) => ({ path: `/product/${slug}`, priority: "0.8", changefreq: "monthly" })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(({ path: pagePath, priority, changefreq }) => `  <url>
    <loc>${siteUrl}${pagePath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(root, "public/sitemap.xml"), sitemap);
fs.writeFileSync(path.join(root, "public/robots.txt"), robots);

const indexPath = path.join(root, "index.html");
const indexHtml = fs.readFileSync(indexPath, "utf8");
const updatedIndexHtml = indexHtml.replace(
  /https:\/\/(?:www\.)?(?:revert-clothing\.com|revert-collection\.it|revert-clothing\.it|example\.com)/g,
  siteUrl,
);
fs.writeFileSync(indexPath, updatedIndexHtml);

console.log(`SEO files generated for ${siteUrl}`);
