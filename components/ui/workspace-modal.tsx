"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Briefcase,
  Heart,
  MessageCircle,
  Send,
  Wifi,
  Car,
  Phone,
  Users,
  DoorOpen,
  Sparkles,
  Utensils,
  BedDouble,
  HeartHandshake,
  GraduationCap,
  Presentation,
  FlaskConical,
  Wrench,
  ClipboardCheck,
  Info,
  Layers,
  X,
  type LucideIcon,
} from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import { getClientIdentifier } from "@/lib/user-identifier";
import {
  normalizeInfoCards,
  type InfoCardCategory,
} from "@/lib/workspace-info-cards";

export type WorkspaceData = {
  id: string;
  name: string;
  description?: string | null;
  infoCards?: unknown;
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
  facilityFeatureOneLine?: string | null;
  categoryWork: boolean;
  categoryConnect: boolean;
  categoryPrototype: boolean;
  categoryPilot: boolean;
  categoryTest: boolean;
  categorySupport: boolean;
  categoryShowcase: boolean;
  categoryLearn: boolean;
  categoryStay: boolean;
};

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: WorkspaceData | null;
}

/* ── 利用用途カテゴリ定義（アイコン付き） ───────────────────── */
const CATEGORY_DEFS: {
  key: keyof WorkspaceData;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "categoryWork", label: "執務", icon: Briefcase },
  { key: "categoryConnect", label: "交流", icon: Users },
  { key: "categoryPrototype", label: "試作", icon: Wrench },
  { key: "categoryPilot", label: "実証", icon: FlaskConical },
  { key: "categoryTest", label: "試験", icon: ClipboardCheck },
  { key: "categorySupport", label: "支援", icon: HeartHandshake },
  { key: "categoryShowcase", label: "発表", icon: Presentation },
  { key: "categoryLearn", label: "学ぶ", icon: GraduationCap },
  { key: "categoryStay", label: "滞在", icon: BedDouble },
];

/* ── 設備・サービス定義（アイコン付き） ───────────────────── */
const AMENITY_DEFS: {
  key: keyof WorkspaceData;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "hasDropin", label: "ドロップイン", icon: DoorOpen },
  { key: "hasNexana", label: "nexana設置", icon: Sparkles },
  { key: "hasMeetingRoom", label: "会議室", icon: Users },
  { key: "hasPhoneBooth", label: "電話ブース", icon: Phone },
  { key: "hasWifi", label: "WiFi", icon: Wifi },
  { key: "hasParking", label: "駐車場", icon: Car },
];

/* ── infoCards カテゴリごとの見出しアイコン／アクセント ─────── */
const INFO_CARD_META: Record<
  InfoCardCategory,
  { label: string; icon: LucideIcon; chipBg: string; iconClass: string }
> = {
  facility: { label: "施設情報", icon: Building2, chipBg: "bg-emerald-50", iconClass: "text-emerald-600" },
  hotel: { label: "周辺ホテル", icon: BedDouble, chipBg: "bg-violet-50", iconClass: "text-violet-600" },
  food: { label: "周辺グルメ", icon: Utensils, chipBg: "bg-amber-50", iconClass: "text-amber-600" },
  spot: { label: "周辺スポット", icon: MapPin, chipBg: "bg-sky-50", iconClass: "text-sky-600" },
};
const INFO_CARD_ORDER: InfoCardCategory[] = ["facility", "hotel", "food", "spot"];

/* ── セクション見出し ───────────────────────────────────── */
function SectionTitle({
  icon: Icon,
  title,
  count,
  chipBg = "bg-emerald-50",
  iconClass = "text-emerald-600",
}: {
  icon: LucideIcon;
  title: string;
  count?: number;
  chipBg?: string;
  iconClass?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${chipBg}`}>
        <Icon className={`w-[17px] h-[17px] ${iconClass}`} strokeWidth={2} />
      </div>
      <h3 className="text-[15px] lg:text-base font-bold text-gray-900 tracking-tight">{title}</h3>
      {typeof count === "number" && (
        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
          {count}
        </span>
      )}
    </div>
  );
}

/* ── メタ情報ボックス（gray-50） ─────────────────────────── */
function MetaBox({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-gray-50 ring-1 ring-gray-100 p-3.5 ${className}`}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-sm font-semibold text-gray-800 leading-relaxed">{children}</div>
    </div>
  );
}

