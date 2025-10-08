import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.ts";
import {
  getDailyChallenges,
} from "../controllers/challenge.controller.ts";

export const route = express.Router();

route.use(protectRoute);

route.get("/get-daily-challenges", getDailyChallenges);
