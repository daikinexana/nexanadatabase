import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { MapPin, Calendar, Building2, TrendingUp, Users, Lightbulb, Handshake, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

interface StartupBoard {
  id: string;
  companyLogoUrl?: string;
  companyProductImageUrl?: string;
  companyName: string;
  companyDescriptionOneLine?: string;
  companyAndProduct?: string;
  companyOverview?: string;
  series?: string;
  corporateNumber?: string;
  establishedDate?: string;
  country: string;
  city: string;
  address?: string;
  listingStatus?: string;
  fundingStatus?: string;
  fundingOverview?: string;
  fundingLink?: string;
  hiringStatus?: string;
  hiringOverview?: string;
  hiringLink?: string;
  proposalStatus?: string;
  proposalOverview?: string;
  proposalLink?: string;
  collaborationStatus?: string;
  collaborationOverview?: string;
  collaborationLink?: string;
  createdAt: string;
}

async function getStartupBoard(id: string): Promise<StartupBoard | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/startup-boards/${id}`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching startup board:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const board = await getStartupBoard(id);

  if (!board) {
    return {
      title: "スタートアップが見つかりません | スタ募 STABO",
    };
  }

  return {
    title: `${board.companyName} | スタ募 STABO | Nexana Database`,
    description: board.companyDescriptionOneLine || `${board.companyName}の詳細情報。調達・採用・提案・共創の募集状況を掲載。`,
    keywords: `${board.companyName}, スタートアップ, ${board.city}, ${board.country}, スタ募, STABO, 調達, 採用, 提案, 共創`,
    alternates: {
      canonical: `https://db.nexanahq.com/startup-boards/${id}`,
    },
    openGraph: {
      title: `${board.companyName} | スタ募 STABO`,
      description: board.companyDescriptionOneLine || `${board.companyName}の詳細情報`,
      type: "website",
      url: `https://db.nexanahq.com/startup-boards/${id}`,
      images: board.companyProductImageUrl ? [board.companyProductImageUrl] : undefined,
    },
  };
}

export default async function StartupBoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const board = await getStartupBoard(id);

  if (!board) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 構造化データ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": board.companyName,
    "description": board.companyDescriptionOneLine || board.companyOverview,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": board.country,
      "addressRegion": board.city,
      "streetAddress": board.address,
    },
    "foundingDate": board.establishedDate,
    "url": board.fundingLink || board.hiringLink || board.proposalLink || board.collaborationLink,
  };

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ClientHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
            <span className="text-xs uppercase tracking-wider text-blue-600 font-bold">STABO</span>
          </div>
          <Link
            href="/startup-boards"
            className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← スタートアップボード一覧に戻る
          </Link>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 画像エリア */}
          <div className="relative h-64 md:h-96 bg-gradient-to-br from-blue-50 to-purple-50">
            {board.companyProductImageUrl ? (
              <img
                src={board.companyProductImageUrl}
                alt={board.companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {board.companyLogoUrl ? (
                  <img
                    src={board.companyLogoUrl}
                    alt={board.companyName}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-24 h-24 text-gray-300" />
                )}
              </div>
            )}
          </div>

          {/* コンテンツエリア */}
          <div className="p-6 md:p-8">
            {/* 企業名 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {board.companyName}
            </h1>

            {/* 一言説明 */}
            {board.companyDescriptionOneLine && (
              <p className="text-lg text-gray-600 mb-6">
                {board.companyDescriptionOneLine}
              </p>
            )}

            {/* 基本情報グリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">所在地</h2>
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{board.city}, {board.country}</span>
                  </div>
                  {board.address && (
                    <p className="text-sm text-gray-600 mt-1 ml-7">{board.address}</p>
                  )}
                </div>

                {board.establishedDate && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-1">設立日</h2>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{formatDate(board.establishedDate)}</span>
                    </div>
                  </div>
                )}

                {board.series && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-1">シリーズ</h2>
                    <div className="flex items-center text-gray-900">
                      <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
                      <span>{board.series}</span>
                    </div>
                  </div>
                )}

                {board.listingStatus && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-1">上場区分</h2>
                    <p className="text-gray-900">{board.listingStatus}</p>
                  </div>
                )}

                {board.corporateNumber && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-1">法人番号</h2>
                    <p className="text-gray-900">{board.corporateNumber}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {board.companyAndProduct && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-2">企業と製品サービス</h2>
                    <p className="text-gray-900 whitespace-pre-line">{board.companyAndProduct}</p>
                  </div>
                )}

                {board.companyOverview && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 mb-2">主な特徴など概要</h2>
                    <p className="text-gray-900 whitespace-pre-line">{board.companyOverview}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 募集情報セクション */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
              {/* 調達/M&A */}
              {board.fundingStatus && board.fundingStatus !== "なし" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">調達/M&A</h2>
                    <span className="ml-3 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                      {board.fundingStatus}
                    </span>
                  </div>
                  {board.fundingOverview && (
                    <p className="text-gray-700 mb-3 whitespace-pre-line">{board.fundingOverview}</p>
                  )}
                  {board.fundingLink && (
                    <a
                      href={board.fundingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                    >
                      詳細を見る
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              )}

              {/* 採用 */}
              {board.hiringStatus === "募集中" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Users className="w-6 h-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">採用</h2>
                    <span className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      募集中
                    </span>
                  </div>
                  {board.hiringOverview && (
                    <p className="text-gray-700 mb-3 whitespace-pre-line">{board.hiringOverview}</p>
                  )}
                  {board.hiringLink && (
                    <a
                      href={board.hiringLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      詳細を見る
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              )}

              {/* 提案 */}
              {board.proposalStatus === "募集中" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="w-6 h-6 text-purple-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">提案</h2>
                    <span className="ml-3 px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
                      募集中
                    </span>
                  </div>
                  {board.proposalOverview && (
                    <p className="text-gray-700 mb-3 whitespace-pre-line">{board.proposalOverview}</p>
                  )}
                  {board.proposalLink && (
                    <a
                      href={board.proposalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                    >
                      詳細を見る
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              )}

              {/* 共創 */}
              {board.collaborationStatus === "募集中" && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Handshake className="w-6 h-6 text-pink-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">共創</h2>
                    <span className="ml-3 px-3 py-1 bg-pink-600 text-white text-sm font-medium rounded-full">
                      募集中
                    </span>
                  </div>
                  {board.collaborationOverview && (
                    <p className="text-gray-700 mb-3 whitespace-pre-line">{board.collaborationOverview}</p>
                  )}
                  {board.collaborationLink && (
                    <a
                      href={board.collaborationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-pink-600 hover:text-pink-800 font-medium"
                    >
                      詳細を見る
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

