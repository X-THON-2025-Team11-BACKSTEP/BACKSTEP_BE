/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `유저` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[google_id]` on the table `유저` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `유저` ADD COLUMN `google_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `유저_email_key` ON `유저`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `유저_google_id_key` ON `유저`(`google_id`);
