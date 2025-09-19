import mongoose, { Document, Schema, Model } from 'mongoose';

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
  name: string;
  profileImage: string;
};

export type Comment = {
  creator: Creator;
  content: string;
  createdAt: Date;
}

export interface IPuzzle extends Document {
  question: string;
  answer: string;
  category: PuzzleCategory;
  difficulty: PuzzleDifficulty;
  creator: Creator;
  likes: number;
  dislikes: number;
  comments: Comment[];
  attempts: number;
  successes: number;
  image: string;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>({
  creator: {
    name: { type: String, required: true },
    profileImage: { type: String, required: true },
  },
  content: { type: String, required: true },
}, {timestamps: true});

const PuzzleSchema = new Schema<IPuzzle>({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  creator: {
    name: { type: String, required: true },
    profileImage: { type: String, required: true },
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] },
  attempts: { type: Number, default: 0 },
  successes: { type: Number, default: 0 },
  image: { type: String, required: true },
}, {timestamps: true});

const puzzleModel: Model<IPuzzle> = mongoose.models.Puzzle || mongoose.model("Puzzle", PuzzleSchema);

export default puzzleModel;