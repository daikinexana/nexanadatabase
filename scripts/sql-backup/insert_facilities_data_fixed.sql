-- 既存のfacilitiesテーブルにデータを追加するSQL（修正版）
-- NOT NULL制約を削除し、既存のスキーマに合わせた形

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
) VALUES
('bruntwood-scitech-001','Bruntwood SciTech','Bruntwood SciTechは、英国主要都市にライフサイエンス／テック企業向けのオフィス・ラボ・インキュベーション機能を備えたキャンパスを展開する事業者。大学や医療機関、投資家と連携し、成長段階に応じた柔軟な拠点、資金・人材・ネットワーク機会を提供し、研究成果の事業化とイノベーションを加速する。','Union, 2-10 Albert Square, Manchester M2 6LW, United Kingdom','イギリス','Bruntwood SciTech','企業','https://bruntwood.co.uk/scitech/','ライフサイエンス・テック領域のイノベーション促進、スタートアップ支援','https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoiYnJ1bnR3b29kXC9hY2NvdW50c1wvM2ZcLzQwMDA5NjJcL3Byb2plY3RzXC81XC9hc3NldHNcL2ExXC8xNTE2MVwvMTJlYjlhNzkzOTU0NjQxMDY2ZTdkZjE4ZWNmZTBmN2MtMTYzNDgyNTczMS5qcGcifQ%3Abruntwood%3AHIF9aLo7Jok2YHQAyuwgBsEjly5tQ-p1s7o9rL3ZGqI?format=jpeg&width=960','オフィス、ラボ、コワーキング、会議室、イベントスペース、イノベーションキャンパス','ライフサイエンス企業、テック企業、研究機関、スタートアップ','- オフィス＆ラボ：成長段階に応じた柔軟な空間提供\n- ビジネスサポート：資金・人材・販路の実務支援\n- 共同研究：大学・医療機関・企業との共創機会\n- イベント：ピッチや交流会等のコミュニティ企画',true,NOW(),NOW()),

('hubhub-001','HubHub','HubHubは、ロンドンの20 Farringdon StreetとWorship Squareを拠点に、柔軟な会員制ワークスペース、プライベートオフィス、イベントスペースを提供。コミュニティ運営と多彩なイベントで企業や起業家の協業を促進し、ウェルビーイング設備や充実のアメニティで生産性の高い環境を実現する。','20 Farringdon St, London EC4A 4AB, United Kingdom','イギリス','HubHub','企業','https://www.hubhub.com/','柔軟なワークスペース提供、コミュニティ形成、イノベーション促進','https://www.hubhub.com/wp-content/uploads/fly-images/10544/0X8A7224-scaled-e1713525942899-3200x1792.jpg','プライベートオフィス、コワーキング、会議室、イベントスペース、フィットネス、ラウンジ','スタートアップ、成長企業、フリーランサー、リモートワーカー','- メンバーシップ：デスク／ラウンジを月額で利用\n- プライベートオフィス：2〜100名規模に対応\n- 会議室：2〜20名の多様な部屋を提供\n- イベントスペース：最大100名の催事運営支援\n- ウェルビーイング：ジム／シャワー等の設備',true,NOW(),NOW()),

('edge-workspaces-001','EDGE Workspaces','EDGE Workspacesは、オランダ発のデベロッパーEDGEが展開するサステナブルなフレキシブルオフィス。アムステルダムやベルリン等のスマートビル内に、プライベートオフィス、会員制クラブ、会議室、イベント空間を備え、ホスピタリティとテクノロジーで目的志向のプロフェッショナルの成長を支援する。','','オランダ','EDGE（Edge Technologies B.V.）','企業','https://www.edgeworkspaces.com/','サステナブル・スマートビルでのワークスペース提供、コミュニティ形成','https://e6gtk6z23a9.exactdn.com/wp-content/uploads/amsterdam-location-II.webp?lossy=1&ssl=1&strip=all','プライベートオフィス、会員制クラブ、会議室、イベントスペース、カフェ、ジム','企業、SME、スタートアップ、プロフェッショナル','- Private Offices：6か月〜の柔軟契約\n- Memberships：Business Club／専用デスク\n- Meeting Rooms：時間貸し会議室\n- Event Spaces：最大250名に対応\n- Hospitality：レセプション／カフェ／ジム',true,NOW(),NOW()),

