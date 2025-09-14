-- 既存のfacilitiesテーブルに日本の施設データを追加するSQL
-- 既存のスキーマに合わせてNOT NULL制約を削除

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
('cic-tokyo-001','CIC TOKYO','CIC TOKYOは、虎ノ門ヒルズ ビジネスタワーに拠点を構える国内最大級のスタートアップ拠点。可変型オフィスやコワーキング、会議室、イベント会場を備え、投資家や大企業、行政と交わる高密度なコミュニティと伴走支援で、起業からグローバル展開までを加速する。','東京都港区虎ノ門1-17-1 虎ノ門ヒルズ ビジネスタワー 15F','東京都','CIC Japan合同会社（Cambridge Innovation Center）','企業','https://jp.cic.com/en/cic-tokyo/','スタートアップ支援、イノベーション促進、コミュニティ形成、グローバル連携',NULL,'コワーキング、プライベートオフィス、会議室、イベントスペース、フォンブース、24時間利用、バイリンガルスタッフ','スタートアップ、起業家、投資家、企業、行政','- Growth Support Program：成長段階に応じた伴走支援\n- Event Space Rentals：大型イベントやピッチに対応\n- Japan Desk：海外拠点連携とソフトランディング支援\n- CIC Institute：産学官連携による知見提供',true,NOW(),NOW()),

('koil-001','KOIL（柏の葉オープンイノベーションラボ）','KOILは、柏の葉スマートシティに位置する三井不動産のオープンイノベーション拠点。大型コワーキングや専有オフィス、デジタル工作室、実証フィールドを備え、メンタリングや企業連携で新産業創出と実装を後押しする。','千葉県柏市若柴178-4 柏の葉キャンパス148街区2 ショップ&オフィス棟6階','千葉県','三井不動産株式会社（Mitsui Fudosan Co., Ltd.）','不動産系','https://www.koil.jp/','スタートアップ支援、プロトタイピング支援、実証実験、企業連携',NULL,'コワーキング、専有オフィス、デジタル工作室、実証フィールド、ラボ、メンタリング','スタートアップ、起業家、企業、研究者、学生','- KOIL OFFICE：コワーキング/専有オフィスの提供\n- KOIL FACTORY PRO：試作を支えるデジタル工作室\n- 実証フィールド：街全体を使った実証環境\n- メンタリング：事業成長の専門家支援',true,NOW(),NOW()),

('dmm-make-akiba-001','DMM.make AKIBA','DMM.make AKIBAは、秋葉原に開設されたハードウェア開発に特化したコワーキング＆ファブ拠点。3Dプリンタや各種加工機、電子実装設備など試作環境と、専門スタッフによる技術支援、コミュニティ・イベントで、ものづくりスタートアップの事業化を支援する。','東京都千代田区神田練塀町3 富士ソフト秋葉原ビル10F・11F・12F','東京都','合同会社DMM.com（DMM.com LLC）','企業','https://akiba.dmm.com/','ハードウェア開発支援、プロトタイピング、起業支援、コミュニティ形成',NULL,'コワーキング、ファブ設備、電子実装設備、会議室、イベントスペース、技術相談','ハードウェア系スタートアップ、エンジニア、デザイナー、起業家','- FAB：3Dプリンタや加工機による試作環境\n- COWORKING：開発に集中できる作業スペース\n- TECH SUPPORT：専門スタッフの技術相談\n- EVENT：勉強会・ピッチ・交流イベント',true,NOW(),NOW()),

('fukuoka-growth-next-001','Fukuoka Growth Next（FGN）','Fukuoka Growth Nextは、旧大名小学校校舎を活用した福岡市の官民共働型スタートアップ支援施設。起業相談窓口やコワーキング、イベント、アクセラレーション等を提供し、地域内外の企業・投資家との接点を創出して成長と実証を加速する。','福岡県福岡市中央区大名2-6-11','福岡県','福岡市（Fukuoka City）','行政','https://growth-next.com/en','スタートアップ支援、アクセラレーション、起業相談、コミュニティ形成',NULL,'コワーキング、イベントホール、会議室、起業相談、アクセラレータープログラム','起業家、スタートアップ、学生、企業、投資家','- STARTUP CAFE：起業相談と情報提供\n- COWORKING：柔軟なワークプレイス\n- ACCELERATION：成長志向の伴走支援\n- EVENTS：ピッチや交流でネットワーク拡大',true,NOW(),NOW()),

('osaka-innovation-hub-001','Osaka Innovation Hub（OIH）','Osaka Innovation Hubは大阪市が支援するスタートアップコミュニティ拠点。ピッチや交流イベント、グローバル連携、メンタリングを通じて起業家・投資家・企業をつなぎ、関西から世界へ挑むイノベーション創出を推進する。','大阪府大阪市北区大深町3-1 グランフロント大阪 タワーC 7階','大阪府','大阪市（City of Osaka）','行政','https://www.innovation-osaka.jp/','スタートアップ支援、グローバル連携、イベント運営、オープンイノベーション',NULL,'イベントスペース、ピッチ機会、メンタリング、海外ネットワーク、コミュニティ','スタートアップ、起業家、投資家、企業、自治体','- PITCH：定期ピッチイベントで登壇機会\n- GLOBAL LINK：海外拠点と相互連携\n- MENTORING：専門家による個別支援\n- COMMUNITY：大阪発の起業家ネットワーク形成',true,NOW(),NOW()),

