const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertTestNews() {
  try {
    // 既存のテストデータを削除
    await prisma.news.deleteMany({
      where: {
        id: {
          startsWith: 'test-news-'
        }
      }
    });

    // テストデータを挿入
    const testNews = [
      {
        id: 'test-news-1',
        title: 'VUILD、総額約2.3億円の資金調達を実施し、BtoB事業を加速',
        description: '設計・施工の自動化など建設テック領域で、BtoC中心からBtoBへ大きくシフトするための第三者割当増資を実施。職人不足や建設費高騰といった課題解決を狙い、営業体制や設備投資を強化。',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop',
        company: 'VUILD株式会社',
        sector: '建設テック',
        area: '東京都',
        amount: '約2.3億円',
        investors: '有限会社カイカイキキ,株式会社リバネスキャピタル,和建設株式会社,高島宏平 (個人),辻庸介 (個人)',
        publishedAt: new Date('2024-09-10'),
        sourceUrl: 'https://example.com/news1',
        isActive: true,
        type: 'FUNDING'
      },
      {
        id: 'test-news-2',
        title: '終活プラットフォーム「SouSou」、プレシリーズA追加調達で累計3億円超',
        description: '日本通信とウェルネットから資本参加を受け、累計調達額が3億円を超えた',
        imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop',
        company: 'そうそう',
        sector: 'ヘルステック',
        area: '東京都',
        amount: '3億円',
        investors: '日本通信,ウェルネット',
        publishedAt: new Date('2024-09-02'),
        sourceUrl: 'https://example.com/news2',
        isActive: true,
        type: 'FUNDING'
      },
      {
        id: 'test-news-3',
        title: 'ドクターズプライム、シリーズA完結で4行から4億2,000万円デット調達',
        description: '医療機関向けサービスを展開するドクターズプライムがデット調達を実施',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop',
        company: 'ドクターズプライム',
        sector: 'ヘルステック',
        area: '大阪府',
        amount: '4億2,000万円',
        investors: 'みずほ銀行,三菱UFJ銀行,三井住友銀行,りそな銀行',
        publishedAt: new Date('2024-09-01'),
        sourceUrl: 'https://example.com/news3',
        isActive: true,
        type: 'FUNDING'
      }
    ];

    for (const newsItem of testNews) {
      await prisma.news.create({
        data: newsItem
      });
      console.log(`Created news: ${newsItem.title}`);
    }

    console.log('Test news data inserted successfully!');
  } catch (error) {
    console.error('Error inserting test news:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertTestNews();
