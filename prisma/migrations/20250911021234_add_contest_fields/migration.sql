/*
  Warnings:

  - You are about to drop the column `amount` on the `contests` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `contests` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `contests` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `contests` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `contests` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `contests` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `contests` table. All the data in the column will be lost.
  - The `organizerType` column on the `contests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `organizerType` on the `asset_provisions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizerType` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizerType` on the `open_calls` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `organizerType` on the `subsidies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `providerType` on the `technologies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."contests" DROP CONSTRAINT "contests_createdBy_fkey";

-- AlterTable
ALTER TABLE "public"."asset_provisions" DROP COLUMN "organizerType",
ADD COLUMN     "organizerType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."contests" DROP COLUMN "amount",
DROP COLUMN "category",
DROP COLUMN "contact",
DROP COLUMN "content",
DROP COLUMN "createdBy",
DROP COLUMN "endDate",
DROP COLUMN "tags",
ADD COLUMN     "incentive" TEXT,
ADD COLUMN     "operatingCompany" TEXT,
ADD COLUMN     "targetArea" TEXT,
ADD COLUMN     "targetAudience" TEXT,
DROP COLUMN "organizerType",
ADD COLUMN     "organizerType" TEXT;

-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "organizerType",
ADD COLUMN     "organizerType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."open_calls" DROP COLUMN "organizerType",
ADD COLUMN     "organizerType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."subsidies" DROP COLUMN "organizerType",
ADD COLUMN     "organizerType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."technologies" DROP COLUMN "providerType",
ADD COLUMN     "providerType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."ContestCategory";

-- DropEnum
DROP TYPE "public"."OrganizerType";
