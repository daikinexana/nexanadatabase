-- 既存のレコードを削除
DELETE FROM open_calls WHERE id = 'jrw2024';

-- 新しいレコードを挿入
INSERT INTO open_calls (
  id, 
  title, 
  description, 
  "imageUrl", 
  "startDate", 
  deadline, 
  area, 
  organizer, 
  "organizerType", 
  website, 
  "targetArea", 
  "targetAudience", 
  "openCallType", 
  "availableResources", 
  "resourceType", 
  "operatingCompany", 
  "isActive", 
  "createdAt", 
  "updatedAt"
) VALUES (
  'jrw2024', 
  'JR西日本グループの事業共創プログラム 『ベルナル』', 
  'JR西日本グループの事業共創プログラム「ベルナル」は、グループが保有する駅施設・車両・WESTER・モバイルICOCA・バーチャル大阪駅3.0等のアセットを活用し、スタートアップ等と新規事業の創出に挑戦する公募です。選考後はJR西日本グループ社員と推進チームを組成し、約10か月にわたる共同検証を実施します。事業化に際してはCVCであるJR西日本イノベーションズからの出資の可能性も検討されます。UNIDGEが運営パートナーとして制度設計やメンタリング等の伴走支援を提供します。募集期間は2024年6月4日〜7月1日です。', 
  'https://prcdn.freetls.fastly.net/release_image/95753/988/95753-988-0dd90b23a817699473a82c0cb7664b4a-709x431.jpg?auto=webp&bg-color=fff&fit=bounds&format=jpeg&height=1350&quality=85&width=1950', 
  '2024-06-04 00:00:00+09', 
  '2024-07-01 23:59:00+09', 
  '全国', 
  '西日本旅客鉄道株式会社、株式会社JR西日本イノベーションズ', 
  '企業', 
  'https://unidge.co.jp/project/jrw2024', 
  '安全、安心で、人と地球にやさしい交通、人々が行き交う、いきいきとしたまち、一人ひとりにやさしく便利で豊かなくらし、持続可能な社会、リアル×デジタル', 
  '登記された法人（企業／NPO／学校等）、個人不可', 
  '共創型', 
  'JR西日本グループのアセット活用（駅施設、車両、WESTER、モバイルICOCA、バーチャル大阪駅3.0等）、推進チームの組成、約10か月の共同検証、JR西日本イノベーションズ（CVC）からの出資可能性、UNIDGEによる伴走・メンタリング、説明会', 
  'アセット提供型', 
  '株式会社ユニッジ', 
  false, 
  NOW(), 
  NOW()
);
