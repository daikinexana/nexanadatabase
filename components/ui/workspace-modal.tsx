"use client";

import { useState, useEffect } from "react";
import { Building, MapPin, Clock, ExternalLink, Copy, Briefcase, Heart, MessageCircle, Send } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import Modal from "@/components/ui/modal";
import Image from "next/image";
import { getClientIdentifier } from "@/lib/user-identifier";

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

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: WorkspaceData | null;
}

export default function WorkspaceModal({ isOpen, onClose, workspace }: WorkspaceModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; userName: string; content: string; createdAt: string }>>([]);
  const [commentContent, setCommentContent] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (workspace?.imageUrl && isOpen) {
      setIsImageLoading(true);
      setImageLoaded(false);
      
      const img = new window.Image();
      img.onload = () => {
        setIsImageLoading(false);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setIsImageLoading(false);
        setImageLoaded(false);
      };
      img.src = workspace.imageUrl;
    }
  }, [workspace?.imageUrl, isOpen]);

  // いいねとコメント情報を取得
  useEffect(() => {
    if (!workspace?.id || !isOpen) return;

    const fetchData = async () => {
      const clientId = getClientIdentifier();
      
      try {
        // いいね情報を取得
        const likesResponse = await fetch(`/api/workspace/${workspace.id}/like`, {
          headers: {
            'X-Client-Id': clientId,
          },
        });
        if (likesResponse.ok) {
          const likesData = await likesResponse.json();
          setLikeCount(likesData.likeCount || 0);
          setIsLiked(likesData.isLiked || false);
        }

        // コメント一覧を取得
        const commentsResponse = await fetch(`/api/workspace/${workspace.id}/comments`, {
          headers: {
            'X-Client-Id': clientId,
          },
        });
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        }
      } catch (error) {
        console.error('Error fetching likes and comments:', error);
      }
    };

    fetchData();
  }, [workspace?.id, isOpen]);

  const handleLike = async () => {
    if (!workspace?.id) return;
    const clientId = getClientIdentifier();
    
    try {
      const response = await fetch(`/api/workspace/${workspace.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': clientId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id || !commentContent.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const clientId = getClientIdentifier();

    try {
      const response = await fetch(`/api/workspace/${workspace.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': clientId,
        },
        body: JSON.stringify({
          content: commentContent.trim(),
          userName: userName.trim() || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [data.comment, ...prev]);
        setCommentContent("");
        setUserName("");
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  if (!workspace) return null;

  const facilityCards = [
    { title: workspace.facilityCard1Title, desc: workspace.facilityCard1Desc, image: workspace.facilityCard1Image },
    { title: workspace.facilityCard2Title, desc: workspace.facilityCard2Desc, image: workspace.facilityCard2Image },
    { title: workspace.facilityCard3Title, desc: workspace.facilityCard3Desc, image: workspace.facilityCard3Image },
    { title: workspace.facilityCard4Title, desc: workspace.facilityCard4Desc, image: workspace.facilityCard4Image },
    { title: workspace.facilityCard5Title, desc: workspace.facilityCard5Desc, image: workspace.facilityCard5Image },
    { title: workspace.facilityCard6Title, desc: workspace.facilityCard6Desc, image: workspace.facilityCard6Image },
    { title: workspace.facilityCard7Title, desc: workspace.facilityCard7Desc, image: workspace.facilityCard7Image },
    { title: workspace.facilityCard8Title, desc: workspace.facilityCard8Desc, image: workspace.facilityCard8Image },
    { title: workspace.facilityCard9Title, desc: workspace.facilityCard9Desc, image: workspace.facilityCard9Image },
  ].filter(card => card.title || card.desc || card.image);

  const tenantCards = [
    { title: workspace.tenantCard1Title, desc: workspace.tenantCard1Desc, image: workspace.tenantCard1Image },
    { title: workspace.tenantCard2Title, desc: workspace.tenantCard2Desc, image: workspace.tenantCard2Image },
    { title: workspace.tenantCard3Title, desc: workspace.tenantCard3Desc, image: workspace.tenantCard3Image },
  ].filter(card => card.title || card.desc || card.image);

  const nearbyHotelImages = [
    workspace.nearbyHotelImage1,
    workspace.nearbyHotelImage2,
    workspace.nearbyHotelImage3,
    workspace.nearbyHotelImage4,
    workspace.nearbyHotelImage5,
    workspace.nearbyHotelImage6,
    workspace.nearbyHotelImage7,
    workspace.nearbyHotelImage8,
    workspace.nearbyHotelImage9,
  ].filter(Boolean);

  const nearbyFoodCards = [
    { title: workspace.nearbyFood1Title, desc: workspace.nearbyFood1Desc, image: workspace.nearbyFood1Image },
    { title: workspace.nearbyFood2Title, desc: workspace.nearbyFood2Desc, image: workspace.nearbyFood2Image },
    { title: workspace.nearbyFood3Title, desc: workspace.nearbyFood3Desc, image: workspace.nearbyFood3Image },
  ].filter(card => card.title || card.desc || card.image);

  const nearbySpotCards = [
    { title: workspace.nearbySpot1Title, desc: workspace.nearbySpot1Desc, image: workspace.nearbySpot1Image },
    { title: workspace.nearbySpot2Title, desc: workspace.nearbySpot2Desc, image: workspace.nearbySpot2Image },
    { title: workspace.nearbySpot3Title, desc: workspace.nearbySpot3Desc, image: workspace.nearbySpot3Image },
  ].filter(card => card.title || card.desc || card.image);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={workspace.name}>
      <div className="h-full flex flex-col">
        {/* コンテンツセクション - PC版: 左半分固定、右半分スクロール / スマホ版: 縦積み */}
        <div className="flex-1 flex flex-col lg:flex-row bg-white overflow-hidden">
          {/* 左半分: 固定 (PC版のみ) */}
          <div className="hidden lg:block w-80 flex-shrink-0 p-6 border-r border-gray-200">
            {/* 左側コンテンツ */}
            <div className="flex flex-col h-full">
              {/* 画像セクション - 上部に配置 */}
              {workspace.imageUrl ? (
                <div className="relative h-60 w-full overflow-hidden rounded-lg border border-gray-200 flex-shrink-0 mb-4">
                  {/* ローディング状態 */}
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">画像を読み込み中...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 画像 */}
                  <Image
                    src={workspace.imageUrl}
                    alt={workspace.name}
                    fill
                    priority={true}
                    className={`object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onLoad={() => {
                      setIsImageLoading(false);
                      setImageLoaded(true);
                    }}
                    onError={() => {
                      setIsImageLoading(false);
                      setImageLoaded(false);
                    }}
                  />
                </div>
              ) : (
                <div className="relative h-60 w-full bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 flex-shrink-0 mb-4">
                  <div className="text-center">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">画像なし</p>
                  </div>
                </div>
              )}

              {/* アクションボタン - 画像の下に配置 */}
              <div className="space-y-2 flex-shrink-0">
                {/* いいねボタン */}
                <button
                  onClick={handleLike}
                  className={`w-full group inline-flex items-center justify-center px-4 py-2.5 font-semibold rounded-lg transition-all duration-200 text-sm ${
                    isLiked
                      ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                  {isLiked ? 'いいね済み' : 'いいね'} ({likeCount})
                </button>

                {/* ウェブサイトリンク */}
                {workspace.officialLink && (
                  <a
                    href={workspace.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full group inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ウェブサイトを見る
                  </a>
                )}

                {/* URLをコピーして共有ボタン */}
                <button
                  onClick={handleCopyUrl}
                  className="w-full group inline-flex items-center justify-center px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-all duration-200 text-sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copySuccess ? 'コピーしました！' : 'URLをコピー'}
                </button>
              </div>
            </div>
          </div>

          {/* 右半分: スクロール可能 (PC版) / 全体: スクロール可能 (スマホ版) */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="space-y-4 lg:space-y-6">
              {/* スマホ版: 画像を上部に表示 */}
              <div className="lg:hidden">
                {workspace.imageUrl ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200 mb-4">
                    <Image
                      src={workspace.imageUrl}
                      alt={workspace.name}
                      fill
                      priority={true}
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                ) : (
                  <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 mb-4">
                    <div className="text-center">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">画像なし</p>
                    </div>
                  </div>
                )}
                
                {/* スマホ版: アクションボタンを画像の下に配置 */}
                <div className="flex flex-col space-y-2 mb-6">
                  {/* いいねボタン */}
                  <button
                    onClick={handleLike}
                    className={`w-full inline-flex items-center justify-center px-4 py-3 font-semibold rounded-lg transition-all duration-200 text-base ${
                      isLiked
                        ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                        : 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                    {isLiked ? 'いいね済み' : 'いいね'} ({likeCount})
                  </button>

                  {/* ウェブサイトリンク */}
                  {workspace.officialLink && (
                    <a
                      href={workspace.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-base"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      ウェブサイトを見る
                    </a>
                  )}

                  {/* URLをコピーして共有ボタン */}
                  <button
                    onClick={handleCopyUrl}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-all duration-200 text-base"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    {copySuccess ? 'コピーしました！' : 'URLをコピー'}
                  </button>
                </div>
              </div>
              {/* 基本情報カード - モダンで洗練されたモノクロ調 */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">W</span>
                  </div>
                  基本情報
                </h3>
                
                <div className="space-y-4 lg:space-y-6">
                  <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">所在地</label>
                    <div className="flex items-center space-x-2 lg:space-x-3 mt-2">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-gray-600" />
                      </div>
                      <span className="text-gray-900 font-semibold text-base lg:text-lg">{workspace.country} / {workspace.city}</span>
                    </div>
                    {workspace.address && (
                      <p className="text-gray-700 mt-2 text-sm lg:text-base">{workspace.address}</p>
                    )}
                  </div>

                  {workspace.businessHours && (
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">営業時間</label>
                      <div className="flex items-center space-x-2 lg:space-x-3 mt-2">
                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-gray-600" />
                        </div>
                        <span className="text-gray-900 font-semibold text-base lg:text-lg">{workspace.businessHours}</span>
                      </div>
                    </div>
                  )}

                  {workspace.operator && (
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">主体</label>
                      <div className="flex items-center space-x-2 lg:space-x-3 mt-2">
                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-gray-600" />
                        </div>
                        <span className="text-gray-900 font-semibold text-base lg:text-lg">{workspace.operator}</span>
                      </div>
                    </div>
                  )}

                  {workspace.management && (
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">運営</label>
                      <div className="flex items-center space-x-2 lg:space-x-3 mt-2">
                        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-gray-600" />
                        </div>
                        <span className="text-gray-900 font-semibold text-base lg:text-lg">{workspace.management}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 施設情報カード - モダンで洗練されたモノクロ調 */}
              {(workspace.hasDropin || workspace.hasNexana || workspace.hasMeetingRoom || workspace.hasPhoneBooth || workspace.hasWifi || workspace.hasParking || workspace.priceTable || workspace.rental || workspace.notes) && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">F</span>
                    </div>
                    施設情報
                  </h3>
                  
                  <div className="space-y-6">
                    {/* 利用可能性 */}
                    {(workspace.hasDropin || workspace.hasNexana || workspace.hasMeetingRoom || workspace.hasPhoneBooth || workspace.hasWifi || workspace.hasParking) && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">施設情報</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {workspace.hasDropin && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                              ドロップイン可能
                            </span>
                          )}
                          {workspace.hasNexana && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                              nexana設置
                            </span>
                          )}
                          {workspace.hasMeetingRoom && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                              会議室
                            </span>
                          )}
                          {workspace.hasPhoneBooth && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                              電話ボックス
                            </span>
                          )}
                          {workspace.hasWifi && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                              WiFi
                            </span>
                          )}
                          {workspace.hasParking && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                              駐車場
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {workspace.priceTable && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">料金表</label>
                        <p className="text-gray-900 mt-2 leading-relaxed text-sm lg:text-base font-medium whitespace-pre-line">{workspace.priceTable}</p>
                      </div>
                    )}

                    {workspace.rental && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">貸し出し</label>
                        <p className="text-gray-900 mt-2 leading-relaxed text-sm lg:text-base font-medium whitespace-pre-line">{workspace.rental}</p>
                      </div>
                    )}

                    {workspace.notes && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">補足事項</label>
                        <p className="text-gray-900 mt-2 leading-relaxed text-sm lg:text-base font-medium whitespace-pre-line">{workspace.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 入居企業カード - モダンで洗練されたモノクロ調 */}
              {tenantCards.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                    入居企業
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tenantCards.map((card, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        {card.image && (
                          <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                            <SimpleImage
                              src={card.image}
                              alt={card.title || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {card.title && <h4 className="font-semibold mb-1 text-gray-900">{card.title}</h4>}
                        {card.desc && <p className="text-sm text-gray-600">{card.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* コミュニティーマネージャー - モダンで洗練されたモノクロ調 */}
              {workspace.communityManagerTitle && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">C</span>
                    </div>
                    コミュニティーマネージャー
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
                    {workspace.communityManagerImage && (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                        <SimpleImage
                          src={workspace.communityManagerImage}
                          alt={workspace.communityManagerTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-gray-900">{workspace.communityManagerTitle}</h4>
                      {workspace.communityManagerDesc && (
                        <p className="text-sm text-gray-600 mb-2">{workspace.communityManagerDesc}</p>
                      )}
                      {workspace.communityManagerContact && (
                        <p className="text-sm text-gray-500">{workspace.communityManagerContact}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 施設紹介カード - モダンで洗練されたモノクロ調 */}
              {facilityCards.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">F</span>
                    </div>
                    施設紹介
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {facilityCards.map((card, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        {card.image && (
                          <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                            <SimpleImage
                              src={card.image}
                              alt={card.title || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {card.title && <h4 className="font-semibold mb-1 text-gray-900">{card.title}</h4>}
                        {card.desc && <p className="text-sm text-gray-600">{card.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 周辺ホテル情報 - モダンで洗練されたモノクロ調 */}
              {(workspace.nearbyHotelTitle || workspace.nearbyHotelDesc || workspace.nearbyHotelUrl || nearbyHotelImages.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">H</span>
                    </div>
                    周辺ホテル情報
                  </h3>
                  {workspace.nearbyHotelTitle && (
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4 mb-4">
                      <p className="text-gray-900 leading-relaxed text-base lg:text-lg font-bold">{workspace.nearbyHotelTitle}</p>
                    </div>
                  )}
                  {workspace.nearbyHotelDesc && (
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4 mb-4">
                      <p className="text-gray-900 leading-relaxed text-sm lg:text-base font-medium">{workspace.nearbyHotelDesc}</p>
                    </div>
                  )}
                  {workspace.nearbyHotelUrl && (
                    <div className="mb-4">
                      <a
                        href={workspace.nearbyHotelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        詳しく見る
                      </a>
                    </div>
                  )}
                  {nearbyHotelImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {nearbyHotelImages.map((image, index) => (
                        <div key={index} className="relative w-full h-32 rounded overflow-hidden border border-gray-200">
                          <SimpleImage
                            src={image!}
                            alt={`ホテル画像 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 周辺Food情報 - モダンで洗練されたモノクロ調 */}
              {nearbyFoodCards.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">F</span>
                    </div>
                    周辺Food情報
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nearbyFoodCards.map((card, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        {card.image && (
                          <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                            <SimpleImage
                              src={card.image}
                              alt={card.title || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {card.title && <h4 className="font-semibold mb-1 text-gray-900">{card.title}</h4>}
                        {card.desc && <p className="text-sm text-gray-600">{card.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 周辺スポット情報 - モダンで洗練されたモノクロ調 */}
              {nearbySpotCards.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                    周辺スポット情報
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nearbySpotCards.map((card, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        {card.image && (
                          <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                            <SimpleImage
                              src={card.image}
                              alt={card.title || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {card.title && <h4 className="font-semibold mb-1 text-gray-900">{card.title}</h4>}
                        {card.desc && <p className="text-sm text-gray-600">{card.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* コメントセクション */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  コメント ({comments.length})
                </h3>

                {/* コメント投稿フォーム */}
                <form onSubmit={handleSubmitComment} className="mb-6 space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="お名前（任意）"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      maxLength={50}
                    />
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      placeholder="コメントを入力してください..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                      rows={3}
                      maxLength={1000}
                      required
                    />
                    <button
                      type="submit"
                      disabled={!commentContent.trim() || isSubmittingComment}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* コメント一覧 */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">まだコメントがありません。最初のコメントを投稿してみましょう！</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-l-4 border-gray-200 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

