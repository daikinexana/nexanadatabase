/*
  Warnings:

  - You are about to drop the column `openCallType` on the `open_calls` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `open_calls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."open_calls" DROP COLUMN "openCallType",
DROP COLUMN "resourceType";
