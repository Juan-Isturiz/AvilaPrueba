/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "aviablity" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
