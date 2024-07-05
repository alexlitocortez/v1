/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Data_description_key` ON `Data`(`description`);
