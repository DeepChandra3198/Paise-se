/*
  Warnings:

  - You are about to drop the column `advanced` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `advanced`,
    ADD COLUMN `advance` VARCHAR(191) NULL;
