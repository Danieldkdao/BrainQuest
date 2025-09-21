import express from "express";
import {
  checkAnswer,
  clearSessionHistory,
  deleteTrainingSession,
  getTrainingSessions,
  saveTrainingSession,
} from "../controllers/train.controller.ts";
import { protectRoute } from "../middlewares/auth.middleware.ts";

export const route = express.Router();

route.use(protectRoute);

route.post("/check-answer", checkAnswer);
route.post("/save-session", saveTrainingSession);
route.get("/get-sessions", getTrainingSessions);
route.delete("/delete-session/:id", deleteTrainingSession);
route.delete("/clear-session-history", clearSessionHistory);
