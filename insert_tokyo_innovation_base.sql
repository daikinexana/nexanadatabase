-- Tokyo Innovation Base (TIB) のデータを facilities テーブルに挿入するSQL
-- このSQLをNeonのSQL Editorで実行してください

INSERT INTO facilities (
  id,
  title,
  description,
  address,
  area,
  organizer,
  "organizerType",
  website,
  "targetArea",
  "imageUrl",
  "facilityInfo",
  "targetAudience",
  program,
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  'tokyo-innovation-base-001',
  'Tokyo Innovation Base (TIB)',
  '世界中のイノベーションの結節点を目指し、多様な人々がつながり、革新的なアイデアやテクノロジーで社会を前進させる挑戦者を生み出す場。世界最高にスタートアップフレンドリーな東京を目指しています。',
  '東京都千代田区丸の内3-8-3 Tokyo Innovation Base',
  '東京都',
  '東京都（Tokyo Metropolitan Government）',
  '行政',
  'https://tib.metro.tokyo.lg.jp/',
  'スタートアップ支援、イノベーション促進',
  '',
  'STUDIO, FAB, SHOP, Open Innovation, Community, TIB PITCH, Premium Mentoring, Establishment, Inbound, CATAPULT, JAM, STUDENTS',
  '学生、若者、スタートアップ、企業、大学等',
  'STUDIO：夢やアイデアをビジネスへと磨き上げる伴走支援プログラム; FAB：3Dプリンター・レーザーカッター等を備えたハードウェア開発支援フィールド; SHOP：スタートアップの一般消費者向け試験販売スペース; Open Innovation：大手企業向けの新規事業導入支援; Community：国内外のスタートアップ・支援者が出会う交流スペース; TIB PITCH：スタートアップの試験導入・展示ピッチイベント（月1回程度）; Premium Mentoring：経営者・起業家によるメンタリング機会; Establishment：中小企業診断士による開業相談・行政手続支援; Inbound：英語での外国企業・外国人向けビジネス・生活支援; CATAPULT：イノベーションクラスターを育成する協創支援プログラム; JAM：学生コミュニティ形成を促す創造的イベントプログラム; STUDENTS：中高生等に挑戦の機会を提供する支援交流プログラム',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  area = EXCLUDED.area,
  organizer = EXCLUDED.organizer,
  "organizerType" = EXCLUDED."organizerType",
  website = EXCLUDED.website,
  "targetArea" = EXCLUDED."targetArea",
  "imageUrl" = EXCLUDED."imageUrl",
  "facilityInfo" = EXCLUDED."facilityInfo",
  "targetAudience" = EXCLUDED."targetAudience",
  program = EXCLUDED.program,
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();
