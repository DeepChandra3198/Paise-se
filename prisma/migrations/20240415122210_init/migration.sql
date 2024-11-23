-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `loanType` VARCHAR(191) NULL,
    `productSelection` VARCHAR(191) NULL,
    `chanelCode` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `locationPin` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `loanRequired` VARCHAR(191) NULL,
    `netSalary` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `preferedLender` VARCHAR(191) NULL,
    `aadharCardDocument` VARCHAR(191) NULL,
    `pancardDocument` VARCHAR(191) NULL,
    `bankStatement` VARCHAR(191) NULL,
    `passportPhoto` VARCHAR(191) NULL,
    `salarySlip` VARCHAR(191) NULL,
    `addressProof` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `profile` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `bankAccount` VARCHAR(191) NULL,
    `bankAccountHolder` VARCHAR(191) NULL,
    `bankBranch` VARCHAR(191) NULL,
    `bankIfsc` VARCHAR(191) NULL,
    `bankChequeDocument` VARCHAR(191) NULL,
    `aadhar` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `pancard` VARCHAR(10) NULL,
    `pancardDocument` VARCHAR(191) NULL,
    `aadharCardDocument` VARCHAR(191) NULL,
    `utms` JSON NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'customer',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `employment` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NULL,
    `pincode` VARCHAR(20) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `dob` DATE NOT NULL,
    `pancard` VARCHAR(10) NULL,
    `annualIncome` DOUBLE NULL,
    `tentativeCreditLimit` DOUBLE NULL,
    `creditCardHolder` BOOLEAN NOT NULL DEFAULT false,
    `creditCardProvidedBy` JSON NULL,
    `creditCardType` VARCHAR(191) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Masters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Masters_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterValues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `masterId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `shortDescription` VARCHAR(191) NULL,
    `longDescription` TEXT NOT NULL,
    `tagLineTitle` VARCHAR(191) NULL,
    `tagLineOne` VARCHAR(191) NULL,
    `tagLineTwo` VARCHAR(191) NULL,
    `tagLineThree` VARCHAR(191) NULL,
    `tagLineFour` VARCHAR(191) NULL,
    `tagLineFive` VARCHAR(191) NULL,
    `tagLineIcon` VARCHAR(191) NULL,
    `buttonName` TEXT NULL,
    `isVisibleOnHomePage` BOOLEAN NOT NULL DEFAULT false,
    `sort` INTEGER NOT NULL DEFAULT 8888,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    FULLTEXT INDEX `Products_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faqs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `question` VARCHAR(255) NOT NULL,
    `answer` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkOfferOtp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `fees` DOUBLE NOT NULL,
    `info` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `lender` VARCHAR(191) NULL,
    `miles` VARCHAR(191) NULL,
    `points` VARCHAR(191) NULL,
    `loungeAccess` VARCHAR(191) NULL,
    `link` TEXT NOT NULL,
    `icon` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cards_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `lender` VARCHAR(191) NULL,
    `cardId` INTEGER NULL,
    `age` INTEGER NOT NULL,
    `income` DOUBLE NULL DEFAULT 0.0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditCardBreCities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `breId` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditCardBreCompanies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `breId` INTEGER NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalLoanBres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `maxAge` INTEGER NULL,
    `maxLoanAmount` DOUBLE NULL DEFAULT 0.0,
    `income` DOUBLE NULL DEFAULT 0.0,
    `otherIncome` DOUBLE NULL DEFAULT 0.0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `redirectUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalLoanBreCities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `breId` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCardClicks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userInformationId` INTEGER NOT NULL,
    `cardId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staticPages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `staticPages_name_key`(`name`),
    UNIQUE INDEX `staticPages_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `content` LONGTEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `sort` INTEGER NOT NULL DEFAULT 8888,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessLoanEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `loanAmount` DOUBLE NOT NULL,
    `employment` VARCHAR(100) NULL,
    `annualTurnover` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `companyType` VARCHAR(100) NULL,
    `currentBusinessYears` VARCHAR(100) NULL,
    `email` VARCHAR(191) NULL,
    `dob` DATE NOT NULL,
    `pancard` VARCHAR(10) NULL,
    `name` VARCHAR(100) NULL,
    `businessName` VARCHAR(191) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeLoanEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `type` VARCHAR(100) NULL,
    `loanAmount` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `employment` VARCHAR(100) NULL,
    `bankAccount` VARCHAR(100) NULL,
    `pancard` VARCHAR(10) NULL,
    `name` VARCHAR(100) NULL,
    `dob` DATE NOT NULL,
    `propertyType` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `tentativePurchaseMonth` VARCHAR(100) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LapLoanEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `loanAmount` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `employment` VARCHAR(100) NULL,
    `bankAccount` VARCHAR(100) NULL,
    `pancard` VARCHAR(10) NULL,
    `name` VARCHAR(100) NULL,
    `dob` DATE NOT NULL,
    `propertyType` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `tentativePurchaseMonth` VARCHAR(100) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TwoWheelerLoanEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `city` VARCHAR(100) NULL,
    `employment` VARCHAR(100) NULL,
    `pancard` VARCHAR(10) NULL,
    `name` VARCHAR(100) NULL,
    `dob` DATE NOT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(191) NULL,
    `monthlyIncome` VARCHAR(100) NULL,
    `twoWheelerBrand` VARCHAR(100) NULL,
    `tentativePurchaseMonth` VARCHAR(100) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CarLoanEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `city` VARCHAR(100) NULL,
    `employment` VARCHAR(100) NULL,
    `pancard` VARCHAR(10) NULL,
    `name` VARCHAR(100) NULL,
    `dob` DATE NOT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(191) NULL,
    `monthlyIncome` VARCHAR(100) NULL,
    `carBrand` VARCHAR(100) NULL,
    `productType` VARCHAR(100) NULL,
    `tentativePurchaseMonth` VARCHAR(100) NULL,
    `carModelYear` VARCHAR(100) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamilyDoctorEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(191) NULL,
    `age` INTEGER NOT NULL,
    `pincode` VARCHAR(20) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalLoanEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `employment` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NULL,
    `pincode` VARCHAR(20) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `dob` DATE NOT NULL,
    `pancard` VARCHAR(10) NULL,
    `salary` DOUBLE NOT NULL DEFAULT 0.0,
    `itr` DOUBLE NOT NULL DEFAULT 0.0,
    `loanAmount` DOUBLE NOT NULL DEFAULT 0.0,
    `emiAmount` DOUBLE NOT NULL DEFAULT 0.0,
    `type` VARCHAR(191) NULL,
    `companyName` VARCHAR(255) NULL,
    `companyType` VARCHAR(255) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HealthInsuranceEnquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `age` INTEGER NOT NULL,
    `pincode` VARCHAR(20) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `utms` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyBankMasters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(255) NOT NULL,
    `bankName` VARCHAR(255) NOT NULL,
    `grade` VARCHAR(50) NOT NULL,
    `foir` DOUBLE NOT NULL DEFAULT 0.0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtherBankMasters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(255) NOT NULL,
    `grade` VARCHAR(50) NOT NULL,
    `foir` DOUBLE NOT NULL DEFAULT 0.0,
    `maxLoanAmount` DOUBLE NULL DEFAULT 0.0,
    `redirectUrl` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfessionalBankMasters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(255) NOT NULL,
    `foir` DOUBLE NOT NULL DEFAULT 0.0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankGradeMasters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(255) NOT NULL,
    `grade` VARCHAR(50) NOT NULL,
    `foir` VARCHAR(50) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactQueries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartnerConnectQueries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `subject` VARCHAR(191) NULL,
    `pincode` VARCHAR(20) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PanVerifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pancard` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PanVerifications_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Greetings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMembers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL DEFAULT 'Core Team',
    `name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NULL,
    `about` LONGTEXT NULL,
    `linkedIn` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `sort` INTEGER NOT NULL DEFAULT 8888,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `author` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `cover` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bankifsc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank` VARCHAR(191) NULL,
    `ifsc` VARCHAR(191) NULL,
    `branch` VARCHAR(191) NULL,
    `addess` LONGTEXT NULL,
    `city1` VARCHAR(191) NULL,
    `city2` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `bankSlug` VARCHAR(191) NULL,
    `stateSlug` VARCHAR(191) NULL,
    `citySlug` VARCHAR(191) NULL,
    `branchSlug` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInformation` ADD CONSTRAINT `UserInformation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInformation` ADD CONSTRAINT `UserInformation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasterValues` ADD CONSTRAINT `MasterValues_masterId_fkey` FOREIGN KEY (`masterId`) REFERENCES `Masters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faqs` ADD CONSTRAINT `Faqs_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bres` ADD CONSTRAINT `Bres_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bres` ADD CONSTRAINT `Bres_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditCardBreCities` ADD CONSTRAINT `CreditCardBreCities_breId_fkey` FOREIGN KEY (`breId`) REFERENCES `Bres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditCardBreCompanies` ADD CONSTRAINT `CreditCardBreCompanies_breId_fkey` FOREIGN KEY (`breId`) REFERENCES `Bres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalLoanBres` ADD CONSTRAINT `PersonalLoanBres_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalLoanBreCities` ADD CONSTRAINT `PersonalLoanBreCities_breId_fkey` FOREIGN KEY (`breId`) REFERENCES `PersonalLoanBres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCardClicks` ADD CONSTRAINT `UserCardClicks_userInformationId_fkey` FOREIGN KEY (`userInformationId`) REFERENCES `UserInformation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCardClicks` ADD CONSTRAINT `UserCardClicks_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCardClicks` ADD CONSTRAINT `UserCardClicks_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessLoanEnquiries` ADD CONSTRAINT `BusinessLoanEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessLoanEnquiries` ADD CONSTRAINT `BusinessLoanEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeLoanEnquiries` ADD CONSTRAINT `HomeLoanEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeLoanEnquiries` ADD CONSTRAINT `HomeLoanEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LapLoanEnquiries` ADD CONSTRAINT `LapLoanEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LapLoanEnquiries` ADD CONSTRAINT `LapLoanEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TwoWheelerLoanEnquiries` ADD CONSTRAINT `TwoWheelerLoanEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TwoWheelerLoanEnquiries` ADD CONSTRAINT `TwoWheelerLoanEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarLoanEnquiries` ADD CONSTRAINT `CarLoanEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarLoanEnquiries` ADD CONSTRAINT `CarLoanEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyDoctorEnquiries` ADD CONSTRAINT `FamilyDoctorEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyDoctorEnquiries` ADD CONSTRAINT `FamilyDoctorEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalLoanEnquiries` ADD CONSTRAINT `PersonalLoanEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonalLoanEnquiries` ADD CONSTRAINT `PersonalLoanEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HealthInsuranceEnquiries` ADD CONSTRAINT `HealthInsuranceEnquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HealthInsuranceEnquiries` ADD CONSTRAINT `HealthInsuranceEnquiries_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PanVerifications` ADD CONSTRAINT `PanVerifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
