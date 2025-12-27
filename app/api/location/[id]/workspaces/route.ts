import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const WORKSpaces_PER_PAGE = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = searchParams.get("limit");
    const all = searchParams.get("all") === "true";
    // all=trueの場合は全件取得、そうでない場合はlimitパラメータまたはデフォルト値を使用
    const limit = all ? 100000 : parseInt(limitParam || String(WORKSpaces_PER_PAGE), 10);
    const skip = all ? 0 : (page - 1) * limit;

    // フィルターパラメータを取得
    const categoriesParam = searchParams.get("categories");
    const categories = categoriesParam ? categoriesParam.split(",") : [];
    const filterMultipleLocationsParam = searchParams.get("filterMultipleLocations");
    const filterMultipleLocations = filterMultipleLocationsParam !== null ? filterMultipleLocationsParam === "true" : null;
    const filterDropinParam = searchParams.get("filterDropin");
    const filterDropin = filterDropinParam !== null ? filterDropinParam === "true" : null;

    // ロケーションを取得（IDまたはSlugで検索）
    const location = await prisma.location.findFirst({
      where: {
        isActive: true,
        OR: [
          { id: resolvedParams.id },
          { slug: resolvedParams.id },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Locationが見つかりません" },
        { status: 404 }
      );
    }

    // フィルター条件を構築
    const categoryMap: Record<string, string> = {
      work: "categoryWork",
      connect: "categoryConnect",
      prototype: "categoryPrototype",
      pilot: "categoryPilot",
      test: "categoryTest",
      support: "categorySupport",
      showcase: "categoryShowcase",
      learn: "categoryLearn",
      stay: "categoryStay",
    };

    const whereConditions: Prisma.WorkspaceWhereInput = {
      locationId: location.id,
      isActive: true,
    };

    // カテゴリフィルタ（複数選択対応・AND条件）
    if (categories.length > 0) {
      const categoryConditions: Prisma.WorkspaceWhereInput[] = categories
        .map((category) => {
          const categoryKey = categoryMap[category];
          if (categoryKey) {
            return { [categoryKey]: true } as Prisma.WorkspaceWhereInput;
          }
          return null;
        })
        .filter((condition): condition is Prisma.WorkspaceWhereInput => condition !== null);
      
      if (categoryConditions.length > 0) {
        const existingAnd = whereConditions.AND 
          ? (Array.isArray(whereConditions.AND) ? whereConditions.AND : [whereConditions.AND])
          : [];
        whereConditions.AND = [
          ...existingAnd,
          ...categoryConditions,
        ];
      }
    }

    // 複数拠点フィルタ
    if (filterMultipleLocations !== null) {
      whereConditions.hasMultipleLocations = filterMultipleLocations;
    }

    // ドロップインフィルタ
    if (filterDropin !== null) {
      whereConditions.hasDropin = filterDropin;
    }

    // まず、フィルター条件に合致するワークスペースIDを取得
    const filteredWorkspaceIds = await prisma.workspace.findMany({
      where: whereConditions,
      select: {
        id: true,
      },
    });

    const workspaceIds = filteredWorkspaceIds.map(ws => ws.id);

    // ワークスペースの総数（フィルター適用後）
    const totalCount = workspaceIds.length;

    if (workspaceIds.length === 0) {
      return NextResponse.json({
        workspaces: [],
        pagination: {
          page,
          limit,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    }

    // いいね数を集計
    const likeCounts = await prisma.workspaceLike.groupBy({
      by: ['workspaceId'],
      where: {
        workspaceId: {
          in: workspaceIds,
        },
      },
      _count: {
        workspaceId: true,
      },
    });

    const likeCountMap = new Map(
      likeCounts.map(item => [item.workspaceId, item._count.workspaceId])
    );

    // デバッグ: いいね数の確認
    console.log(`[Workspaces API] Location: ${location.id}, Total workspaces: ${workspaceIds.length}, Workspaces with likes: ${likeCounts.length}`);
    if (likeCounts.length > 0) {
      const topLikes = likeCounts
        .sort((a, b) => b._count.workspaceId - a._count.workspaceId)
        .slice(0, 5)
        .map(item => ({ workspaceId: item.workspaceId, likeCount: item._count.workspaceId }));
      console.log(`[Workspaces API] Top 5 workspaces by likes:`, JSON.stringify(topLikes, null, 2));
    }

    // ワークスペースを取得（いいね数でソート）
    const workspaces = await prisma.workspace.findMany({
      where: {
        id: {
          in: workspaceIds,
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        country: true,
        city: true,
        address: true,
        officialLink: true,
        businessHours: true,
        hasDropin: true,
        hasNexana: true,
        hasMeetingRoom: true,
        hasPhoneBooth: true,
        hasWifi: true,
        hasParking: true,
        priceTable: true,
        rental: true,
        notes: true,
        operator: true,
        management: true,
        tenantCard1Title: true,
        tenantCard1Desc: true,
        tenantCard1Image: true,
        tenantCard2Title: true,
        tenantCard2Desc: true,
        tenantCard2Image: true,
        tenantCard3Title: true,
        tenantCard3Desc: true,
        tenantCard3Image: true,
        communityManagerImage: true,
        communityManagerTitle: true,
        communityManagerDesc: true,
        communityManagerContact: true,
        facilityCard1Title: true,
        facilityCard1Desc: true,
        facilityCard1Image: true,
        facilityCard2Title: true,
        facilityCard2Desc: true,
        facilityCard2Image: true,
        facilityCard3Title: true,
        facilityCard3Desc: true,
        facilityCard3Image: true,
        facilityCard4Title: true,
        facilityCard4Desc: true,
        facilityCard4Image: true,
        facilityCard5Title: true,
        facilityCard5Desc: true,
        facilityCard5Image: true,
        facilityCard6Title: true,
        facilityCard6Desc: true,
        facilityCard6Image: true,
        facilityCard7Title: true,
        facilityCard7Desc: true,
        facilityCard7Image: true,
        facilityCard8Title: true,
        facilityCard8Desc: true,
        facilityCard8Image: true,
        facilityCard9Title: true,
        facilityCard9Desc: true,
        facilityCard9Image: true,
        nearbyHotelTitle: true,
        nearbyHotelDesc: true,
        nearbyHotelUrl: true,
        nearbyHotelImage1: true,
        nearbyHotelImage2: true,
        nearbyHotelImage3: true,
        nearbyHotelImage4: true,
        nearbyHotelImage5: true,
        nearbyHotelImage6: true,
        nearbyHotelImage7: true,
        nearbyHotelImage8: true,
        nearbyHotelImage9: true,
        nearbyFood1Title: true,
        nearbyFood1Desc: true,
        nearbyFood1Image: true,
        nearbyFood2Title: true,
        nearbyFood2Desc: true,
        nearbyFood2Image: true,
        nearbyFood3Title: true,
        nearbyFood3Desc: true,
        nearbyFood3Image: true,
        nearbySpot1Title: true,
        nearbySpot1Desc: true,
        nearbySpot1Image: true,
        nearbySpot2Title: true,
        nearbySpot2Desc: true,
        nearbySpot2Image: true,
        nearbySpot3Title: true,
        nearbySpot3Desc: true,
        nearbySpot3Image: true,
        facilityFeatureOneLine: true,
        categoryWork: true,
        categoryConnect: true,
        categoryPrototype: true,
        categoryPilot: true,
        categoryTest: true,
        categorySupport: true,
        categoryShowcase: true,
        categoryLearn: true,
        categoryStay: true,
        hasMultipleLocations: true,
        requiresAdvanceNotice: true,
        canDoWebMeeting: true,
        hasEnglishSupport: true,
        meetsNexanaStandard: true,
        isNexanaRecommended: true,
        createdAt: true,
      },
    });

    // デバッグ: ソート前の最初の10件のいいね数を確認
    if (workspaces.length > 0) {
      const beforeSort = workspaces.slice(0, 10).map(ws => ({
        id: ws.id,
        name: ws.name,
        isNexanaRecommended: ws.isNexanaRecommended,
        likeCount: likeCountMap.get(ws.id) || 0,
      }));
      console.log(`[Workspaces API] Before sort (first 10):`, JSON.stringify(beforeSort, null, 2));
    }

    // いいね数でソート（nexana Best 3を最上位に、その次にいいね数の多い順）
    // 注意: sort()は元の配列を変更するため、コピーを作成してからソート
    const sortedWorkspaces = [...workspaces].sort((a, b) => {
      // 1. nexana Best 3を最上位に
      if (a.isNexanaRecommended && !b.isNexanaRecommended) return -1;
      if (!a.isNexanaRecommended && b.isNexanaRecommended) return 1;
      
      // 2. 両方ともnexana Best 3、または両方ともそうでない場合、いいね数でソート
      const aLikeCount = likeCountMap.get(a.id) || 0;
      const bLikeCount = likeCountMap.get(b.id) || 0;
      
      // いいね数の多い順（降順）
      if (bLikeCount !== aLikeCount) {
        return bLikeCount - aLikeCount;
      }
      
      // いいね数が同じ場合は、作成日時の新しい順（降順）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // ソート結果を元の配列に反映
    workspaces.length = 0;
    workspaces.push(...sortedWorkspaces);

    // デバッグ: ソート後の最初の10件のいいね数を確認
    if (workspaces.length > 0) {
      const afterSort = workspaces.slice(0, 10).map(ws => ({
        id: ws.id,
        name: ws.name,
        isNexanaRecommended: ws.isNexanaRecommended,
        likeCount: likeCountMap.get(ws.id) || 0,
      }));
      console.log(`[Workspaces API] After sort (first 10):`, JSON.stringify(afterSort, null, 2));
      
      // いいね数順が正しいか検証
      let isValid = true;
      for (let i = 1; i < afterSort.length; i++) {
        const prev = afterSort[i - 1];
        const curr = afterSort[i];
        // nexana Best 3を除いて、いいね数が降順になっているか確認
        if (!prev.isNexanaRecommended && !curr.isNexanaRecommended) {
          if (prev.likeCount < curr.likeCount) {
            isValid = false;
            console.error(`[Workspaces API] Sort validation failed: ${prev.name} (${prev.likeCount}) should come before ${curr.name} (${curr.likeCount})`);
            break;
          }
        }
      }
      if (isValid) {
        console.log(`[Workspaces API] Sort validation passed: Workspaces are correctly sorted by likes`);
      }
    }

    // ページネーション適用
    const paginatedWorkspaces = all 
      ? workspaces 
      : workspaces.slice(skip, skip + limit);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      workspaces: paginatedWorkspaces,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}

