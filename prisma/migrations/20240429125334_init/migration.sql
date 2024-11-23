-- CreateTable
CREATE TABLE `BankLoanTypeCommission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank` VARCHAR(191) NOT NULL,
    `loanType` VARCHAR(191) NULL,
    `agentCategory` VARCHAR(191) NULL,
    `payoutPercent` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BankLoanTypeCommission_bank_key`(`bank`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
