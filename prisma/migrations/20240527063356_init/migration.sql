/*
  Warnings:

  - You are about to drop the column `name` on the `tds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tds` DROP COLUMN `name`,
    ADD COLUMN `role` VARCHAR(191) NULL;
