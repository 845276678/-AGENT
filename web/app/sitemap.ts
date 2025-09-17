import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();
  const routes = ['/', '/agents', '/ideas', '/store', '/login', '/me', '/health'];
  return routes.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: 'daily', priority: 0.7 }));
}