import prisma from "../db";
import {
  CreateChallengeInput,
  CreateChallengeLogInput,
} from "../validators/challenge";

export const ChallengeService = {
  async createChallenge(input: CreateChallengeInput) {
    await prisma.challenge.create({
      data: {
        ...input,
        lastUpdatedDate: new Date(input.startDate),
        status: "SetToHappen",
        isPaused: false,
        logs: {
          create: [],
        },
      },
    });
    return;
  },
  async createChallengeLog(input: CreateChallengeLogInput) {
    await prisma.challengeLog.create({
      data: {
        ...input,
      },
    });
    return;
  },
};
