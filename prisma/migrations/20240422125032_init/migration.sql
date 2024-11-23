/*
  Warnings:

  - You are about to alter the column `loanRequired` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `netSalary` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `turnOver` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `disbursedAmount` INTEGER NULL,
    MODIFY `loanRequired` INTEGER NULL,
    MODIFY `netSalary` INTEGER NULL,
    MODIFY `turnOver` INTEGER NULL;
