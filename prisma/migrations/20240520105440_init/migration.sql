-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `customerId` VARCHAR(191) NULL,
    ADD COLUMN `leadId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `gstNumber` VARCHAR(191) NULL;
