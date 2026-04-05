import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/intake/confirmation"],
      },
    ],
    sitemap: "https://www.texastotalloss.com/sitemap.xml",
  };
}
