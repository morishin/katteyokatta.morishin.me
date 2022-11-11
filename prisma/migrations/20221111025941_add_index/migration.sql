/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `Post_itemId_idx` ON `Post`(`itemId`);

-- CreateIndex
CREATE INDEX `Post_userId_idx` ON `Post`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_name_key` ON `User`(`name`);
