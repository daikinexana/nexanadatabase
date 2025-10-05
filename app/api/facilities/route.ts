import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
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
      
      // ドロップインキーワードかチェック
      const isDropinKeyword = ['ドロップイン', 'dropin', 'ドロップ', 'drop'].some(keyword => 
        keyword.toLowerCase() === search.toLowerCase()
      );
      
      // Nexanaキーワードかチェック
      const isNexanaKeyword = ['nexana', 'ネクサナ', 'ネクサナ'].some(keyword => 
        keyword.toLowerCase() === search.toLowerCase()
      );
      
      if (isOrganizerTypeKeyword) {
        // 主催者タイプで検索
        where.organizerType = { contains: search, mode: "insensitive" };
      } else if (isAreaKeyword) {
        // エリアで検索（部分一致）
        where.area = { contains: search, mode: "insensitive" };
      } else if (isDropinKeyword) {
        // ドロップインで検索
        where.isDropinAvailable = true;
      } else if (isNexanaKeyword) {
        // Nexanaで検索
        where.isNexanaAvailable = true;
      } else {
        // その他の場合は、複数フィールドで部分一致検索
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { organizer: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
          { targetArea: { contains: search, mode: "insensitive" } },
          { facilityInfo: { contains: search, mode: "insensitive" } },
          { targetAudience: { contains: search, mode: "insensitive" } },
          { program: { contains: search, mode: "insensitive" } },
        ];
      }
    }

    const facilities = await prisma.facility.findMany({
      where,
      orderBy: [
        { area: "asc" },
        { createdAt: "desc" },
      ],
      // 必要なフィールドのみ選択してパフォーマンスを向上
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        address: true,
        area: true,
        organizer: true,
        organizerType: true,
        website: true,
        targetArea: true,
        facilityInfo: true,
        targetAudience: true,
        program: true,
        isDropinAvailable: true,
        isNexanaAvailable: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const response = NextResponse.json(facilities);
    
    // キャッシュヘッダーを設定
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=20');
    
    return response;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
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
      address,
      area,
      organizer,
      organizerType,
      website,
      targetArea,
      facilityInfo,
      targetAudience,
      program,
      isDropinAvailable,
      isNexanaAvailable,
    } = body;

    // バリデーション
    if (!title || !organizer || !organizerType) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.create({
      data: {
        title,
        description,
        imageUrl,
        address,
        area,
        organizer,
        organizerType,
        website,
        targetArea,
        facilityInfo,
        targetAudience,
        program,
        isDropinAvailable: isDropinAvailable || false,
        isNexanaAvailable: isNexanaAvailable || false,
      },
    });

    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    console.error("Error creating facility:", error);
    
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
      { error: "施設の作成に失敗しました" },
      { status: 500 }
    );
  }
}
