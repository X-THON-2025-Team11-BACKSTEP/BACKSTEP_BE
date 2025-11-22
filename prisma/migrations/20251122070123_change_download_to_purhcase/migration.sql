/*
  Warnings:

  - You are about to drop the `다운로드 이력` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `다운로드 이력` DROP FOREIGN KEY `다운로드 이력_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `다운로드 이력` DROP FOREIGN KEY `다운로드 이력_user_id_fkey`;

-- DropTable
DROP TABLE `다운로드 이력`;

-- CreateTable
CREATE TABLE `구매 이력` (
    `purchase_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`purchase_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `구매 이력` ADD CONSTRAINT `구매 이력_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `유저`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `구매 이력` ADD CONSTRAINT `구매 이력_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `프로젝트`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