('plug-and-play-japan-001','Plug and Play Japan','Plug and Play Japanは、シリコンバレー発Plug and Playの日本拠点。多領域のアクセラレータープログラムと大企業連携、投資を通じ、国内外スタートアップの事業成長と実証・協業を加速するイノベーションプラットフォーム。','東京都渋谷区道玄坂1-10-8 渋谷道玄坂東急ビル1F','東京都','Plug and Play Japan株式会社（Plug and Play Japan KK）','VC','https://japan.plugandplaytechcenter.com/','アクセラレーション、事業共創、PoC支援、資金調達支援',NULL,'アクセラレータープログラム、企業マッチング、投資、イベント、PoC支援','スタートアップ、事業会社、投資家、自治体、大学','- ACCELERATOR：分野別バッチで成長支援\n- CORPORATE INNOVATION：大企業との協業創出\n- VENTURES：投資と資金調達機会\n- EVENTS：SUMMITや交流イベントを開催',true,NOW(),NOW()),

('open-network-lab-001','Open Network Lab（Onlab）','Open Network Labはデジタルガレージが運営する国内草創期のシードアクセラレータ。シード期の伴走支援、メンタリング、資金調達支援に加え、北海道・福岡やweb3等の特化プログラムで起業家のグローバル展開を後押しする。','東京都渋谷区恵比寿南3-5-7 デジタルゲートビル','東京都','株式会社デジタルガレージ（Digital Garage, Inc.）','VC','https://onlab.jp/en/','シード支援、アクセラレーション、オープンイノベーション、グローバル連携',NULL,'アクセラレータ、メンタリング、投資連携、地域/テーマ特化プログラム、コミュニティ','起業家、スタートアップ、研究者、企業、投資家','- Seed Accelerator：シード期に特化した伴走\n- Open Innovation：大企業との共創支援\n- Onlab HOKKAIDO／FUKUOKA：地域特化の成長支援\n- onlab web3：次世代技術領域の育成',true,NOW(),NOW()),

('foundx-001','東京大学 FoundX','東京大学 FoundXは、東大卒業生・研究者を対象に非エクイティで提供する起業支援プログラム。個室オフィスやコミュニティ、実務支援を無償で提供し、アイデア検証から初期資金調達までを長期で伴走し、社会実装を目指す。','','東京都','東京大学（The University of Tokyo）','大学と研究機関','https://foundx.jp/','起業支援、アクセラレーション、コミュニティ形成、実務支援',NULL,'個室オフィス、コワーキング、メンタリング、資金調達支援、学習リソース','東大卒業生、研究者、起業家チーム、学生','- Founders Program：9か月の長期伴走と個室提供\n- Studio Program：テーマ特化のアイデア創出\n- COMMUNITY：卒業生ネットワークと相互支援\n- RESOURCES：クラウドや法務等の支援特典',true,NOW(),NOW()),

('tokyo-sogyo-station-001','TOKYO創業ステーション','TOKYO創業ステーションは、東京都が提供する創業支援拠点。丸の内と多摩の2拠点で、起業相談、専門家アドバイス、セミナー、交流スペース、仮説検証支援や助成金情報などをワンストップで提供し、はじめての起業を後押しする。','東京都千代田区丸の内二丁目1番1号 明治安田生命ビル 低層棟1・2・3階','東京都','東京都（Tokyo Metropolitan Government）','行政','https://startup-station.jp/','創業支援、相談窓口、セミナー・イベント、仮説検証支援',NULL,'起業相談窓口、交流スペース、セミナー会場、専門相談、助成金情報','創業希望者、個人事業主、プレ起業家、学生、女性・シニア','- コンシェルジュ相談：先輩起業家による伴走\n- プランコンサル：事業計画の作成支援\n- イベント・セミナー：学びと交流の場\n- Startup Hub Tokyo：情報・書籍・ラウンジ提供',true,NOW(),NOW()),

('shibuya-qws-001','SHIBUYA QWS','SHIBUYA QWSは渋谷駅直結の渋谷スクランブルスクエア内にある共創拠点。多様な分野の人材が問いを起点に交差する場として、プロジェクトスペース、イベントホール、会員制プログラムやQWSチャレンジなどで価値創造を加速する。','東京都渋谷区渋谷2-24-12 渋谷スクランブルスクエア 東棟15階','東京都','渋谷スクランブルスクエア株式会社（SHIBUYA SCRAMBLE SQUARE Co., Ltd.）','不動産系','https://shibuya-qws.com/en/','共創支援、コミュニティ形成、実証実験、イベント運営',NULL,'プロジェクトスペース、イベントホール、個室、サロン、カフェ、会員制度','起業家、研究者、クリエイター、企業、学生、自治体','- QWS Challenge：問いを起点にした採択プログラム\n- MEMBERSHIP：個人・法人向け会員制度\n- CROSSTAGE：実証や展示のイベント運営\n- COMMUNITY：多様な分野を横断する出会いを創出',true,NOW(),NOW())

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

