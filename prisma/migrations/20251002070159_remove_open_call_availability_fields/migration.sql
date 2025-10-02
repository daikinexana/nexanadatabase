/*
  Warnings:

  - You are about to drop the column `isDropinAvailable` on the `open_calls` table. All the data in the column will be lost.
  - You are about to drop the column `isNexanaAvailable` on the `open_calls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."open_calls" DROP COLUMN "isDropinAvailable",
DROP COLUMN "isNexanaAvailable";
