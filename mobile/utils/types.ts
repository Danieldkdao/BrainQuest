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

export type PuzzleCategoryData = {
  value: number;
  color: string;
  text: string;
  label: string;
  focused: boolean;
};

export type DaysWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type BarChartData = {
  value: number;
  label: DaysWeek;
};

export type Weekly = {
  from: number;
  to: number;
  data: [
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
  ];
};

export type User = {
  userId: string;
  name: string;
  enableNotifications: boolean;
  enableLeaderboard: boolean;
  puzzleGoal: number;
  pointsGoal: number;
  puzzles: number;
  points: number;
  badgesEarned: string[];
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  streak: number;
  todayPuzzles: number;
  todayPoints: number;
  lastLogged: number;
  weekPuzzles: Weekly[];
  weekPoints: Weekly[];
  puzzleCategoryData: PuzzleCategoryData[];
}

export type LeaderboardUser = {
  userId: string;
  name: string;
  points: number;
  puzzles: number;
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

export type Tab = {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
};