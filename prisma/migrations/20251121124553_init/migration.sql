-- CreateTable
CREATE TABLE `프로젝트` (
    `project_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `period` VARCHAR(255) NULL,
    `personnel` INTEGER NULL,
    `intent` VARCHAR(191) NULL,
    `my_role` VARCHAR(191) NULL,
    `failure` VARCHAR(191) NULL,
    `failure_reason` VARCHAR(191) NULL,
    `growth_point` VARCHAR(191) NULL,
    `sale_status` ENUM('NOTSALE', 'FREE', 'ONSALE') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_free` BOOLEAN NULL,
    `price` INTEGER NULL,
    `result_url` VARCHAR(191) NULL,

    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `유저` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `nickname` VARCHAR(255) NULL,
    `money` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `유저-프로젝트 도움돼요 표시 매핑` (
    `userprojecthelpful_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,

    UNIQUE INDEX `유저-프로젝트 도움돼요 표시 매핑_user_id_proje_key`(`user_id`, `project_id`),
    PRIMARY KEY (`userprojecthelpful_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `실패 카테고리` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `프로젝트카테고리 매핑` (
    `projectcategory_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id2` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,

    UNIQUE INDEX `프로젝트카테고리 매핑_project_id_category_id2_key`(`project_id`, `category_id2`),
    PRIMARY KEY (`projectcategory_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `다운로드 이력` (
    `download_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,
    `is_free` BOOLEAN NULL,
    `price` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`download_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `프로젝트` ADD CONSTRAINT `프로젝트_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `유저`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `유저-프로젝트 도움돼요 표시 매핑` ADD CONSTRAINT `유저-프로젝트 도움돼요 표시 매핑_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `유저`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `유저-프로젝트 도움돼요 표시 매핑` ADD CONSTRAINT `유저-프로젝트 도움돼요 표시 매핑_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `프로젝트`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `프로젝트카테고리 매핑` ADD CONSTRAINT `프로젝트카테고리 매핑_category_id2_fkey` FOREIGN KEY (`category_id2`) REFERENCES `실패 카테고리`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `프로젝트카테고리 매핑` ADD CONSTRAINT `프로젝트카테고리 매핑_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `프로젝트`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `다운로드 이력` ADD CONSTRAINT `다운로드 이력_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `유저`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `다운로드 이력` ADD CONSTRAINT `다운로드 이력_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `프로젝트`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
