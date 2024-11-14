/*
  Warnings:

  - Added the required column `customerContact` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerFullName` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "customerContact" TEXT NOT NULL,
ADD COLUMN     "customerFullName" TEXT NOT NULL;
