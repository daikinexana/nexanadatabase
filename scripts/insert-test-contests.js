const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertTestContests() {
  try {
    console.log('テスト用のコンテストデータを挿入中...');

    const testContests = [
      {
        id: 'contest-1',
        title: 'スタートアップピッチコンテスト 2025',
        description: '革新的なビジネスアイデアを持つスタートアップを募集。優勝者には100万円の賞金と投資機会を提供。',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
        deadline: new Date('2025-03-31T23:59:59Z'),
        startDate: new Date('2025-01-15T10:00:00Z'),
        area: '全国',
        organizer: 'Nexana HQ',
        organizerType: '企業',
        website: 'https://example.com/contest1',
        targetArea: '全国',
        targetAudience: 'スタートアップ、起業家',
        incentive: '賞金100万円、投資機会、メンタリング',
        operatingCompany: 'Nexana Inc.',
        isActive: true,
        isPopular: true,
      },
      {
        id: 'contest-2',
        title: 'AI・ディープテック イノベーションコンテスト',
        description: 'AI、機械学習、ディープテック技術を活用した革新的なソリューションを募集。',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        deadline: new Date('2025-04-15T18:00:00Z'),
        startDate: new Date('2025-02-01T09:00:00Z'),
        area: '東京都',
        organizer: '東京大学',
        organizerType: '大学',
        website: 'https://example.com/contest2',
        targetArea: '東京都',
        targetAudience: '研究者、学生、スタートアップ',
        incentive: '研究費500万円、特許出願支援、事業化支援',
        operatingCompany: '東京大学産学連携本部',
        isActive: true,
        isPopular: true,
      },
      {
        id: 'contest-3',
        title: '地方創生スタートアップコンテスト',
        description: '地方の課題解決に取り組むスタートアップを募集。地域密着型のビジネスモデルを評価。',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        deadline: new Date('2025-05-30T17:00:00Z'),
        startDate: new Date('2025-03-01T10:00:00Z'),
        area: '大分県',
        organizer: '大分県庁',
        organizerType: '行政',
        website: 'https://example.com/contest3',
        targetArea: '大分県',
        targetAudience: '地方スタートアップ、地域企業',
        incentive: '補助金300万円、事業所提供、行政支援',
        operatingCompany: '大分県商工労働部',
        isActive: true,
        isPopular: false,
      },
      {
        id: 'contest-4',
        title: 'グローバルスタートアップコンテスト',
        description: '海外展開を目指すスタートアップのための国際コンテスト。グローバル市場での事業機会を提供。',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        deadline: new Date('2025-06-30T23:59:59Z'),
        startDate: new Date('2025-04-01T09:00:00Z'),
        area: '中国',
        organizer: '上海市政府',
        organizerType: '行政',
        website: 'https://example.com/contest4',
        targetArea: '中国',
        targetAudience: 'グローバルスタートアップ',
        incentive: '投資額1000万円、中国市場参入支援、現地パートナー紹介',
        operatingCompany: '上海市商務委員会',
        isActive: true,
        isPopular: true,
      },
      {
        id: 'contest-5',
        title: 'サステナビリティイノベーションコンテスト',
        description: '環境問題や社会課題の解決に取り組むスタートアップを募集。SDGs達成に貢献するアイデアを評価。',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
        deadline: new Date('2025-07-31T18:00:00Z'),
        startDate: new Date('2025-05-01T10:00:00Z'),
        area: '大阪府',
        organizer: '関西大学',
        organizerType: '大学',
        website: 'https://example.com/contest5',
        targetArea: '大阪府',
        targetAudience: '環境系スタートアップ、研究者',
        incentive: '研究費300万円、グリーンテック支援、国際会議参加',
        operatingCompany: '関西大学環境学部',
        isActive: true,
        isPopular: false,
      }
    ];

    // 既存のデータを削除
    await prisma.contest.deleteMany({
      where: {
        id: {
          in: testContests.map(c => c.id)
        }
      }
    });

    // テストデータを挿入
    for (const contest of testContests) {
      await prisma.contest.create({
        data: contest
      });
      console.log(`✓ ${contest.title} を挿入しました`);
    }

    console.log('✅ テスト用のコンテストデータの挿入が完了しました！');

    // 挿入されたデータを確認
    const count = await prisma.contest.count();
    console.log(`📊 現在のコンテスト数: ${count}件`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertTestContests();
