import type { MetadataRoute } from "next";

const BASE_URL = "https://www.texastotalloss.com";

const TOPIC_SLUGS = [
  "acv-dispute",
  "gap-insurance",
  "salvage-process",
  "settlement-timeline",
  "replacement-options",
  "inspection",
  "diminished-value",
  "rental-car-rights",
  "ccc-valuation-gap",
  "copart-anxiety",
  "recovery-journal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const topicPages: MetadataRoute.Sitemap = TOPIC_SLUGS.map((slug) => ({
    url: `${BASE_URL}/total-loss/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/total-loss`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/intake`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/portal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...topicPages,
  ];
}
