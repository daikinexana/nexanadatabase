import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// サイトマップは1時間に1回再生成（SEO最適化のため）
// データベースから最新情報を取得するため、動的生成が必要
export const revalidate = 3600 // 1時間キャッシュ
export const fetchCache = 'force-cache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://db.nexanahq.com'
  
  // 現在の日時
  const now = new Date()

  try {
    // データベースから各カテゴリの最新更新日時を取得
    const [
      latestContest,
      latestOpenCall,
      latestLocation,
      latestNews,
      latestKnowledge,
      activeLocations,
    ] = await Promise.all([
      prisma.contest.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.openCall.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.location.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.news.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.knowledge.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.location.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    // 各ページのlastModifiedを設定（データベースの最新更新日時があれば使用、なければ現在時刻）
    const homeLastModified = now.toISOString()
    const contestsLastModified = latestContest?.updatedAt.toISOString() || now.toISOString()
    const openCallsLastModified = latestOpenCall?.updatedAt.toISOString() || now.toISOString()
    const locationsLastModified = latestLocation?.updatedAt.toISOString() || now.toISOString()
    const newsLastModified = latestNews?.updatedAt.toISOString() || now.toISOString()
    const knowledgeLastModified = latestKnowledge?.updatedAt.toISOString() || now.toISOString()

    // サブドメイン専用のサイトマップ（db.nexanahq.com）
    const sitemapEntries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: homeLastModified,
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/contests`,
        lastModified: contestsLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/open-calls`,
        lastModified: openCallsLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/location`,
        lastModified: locationsLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/news`,
        lastModified: newsLastModified,
        changeFrequency: 'hourly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/knowledge`,
        lastModified: knowledgeLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: now.toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: now.toISOString(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: now.toISOString(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
    ]

    // 個別のlocationページを追加
    activeLocations.forEach((location) => {
      sitemapEntries.push({
        url: `${baseUrl}/location/${location.slug}`,
        lastModified: location.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    })

    return sitemapEntries
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // エラー時は現在時刻を使用してフォールバック
    const fallbackDate = now.toISOString()
    return [
      {
        url: baseUrl,
        lastModified: fallbackDate,
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/contests`,
        lastModified: fallbackDate,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/open-calls`,
        lastModified: fallbackDate,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/location`,
        lastModified: fallbackDate,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/news`,
        lastModified: fallbackDate,
        changeFrequency: 'hourly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/knowledge`,
        lastModified: fallbackDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: fallbackDate,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: fallbackDate,
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: fallbackDate,
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
    ]
  }
}