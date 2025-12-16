import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://db.nexanahq.com'
  // 環境変数でカスタムadminパスを取得（デフォルト: /admin）
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || '/admin'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [`${adminPath}/`, '/api/', '/_next/', '/sign-in/', '/sign-up/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [`${adminPath}/`, '/api/', '/_next/', '/sign-in/', '/sign-up/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // hostを削除してサブドメイン間の競合を回避
  }
}