export default function WorkspaceModal({ isOpen, onClose, workspace }: WorkspaceModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; userName: string; content: string; createdAt: string }>>([]);
  const [commentContent, setCommentContent] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Escキーで閉じる & 背景スクロールを固定
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  // いいねとコメント情報を取得
  useEffect(() => {
    if (!workspace?.id || !isOpen) return;

    const fetchData = async () => {
      const clientId = getClientIdentifier();

      try {
        const likesResponse = await fetch(`/api/workspace/${workspace.id}/like`, {
          headers: { "X-Client-Id": clientId },
        });
        if (likesResponse.ok) {
          const likesData = await likesResponse.json();
          setLikeCount(likesData.likeCount || 0);
          setIsLiked(likesData.isLiked || false);
        }

        const commentsResponse = await fetch(`/api/workspace/${workspace.id}/comments`, {
          headers: { "X-Client-Id": clientId },
        });
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        }
      } catch (error) {
        console.error("Error fetching likes and comments:", error);
      }
    };

    fetchData();
  }, [workspace?.id, isOpen]);

  const handleLike = async () => {
    if (!workspace?.id) return;
    const clientId = getClientIdentifier();

    try {
      const response = await fetch(`/api/workspace/${workspace.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": clientId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id || !commentContent.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const clientId = getClientIdentifier();

    try {
      const response = await fetch(`/api/workspace/${workspace.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Client-Id": clientId,
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
      console.error("Error submitting comment:", error);
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

  if (!isOpen || !workspace) return null;

  // 可変リストの施設情報・周辺情報カード（カテゴリごとにグループ化）
  const infoCards = normalizeInfoCards(workspace.infoCards);
  const infoCardGroups = INFO_CARD_ORDER.map((value) => ({
    value,
    ...INFO_CARD_META[value],
    cards: infoCards.filter((c) => c.category === value),
  })).filter((g) => g.cards.length > 0);

  const activeCategories = CATEGORY_DEFS.filter((c) => workspace[c.key]);
  const activeAmenities = AMENITY_DEFS.filter((a) => workspace[a.key]);
  const hasFacilityInfo =
    activeAmenities.length > 0 ||
    !!workspace.priceTable ||
    !!workspace.rental ||
    !!workspace.notes;

  const locationLabel = `${workspace.city}${
    workspace.country && workspace.country !== "日本" ? `・${workspace.country}` : ""
  }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={workspace.name}
    >
      {/* 背景 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* 本体 */}
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 sm:zoom-in-95 fade-in-0 duration-300">
        {/* モバイル用グラバー */}
        <div className="sm:hidden sticky top-0 z-30 flex justify-center pt-2.5 pb-1 bg-gradient-to-b from-black/10 to-transparent pointer-events-none">
          <div className="w-10 h-1 rounded-full bg-white/70" />
        </div>

        {/* 閉じるボタン */}
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-3 right-3 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヒーロー画像 */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
          {workspace.imageUrl ? (
            <SimpleImage
              src={workspace.imageUrl}
              alt={workspace.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="h-12 w-12 text-gray-300" />
            </div>
          )}

          {/* 下部グラデーション */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

          {/* 画像下オーバーレイ: 所在地 + いいね数 */}
          <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-white min-w-0">
              <MapPin className="h-4 w-4 text-emerald-300 flex-shrink-0" />
              <span className="text-sm font-semibold truncate drop-shadow">{locationLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-xs font-bold flex-shrink-0">
              <Heart className={`w-3.5 h-3.5 ${likeCount > 0 ? "fill-rose-400 text-rose-400" : ""}`} />
              {likeCount}
            </span>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-5 sm:p-6">
          {/* 利用用途チップ */}
          {activeCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {activeCategories.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full ring-1 ring-emerald-100"
                >
                  <Icon className="w-3 h-3 text-emerald-500" strokeWidth={2.2} />
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* タイトル */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug break-words">
            {workspace.name}
          </h2>

          {/* 一言 */}
          {workspace.facilityFeatureOneLine && (
            <blockquote className="mt-3 pl-3.5 border-l-[3px] border-emerald-400">
              <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                {workspace.facilityFeatureOneLine}
              </p>
            </blockquote>
          )}

          {/* アクション */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            {workspace.officialLink && (
              <a
                href={workspace.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:from-emerald-700 hover:to-teal-700 transition-all min-h-[48px] active:scale-[0.98]"
              >
                ウェブサイトを見る
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all min-h-[48px] active:scale-[0.98] ${
                  isLiked
                    ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                {isLiked ? "いいね済み" : "いいね"}
              </button>
              <button
                onClick={handleCopyUrl}
                aria-label="URLをコピーして共有"
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all min-h-[48px] active:scale-[0.98] ${
                  copySuccess
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300"
                }`}
              >
                {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copySuccess ? "コピー済み" : "共有"}
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <section className="mt-6 pt-6 border-t border-gray-100">
            <SectionTitle icon={Info} title="基本情報" />
            <div className="grid grid-cols-2 gap-2.5">
              <MetaBox label="所在地" className="col-span-2">
                <span>
                  {workspace.country} / {workspace.city}
                </span>
                {workspace.address && (
                  <p className="text-gray-500 font-normal mt-1 text-[13px]">{workspace.address}</p>
                )}
              </MetaBox>
              {workspace.businessHours && (
                <MetaBox label="営業時間" className="col-span-2">
                  <span className="inline-flex items-start gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="whitespace-pre-line">{workspace.businessHours}</span>
                  </span>
                </MetaBox>
              )}
              {workspace.operator && <MetaBox label="主体">{workspace.operator}</MetaBox>}
              {workspace.management && <MetaBox label="運営">{workspace.management}</MetaBox>}
            </div>
          </section>

          {/* 施設・設備 */}
          {hasFacilityInfo && (
            <section className="mt-6 pt-6 border-t border-gray-100">
              <SectionTitle icon={Layers} title="施設・設備" />
              <div className="space-y-5">
                {activeAmenities.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeAmenities.map(({ label, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-xl bg-gray-50 ring-1 ring-gray-100 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white ring-1 ring-emerald-100 flex-shrink-0">
                          <Icon className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-800 truncate">{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {workspace.priceTable && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">料金表</p>
                    <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-line bg-gray-50 rounded-xl p-4 ring-1 ring-gray-100">
                      {workspace.priceTable}
                    </p>
                  </div>
                )}

                {workspace.rental && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">貸し出し</p>
                    <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-line">{workspace.rental}</p>
                  </div>
                )}

                {workspace.notes && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">補足事項</p>
                    <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-line">{workspace.notes}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 施設情報・周辺情報カード（カテゴリごと） */}
          {infoCardGroups.map((group) => (
            <section key={group.value} className="mt-6 pt-6 border-t border-gray-100">
              <SectionTitle
                icon={group.icon}
                title={group.label}
                count={group.cards.length}
                chipBg={group.chipBg}
                iconClass={group.iconClass}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.cards.map((card, index) => (
                  <div
                    key={index}
                    className="group/card bg-white rounded-xl overflow-hidden ring-1 ring-gray-200/80 hover:ring-gray-300 hover:shadow-md transition-all duration-300"
                  >
                    {card.imageUrl && (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                        <SimpleImage
                          src={card.imageUrl}
                          alt={card.title || ""}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-3.5">
                      {card.title && (
                        <h4 className="font-bold mb-1 text-gray-900 text-sm leading-snug">{card.title}</h4>
                      )}
                      {card.description && (
                        <p className="text-[13px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* コメント */}
          <section className="mt-6 pt-6 border-t border-gray-100">
            <SectionTitle icon={MessageCircle} title="コメント" count={comments.length} />

            {/* 投稿フォーム */}
            <form onSubmit={handleSubmitComment} className="mb-5 space-y-2.5">
              <input
                type="text"
                placeholder="お名前（任意）"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white transition-colors"
                maxLength={50}
              />
              <div className="flex gap-2">
                <textarea
                  placeholder="コメントを入力してください..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white resize-none transition-colors"
                  rows={3}
                  maxLength={1000}
                  required
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isSubmittingComment}
                  aria-label="コメントを送信"
                  className="px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center self-stretch active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* 一覧 */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 ring-1 ring-gray-100 mb-3">
                    <MessageCircle className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">
                    まだコメントがありません。
                    <br className="sm:hidden" />
                    最初のコメントを投稿してみましょう！
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-xl bg-gray-50 ring-1 ring-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex-shrink-0">
                        {(comment.userName || "匿").charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{comment.userName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed pl-8">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
