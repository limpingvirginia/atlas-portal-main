import { MetadataRoute } from "next";
import { sidebarData } from "@/@data/sidebar";

export default function sitemap(): MetadataRoute.Sitemap {
  const pageRoutesLinks: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addRoute = (path?: string) => {
    if (!path || seenUrls.has(path)) return;
    seenUrls.add(path);
    pageRoutesLinks.push({
      url: `${process.env.BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    });
  };

  sidebarData.forEach(({ items }) => {
    items.forEach((route) => {
      addRoute(route.url);
      route.items?.forEach((subRoute) => addRoute(subRoute.url));
    });
  });

  return [
    {
      url: `${process.env.BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...pageRoutesLinks
  ];
}
