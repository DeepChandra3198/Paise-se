/*
  Warnings:

  - You are about to drop the column `agentType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `agentType`,
    ADD COLUMN `agentCategory` VARCHAR(191) NULL;
