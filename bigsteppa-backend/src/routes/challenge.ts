import { Router } from "express";
import { createChallenge, createChallengeLog, getChallenge, getChallengeLogs, getChallenges } from "../controllers/challenge";
import verifyToken from "../middlewares/auth";

const challengesRoutes = Router();

challengesRoutes.post("/create_challenge", verifyToken, createChallenge);
challengesRoutes.post("/create_challenge_log", verifyToken, createChallengeLog);
challengesRoutes.get("/challenges", verifyToken, getChallenges);
challengesRoutes.get("/challenge/:challenge_id", verifyToken, getChallenge);
challengesRoutes.get("/challenge_logs/:challenge_id", verifyToken, getChallengeLogs);

export default challengesRoutes;
