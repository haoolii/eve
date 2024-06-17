/*
  Warnings:

  - A unique constraint covering the columns `[fundId]` on the table `TwFundInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TwFundInfo_fundId_key" ON "TwFundInfo"("fundId");
