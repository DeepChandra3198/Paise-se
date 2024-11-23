/*
  Warnings:

  - You are about to drop the column `disbursedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `disbursedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `disbursedAt`;
