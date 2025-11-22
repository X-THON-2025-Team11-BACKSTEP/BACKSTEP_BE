/*
  Warnings:

  - You are about to drop the column `failure` on the `프로젝트` table. All the data in the column will be lost.
  - You are about to drop the column `failure_reason` on the `프로젝트` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `프로젝트` DROP COLUMN `failure`,
    DROP COLUMN `failure_reason`;
