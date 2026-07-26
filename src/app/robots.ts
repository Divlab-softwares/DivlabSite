import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/Commande/"],
    },
    sitemap: "https://divlabs-tech.com/sitemap.xml",
    host: "https://divlabs-tech.com",
  };
}
