import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.ts";
import {
  addUserToDB,
  checkResetStreak,
  enableLeaderboard,
  enableNotifications,
  fetchUsers,
  fetchUserSettings,
  updatePointsGoal,
  updatePuzzleGoal,
} from "../controllers/user.controller.ts";

export const route = express.Router();

route.use(protectRoute);

route.post("/add-user-db", addUserToDB);
route.put("/enable-notifications", enableNotifications);
route.put("/enable-leaderboard", enableLeaderboard);
route.put("/update-puzzle-goal", updatePuzzleGoal);
route.put("/update-points-goal", updatePointsGoal);
route.get("/fetch-user-settings", fetchUserSettings);
route.get("/fetch-users", fetchUsers);
route.get("/check-reset-streak", checkResetStreak)
