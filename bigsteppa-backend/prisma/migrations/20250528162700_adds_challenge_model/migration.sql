-- CreateEnum
CREATE TYPE "DurationUnit" AS ENUM ('Days', 'Weeks', 'Months', 'Years');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('SetToHappen', 'Ongoing', 'Completed', 'Stalled');

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationValue" INTEGER NOT NULL,
    "durationUnit" "DurationUnit" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "lastUpdatedDate" TIMESTAMP(3) NOT NULL,
    "status" "ChallengeStatus" NOT NULL,
    "reminderTime" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPaused" BOOLEAN NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeLog" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyReflection" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ChallengeLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeLog" ADD CONSTRAINT "ChallengeLog_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
