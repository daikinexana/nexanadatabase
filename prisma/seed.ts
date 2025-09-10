import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータの作成を開始...');

  // サンプルコンテストデータ
  const contests = [
    {
      title: "NEXCO東日本『E-NEXCO OPEN INNOVATION PROGRAM 2025』",
      description: "高速道路・SA・PAの新しい提供価値の創出を目指すプログラム",
      content: "## プログラム概要\n\n高速道路・SA・PAの新しい提供価値の創出を目指すオープンイノベーションプログラムです。\n\n## 募集テーマ\n- 効率化\n- コミュニティ\n- 地方創生\n- 旅行・観光\n- カーボンニュートラル",
      deadline: new Date("2025-09-17"),
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-21"),
      area: "全国",
      organizer: "東日本高速道路株式会社",
      organizerType: "GOVERNMENT" as const,
      category: "INNOVATION_CHALLENGE" as const,
      tags: ["効率化", "コミュニティ", "地方創生", "旅行・観光", "カーボンニュートラル"],
      website: "https://example.com/nexco",
      isActive: true,
    },
    {
      title: "渋沢MIXオープンイノベーションプログラム Canvas",
      description: "様々な企業が自由な発想で絵(新規事業)を描く舞台",
      content: "## プログラム概要\n\n様々な企業が自由な発想で絵(新規事業)を描く舞台として開催されるオープンイノベーションプログラムです。\n\n## 募集テーマ\n- 地域活性\n- ヘルスケア\n- ものづくり\n- 食文化\n- サーキュラーエコノミー\n- ウェルビーイング",
      deadline: new Date("2025-10-10"),
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-10-31"),
      area: "埼玉県",
      organizer: "埼玉県",
      organizerType: "GOVERNMENT" as const,
      category: "STARTUP_CONTEST" as const,
      tags: ["地域活性", "ヘルスケア", "ものづくり", "食文化", "サーキュラーエコノミー", "ウェルビーイング"],
      website: "https://example.com/canvas",
      isActive: true,
    },
    {
      title: "Asahi Kasei Value Co-Creation Table 2025",
      description: "次世代のサステナブルを共に切り開く",
      content: "## プログラム概要\n\n次世代のサステナブルを共に切り開くための共創プログラムです。\n\n## 募集テーマ\n- 3Dプリンター\n- シミュレーション\n- 精製\n- プロセスイノベーション",
      deadline: new Date("2025-10-31"),
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-10-31"),
      area: "全国",
      organizer: "旭化成株式会社",
      organizerType: "CORPORATION" as const,
      category: "INNOVATION_CHALLENGE" as const,
      tags: ["3Dプリンター", "シミュレーション", "精製", "プロセスイノベーション"],
      website: "https://example.com/asahi",
      isActive: true,
    },
  ];

  // サンプルニュースデータ
  const news = [
    {
      title: "終活プラットフォーム「SouSou」、プレシリーズA追加調達で累計3億円超",
      description: "日本通信とウェルネットから資本参加を受け、累計調達額が3億円を超えた",
      content: "## 調達概要\n\n終活プラットフォーム「SouSou」がプレシリーズA追加調達を実施し、累計調達額が3億円を超えました。\n\n## 投資家\n- 日本通信\n- ウェルネット",
      company: "そうそう",
      type: "FUNDING" as const,
      sector: "ヘルステック",
      amount: "3億円",
      round: "プレシリーズA",
      investors: ["日本通信", "ウェルネット"],
      publishedAt: new Date("2025-09-02"),
      source: "BRIDGE",
      sourceUrl: "https://example.com/sousou",
      tags: ["終活", "プラットフォーム", "プレシリーズA", "日本通信", "ウェルネット"],
      isActive: true,
    },
    {
      title: "ドクターズプライム、シリーズA完結で4行から4億2,000万円デット調達",
      description: "医療機関向けサービスを展開するドクターズプライムがデット調達を実施",
      content: "## 調達概要\n\n医療機関向けサービスを展開するドクターズプライムがシリーズA完結で4行から4億2,000万円のデット調達を実施しました。",
      company: "ドクターズプライム",
      type: "FUNDING" as const,
      sector: "ヘルステック",
      amount: "4億2,000万円",
      round: "シリーズA",
      investors: ["4行"],
      publishedAt: new Date("2025-09-02"),
      source: "BRIDGE",
      sourceUrl: "https://example.com/doctors-prime",
      tags: ["医療", "シリーズA", "デット調達", "4億2,000万円"],
      isActive: true,
    },
  ];

  // サンプルナレッジデータ
  const knowledge = [
    {
      title: "バイブコーディングは本格開発に使えるの？——PolyscapeのAI駆動開発",
      description: "開発期間の大幅短縮を実現するAI駆動開発手法について解説",
      content: "## AI駆動開発の可能性\n\nバイブコーディングという新しい開発手法について、Polyscapeの事例を交えて解説します。\n\n## 開発効率化のポイント\n- AIを活用したコード生成\n- 開発期間の短縮\n- 品質の向上",
      category: "AI" as const,
      author: "kigoyama",
      publishedAt: new Date("2025-08-26"),
      tags: ["AI", "コーディング", "開発効率化", "バイブコーディング", "Polyscape"],
      isActive: true,
    },
    {
      title: "量子コンピューティングの最新動向とスタートアップへの影響",
      description: "量子コンピューティング技術の進歩とスタートアップが取り組むべき領域について",
      content: "## 量子コンピューティングの現状\n\n量子コンピューティング技術の進歩と、スタートアップが取り組むべき領域について解説します。\n\n## スタートアップの機会\n- 量子アルゴリズムの開発\n- 量子セキュリティ\n- 量子シミュレーション",
      category: "DEEPTECH" as const,
      author: "Nexana Research Team",
      publishedAt: new Date("2025-08-25"),
      tags: ["量子コンピューティング", "ディープテック", "スタートアップ", "技術トレンド"],
      isActive: true,
    },
  ];

  // サンプル施設データ
  const facilities = [
    {
      title: "STATION Ai（ステーション エーアイ）",
      description: "名古屋・鶴舞にある日本最大規模のオープンイノベーション拠点。スタートアップやパートナー企業、VC・大学などが集まり、オフィス／コワーキング、イベントスペース、ホテルや飲食などを備える「働く・学ぶ・交わる」ための複合施設。入居スタートアップ約500社、パートナー企業約200社（2025年2月時点）。",
      address: "愛知県名古屋市昭和区鶴舞一丁目2番32号",
      area: "愛知県",
      organizer: "STATION Ai株式会社",
      organizerType: "企業",
      website: "https://stationai.co.jp/",
      targetArea: "ICT領域のテック系スタートアップ（投資・伴走支援の対象）",
      imageUrl: "https://prcdn.freetls.fastly.net/release_image/95825/59/95825-59-7101a66fe53a521fcc9c8e630a4af800-3048x1712.jpg",
      facilityInfo: "規模：地上7階・延床約23,600㎡; ゾーニング：1F カフェ/レストラン/イベント、2F あいち創業館/テックラボ/託児、M3F 一般会議室、3–6F オフィス/ラウンジ/会議室、7F ホテル/交流リビング/フィットネス/屋上バー（※一部会員専用）",
      targetAudience: "スタートアップ; パートナー企業; VC・大学・支援機関; 一般来場者",
      program: "STATION Ai Catapult（創業前後～シード期向けの短期集中プログラム）; STAPS（学生起業家育成）; ACTIVATION Lab（社会人向けの新規事業人材・起業家育成）; SKIP（企業向けのオープンイノベーション推進）",
      isActive: true,
    },
  ];

  // ダミーユーザーを作成（実際の運用ではClerkのWebhookで作成）
  const dummyUser = await prisma.user.upsert({
    where: { email: "admin@nexana.com" },
    update: {},
    create: {
      clerkId: "dummy_clerk_id",
      email: "admin@nexana.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log('👤 ダミーユーザーを作成:', dummyUser.email);

  // コンテストデータを作成
  for (const contestData of contests) {
    const contest = await prisma.contest.create({
      data: {
        ...contestData,
        tags: Array.isArray(contestData.tags) ? contestData.tags.join(',') : contestData.tags,
        createdBy: dummyUser.id,
      },
    });
    console.log('🏆 コンテストを作成:', contest.title);
  }

  // ニュースデータを作成
  for (const newsData of news) {
    const newsItem = await prisma.news.create({
      data: {
        ...newsData,
        tags: Array.isArray(newsData.tags) ? newsData.tags.join(',') : newsData.tags,
        investors: Array.isArray(newsData.investors) ? newsData.investors.join(',') : newsData.investors,
        createdBy: dummyUser.id,
      },
    });
    console.log('📰 ニュースを作成:', newsItem.title);
  }

  // ナレッジデータを作成
  for (const knowledgeData of knowledge) {
    const knowledgeItem = await prisma.knowledge.create({
      data: {
        ...knowledgeData,
        tags: Array.isArray(knowledgeData.tags) ? knowledgeData.tags.join(',') : knowledgeData.tags,
        createdBy: dummyUser.id,
      },
    });
    console.log('📚 ナレッジを作成:', knowledgeItem.title);
  }

  // 施設データを作成
  for (const facilityData of facilities) {
    const facility = await prisma.facility.create({
      data: facilityData,
    });
    console.log('🏢 施設を作成:', facility.title);
  }

  console.log('✅ シードデータの作成が完了しました！');
}

main()
  .catch((e) => {
    console.error('❌ シードデータの作成中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
