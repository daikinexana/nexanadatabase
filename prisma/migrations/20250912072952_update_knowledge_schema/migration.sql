/*
  Warnings:

  - You are about to drop the column `author` on the `knowledge` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `knowledge` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `knowledge` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `knowledge` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."knowledge" DROP CONSTRAINT "knowledge_createdBy_fkey";

-- AlterTable
ALTER TABLE "public"."knowledge" DROP COLUMN "author",
DROP COLUMN "category",
DROP COLUMN "content",
DROP COLUMN "createdBy",
ADD COLUMN     "categoryTag" TEXT,
ADD COLUMN     "website" TEXT;

-- DropEnum
DROP TYPE "public"."KnowledgeCategory";
