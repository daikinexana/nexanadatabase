import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://db.nexanahq.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/sign-in/', '/sign-up/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/sign-in/', '/sign-up/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // hostを削除してサブドメイン間の競合を回避
  }
}
