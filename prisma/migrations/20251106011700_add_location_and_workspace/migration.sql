-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "topImageUrl" TEXT,
    "mapImageUrl" TEXT,
    "companyCard1Image" TEXT,
    "companyCard1Name" TEXT,
    "companyCard1DescTop" TEXT,
    "companyCard1DescBottom" TEXT,
    "companyCard2Image" TEXT,
    "companyCard2Name" TEXT,
    "companyCard2DescTop" TEXT,
    "companyCard2DescBottom" TEXT,
    "companyCard3Image" TEXT,
    "companyCard3Name" TEXT,
    "companyCard3DescTop" TEXT,
    "companyCard3DescBottom" TEXT,
    "experienceCard1Image" TEXT,
    "experienceCard1Title" TEXT,
    "experienceCard1Url" TEXT,
    "experienceCard2Image" TEXT,
    "experienceCard2Title" TEXT,
    "experienceCard2Url" TEXT,
    "experienceCard3Image" TEXT,
    "experienceCard3Title" TEXT,
    "experienceCard3Url" TEXT,
    "sightseeingCard1Image" TEXT,
    "sightseeingCard1Title" TEXT,
    "sightseeingCard2Image" TEXT,
    "sightseeingCard2Title" TEXT,
    "sightseeingCard3Image" TEXT,
    "sightseeingCard3Title" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "officialLink" TEXT,
    "businessHours" TEXT,
    "hasDropin" BOOLEAN NOT NULL DEFAULT false,
    "hasNexana" BOOLEAN NOT NULL DEFAULT false,
    "hasMeetingRoom" BOOLEAN NOT NULL DEFAULT false,
    "hasPhoneBooth" BOOLEAN NOT NULL DEFAULT false,
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "priceTable" TEXT,
    "rental" TEXT,
    "notes" TEXT,
    "operator" TEXT,
    "management" TEXT,
    "tenantCard1Title" TEXT,
    "tenantCard1Desc" TEXT,
    "tenantCard1Image" TEXT,
    "tenantCard2Title" TEXT,
    "tenantCard2Desc" TEXT,
    "tenantCard2Image" TEXT,
    "tenantCard3Title" TEXT,
    "tenantCard3Desc" TEXT,
    "tenantCard3Image" TEXT,
    "communityManagerImage" TEXT,
    "communityManagerTitle" TEXT,
    "communityManagerDesc" TEXT,
    "communityManagerContact" TEXT,
    "facilityCard1Title" TEXT,
    "facilityCard1Desc" TEXT,
    "facilityCard1Image" TEXT,
    "facilityCard2Title" TEXT,
    "facilityCard2Desc" TEXT,
    "facilityCard2Image" TEXT,
    "facilityCard3Title" TEXT,
    "facilityCard3Desc" TEXT,
    "facilityCard3Image" TEXT,
    "facilityCard4Title" TEXT,
    "facilityCard4Desc" TEXT,
    "facilityCard4Image" TEXT,
    "facilityCard5Title" TEXT,
    "facilityCard5Desc" TEXT,
    "facilityCard5Image" TEXT,
    "facilityCard6Title" TEXT,
    "facilityCard6Desc" TEXT,
    "facilityCard6Image" TEXT,
    "facilityCard7Title" TEXT,
    "facilityCard7Desc" TEXT,
    "facilityCard7Image" TEXT,
    "facilityCard8Title" TEXT,
    "facilityCard8Desc" TEXT,
    "facilityCard8Image" TEXT,
    "facilityCard9Title" TEXT,
    "facilityCard9Desc" TEXT,
    "facilityCard9Image" TEXT,
    "nearbyHotelTitle" TEXT,
    "nearbyHotelDesc" TEXT,
    "nearbyHotelUrl" TEXT,
    "nearbyHotelImage1" TEXT,
    "nearbyHotelImage2" TEXT,
    "nearbyHotelImage3" TEXT,
    "nearbyHotelImage4" TEXT,
    "nearbyHotelImage5" TEXT,
    "nearbyHotelImage6" TEXT,
    "nearbyHotelImage7" TEXT,
    "nearbyHotelImage8" TEXT,
    "nearbyHotelImage9" TEXT,
    "nearbyFood1Title" TEXT,
    "nearbyFood1Desc" TEXT,
    "nearbyFood1Image" TEXT,
    "nearbyFood2Title" TEXT,
    "nearbyFood2Desc" TEXT,
    "nearbyFood2Image" TEXT,
    "nearbyFood3Title" TEXT,
    "nearbyFood3Desc" TEXT,
    "nearbyFood3Image" TEXT,
    "nearbySpot1Title" TEXT,
    "nearbySpot1Desc" TEXT,
    "nearbySpot1Image" TEXT,
    "nearbySpot2Title" TEXT,
    "nearbySpot2Desc" TEXT,
    "nearbySpot2Image" TEXT,
    "nearbySpot3Title" TEXT,
    "nearbySpot3Desc" TEXT,
    "nearbySpot3Image" TEXT,
    "locationId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_slug_key" ON "locations"("slug");

-- CreateIndex
CREATE INDEX "locations_isActive_idx" ON "locations"("isActive");

-- CreateIndex
CREATE INDEX "locations_slug_idx" ON "locations"("slug");

-- CreateIndex
CREATE INDEX "locations_city_idx" ON "locations"("city");

-- CreateIndex
CREATE INDEX "locations_country_idx" ON "locations"("country");

-- CreateIndex
CREATE INDEX "workspaces_isActive_idx" ON "workspaces"("isActive");

-- CreateIndex
CREATE INDEX "workspaces_city_idx" ON "workspaces"("city");

-- CreateIndex
CREATE INDEX "workspaces_country_idx" ON "workspaces"("country");

-- CreateIndex
CREATE INDEX "workspaces_locationId_idx" ON "workspaces"("locationId");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
