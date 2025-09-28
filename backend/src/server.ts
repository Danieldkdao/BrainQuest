import express, { type Response, type Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.ts";
import { route as trainRoute } from "./routes/train.route.ts";
import { route as puzzleRoute } from "./routes/puzzle.route.ts";
import { route as userRoute } from "./routes/user.route.ts";
import puzzleModel from "./models/puzzle.model.ts";
import { clerkMiddleware } from "@clerk/express";
import trainingSessionModel from "./models/training-session.model.ts";
import userModel from "./models/user.model.ts";
import OpenAI from "openai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

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

app.get("/", async (req: Request, res: Response) => {
  // const openai = new OpenAI({
  //   apiKey: process.env.GEMINI_API_KEY!,
  //   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  // });

  // const response = await openai.chat.completions.create({
  //   model: "gemini-2.0-flash",
  //   messages: [
  //     { role: "system", content: "You are a helpful assistant." },
  //     {
  //       role: "user",
  //       content: "Explain to me how AI works",
  //     },
  //   ],
  // });

  // console.log(response.choices[0].message);
  const r = await userModel.find();
  res.json(r);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
