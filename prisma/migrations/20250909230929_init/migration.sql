-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MEMBER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."ContestCategory" AS ENUM ('STARTUP_CONTEST', 'INNOVATION_CHALLENGE', 'HACKATHON', 'PITCH_CONTEST', 'BUSINESS_PLAN', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."OrganizerType" AS ENUM ('GOVERNMENT', 'VC', 'CVC', 'BANK', 'REAL_ESTATE', 'CORPORATION', 'RESEARCH_INSTITUTION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."OpenCallCategory" AS ENUM ('PARTNERSHIP', 'COLLABORATION', 'CHALLENGE', 'INNOVATION', 'RESEARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."SubsidyCategory" AS ENUM ('STARTUP_SUPPORT', 'R_AND_D', 'EXPORT_SUPPORT', 'DIGITAL_TRANSFORMATION', 'ENVIRONMENTAL', 'REGIONAL_DEVELOPMENT', 'EMPLOYMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."NewsType" AS ENUM ('FUNDING', 'M_AND_A', 'IPO', 'PARTNERSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."KnowledgeCategory" AS ENUM ('AI', 'DEEPTECH', 'BIOTECH', 'CLEANTECH', 'FINTECH', 'HEALTHTECH', 'EDUTECH', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AssetCategory" AS ENUM ('FUNDING', 'EQUIPMENT', 'FACILITY', 'TECHNOLOGY', 'KNOWLEDGE', 'NETWORK', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."TechnologyCategory" AS ENUM ('AI', 'BLOCKCHAIN', 'QUANTUM', 'BIOTECH', 'NANOTECH', 'ROBOTICS', 'IOT', 'CYBERSECURITY', 'CLOUD', 'OTHER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "category" "public"."ContestCategory" NOT NULL,
    "area" TEXT,
    "organizer" TEXT NOT NULL,
    "organizerType" "public"."OrganizerType" NOT NULL,
    "amount" TEXT,
    "website" TEXT,
    "contact" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "venue" TEXT,
    "area" TEXT,
    "organizer" TEXT NOT NULL,
    "organizerType" "public"."OrganizerType" NOT NULL,
    "website" TEXT,
    "contact" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."open_calls" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "category" "public"."OpenCallCategory" NOT NULL,
    "area" TEXT,
    "organizer" TEXT NOT NULL,
    "organizerType" "public"."OrganizerType" NOT NULL,
    "amount" TEXT,
    "website" TEXT,
    "contact" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "open_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subsidies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "category" "public"."SubsidyCategory" NOT NULL,
    "area" TEXT,
    "organizer" TEXT NOT NULL,
    "organizerType" "public"."OrganizerType" NOT NULL,
    "amount" TEXT,
    "website" TEXT,
    "contact" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "subsidies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "type" "public"."NewsType" NOT NULL,
    "company" TEXT NOT NULL,
    "sector" TEXT,
    "amount" TEXT,
    "round" TEXT,
    "investors" TEXT,
    "publishedAt" TIMESTAMP(3),
    "source" TEXT,
    "sourceUrl" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knowledge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" "public"."KnowledgeCategory" NOT NULL,
    "tags" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."facilities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "address" TEXT,
    "area" TEXT,
    "organizer" TEXT NOT NULL,
    "organizerType" "public"."OrganizerType" NOT NULL,
    "website" TEXT,
    "contact" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_provisions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "category" "public"."AssetCategory" NOT NULL,
    "area" TEXT,
    "organizer" TEXT NOT NULL,
    "organizerType" "public"."OrganizerType" NOT NULL,
    "amount" TEXT,
    "website" TEXT,
    "contact" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "asset_provisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."technologies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "category" "public"."TechnologyCategory" NOT NULL,
    "area" TEXT,
    "provider" TEXT NOT NULL,
    "providerType" "public"."OrganizerType" NOT NULL,
    "website" TEXT,
    "contact" TEXT,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "tags" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "public"."users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."contests" ADD CONSTRAINT "contests_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."open_calls" ADD CONSTRAINT "open_calls_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subsidies" ADD CONSTRAINT "subsidies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."news" ADD CONSTRAINT "news_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."knowledge" ADD CONSTRAINT "knowledge_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."facilities" ADD CONSTRAINT "facilities_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_provisions" ADD CONSTRAINT "asset_provisions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."technologies" ADD CONSTRAINT "technologies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
