// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://qrmenu.rohaty.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/auth"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
