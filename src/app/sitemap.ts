import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://beethoval.dev',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // We can add dynamic projects here later by querying the database
    // For now, we prioritize the local landing page.
  ]
}
