import { Request, Response } from "express";
import {
  createChallengeLogSchema,
  createChallengeSchema,
} from "../validators/challenge";
import { ChallengeService } from "../services/challenge";

export const createChallenge = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      formErrors: ["No input provided"],
      fieldErrors: {},
    });
  }
  const parsed = createChallengeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    await ChallengeService.createChallenge(parsed?.data);
    return res
      .status(201)
      .json({
        message: "Challenge created, successfully! Go BigSteppa",
        statusText: "ok",
      });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const createChallengeLog = async (req: Request, res: Response) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      formErrors: ["No input provided"],
      fieldErrors: {},
    });
  }
  const parsed = createChallengeLogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    await ChallengeService.createChallengeLog(parsed?.data);
    return res
      .status(201)
      .json({
        message:
          "Today's challenge log entered! We see you BigSteppa. Keep steppin'",
      });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};

export const getChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await ChallengeService.getAllChallenges();
    res.status(200).json(challenges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
};

export const getChallenge = async (req: Request, res: Response) => {
  const { challenge_id } = req.params;

  try {
    const challenge = await ChallengeService.getChallenge(challenge_id);
    res.status(200).json(challenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
};

export const getChallengeLogs = async (req: Request, res: Response) => {
  const { challenge_id } = req.params;

  try {
    const logs = await ChallengeService.getFormattedLogs(challenge_id);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
