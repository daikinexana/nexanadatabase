import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
    // const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (area) {
      where.area = area;
    }

    if (organizerType) {
      where.organizerType = organizerType;
    }

    if (search) {
      // 主催者タイプのキーワード
      const organizerTypeKeywords = ['企業', '行政', '大学', 'VC', 'その他'];
      // エリアのキーワード
      const areaKeywords = [
        '全国', '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
        '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県',
        '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
        '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県',
        '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県',
        '沖縄県', 'アメリカ', 'カナダ', 'イギリス', 'エストニア', 'オランダ', 'スペイン',
        'ドイツ', 'フランス', 'ポルトガル', '中国', '台湾', '韓国', 'インドネシア',
        'シンガポール', 'タイ', 'ベトナム', 'インド', 'UAE（ドバイ/アブダビ）', 'オーストラリア', 'その他'
      ];
      
      // 主催者タイプのキーワードかチェック
      const isOrganizerTypeKeyword = organizerTypeKeywords.some(keyword => 
        keyword.toLowerCase() === search.toLowerCase()
      );
      
      // エリアのキーワードかチェック（部分一致も含む）
      const isAreaKeyword = areaKeywords.some(keyword => 
        keyword.toLowerCase() === search.toLowerCase() ||
        keyword.toLowerCase().includes(search.toLowerCase()) ||
        search.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (isOrganizerTypeKeyword) {
        // 主催者タイプで検索
        where.organizerType = { contains: search, mode: "insensitive" };
      } else if (isAreaKeyword) {
        // エリアで検索（部分一致）
        where.area = { contains: search, mode: "insensitive" };
      } else {
        // その他の場合は、複数フィールドで部分一致検索
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { organizer: { contains: search, mode: "insensitive" } },
          { targetArea: { contains: search, mode: "insensitive" } },
          { targetAudience: { contains: search, mode: "insensitive" } },
          { availableResources: { contains: search, mode: "insensitive" } },
          { operatingCompany: { contains: search, mode: "insensitive" } },
        ];
      }
    }

    const openCalls = await prisma.openCall.findMany({
      where,
      orderBy: [
        { area: "asc" },
        { deadline: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        deadline: true,
        startDate: true,
        area: true,
        organizer: true,
        website: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        organizerType: true,
        targetArea: true,
        targetAudience: true,
        availableResources: true,
        operatingCompany: true,
      },
    });

    // デバッグ用ログ
    console.log("Fetched open calls:", openCalls.length);
    if (openCalls.length > 0) {
      console.log("First open call:", JSON.stringify(openCalls[0], null, 2));
    }

    const response = NextResponse.json(openCalls);
    
    // 開発環境ではキャッシュを無効化、本番環境では1時間キャッシュ
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    } else {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching open calls:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { error: "Failed to fetch open calls", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者権限を確認
    await requireAdmin();
    
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      deadline,
      startDate,
      area,
      organizer,
      organizerType,
      website,
      targetArea,
      targetAudience,
        availableResources,
        operatingCompany,
      } = body;

    // バリデーション
    if (!title || !organizer || !organizerType) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // 日付のバリデーション
    const deadlineDate = deadline ? new Date(deadline) : null;
    const start = startDate ? new Date(startDate) : null;
    
    if (deadlineDate && isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { error: "締切日が無効です" },
        { status: 400 }
      );
    }

    if (start && isNaN(start.getTime())) {
      return NextResponse.json(
        { error: "開始日が無効です" },
        { status: 400 }
      );
    }

    const openCall = await prisma.openCall.create({
      data: {
        title,
        description,
        imageUrl,
        deadline: deadlineDate,
        startDate: start,
        area,
        organizer,
        organizerType,
        website,
        targetArea,
        targetAudience,
        availableResources,
        operatingCompany,
        },
    });

    return NextResponse.json(openCall, { status: 201 });
  } catch (error) {
    console.error("Error creating open call:", error);
    
    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes("管理者権限")) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "公募の作成に失敗しました" },
      { status: 500 }
    );
  }
}
