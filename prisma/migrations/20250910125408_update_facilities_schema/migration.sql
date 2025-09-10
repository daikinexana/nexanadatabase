/*
  Warnings:

  - You are about to drop the column `contact` on the `facilities` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `facilities` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `facilities` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `facilities` table. All the data in the column will be lost.
  - Changed the type of `organizerType` on the `facilities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."facilities" DROP CONSTRAINT "facilities_createdBy_fkey";

-- Add temporary column for organizerType conversion
ALTER TABLE "public"."facilities" ADD COLUMN "organizerType_temp" TEXT;

-- Copy existing organizerType enum values to temporary text column
UPDATE "public"."facilities" SET "organizerType_temp" = "organizerType"::TEXT;

-- Drop the old columns
ALTER TABLE "public"."facilities" DROP COLUMN "contact",
DROP COLUMN "content",
DROP COLUMN "createdBy",
DROP COLUMN "tags",
DROP COLUMN "organizerType";

-- Add new columns
ALTER TABLE "public"."facilities" ADD COLUMN "facilityInfo" TEXT,
ADD COLUMN "program" TEXT,
ADD COLUMN "targetArea" TEXT,
ADD COLUMN "targetAudience" TEXT,
ADD COLUMN "organizerType" TEXT NOT NULL DEFAULT 'OTHER';

-- Copy values from temporary column to new organizerType column
UPDATE "public"."facilities" SET "organizerType" = "organizerType_temp";

-- Drop temporary column
ALTER TABLE "public"."facilities" DROP COLUMN "organizerType_temp";
