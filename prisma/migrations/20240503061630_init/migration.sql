-- CreateTable
CREATE TABLE `paiseseWebhook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `externalId` VARCHAR(191) NULL,
    `deliveredTS` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `cause` VARCHAR(191) NULL,
    `phoneNo` VARCHAR(191) NULL,
    `errCode` VARCHAR(191) NULL,
    `noOfFrags` VARCHAR(191) NULL,
    `mask` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
