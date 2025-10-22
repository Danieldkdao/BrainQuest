import express, { type Response, type Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { route as trainRoute } from "./routes/train.route.js";
import { route as puzzleRoute } from "./routes/puzzle.route.js";
import { route as userRoute } from "./routes/user.route.js";
import { route as badgeRoute } from "./routes/badge.route.js";
import { route as challengeRoute } from "./routes/challenge.route.js";
import { clerkMiddleware } from "@clerk/express";
import { runDaily, keepOpen } from "./config/cron.js";
import puzzleModel from "./models/puzzle.model.js";
import trainingSessionModel from "./models/training-session.model.js";
import userModel, { createNewWeekPuzzles } from "./models/user.model.js";
import badgeModel from "./models/badge.model.js";
import challengeModel from "./models/challenge.model.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
keepOpen.start();
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
  res.send("Welcome to the BrainQuest backend!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
