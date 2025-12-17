import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
import LocationCard from "@/components/ui/location-card";

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        {/* ヒーローセクション - iPhone 16最適化 */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] aspect-[16/9] sm:aspect-[16/6] flex items-center group">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
              style={{
                backgroundImage: "url('/facilities.image.png')"
              }}
            ></div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            
            {/* 装飾的な要素 - iPhone 16最適化 */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-0.5 sm:w-1 h-8 sm:h-12 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full"></div>
                <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-white font-bold">Locations</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative px-4 sm:px-8 md:px-16 py-10 sm:py-16 md:py-20 text-left max-w-5xl z-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 leading-[0.95] tracking-tight" style={{
                textShadow: '0 4px 40px rgba(0,0,0,0.4), 0 2px 20px rgba(0,0,0,0.3)'
              }}>
                Locations
              </h1>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light">ロケーション一覧</p>
                <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-white/60 to-transparent"></div>
              </div>
              
              <div className="max-w-3xl space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-light">
                  世界各国・都市のロケーション情報を掲載
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70 font-light">
                  Location information for cities around the world
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ロケーション一覧 - iPhone 16最適化 */}
        <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
          {Object.entries(locationsByCountry).map(([country, countryLocations]) => (
            <div key={country}>
              {/* 国別セクションヘッダー - iPhone 16最適化 */}
              <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <div className="w-0.5 sm:w-1 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
                  <div className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full border border-emerald-200/50">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-emerald-700 font-bold">Country</span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 leading-[0.95] tracking-tight mt-3 sm:mt-4">
                  {country}
                </h2>
                <div className="pt-3 sm:pt-4">
                  <span className="text-xs sm:text-sm text-gray-500 font-light">{countryLocations.length} locations</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {countryLocations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gray-100 mb-4 sm:mb-6">
              <MapPin className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 font-light">ロケーション情報がありません</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

