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
        createdAt: new Date()
      },
    });
    return;
  },
  async getAllChallenges() {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: "asc" }
    });
  
    return challenges
  },
  async getChallenge(challenge_id: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challenge_id }
    });
  
    return challenge;
  },
  async getFormattedLogs(challenge_id: string) {
    const logs = await prisma.challengeLog.findMany({
      where: { challengeId: challenge_id },
      orderBy: { createdAt: "asc" }
    });
  
    const formatted = {
      days: logs.map(log => log.createdAt.toISOString().split("T")[0]),
      image_urls: logs.map(log => log.url)
    };
  
    return formatted;
  }
};
