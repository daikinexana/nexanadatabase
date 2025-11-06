"use client";

import { useState } from "react";
import SimpleImage from "@/components/ui/simple-image";
import WorkspaceModal from "@/components/ui/workspace-modal";

interface Location {
  id: string;
  slug: string;
  country: string;
  city: string;
  description?: string | null;
  topImageUrl?: string | null;
  mapImageUrl?: string | null;
  companyCard1Image?: string | null;
  companyCard1Name?: string | null;
  companyCard1DescTop?: string | null;
  companyCard1DescBottom?: string | null;
  companyCard2Image?: string | null;
  companyCard2Name?: string | null;
  companyCard2DescTop?: string | null;
  companyCard2DescBottom?: string | null;
  companyCard3Image?: string | null;
  companyCard3Name?: string | null;
  companyCard3DescTop?: string | null;
  companyCard3DescBottom?: string | null;
  experienceCard1Image?: string | null;
  experienceCard1Title?: string | null;
  experienceCard1Url?: string | null;
  experienceCard2Image?: string | null;
  experienceCard2Title?: string | null;
  experienceCard2Url?: string | null;
  experienceCard3Image?: string | null;
  experienceCard3Title?: string | null;
  experienceCard3Url?: string | null;
  sightseeingCard1Image?: string | null;
  sightseeingCard1Title?: string | null;
  sightseeingCard2Image?: string | null;
  sightseeingCard2Title?: string | null;
  sightseeingCard3Image?: string | null;
  sightseeingCard3Title?: string | null;
  workspaces: Array<{
    id: string;
    name: string;
    imageUrl?: string | null;
    country: string;
    city: string;
    address?: string | null;
    officialLink?: string | null;
    businessHours?: string | null;
    hasDropin: boolean;
    hasNexana: boolean;
    hasMeetingRoom: boolean;
    hasPhoneBooth: boolean;
    hasWifi: boolean;
    hasParking: boolean;
    priceTable?: string | null;
    rental?: string | null;
    notes?: string | null;
    operator?: string | null;
    management?: string | null;
    tenantCard1Title?: string | null;
    tenantCard1Desc?: string | null;
    tenantCard1Image?: string | null;
    tenantCard2Title?: string | null;
    tenantCard2Desc?: string | null;
    tenantCard2Image?: string | null;
    tenantCard3Title?: string | null;
    tenantCard3Desc?: string | null;
    tenantCard3Image?: string | null;
    communityManagerImage?: string | null;
    communityManagerTitle?: string | null;
    communityManagerDesc?: string | null;
    communityManagerContact?: string | null;
    facilityCard1Title?: string | null;
    facilityCard1Desc?: string | null;
    facilityCard1Image?: string | null;
    facilityCard2Title?: string | null;
    facilityCard2Desc?: string | null;
    facilityCard2Image?: string | null;
    facilityCard3Title?: string | null;
    facilityCard3Desc?: string | null;
    facilityCard3Image?: string | null;
    facilityCard4Title?: string | null;
    facilityCard4Desc?: string | null;
    facilityCard4Image?: string | null;
    facilityCard5Title?: string | null;
    facilityCard5Desc?: string | null;
    facilityCard5Image?: string | null;
    facilityCard6Title?: string | null;
    facilityCard6Desc?: string | null;
    facilityCard6Image?: string | null;
    facilityCard7Title?: string | null;
    facilityCard7Desc?: string | null;
    facilityCard7Image?: string | null;
    facilityCard8Title?: string | null;
    facilityCard8Desc?: string | null;
    facilityCard8Image?: string | null;
    facilityCard9Title?: string | null;
    facilityCard9Desc?: string | null;
    facilityCard9Image?: string | null;
    nearbyHotelTitle?: string | null;
    nearbyHotelDesc?: string | null;
    nearbyHotelUrl?: string | null;
    nearbyHotelImage1?: string | null;
    nearbyHotelImage2?: string | null;
    nearbyHotelImage3?: string | null;
    nearbyHotelImage4?: string | null;
    nearbyHotelImage5?: string | null;
    nearbyHotelImage6?: string | null;
    nearbyHotelImage7?: string | null;
    nearbyHotelImage8?: string | null;
    nearbyHotelImage9?: string | null;
    nearbyFood1Title?: string | null;
    nearbyFood1Desc?: string | null;
    nearbyFood1Image?: string | null;
    nearbyFood2Title?: string | null;
    nearbyFood2Desc?: string | null;
    nearbyFood2Image?: string | null;
    nearbyFood3Title?: string | null;
    nearbyFood3Desc?: string | null;
    nearbyFood3Image?: string | null;
    nearbySpot1Title?: string | null;
    nearbySpot1Desc?: string | null;
    nearbySpot1Image?: string | null;
    nearbySpot2Title?: string | null;
    nearbySpot2Desc?: string | null;
    nearbySpot2Image?: string | null;
    nearbySpot3Title?: string | null;
    nearbySpot3Desc?: string | null;
    nearbySpot3Image?: string | null;
  }>;
}

