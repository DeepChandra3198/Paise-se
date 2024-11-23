/*
  Warnings:

  - You are about to drop the column `entityType` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Lead` DROP COLUMN `entityType`,
    ADD COLUMN `disbursingBank` VARCHAR(191) NULL,
    ADD COLUMN `invoiced` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `preferedInsurer` VARCHAR(191) NULL;
