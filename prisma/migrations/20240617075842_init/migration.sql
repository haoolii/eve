-- CreateTable
CREATE TABLE "CoinInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "coinName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "contentCreatedOn" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinRecord" (
    "coinId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinRecord_pkey" PRIMARY KEY ("coinId","time")
);

-- CreateTable
CREATE TABLE "TwFundInfo" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwFundInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwFundRecord" (
    "fundId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwFundRecord_pkey" PRIMARY KEY ("fundId","time")
);