interface LocationDetailClientProps {
  location: Location;
}

type WorkspaceData = {
  id: string;
  name: string;
  imageUrl?: string | null;
  country: string;
  city: string;
  address?: string | null;
  officialLink?: string | null;
  businessHours?: string | null;
  hasDropin: boolean;
  hasNexana: boolean;
  hasMeetingRoom: boolean;
  hasPhoneBooth: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  priceTable?: string | null;
  rental?: string | null;
  notes?: string | null;
  operator?: string | null;
  management?: string | null;
  tenantCard1Title?: string | null;
  tenantCard1Desc?: string | null;
  tenantCard1Image?: string | null;
  tenantCard2Title?: string | null;
  tenantCard2Desc?: string | null;
  tenantCard2Image?: string | null;
  tenantCard3Title?: string | null;
  tenantCard3Desc?: string | null;
  tenantCard3Image?: string | null;
  communityManagerImage?: string | null;
  communityManagerTitle?: string | null;
  communityManagerDesc?: string | null;
  communityManagerContact?: string | null;
  facilityCard1Title?: string | null;
  facilityCard1Desc?: string | null;
  facilityCard1Image?: string | null;
  facilityCard2Title?: string | null;
  facilityCard2Desc?: string | null;
  facilityCard2Image?: string | null;
  facilityCard3Title?: string | null;
  facilityCard3Desc?: string | null;
  facilityCard3Image?: string | null;
  facilityCard4Title?: string | null;
  facilityCard4Desc?: string | null;
  facilityCard4Image?: string | null;
  facilityCard5Title?: string | null;
  facilityCard5Desc?: string | null;
  facilityCard5Image?: string | null;
  facilityCard6Title?: string | null;
  facilityCard6Desc?: string | null;
  facilityCard6Image?: string | null;
  facilityCard7Title?: string | null;
  facilityCard7Desc?: string | null;
  facilityCard7Image?: string | null;
  facilityCard8Title?: string | null;
  facilityCard8Desc?: string | null;
  facilityCard8Image?: string | null;
  facilityCard9Title?: string | null;
  facilityCard9Desc?: string | null;
  facilityCard9Image?: string | null;
  nearbyHotelTitle?: string | null;
  nearbyHotelDesc?: string | null;
  nearbyHotelUrl?: string | null;
  nearbyHotelImage1?: string | null;
  nearbyHotelImage2?: string | null;
  nearbyHotelImage3?: string | null;
  nearbyHotelImage4?: string | null;
  nearbyHotelImage5?: string | null;
  nearbyHotelImage6?: string | null;
  nearbyHotelImage7?: string | null;
  nearbyHotelImage8?: string | null;
  nearbyHotelImage9?: string | null;
  nearbyFood1Title?: string | null;
  nearbyFood1Desc?: string | null;
  nearbyFood1Image?: string | null;
  nearbyFood2Title?: string | null;
  nearbyFood2Desc?: string | null;
  nearbyFood2Image?: string | null;
  nearbyFood3Title?: string | null;
  nearbyFood3Desc?: string | null;
  nearbyFood3Image?: string | null;
  nearbySpot1Title?: string | null;
  nearbySpot1Desc?: string | null;
  nearbySpot1Image?: string | null;
  nearbySpot2Title?: string | null;
  nearbySpot2Desc?: string | null;
  nearbySpot2Image?: string | null;
  nearbySpot3Title?: string | null;
  nearbySpot3Desc?: string | null;
  nearbySpot3Image?: string | null;
};

