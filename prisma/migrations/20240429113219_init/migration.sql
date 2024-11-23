-- AlterTable
ALTER TABLE `User` ADD COLUMN `payoutPercent` DOUBLE NULL,
    ADD COLUMN `role` VARCHAR(191) NULL DEFAULT 'normal';
