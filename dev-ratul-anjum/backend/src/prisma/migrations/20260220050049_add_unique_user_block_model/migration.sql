/*
  Warnings:

  - A unique constraint covering the columns `[blockerId,blockedId]` on the table `userBlocks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userBlocks_blockerId_blockedId_key" ON "userBlocks"("blockerId", "blockedId");
