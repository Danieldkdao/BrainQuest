import express, { type Response, type Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.ts";
import { route as trainRoute } from "./routes/train.route.ts";
import { route as puzzleRoute } from "./routes/puzzle.route.ts";
import puzzleModel from "./models/puzzle.model.ts";
import { clerkMiddleware } from "@clerk/express";

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
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
}));

app.use("/api/puzzles", puzzleRoute);
app.use("/api/train", trainRoute);

app.get("/", async (req: Request, res: Response) => {
  const puzzles = await puzzleModel.find();
  res.json({ puzzles });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
