import mongoose, { Document, Schema, Model } from "mongoose";

export type PuzzleCategory =
  | "logic"
  | "math"
  | "wordplay"
  | "lateral"
  | "patterns"
  | "classic"
  | "trivia";

export type PuzzleDifficulty = "easy" | "medium" | "hard";

export type Creator = {
  id: string;
  name: string;
  profileImage: string;
};

export type Comment = {
  creator: Creator;
  content: string;
  createdAt: Date;
};

export type Image = {
  url: string;
  publicId: string;
};

export interface IPuzzle extends Document {
  question: string;
  answer: string;
  category: PuzzleCategory;
  difficulty: PuzzleDifficulty;
  creator: Creator;
  likes: string[];
  dislikes: string[];
  comments: Comment[];
  attempts: string[];
  successes: string[];
  image: Image;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>(
  {
    creator: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      profileImage: { type: String, required: true },
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const PuzzleSchema = new Schema<IPuzzle>(
  {
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    creator: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      profileImage: { type: String, required: true },
    },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
    attempts: { type: [String], default: [] },
    successes: { type: [String], default: [] },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const puzzleModel: Model<IPuzzle> =
  mongoose.models.Puzzle || mongoose.model("Puzzle", PuzzleSchema);

export default puzzleModel;
