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
  isDaily: boolean;
  dailyPuzzleAttempts: string[];
  hint: string;
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

export type LevelType = {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  title: string;
  pointsNeeded: number;
  puzzlesNeeded: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export type PuzzleCategoryData = {
  value: number;
  color: string;
  text: string;
  label: string;
  focused: boolean;
  correct: number;
  timeSpent: number;
};

export type CategoryArrayItemSave = {
  category: PuzzleCategory;
  isCorrect: boolean;
  timeSpent: number;
};

export type TodayStats = {
  puzzles: {
    correct: number;
    incorrect: number;
  };
  points: number;
  timeSpent: number;
  categories: {
    logic: number;
    math: number;
    wordplay: number;
    lateral: number;
    patterns: number;
    classic: number;
    trivia: number;
  };
};

export type DaysWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type BarChartData = {
  value: number;
  frontColor: string;
  gradientColor: string;
  label?: DaysWeek;
  spacing?: number;
  labelWidth?: number;
  day?: DaysWeek;
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
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
    BarChartData,
  ];
};

export type Weekly2 = {
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
  puzzles: {
    correct: number,
    incorrect: number,
  };
  points: number;
  timeSpent: number;
  badgesEarned: string[];
  level: LevelType;
  streak: number;
  todayStats: TodayStats;
  lastLogged: number;
  weekPuzzles: Weekly[];
  weekPoints: Weekly2[];
  weekTimeSpent: Weekly2[];
  puzzleCategoryData: PuzzleCategoryData[];
};

export type Badge = {
  _id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  condition: string;
};

export type LeaderboardUser = {
  userId: string;
  name: string;
  points: number;
  puzzles: {
    correct: number;
    incorrect: number;
  };
}

export type UserProgress = {
  user: string;
  progress: number;
  isCompleted: boolean;
};

export type Challenge = {
  _id: string;
  title: string;
  task: string;
  reward: number;
  final: number;
  isDaily: boolean;
  condition: string;
  usersComplete: UserProgress[];
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