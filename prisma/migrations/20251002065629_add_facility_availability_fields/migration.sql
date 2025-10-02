-- AlterTable
ALTER TABLE "public"."facilities" ADD COLUMN     "isDropinAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNexanaAvailable" BOOLEAN NOT NULL DEFAULT false;
