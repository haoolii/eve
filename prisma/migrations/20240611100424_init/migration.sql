-- CreateTable
CREATE TABLE "CoinInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "coinName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "contentCreatedOn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CoinRecord" (
    "coinId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "price" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("coinId", "time")
);