('labs-001','LABS','LABSは、ロンドンのカムデン／ホルボーンに9拠点を持つコワーキング＆サービスオフィスブランド。デザイン性の高い空間、会議室、イベントスペース、ジムやシャワー等の設備、コミュニティプログラムを提供し、日単位から専用オフィスまで柔軟に選べる環境で企業と起業家の成長を後押しする。','Stables Market, Chalk Farm Rd, London NW1 8AH, United Kingdom','イギリス','LABS','企業','https://labs.com/','コワーキング・イベント運営によるスタートアップ支援','https://labs-website-wordpress-content-dev.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/03/21155818/LABS-Atrium-Camden.jpg','プライベートオフィス、コワーキング、会議室、イベントスペース、ジム、ラウンジ','スタートアップ、企業、クリエイター、フリーランサー','- Private Offices：専用個室と拠点拡張\n- Roaming：全拠点で使えるフレックス席\n- Meeting Rooms：用途別の会議室\n- Event Space：ローンチ／パネル等に対応\n- Wellbeing：ジム／ヨガ／シャワー',true,NOW(),NOW()),

('bridge-79-robinson-road-001','Bridge+ 79 Robinson Road','Bridge+ 79 Robinson Roadは、シンガポールCBDのCapitaSky内に位置するフレキシブルワークスペース。約56,000平方フィート、3フロアにわたりデスク／スイート、25室以上の会議・イベント設備を備え、FinTechを中心としたコミュニティ形成と知見共有を促進する拠点として機能する。','79 Robinson Rd, Singapore 068897','シンガポール','CapitaLand Investment Limited（Bridge+）','企業','','FinTechコミュニティ形成、フレキシブルオフィス提供',NULL,'フレックスデスク、固定席、プライベートスイート、会議室、イベントスペース、ラウンジ','FinTech企業、金融機関、スタートアップ、投資家、専門家','- Flexi／Fixed Desk：個人〜小チーム向け\n- Private Suites：機密性の高い専用区画\n- Meeting Rooms：25室規模の多目的会議室\n- Event Spaces：30〜200名のイベント対応\n- FinTechプログラム：業界団体との連携企画',true,NOW(),NOW()),

('jtc-launchpad-one-north-001','JTC LaunchPad @ one-north','JTC LaunchPad @ one-northは、スタートアップ集積を目的に政府系のJTCが運営する拠点。インキュベータ・アクセラレータ、試作・メイカーズ設備、イベントスペース、メンタリングや資金調達支援などを一体的に提供し、研究機関や産業クラスターと連携して成長を加速する。','','シンガポール','JTC（Jurong Town Corporation）','行政','https://www.jtc.gov.sg/find-space/launchpad--onenorth','スタートアップ支援、起業・事業化促進',NULL,'インキュベータ、アクセラレータ、メイカースペース、試作設備、イベントスペース、共同研究機能','スタートアップ、起業家、研究者、アクセラレータ、投資家','- インキュベーション：メンタリング／伴走支援\n- アクセラレーション：成長促進プログラム\n- プロトタイピング：試作・実証の設備提供\n- コミュニティ：イベント／ネットワーキング\n- 施設提供：低コストの拠点確保',true,NOW(),NOW()),

('dubai-internet-city-001','Dubai Internet City','Dubai Internet City（DIC）は、テクノロジー企業のための自由区としてTECOM Groupが運営するイノベーションコミュニティ。主要IT企業の地域本社やスタートアップが集積し、オフィス、ビジネスライセンス、柔軟な人材・ビザ制度、イベントとネットワーク機会を提供して中東市場への進出を支える。','Dubai Internet City, Dubai, United Arab Emirates','UAE（ドバイ/アブダビ）','TECOM Group PJSC','企業','https://dic.ae/','テクノロジー集積、ビジネス誘致・成長支援',NULL,'オフィス、ライセンス制度、ビジネス支援、イベント会場、カンファレンス施設','IT企業、スタートアップ、国際企業、起業家','- 会社設立／ライセンス：自由区制度の活用支援\n- オフィスソリューション：柔軟な拠点選択\n- ビジネス支援：行政連携／規制対応ガイド\n- イベント：カンファレンス／展示会開催\n- ネットワーク：地域・グローバル企業と接点',true,NOW(),NOW()),

