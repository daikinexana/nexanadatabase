/*
  Warnings:

  - You are about to drop the column `content` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `round` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `news` table. All the data in the column will be lost.
  - You are about to drop the `asset_provisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subsidies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `technologies` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `news` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."asset_provisions" DROP CONSTRAINT "asset_provisions_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."news" DROP CONSTRAINT "news_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."subsidies" DROP CONSTRAINT "subsidies_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."technologies" DROP CONSTRAINT "technologies_createdBy_fkey";

-- AlterTable
ALTER TABLE "public"."news" DROP COLUMN "content",
DROP COLUMN "createdBy",
DROP COLUMN "round",
DROP COLUMN "source",
DROP COLUMN "tags";

-- Add new type column as TEXT
ALTER TABLE "public"."news" ADD COLUMN "type_text" TEXT;

-- Copy data from old type column to new one
UPDATE "public"."news" SET "type_text" = "type"::text;

-- Drop old type column
ALTER TABLE "public"."news" DROP COLUMN "type";

-- Rename new column to type
ALTER TABLE "public"."news" RENAME COLUMN "type_text" TO "type";

-- AlterTable
ALTER TABLE "public"."open_calls" ADD COLUMN     "operatingCompany" TEXT,
ADD COLUMN     "resourceType" TEXT;

-- DropTable
DROP TABLE "public"."asset_provisions";

-- DropTable
DROP TABLE "public"."subsidies";

-- DropTable
DROP TABLE "public"."technologies";

-- DropEnum
DROP TYPE "public"."AssetCategory";

-- DropEnum
DROP TYPE "public"."NewsType";

-- DropEnum
DROP TYPE "public"."SubsidyCategory";

-- DropEnum
DROP TYPE "public"."TechnologyCategory";
