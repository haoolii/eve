-- CreateTable
CREATE TABLE "TwStockInfo" (
    "stockId" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "TwStockRecord" (
    "stockId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwStockRecord_pkey" PRIMARY KEY ("stockId","time")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwStockInfo_stockId_key" ON "TwStockInfo"("stockId");
