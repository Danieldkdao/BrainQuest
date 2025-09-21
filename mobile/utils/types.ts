import { Ionicons } from "@expo/vector-icons";

export type Response<T extends keyof K = never, K = never> = {
  success: boolean;
  message: string;
} & {
  [V in T]?: K[V];
}

export type Creator = {
  id: string;
  name: string;
  profileImage: string;
};

export type Comment = {
  _id: string;
  creator: Creator;
  content: string;
  createdAt: string;
};

export type Image = {
  url: string;
  publicId: string;
}

export type Puzzle = {
  _id: string;
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
  createdAt: string;
};

export type Session = {
  _id: string;
  user: string;
  pointsEarned: number;
  puzzlesAttempted: number;
  puzzlesSolved: number;
  timeLimit: number | string;
  timeTaken: string;
  createdAt: string;
};

export type PuzzleCategory =
  | "logic"
  | "math"
  | "wordplay"
  | "lateral"
  | "patterns"
  | "classic"
  | "trivia";

export type PuzzleDifficulty = "easy" | "medium" | "hard";

export type Category = {
  id: number;
  category: PuzzleCategory;
  iconName: keyof typeof Ionicons.glyphMap;
};

export type Difficulty = {
  id: number;
  difficulty: PuzzleDifficulty;
  iconName: keyof typeof Ionicons.glyphMap;
};