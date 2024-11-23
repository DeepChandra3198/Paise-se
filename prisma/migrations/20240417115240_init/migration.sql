/*
  Warnings:

  - You are about to drop the column `status` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Lead` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `status` VARCHAR(191) NULL;
