import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import SimpleImage from "@/components/ui/simple-image";

export const metadata: Metadata = {
  title: "ロケーション一覧 | Nexana Database",
  description: "世界各国・都市のロケーション情報を掲載。ワークスペース情報や地域情報を提供します。",
  keywords: "ロケーション, 都市, ワークスペース, 地域情報, ネクサナ, nexana",
  alternates: {
    canonical: "https://db.nexanahq.com/location",
  },
  openGraph: {
    title: "ロケーション一覧 | Nexana Database",
    description: "世界各国・都市のロケーション情報を掲載",
    type: "website",
    url: "https://db.nexanahq.com/location",
  },
};

interface Location {
  id: string;
  slug: string;
  country: string;
  city: string;
  description?: string | null;
  topImageUrl?: string | null;
  isActive: boolean;
  workspaces: Array<{
    id: string;
    name: string;
    imageUrl?: string | null;
  }>;
}

async function getLocations(): Promise<Location[]> {
  try {
    // サーバーサイドでは直接Prismaを使用する方が確実
    const { prisma } = await import("@/lib/prisma");
    
    const locations = await prisma.location.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        country: true,
        city: true,
        description: true,
        topImageUrl: true,
        isActive: true,
        workspaces: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: [
        { country: "asc" },
        { city: "asc" },
        { createdAt: "desc" },
      ],
    });

    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const revalidate = 3600;
export const fetchCache = 'force-cache';
export const preferredRegion = 'auto';

export default async function LocationPage() {
  const locations = await getLocations();

  // 都道府県の順序定義
  const prefectureOrder = [
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県'
  ];

  // 都道府県の順序を取得する関数
  const getPrefectureOrder = (city: string) => {
    const index = prefectureOrder.indexOf(city);
    return index === -1 ? 999 : index;
  };

  // ソート処理：日本国内は都道府県順、海外は国名順
  const sortedLocations = [...locations].sort((a, b) => {
    // 日本国内のロケーションを優先
    if (a.country === "日本" && b.country !== "日本") {
      return -1;
    }
    if (a.country !== "日本" && b.country === "日本") {
      return 1;
    }

    // 日本国内同士の場合は都道府県順
    if (a.country === "日本" && b.country === "日本") {
      const aOrder = getPrefectureOrder(a.city);
      const bOrder = getPrefectureOrder(b.city);
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      // 同じ都道府県内では都市名順
      return a.city.localeCompare(b.city, 'ja');
    }

    // 海外同士の場合は国名順、同じ国では都市名順
    if (a.country !== b.country) {
      return a.country.localeCompare(b.country, 'ja');
    }
    return a.city.localeCompare(b.city, 'ja');
  });

  // 国別にグループ化
  const locationsByCountry = sortedLocations.reduce((acc, location) => {
    if (!acc[location.country]) {
      acc[location.country] = [];
    }
    acc[location.country].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヒーローセクション */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl min-h-[500px] flex items-center">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/facilities.image.png')"
              }}
            ></div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-teal-800/60 to-transparent"></div>
            
            <div className="relative px-8 py-16 text-left max-w-4xl">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-6 shadow-lg">
                <MapPin className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">LOCATIONS</span>
              </div>
              
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  Locations
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-emerald-300 to-transparent flex-1 max-w-32"></div>
                  <span className="text-lg font-medium text-emerald-100 px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    ロケーション一覧
                  </span>
                </div>
              </div>
              
              <div className="max-w-2xl">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-medium mb-4">
                  世界各国・都市のロケーション情報を掲載
                </p>
                <p className="text-base text-emerald-100 font-medium">
                  Location information for cities around the world
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ロケーション一覧 */}
        <div className="space-y-12">
          {Object.entries(locationsByCountry).map(([country, countryLocations]) => (
            <div key={country}>
              <h2 className="text-2xl font-bold text-black mb-8">{country}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {countryLocations.map((location) => (
                  <Link
                    key={location.id}
                    href={`/location/${location.slug}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 block"
                  >
                    {/* 画像エリア */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                      {location.topImageUrl ? (
                        <SimpleImage
                          src={location.topImageUrl}
                          alt={location.city}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <MapPin className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* 暗いオーバーレイ */}
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      {/* 上部説明文（日本語、中央上部） */}
                      {location.description && (
                        <div className="absolute top-6 left-0 right-0 text-center">
                          <p className="text-white text-sm md:text-base font-bold leading-relaxed px-4">
                            {location.description}
                          </p>
                        </div>
                      )}
                      
                      {/* メインタイトル（Slug、中央上部寄り、大きく太字） */}
                      <div className="absolute inset-0 flex items-start justify-center pt-12 md:pt-16">
                        <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wide text-center px-4">
                          {location.slug}
                        </h3>
                      </div>
                      
                      {/* タグ（左下） */}
                      {location.workspaces && location.workspaces.length > 0 && (
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-block bg-black text-white text-[10px] font-medium px-2.5 py-1 uppercase tracking-wider rounded">
                            {location.workspaces.length} Workspaces
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* テキストブロック */}
                    <div className="bg-white px-4 py-5">
                      {/* 詳細情報 */}
                      <div className="text-sm text-gray-600 mb-2">
                        {location.country}
                      </div>
                      
                      {/* タイトル（都市名） */}
                      <h4 className="text-xl font-bold text-black">
                        {location.city}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">ロケーション情報がありません</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

