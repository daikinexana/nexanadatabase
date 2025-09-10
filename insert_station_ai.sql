-- STATION AiのデータをNeonデータベースに挿入するSQL
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
  'station-ai-001',
  'STATION Ai（ステーション エーアイ）',
  '名古屋・鶴舞にある日本最大規模のオープンイノベーション拠点。スタートアップやパートナー企業、VC・大学などが集まり、オフィス／コワーキング、イベントスペース、ホテルや飲食などを備える「働く・学ぶ・交わる」ための複合施設。入居スタートアップ約500社、パートナー企業約200社（2025年2月時点）。',
  '愛知県名古屋市昭和区鶴舞一丁目2番32号',
  '愛知県',
  'STATION Ai株式会社',
  '企業',
  'https://stationai.co.jp/',
  'ICT領域のテック系スタートアップ（投資・伴走支援の対象）',
  'https://prcdn.freetls.fastly.net/release_image/95825/59/95825-59-7101a66fe53a521fcc9c8e630a4af800-3048x1712.jpg',
  '規模：地上7階・延床約23,600㎡; ゾーニング：1F カフェ/レストラン/イベント、2F あいち創業館/テックラボ/託児、M3F 一般会議室、3–6F オフィス/ラウンジ/会議室、7F ホテル/交流リビング/フィットネス/屋上バー（※一部会員専用）',
  'スタートアップ; パートナー企業; VC・大学・支援機関; 一般来場者',
  'STATION Ai Catapult（創業前後～シード期向けの短期集中プログラム）; STAPS（学生起業家育成）; ACTIVATION Lab（社会人向けの新規事業人材・起業家育成）; SKIP（企業向けのオープンイノベーション推進）',
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
