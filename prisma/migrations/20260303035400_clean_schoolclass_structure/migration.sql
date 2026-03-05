/*
  Warnings:

  - You are about to drop the column `guruId` on the `SchoolClass` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SchoolClass" DROP CONSTRAINT "SchoolClass_guruId_fkey";

-- AlterTable
ALTER TABLE "SchoolClass" DROP COLUMN "guruId";
