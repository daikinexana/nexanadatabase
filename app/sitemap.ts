import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

/**
 * サイトマップ生成
 * 
 * SEO最適化のため、1時間ごとに再生成されます。
 * データベースから最新情報を取得して動的に生成します。
 * 
 * 含まれるページ:
 * - トップページ（priority: 1.0, changeFrequency: daily）
 * - 一覧ページ（コンテスト、公募、ロケーション、ニュース）（priority: 0.9）
 *   - コンテスト一覧（changeFrequency: daily）
 *   - 公募一覧（changeFrequency: daily）
 *   - ワークスペース一覧（changeFrequency: weekly）
 *   - ニュース一覧（changeFrequency: hourly）
 * - 静的ページ（お問い合わせ、プライバシーポリシー、利用規約）（priority: 0.3-0.5）
 * - 個別ロケーションページ（slugベース）（priority: 0.8, changeFrequency: weekly）
 * 
 * SEO最適化のポイント:
 * - 各ページのlastModifiedはデータベースの最新更新日時を使用
 * - 更新頻度の高いページ（ニュース）はhourly、低いページ（静的ページ）はyearlyに設定
 * - 優先度は重要度に応じて設定（トップページ: 1.0、一覧ページ: 0.9、詳細ページ: 0.8）
 * 
 * 注意: コンテスト、公募、ニュースの詳細ページは現時点では存在しないため、
 * 一覧ページのみが含まれています。将来的に詳細ページが追加された場合は、
 * このファイルを更新して詳細ページのURLを追加してください。
 * 
 * 将来的な拡張:
 * - コンテスト詳細ページ（/contests/[id]）
 * - 公募詳細ページ（/open-calls/[id]）
 * - ニュース詳細ページ（/news/[id]）
 * - VC/CVCデータベースページ（/vc, /cvc）
 * - 企業データベースページ（/companies）
 * - 行政データベースページ（/government）
 * - 大学データベースページ（/universities）
 */
export const revalidate = 3600 // 1時間キャッシュ
export const fetchCache = 'force-cache'

const BASE_URL = 'https://db.nexanahq.com'

/**
 * フォールバック用の基本サイトマップ
 * エラー発生時に使用されます
 */
function getFallbackSitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contests`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/open-calls`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/workspace`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  try {
    // データベースから各カテゴリの最新更新日時とロケーションデータを並列取得
    const [
      latestContest,
      latestOpenCall,
      latestLocation,
      latestNews,
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
      prisma.location.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    // 各ページのlastModifiedを設定
    // データベースの最新更新日時があれば使用、なければ現在時刻
    const homeLastModified = now.toISOString()
    const contestsLastModified = latestContest?.updatedAt.toISOString() || now.toISOString()
    const openCallsLastModified = latestOpenCall?.updatedAt.toISOString() || now.toISOString()
    const locationsLastModified = latestLocation?.updatedAt.toISOString() || now.toISOString()
    const newsLastModified = latestNews?.updatedAt.toISOString() || now.toISOString()

    // 基本ページ（トップ、一覧、静的ページ）
    const sitemapEntries: MetadataRoute.Sitemap = [
      // トップページ
      {
        url: BASE_URL,
        lastModified: homeLastModified,
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      // 一覧ページ
      {
        url: `${BASE_URL}/contests`,
        lastModified: contestsLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/open-calls`,
        lastModified: openCallsLastModified,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/workspace`,
        lastModified: locationsLastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/news`,
        lastModified: newsLastModified,
        changeFrequency: 'hourly' as const,
        priority: 0.9,
      },
      // 静的ページ
      {
        url: `${BASE_URL}/contact`,
        lastModified: now.toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/privacy`,
        lastModified: now.toISOString(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      {
        url: `${BASE_URL}/terms`,
        lastModified: now.toISOString(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
    ]

    // 個別のロケーションページを追加
    // 注意: ロケーションはslugベースでアクセス可能
    activeLocations.forEach((location) => {
      if (location.slug) {
        sitemapEntries.push({
          url: `${BASE_URL}/workspace/${location.slug}`,
          lastModified: location.updatedAt.toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      }
    })

    return sitemapEntries
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // エラー時はフォールバックサイトマップを返す
    return getFallbackSitemap()
  }
}