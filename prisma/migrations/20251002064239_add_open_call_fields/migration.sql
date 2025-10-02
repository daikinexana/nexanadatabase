-- AlterTable
ALTER TABLE "public"."open_calls" ADD COLUMN     "isDropinAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNexanaAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openCallType" TEXT;
