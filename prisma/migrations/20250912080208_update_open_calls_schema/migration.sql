-- DropForeignKey
ALTER TABLE "public"."open_calls" DROP CONSTRAINT "open_calls_createdBy_fkey";

-- DropEnum
DROP TYPE "public"."OpenCallCategory";

-- AlterTable
ALTER TABLE "public"."open_calls" DROP COLUMN "content",
DROP COLUMN "endDate",
DROP COLUMN "category",
DROP COLUMN "amount",
DROP COLUMN "contact",
DROP COLUMN "tags",
DROP COLUMN "createdBy",
ADD COLUMN "targetArea" TEXT,
ADD COLUMN "targetAudience" TEXT,
ADD COLUMN "openCallType" TEXT,
ADD COLUMN "availableResources" TEXT;
