/*
  Warnings:

  - Made the column `type` on table `news` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."news" ALTER COLUMN "type" SET NOT NULL;
