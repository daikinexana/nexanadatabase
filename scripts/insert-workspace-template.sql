-- ワークスペース追加用SQLテンプレート
-- 注意: カラム名はキャメルケース（priceTable, tenantCard1Titleなど）を使用してください

INSERT INTO workspaces (
  id, 
  name, 
  country, 
  city, 
  address,
  "priceTable", 
  rental, 
  notes, 
  operator, 
  management,
  "tenantCard1Title", 
  "tenantCard1Desc", 
  "tenantCard1Image",
  "tenantCard2Title", 
  "tenantCard2Desc", 
  "tenantCard2Image",
  "tenantCard3Title", 
  "tenantCard3Desc", 
  "tenantCard3Image",
  "communityManagerImage", 
  "communityManagerTitle", 
  "communityManagerDesc", 
  "communityManagerContact",
  "facilityCard1Title", 
  "facilityCard1Desc", 
  "facilityCard1Image",
  "facilityCard2Title", 
  "facilityCard2Desc", 
  "facilityCard2Image",
  "facilityCard3Title", 
  "facilityCard3Desc", 
  "facilityCard3Image",
  "facilityCard4Title", 
  "facilityCard4Desc", 
  "facilityCard4Image",
  "facilityCard5Title", 
  "facilityCard5Desc", 
  "facilityCard5Image",
  "facilityCard6Title", 
  "facilityCard6Desc", 
  "facilityCard6Image",
  "facilityCard7Title", 
  "facilityCard7Desc", 
  "facilityCard7Image",
  "facilityCard8Title", 
  "facilityCard8Desc", 
  "facilityCard8Image",
  "facilityCard9Title", 
  "facilityCard9Desc", 
  "facilityCard9Image",
  "nearbyHotelTitle",
  "nearbyHotelDesc",
  "nearbyHotelUrl",
  "nearbyHotelImage1",
  "nearbyHotelImage2",
  "nearbyHotelImage3",
  "nearbyHotelImage4",
  "nearbyHotelImage5",
  "nearbyHotelImage6",
  "nearbyHotelImage7",
  "nearbyHotelImage8",
  "nearbyHotelImage9",
  "nearbyFood1Title",
  "nearbyFood1Desc",
  "nearbyFood1Image",
  "nearbyFood2Title",
  "nearbyFood2Desc",
  "nearbyFood2Image",
  "nearbyFood3Title",
  "nearbyFood3Desc",
  "nearbyFood3Image",
  "nearbySpot1Title",
  "nearbySpot1Desc",
  "nearbySpot1Image",
  "nearbySpot2Title",
  "nearbySpot2Desc",
  "nearbySpot2Image",
  "nearbySpot3Title",
  "nearbySpot3Desc",
  "nearbySpot3Image",
  "imageUrl",
  "officialLink",
  "businessHours",
  "hasDropin",
  "hasNexana",
  "hasMeetingRoom",
  "hasPhoneBooth",
  "hasWifi",
  "hasParking",
  "locationId",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,  -- id (PostgreSQLの場合)
  'ワークスペース名',
  '日本',
  '都市名',
  '住所',
  NULL,  -- priceTable
  NULL,  -- rental
  NULL,  -- notes
  NULL,  -- operator
  NULL,  -- management
  NULL,  -- tenantCard1Title
  NULL,  -- tenantCard1Desc
  NULL,  -- tenantCard1Image
  NULL,  -- tenantCard2Title
  NULL,  -- tenantCard2Desc
  NULL,  -- tenantCard2Image
  NULL,  -- tenantCard3Title
  NULL,  -- tenantCard3Desc
  NULL,  -- tenantCard3Image
  NULL,  -- communityManagerImage
  NULL,  -- communityManagerTitle
  NULL,  -- communityManagerDesc
  NULL,  -- communityManagerContact
  NULL,  -- facilityCard1Title
  NULL,  -- facilityCard1Desc
  NULL,  -- facilityCard1Image
  NULL,  -- facilityCard2Title
  NULL,  -- facilityCard2Desc
  NULL,  -- facilityCard2Image
  NULL,  -- facilityCard3Title
  NULL,  -- facilityCard3Desc
  NULL,  -- facilityCard3Image
  NULL,  -- facilityCard4Title
  NULL,  -- facilityCard4Desc
  NULL,  -- facilityCard4Image
  NULL,  -- facilityCard5Title
  NULL,  -- facilityCard5Desc
  NULL,  -- facilityCard5Image
  NULL,  -- facilityCard6Title
  NULL,  -- facilityCard6Desc
  NULL,  -- facilityCard6Image
  NULL,  -- facilityCard7Title
  NULL,  -- facilityCard7Desc
  NULL,  -- facilityCard7Image
  NULL,  -- facilityCard8Title
  NULL,  -- facilityCard8Desc
  NULL,  -- facilityCard8Image
  NULL,  -- facilityCard9Title
  NULL,  -- facilityCard9Desc
  NULL,  -- facilityCard9Image
  NULL,  -- nearbyHotelTitle
  NULL,  -- nearbyHotelDesc
  NULL,  -- nearbyHotelUrl
  NULL,  -- nearbyHotelImage1
  NULL,  -- nearbyHotelImage2
  NULL,  -- nearbyHotelImage3
  NULL,  -- nearbyHotelImage4
  NULL,  -- nearbyHotelImage5
  NULL,  -- nearbyHotelImage6
  NULL,  -- nearbyHotelImage7
  NULL,  -- nearbyHotelImage8
  NULL,  -- nearbyHotelImage9
  NULL,  -- nearbyFood1Title
  NULL,  -- nearbyFood1Desc
  NULL,  -- nearbyFood1Image
  NULL,  -- nearbyFood2Title
  NULL,  -- nearbyFood2Desc
  NULL,  -- nearbyFood2Image
  NULL,  -- nearbyFood3Title
  NULL,  -- nearbyFood3Desc
  NULL,  -- nearbyFood3Image
  NULL,  -- nearbySpot1Title
  NULL,  -- nearbySpot1Desc
  NULL,  -- nearbySpot1Image
  NULL,  -- nearbySpot2Title
  NULL,  -- nearbySpot2Desc
  NULL,  -- nearbySpot2Image
  NULL,  -- nearbySpot3Title
  NULL,  -- nearbySpot3Desc
  NULL,  -- nearbySpot3Image
  NULL,  -- imageUrl
  NULL,  -- officialLink
  NULL,  -- businessHours
  false,  -- hasDropin
  false,  -- hasNexana
  false,  -- hasMeetingRoom
  false,  -- hasPhoneBooth
  false,  -- hasWifi
  false,  -- hasParking
  NULL,  -- locationId (locationsテーブルのidを参照)
  true,  -- isActive
  CURRENT_TIMESTAMP,  -- createdAt
  CURRENT_TIMESTAMP   -- updatedAt
);