export default function LocationDetailClient({ location }: LocationDetailClientProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);

  const openWorkspaceModal = async (workspaceId: string) => {
    setLoadingWorkspace(true);
    try {
      const response = await fetch(`/api/workspace/${workspaceId}`);
      if (response.ok) {
        const workspaceData = await response.json();
        setSelectedWorkspace(workspaceData);
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch workspace:", response.status);
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      setLoadingWorkspace(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top画像 */}
        {location.topImageUrl && (
          <div className="relative w-full h-[60vh] mb-12 rounded-2xl overflow-hidden">
            <SimpleImage
              src={location.topImageUrl}
              alt={location.city}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{location.city}</h1>
                <p className="text-xl text-gray-200">{location.country}</p>
              </div>
            </div>
          </div>
        )}

        {/* 企業リストカード */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wider text-gray-600 mb-2">ABOUT</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">企業リスト</h2>
            <p className="text-base text-gray-700 max-w-3xl mx-auto">
              地域を代表する企業や注目のスタートアップなど、{location.city || ''}で活動する企業の情報を掲載しています。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                image: location.companyCard1Image,
                name: location.companyCard1Name,
                descTop: location.companyCard1DescTop,
                descBottom: location.companyCard1DescBottom,
              },
              {
                image: location.companyCard2Image,
                name: location.companyCard2Name,
                descTop: location.companyCard2DescTop,
                descBottom: location.companyCard2DescBottom,
              },
              {
                image: location.companyCard3Image,
                name: location.companyCard3Name,
                descTop: location.companyCard3DescTop,
                descBottom: location.companyCard3DescBottom,
              },
            ]
            .filter((card) => card.image || card.name)
            .map((card, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                  {/* 左上のタグ（descTop） */}
                  {card.descTop && (
                    <div className="mb-4">
                      <span className="inline-block bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-md">
                        {card.descTop}
                      </span>
                    </div>
                  )}
                  
                  {/* 企業名（大きなタイトル） */}
                  {card.name && (
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight min-h-[4rem] md:min-h-[5rem] flex items-start">
                      {card.name}
                    </h3>
                  )}
                  
                  {/* コンテンツエリア（画像と説明文） */}
                  <div className="space-y-4">
                    {card.image && (
                      <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden bg-gray-200">
                        <SimpleImage
                          src={card.image}
                          alt={card.name || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    {card.descBottom && (
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {card.descBottom}
                      </div>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </section>

        {/* 地図画像 */}
        {location.mapImageUrl && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <div className="text-sm uppercase tracking-wider text-gray-600 mb-2">ABOUT</div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">ワークスペース</h2>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                {location.city}で利用可能なワークスペースやコワーキングスペースの位置情報を地図で確認できます。
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl">
                <div className="relative">
                  {/* 画像コンテナ */}
                  <div className="relative overflow-hidden bg-white">
                    <SimpleImage
                      src={location.mapImageUrl || ''}
                      alt={`${location.city} 地図`}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  {/* モダンな枠線デザイン */}
                  <div className="absolute inset-0 border border-black/10 pointer-events-none"></div>
                  <div className="absolute -inset-px border border-black/5 pointer-events-none"></div>
                  
                  {/* シャドウエフェクト */}
                  <div className="absolute inset-0 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ワークスペースカード */}
        {location.workspaces && location.workspaces.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {location.workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => openWorkspaceModal(workspace.id)}
                  disabled={loadingWorkspace}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 text-left group disabled:opacity-50"
                >
                  {/* 画像エリア */}
                  <div className="relative w-full h-72 md:h-96 overflow-hidden">
                    {workspace.imageUrl ? (
                      <SimpleImage
                        src={workspace.imageUrl}
                        alt={workspace.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <div className="text-emerald-400 text-4xl">🏢</div>
                      </div>
                    )}
                    {/* グラデーションオーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* メインタイトル（中央） */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wide text-center px-4">
                        {workspace.name}
                      </h3>
                    </div>
                    
                    {/* タグ（左下） */}
                    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                      {workspace.hasNexana && (
                        <span className="inline-block bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md">
                          NEXANA
                        </span>
                      )}
                      {workspace.hasDropin && (
                        <span className="inline-block bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md">
                          ドロップイン可
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* テキストエリア（最小限） */}
                  <div className="bg-white p-6">
                    <p className="text-sm text-gray-700">
                      {workspace.country} / {workspace.city}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 体験ブログカード */}
        <section className="mb-16 bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">体験ブログ</h2>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                {location.city}での体験や滞在レポート、地域の魅力を発信するブログ記事をご紹介します。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  image: location.experienceCard1Image,
                  title: location.experienceCard1Title,
                  url: location.experienceCard1Url,
                },
                {
                  image: location.experienceCard2Image,
                  title: location.experienceCard2Title,
                  url: location.experienceCard2Url,
                },
                {
                  image: location.experienceCard3Image,
                  title: location.experienceCard3Title,
                  url: location.experienceCard3Url,
                },
              ].map((card, index) => {
                if (!card.image && !card.title) return null;
                
                return (
                  <a
                    key={index}
                    href={card.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 block"
                  >
                    {card.image && (
                      <div className="relative w-full h-64 md:h-80 overflow-hidden">
                        <SimpleImage
                          src={card.image}
                          alt={card.title || ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    {card.title && (
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {card.title}
                        </h3>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 観光地カード */}
        <section className="mb-16 bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">観光地</h2>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                {location.city}周辺の観光スポットや名所、地域の魅力を発見できる場所をご紹介します。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  image: location.sightseeingCard1Image,
                  title: location.sightseeingCard1Title,
                },
                {
                  image: location.sightseeingCard2Image,
                  title: location.sightseeingCard2Title,
                },
                {
                  image: location.sightseeingCard3Image,
                  title: location.sightseeingCard3Title,
                },
              ].map((card, index) => {
                if (!card.image && !card.title) return null;
                
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {card.image && (
                      <div className="relative w-full h-64 md:h-80 overflow-hidden">
                        <SimpleImage
                          src={card.image}
                          alt={card.title || ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    {card.title && (
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {card.title}
                        </h3>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ワークスペースモーダル */}
      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorkspace(null);
        }}
        workspace={selectedWorkspace}
      />
    </>
  );
}

