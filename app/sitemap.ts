import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://db.nexanahq.com'
  const now = new Date().toISOString()

  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/contests`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/open-calls`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/facilities`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/knowledge`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  try {
    // 動的ページを取得
    const [contests, openCalls, facilities, news, knowledge, events] = await Promise.all([
      prisma.contest.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true },
      }),
      prisma.openCall.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true },
      }),
      prisma.facility.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true },
      }),
      prisma.news.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true },
      }),
      prisma.knowledge.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true },
      }),
      prisma.event.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true },
      }),
    ])

    // 動的ページのサイトマップエントリを生成
    const dynamicPages = [
      ...contests.map(contest => ({
        url: `${baseUrl}/contests/${contest.id}`,
        lastModified: contest.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...openCalls.map(openCall => ({
        url: `${baseUrl}/open-calls/${openCall.id}`,
        lastModified: openCall.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...facilities.map(facility => ({
        url: `${baseUrl}/facilities/${facility.id}`,
        lastModified: facility.updatedAt.toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...news.map(newsItem => ({
        url: `${baseUrl}/news/${newsItem.id}`,
        lastModified: newsItem.updatedAt.toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
      ...knowledge.map(knowledgeItem => ({
        url: `${baseUrl}/knowledge/${knowledgeItem.id}`,
        lastModified: knowledgeItem.updatedAt.toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...events.map(event => ({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: event.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]

    return [...staticPages, ...dynamicPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // エラーの場合は静的ページのみ返す
    return staticPages
  }
}
