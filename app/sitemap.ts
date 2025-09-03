// app/sitemap.ts
import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

async function getRestaurantsSlugs(): Promise<string[]> {
  const query = `*[_type == "restaurant" && defined(slug.current)]{
    "slug": slug.current
  }`;
  const data = await client.fetch<{ slug: string }[]>(query);
  return data.map((item) => item.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://qrmenu.rohaty.com";

  const slugs = await getRestaurantsSlugs();

  // Landing page
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Pages restaurants
  const dynamicPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticPages, ...dynamicPages];
}
