import { prisma } from './prisma';

export interface DatabaseStats {
  programs: number;
  workspaces: number;
  news: number;
}

export async function getDatabaseStats(): Promise<DatabaseStats> {
  try {
    // タイムアウトを設定（初回起動時のデータベース接続遅延に対応）
    const timeoutPromise = new Promise<DatabaseStats>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 3000);
    });

    const queryPromise = Promise.all([
      // コンテスト・公募・プログラム数（/opportunities が参照する Opportunity テーブル）
      prisma.opportunity.count({
        where: { isActive: true }
      }),
      // 実際に登録されているワークスペース数（/workspace が参照する Workspace テーブル）
      prisma.workspace.count({
        where: { isActive: true }
      }),
      prisma.news.count({
        where: { isActive: true }
      })
    ]).then(([programsCount, workspacesCount, newsCount]) => ({
      programs: programsCount,
      workspaces: workspacesCount,
      news: newsCount
    }));

    // タイムアウトまたはクエリ完了のどちらか先に終わった方を返す
    return await Promise.race([queryPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error fetching database stats:', error);
    // エラー時はデフォルト値を返す（ページが表示され続けるように）
    return {
      programs: 10,
      workspaces: 50,
      news: 1000
    };
  }
}
