-- CreateEnum
CREATE TYPE "RaceStatus" AS ENUM ('SCHEDULED', 'OPEN', 'CLOSED', 'FINISHED');

-- CreateEnum
CREATE TYPE "BetType" AS ENUM ('WINNER', 'TOP_3', 'TOP_5');

-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'WON', 'LOST', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unicorn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "victories" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unicorn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "bettingOpen" TIMESTAMP(3) NOT NULL,
    "status" "RaceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "totalPool" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceEntry" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "unicornId" TEXT NOT NULL,
    "lane" INTEGER NOT NULL,
    "finishRank" INTEGER,

    CONSTRAINT "RaceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "type" "BetType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "potentialWin" DECIMAL(12,2) NOT NULL,
    "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetSelection" (
    "id" TEXT NOT NULL,
    "betId" TEXT NOT NULL,
    "unicornId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BetSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "betId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "providerRef" TEXT,
    "cardLast4" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "authorizedAt" TIMESTAMP(3),
    "capturedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Unicorn_name_key" ON "Unicorn"("name");

-- CreateIndex
CREATE INDEX "Race_startsAt_idx" ON "Race"("startsAt");

-- CreateIndex
CREATE INDEX "Race_bettingOpen_status_idx" ON "Race"("bettingOpen", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RaceEntry_raceId_unicornId_key" ON "RaceEntry"("raceId", "unicornId");

-- CreateIndex
CREATE UNIQUE INDEX "RaceEntry_raceId_lane_key" ON "RaceEntry"("raceId", "lane");

-- CreateIndex
CREATE INDEX "Bet_raceId_type_status_idx" ON "Bet"("raceId", "type", "status");

-- CreateIndex
CREATE INDEX "Bet_userId_createdAt_idx" ON "Bet"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BetSelection_betId_position_key" ON "BetSelection"("betId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_betId_key" ON "Payment"("betId");

-- CreateIndex
CREATE INDEX "ProductEvent_name_target_createdAt_idx" ON "ProductEvent"("name", "target", "createdAt");

-- CreateIndex
CREATE INDEX "ProductEvent_userId_createdAt_idx" ON "ProductEvent"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "RaceEntry" ADD CONSTRAINT "RaceEntry_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceEntry" ADD CONSTRAINT "RaceEntry_unicornId_fkey" FOREIGN KEY ("unicornId") REFERENCES "Unicorn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelection" ADD CONSTRAINT "BetSelection_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetSelection" ADD CONSTRAINT "BetSelection_unicornId_fkey" FOREIGN KEY ("unicornId") REFERENCES "Unicorn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductEvent" ADD CONSTRAINT "ProductEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
