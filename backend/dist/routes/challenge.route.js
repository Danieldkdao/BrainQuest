import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getDailyChallenges } from "../controllers/challenge.controller.js";
export const route = express.Router();
route.use(protectRoute);
route.get("/get-daily-challenges", getDailyChallenges);
