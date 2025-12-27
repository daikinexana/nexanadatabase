-- CreateTable
CREATE TABLE "startup_boards" (
    "id" TEXT NOT NULL,
    "companyLogoUrl" TEXT,
    "companyProductImageUrl" TEXT,
    "companyName" TEXT NOT NULL,
    "companyDescriptionOneLine" TEXT,
    "companyAndProduct" TEXT,
    "companyOverview" TEXT,
    "series" TEXT,
    "corporateNumber" TEXT,
    "establishedDate" TIMESTAMP(3),
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "listingStatus" TEXT,
    "contact1Department" TEXT,
    "contact1Name" TEXT,
    "contact1Email" TEXT,
    "contact2Department" TEXT,
    "contact2Name" TEXT,
    "contact2Email" TEXT,
    "contact3Department" TEXT,
    "contact3Name" TEXT,
    "contact3Email" TEXT,
    "fundingStatus" TEXT,
    "fundingOverview" TEXT,
    "fundingLink" TEXT,
    "hiringStatus" TEXT,
    "hiringOverview" TEXT,
    "hiringLink" TEXT,
    "proposalStatus" TEXT,
    "proposalOverview" TEXT,
    "proposalLink" TEXT,
    "collaborationStatus" TEXT,
    "collaborationOverview" TEXT,
    "collaborationLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "startup_boards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "startup_boards_isActive_idx" ON "startup_boards"("isActive");

-- CreateIndex
CREATE INDEX "startup_boards_country_idx" ON "startup_boards"("country");

-- CreateIndex
CREATE INDEX "startup_boards_city_idx" ON "startup_boards"("city");

-- CreateIndex
CREATE INDEX "startup_boards_fundingStatus_idx" ON "startup_boards"("fundingStatus");

-- CreateIndex
CREATE INDEX "startup_boards_hiringStatus_idx" ON "startup_boards"("hiringStatus");

-- CreateIndex
CREATE INDEX "startup_boards_proposalStatus_idx" ON "startup_boards"("proposalStatus");

-- CreateIndex
CREATE INDEX "startup_boards_collaborationStatus_idx" ON "startup_boards"("collaborationStatus");

-- CreateIndex
CREATE INDEX "startup_boards_createdAt_idx" ON "startup_boards"("createdAt");


