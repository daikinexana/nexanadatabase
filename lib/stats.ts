import { prisma } from './prisma';

export interface DatabaseStats {
  contests: number;
  facilities: number;
  news: number;
  knowledge: number;
}

export async function getDatabaseStats(): Promise<DatabaseStats> {
  try {
    // タイムアウトを設定（初回起動時のデータベース接続遅延に対応）
    const timeoutPromise = new Promise<DatabaseStats>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 3000);
    });

    const queryPromise = Promise.all([
      prisma.contest.count({
        where: { isActive: true }
      }),
      prisma.facility.count({
        where: { isActive: true }
      }),
      prisma.news.count({
        where: { isActive: true }
      }),
      prisma.knowledge.count({
        where: { isActive: true }
      })
    ]).then(([contestsCount, facilitiesCount, newsCount, knowledgeCount]) => ({
      contests: contestsCount,
      facilities: facilitiesCount,
      news: newsCount,
      knowledge: knowledgeCount
    }));

    // タイムアウトまたはクエリ完了のどちらか先に終わった方を返す
    return await Promise.race([queryPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error fetching database stats:', error);
    // エラー時はデフォルト値を返す（ページが表示され続けるように）
    return {
      contests: 500,
      facilities: 200,
      news: 1000,
      knowledge: 50
    };
  }
}