('in5-001','in5','in5は、TECOM Groupが運営する起業支援プラットフォーム。Tech・Media・Designの3拠点で、コワーキング、プロトタイピング設備、メンタリング、企業連携、資金調達・法務等のサポートを提供。学生から創業者までを対象に、ピッチやアクセラレーションを通じて事業化を後押しする。','','UAE（ドバイ/アブダビ）','TECOM Group PJSC','企業','https://infive.ae/','アクセラレーション、起業家育成、試作支援',NULL,'コワーキング、プロトタイピングラボ、メンタリング、イベントスペース、スタジオ','学生、起業家、クリエイター、スタートアップ','- コワーキング：柔軟な作業環境\n- プロトタイピング：3Dプリント／レーザー加工\n- メンタリング：専門家の個別支援\n- アクセラレーション：ピッチ／資金調達支援\n- コミュニティ：勉強会／ミートアップ',true,NOW(),NOW()),

('the-mills-fabrica-001','The Mills Fabrica','The Mills Fabricaは、Nan Fung Groupが運営するテックスタイル／アグリフード領域のイノベーションプラットフォーム。香港とロンドンにインキュベーションスペース、試作ラボ、イベントホールを備え、投資・パイロット支援・企業連携・展示を通じてサステナブルな産業変革を促進する。','The Mills, 45 Pak Tin Par Street, Tsuen Wan, Hong Kong','中国','The Mills Fabrica（Nan Fung Group）','企業','https://www.themillsfabrica.com/','テックスタイル／アグリフードのイノベーション支援',NULL,'インキュベーションスペース、Fabrica Lab、ショールーム／イベントホール、コワーキング','スタートアップ、研究者、企業、投資家','- Incubation：資金／事業化サポート\n- Fabrica Lab：試作／素材評価の設備\n- Showroom／Events：展示／デモ／大型イベント\n- 投資：シード〜成長資金の提供\n- 産学連携：大企業／大学との共創',true,NOW(),NOW()),

('kloud-001','KLOUD','KLOUDは、Keppel Landが展開するサービスド・コオフィス。シンガポールを中心に、フレキシブルなプラン、プライベートオフィス、会議室、コミュニティイベントを提供し、企業の拡張やプロジェクトに合わせてスケール可能なワークプレイスを実現する。','','シンガポール','Keppel Land Limited（KLOUD）','企業','https://kloudsco.com/','フレキシブルオフィス提供、コミュニティ運営',NULL,'プライベートオフィス、コワーキング、会議室、フォンブース、イベントスペース','企業、プロジェクトチーム、スタートアップ、リモートワーカー','- サービスドオフィス：家具付き個室\n- コワーキング：柔軟なデスクプラン\n- 会議室：時間課金の会議／研修\n- コミュニティ：イベント／ネットワーキング\n- 拠点連携：他都市のKLOUD利用',true,NOW(),NOW()),

('station-f-001','STATION F','STATION Fは、パリ13区にある世界最大級のスタートアップキャンパス。3000名超の創業者が集うエコシステムとして、入居プログラム、VC・大企業・公共機関との連携、ファブ施設やイベントスペース、住居（Flatmates）まで一体で提供し、創業から成長までを支援する。','5 Parvis Alan Turing, 75013 Paris, France','フランス','STATION F','企業','https://stationf.co/','スタートアップ支援、アクセラレーション、エコシステム構築',NULL,'キャンパス、アクセラレータプログラム、会議室、イベントホール、ファブ施設、住居支援','スタートアップ、起業家、学生、投資家、企業','- Founders Program：選抜制の入居支援\n- パートナープログラム：大企業／VC主催\n- 専門サービス：法務／会計／採用の窓口\n- イベント：ピッチ／カンファレンス\n- FLATMATES：創業者向け共同住宅',true,NOW(),NOW())

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
