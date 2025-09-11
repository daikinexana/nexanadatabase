/*
  Warnings:

  - You are about to drop the column `contact` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_createdBy_fkey";

-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "contact",
DROP COLUMN "content",
DROP COLUMN "createdBy",
DROP COLUMN "tags",
ADD COLUMN     "operatingCompany" TEXT,
ADD COLUMN     "targetArea" TEXT,
ADD COLUMN     "targetAudience" TEXT;
