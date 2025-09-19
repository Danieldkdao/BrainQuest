import { Ionicons } from "@expo/vector-icons";

export type Response<T extends keyof K = never, K = never> = {
  success: boolean;
  message: string;
} & {
  [V in T]?: K[V];
}

export type Creator = {
  name: string;
  profileImage: string;
};

export type Comment = {
  creator: Creator;
  content: string;
  createdAt: string;
};

export type Puzzle = {
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
  createdAt: string;
}

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