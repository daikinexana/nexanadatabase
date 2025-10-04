const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertTestData() {
  try {
    console.log('テスト用のデータを挿入中...');

    // オープンコールのテストデータ
    const testOpenCalls = [
      {
        id: 'opencall-1',
        title: 'AI技術を活用したDX推進パートナー募集',
        description: '製造業のDX推進に向けて、AI技術を活用したソリューションを提供できるパートナーを募集。',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
        deadline: new Date('2025-04-30T23:59:59Z'),
        startDate: new Date('2025-02-01T09:00:00Z'),
        area: '全国',
        organizer: 'トヨタ自動車',
        organizerType: '企業',
        website: 'https://example.com/opencall1',
        targetArea: '全国',
        targetAudience: 'AI技術企業、DXコンサルティング企業',
        availableResources: '開発費5000万円、技術支援、人材派遣',
        operatingCompany: 'トヨタ自動車株式会社',
        isActive: true,
      },
      {
        id: 'opencall-2',
        title: '地方創生プロジェクト協業パートナー募集',
        description: '過疎地域の活性化に向けたICT活用プロジェクトの協業パートナーを募集。',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        deadline: new Date('2025-05-15T17:00:00Z'),
        startDate: new Date('2025-03-01T10:00:00Z'),
        area: '大分県',
        organizer: '大分県庁',
        organizerType: '行政',
        website: 'https://example.com/opencall2',
        targetArea: '大分県',
        targetAudience: 'ICT企業、地方創生支援企業',
        availableResources: '補助金2000万円、行政支援、ネットワーク提供',
        operatingCompany: '大分県商工労働部',
        isActive: true,
      }
    ];

    // 施設のテストデータ
    const testFacilities = [
      {
        id: 'facility-1',
        title: '東京イノベーションセンター',
        description: 'スタートアップ向けのコワーキングスペースとインキュベーション施設。最新の設備とメンタリングサービスを提供。',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
        address: '東京都渋谷区恵比寿1-1-1',
        area: '東京都',
        organizer: '東京都',
        organizerType: '行政',
        website: 'https://example.com/facility1',
        facilityInfo: 'コワーキングスペース、会議室、イベントスペース',
        program: 'インキュベーションプログラム、メンタリング、ネットワーキング',
        targetArea: '東京都',
        targetAudience: 'スタートアップ、フリーランサー、起業家',
        isDropinAvailable: true,
        isNexanaAvailable: true,
        isActive: true,
      },
      {
        id: 'facility-2',
        title: '大阪スタートアップハブ',
        description: '関西圏のスタートアップ支援施設。アクセラレーションプログラムと投資家ネットワークを提供。',
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
        address: '大阪府大阪市北区梅田1-1-1',
        area: '大阪府',
        organizer: '大阪府',
        organizerType: '行政',
        website: 'https://example.com/facility2',
        facilityInfo: 'オフィス、ラボ、イベントホール',
        program: 'アクセラレーションプログラム、ピッチイベント、投資家マッチング',
        targetArea: '大阪府',
        targetAudience: 'スタートアップ、投資家、企業',
        isDropinAvailable: false,
        isNexanaAvailable: true,
        isActive: true,
      }
    ];

    // ニュースのテストデータ
    const testNews = [
      {
        id: 'news-1',
        title: 'AIスタートアップ「TechAI」がシリーズAで10億円調達',
        description: '機械学習技術を活用した企業向けソリューションを提供するTechAIが、シリーズAラウンドで10億円の資金調達を発表。',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        company: 'TechAI',
        sector: 'AI・機械学習',
        amount: '10億円',
        investors: 'SoftBank Vision Fund, みずほキャピタル',
        publishedAt: new Date('2025-01-10T09:00:00Z'),
        sourceUrl: 'https://example.com/news1',
        type: 'funding',
        area: '東京都',
        isActive: true,
      },
      {
        id: 'news-2',
        title: '地方スタートアップ「GreenTech」がM&Aで大企業に買収',
        description: '環境技術に特化した地方スタートアップGreenTechが、大手商社によるM&Aで買収されることが決定。',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
        company: 'GreenTech',
        sector: '環境・エネルギー',
        amount: '50億円',
        investors: '三菱商事',
        publishedAt: new Date('2025-01-08T14:30:00Z'),
        sourceUrl: 'https://example.com/news2',
        type: 'm&a',
        area: '大分県',
        isActive: true,
      }
    ];

    // ナレッジのテストデータ
    const testKnowledge = [
      {
        id: 'knowledge-1',
        title: 'AI技術の最新トレンドとビジネス応用',
        description: '2025年のAI技術トレンドと、スタートアップでの実装方法について解説。',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        publishedAt: new Date('2025-01-05T10:00:00Z'),
        categoryTag: 'AI・テクノロジー',
        website: 'https://example.com/knowledge1',
        area: '全国',
        isActive: true,
      },
      {
        id: 'knowledge-2',
        title: 'スタートアップの資金調達戦略',
        description: 'シード期からシリーズAまでの資金調達のポイントと投資家との関係構築について。',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        publishedAt: new Date('2025-01-03T15:00:00Z'),
        categoryTag: 'ビジネス・戦略',
        website: 'https://example.com/knowledge2',
        area: '全国',
        isActive: true,
      }
    ];

    // 既存のテストデータを削除
    await prisma.openCall.deleteMany({
      where: { id: { in: testOpenCalls.map(c => c.id) } }
    });
    await prisma.facility.deleteMany({
      where: { id: { in: testFacilities.map(f => f.id) } }
    });
    await prisma.news.deleteMany({
      where: { id: { in: testNews.map(n => n.id) } }
    });
    await prisma.knowledge.deleteMany({
      where: { id: { in: testKnowledge.map(k => k.id) } }
    });

    // データを挿入
    for (const openCall of testOpenCalls) {
      await prisma.openCall.create({ data: openCall });
      console.log(`✓ オープンコール: ${openCall.title}`);
    }

    for (const facility of testFacilities) {
      await prisma.facility.create({ data: facility });
      console.log(`✓ 施設: ${facility.title}`);
    }

    for (const news of testNews) {
      await prisma.news.create({ data: news });
      console.log(`✓ ニュース: ${news.title}`);
    }

    for (const knowledge of testKnowledge) {
      await prisma.knowledge.create({ data: knowledge });
      console.log(`✓ ナレッジ: ${knowledge.title}`);
    }

    console.log('✅ テストデータの挿入が完了しました！');

    // 各テーブルの件数を確認
    const contestCount = await prisma.contest.count();
    const openCallCount = await prisma.openCall.count();
    const facilityCount = await prisma.facility.count();
    const newsCount = await prisma.news.count();
    const knowledgeCount = await prisma.knowledge.count();

    console.log(`📊 データ件数:`);
    console.log(`  - コンテスト: ${contestCount}件`);
    console.log(`  - オープンコール: ${openCallCount}件`);
    console.log(`  - 施設: ${facilityCount}件`);
    console.log(`  - ニュース: ${newsCount}件`);
    console.log(`  - ナレッジ: ${knowledgeCount}件`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertTestData();
