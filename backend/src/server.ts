import express, { type Response, type Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.ts";
import { route as trainRoute } from "./routes/train.route.ts";
import { route as puzzleRoute } from "./routes/puzzle.route.ts";
import { route as userRoute } from "./routes/user.route.ts";
import { route as badgeRoute } from "./routes/badge.route.ts";
import { route as challengeRoute } from "./routes/challenge.route.ts";
import { clerkMiddleware } from "@clerk/express";
import { runDaily, keepOpen } from "./config/cron.ts";
import puzzleModel from "./models/puzzle.model.ts";
import trainingSessionModel from "./models/training-session.model.ts";
import userModel, { createNewWeekPuzzles } from "./models/user.model.ts";
import badgeModel from "./models/badge.model.ts";
import challengeModel from "./models/challenge.model.ts";
import { chooseDailyChallenges } from "./controllers/challenge.controller.ts";
import { chooseDailyPuzzle } from "./controllers/puzzle.controller.ts";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
runDaily.start();

app.use(express.json());
app.use(
  cors({
    origin: "",
  })
);
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  })
);

app.use("/api/users", userRoute);
app.use("/api/puzzles", puzzleRoute);
app.use("/api/train", trainRoute);
app.use("/api/badges", badgeRoute);
app.use("/api/challenges", challengeRoute);

app.get("/", async (req: Request, res: Response) => {
  const r = await userModel.find();
  res.json(r);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
