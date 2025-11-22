/*
  Warnings:

  - Added the required column `question1` to the `실패 카테고리` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question2` to the `실패 카테고리` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question3` to the `실패 카테고리` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answer1` to the `프로젝트카테고리 매핑` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answer2` to the `프로젝트카테고리 매핑` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answer3` to the `프로젝트카테고리 매핑` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `실패 카테고리` ADD COLUMN `question1` VARCHAR(255) NOT NULL,
    ADD COLUMN `question2` VARCHAR(255) NOT NULL,
    ADD COLUMN `question3` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `프로젝트카테고리 매핑` ADD COLUMN `answer1` VARCHAR(191) NOT NULL,
    ADD COLUMN `answer2` VARCHAR(191) NOT NULL,
    ADD COLUMN `answer3` VARCHAR(191) NOT NULL;
