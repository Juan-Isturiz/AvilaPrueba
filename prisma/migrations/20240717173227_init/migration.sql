/*
  Warnings:

  - You are about to drop the column `aviablity` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "aviablity",
ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true;
