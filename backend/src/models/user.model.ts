import mongoose, { Document, Schema, Model } from "mongoose";
import { type CategoryArrayItemSave } from "../controllers/train.controller.js";

export const resetDay = (
  correct: number,
  incorrect: number,
  pointsEarned: number,
  timeSpent: number,
  categories: CategoryArrayItemSave[]
) => {
  const newTodayStats = { ...defaultData3 };
  newTodayStats.puzzles = { correct, incorrect };
  newTodayStats.points = pointsEarned;
  newTodayStats.timeSpent = timeSpent;
  categories.forEach((item) => {
    newTodayStats.categories[item.category][
      item.isCorrect ? "correct" : "incorrect"
    ] =
      newTodayStats.categories[item.category][
        item.isCorrect ? "correct" : "incorrect"
      ] + 1;
  });
  return newTodayStats;
};

export const createNewWeekPuzzles = (correct: number, incorrect: number) => {
  const date = new Date(Date.now());
  const pendingDayOfWeek = date.getDay();
  const dayOfWeek = pendingDayOfWeek - 1 < 0 ? 12 : (pendingDayOfWeek - 1) * 2;
  const weekPuzzles = defaultData.map((item) => ({ ...item }));
  weekPuzzles[dayOfWeek].value = correct;
  weekPuzzles[dayOfWeek + 1].value = incorrect;
  return weekPuzzles;
};

export const createNewWeekPoints = (points: number) => {
  const date = new Date(Date.now());
  const pendingDayOfWeek = date.getDay();
  const dayOfWeek = pendingDayOfWeek - 1 < 0 ? 6 : pendingDayOfWeek - 1;
  const weekPoints = defaultData4.map((item) => ({ ...item }));
  weekPoints[dayOfWeek].value = points;
  return weekPoints;
};

export const createNewWeekTimeSpent = (timeSpent: number) => {
  const date = new Date(Date.now());
  const pendingDayOfWeek = date.getDay();
  const dayOfWeek = pendingDayOfWeek - 1 < 0 ? 6 : pendingDayOfWeek - 1;
  const weekTimeSpent = defaultData4.map((item) => ({ ...item }));
  weekTimeSpent[dayOfWeek].value = timeSpent;
  return weekTimeSpent;
};

export const calcDaysTillSun = (d: number) => {
  const date = new Date(d);
  const dayOfWeek = date.getDay();
  const daysTill = (7 - dayOfWeek) % 7;
  if (daysTill === 0) {
    const endOfSun = new Date(date);
    return endOfSun.setHours(23, 59, 59, 999);
  }
  return Date.now() + daysTill * 24 * 60 * 60 * 1000;
};

export type CheckNewDay = {
  timezone: string;
  lastChecked: number;
}

export type PuzzlesCompleted = {
  correct: number;
  incorrect: number;
};

export type LevelType = {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  title: string;
  pointsNeeded: number;
  puzzlesNeeded: number;
  icon: string;
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
  data: BarChartData[];
};

export type TodayStats = {
  puzzles: PuzzlesCompleted;
  points: number;
  timeSpent: number;
  categories: {
    logic: PuzzlesCompleted;
    math: PuzzlesCompleted;
    wordplay: PuzzlesCompleted;
    lateral: PuzzlesCompleted;
    patterns: PuzzlesCompleted;
    classic: PuzzlesCompleted;
    trivia: PuzzlesCompleted;
  };
};

export interface IUser extends Document {
  userId: string;
  name: string;
  enableNotifications: boolean;
  enableLeaderboard: boolean;
  puzzleGoal: number;
  pointsGoal: number;
  puzzles: PuzzlesCompleted;
  points: number;
  timeSpent: number;
  badgesEarned: string[];
  level: LevelType;
  streak: number;
  todayStats: TodayStats;
  lastLogged: number;
  weekPuzzles: Weekly[];
  weekPoints: Weekly[];
  weekTimeSpent: Weekly[];
  puzzleCategoryData: PuzzleCategoryData[];
  checkNewDay: CheckNewDay;
}

export const defaultData: BarChartData[] = [
  {
    value: 0,
    label: "Mon",
    frontColor: "#10b981",
    gradientColor: "#059669",
    spacing: 2,
    labelWidth: 50,
  },
  {
    value: 0,
    frontColor: "#ef4444",
    gradientColor: "#dc2626",
    day: "Mon",
  },
  {
    value: 0,
    label: "Tue",
    frontColor: "#10b981",
    gradientColor: "#059669",
    spacing: 2,
    labelWidth: 50,
  },
  {
    value: 0,
    frontColor: "#ef4444",
    gradientColor: "#dc2626",
    day: "Tue",
  },
  {
    value: 0,
    label: "Wed",
    frontColor: "#10b981",
    gradientColor: "#059669",
    spacing: 2,
    labelWidth: 50,
  },
  {
    value: 0,
    frontColor: "#ef4444",
    gradientColor: "#dc2626",
    day: "Wed",
  },
  {
    value: 0,
    label: "Thu",
    frontColor: "#10b981",
    gradientColor: "#059669",
    spacing: 2,
    labelWidth: 50,
  },
  {
    value: 0,
    frontColor: "#ef4444",
    gradientColor: "#dc2626",
    day: "Thu",
  },
  {
    value: 0,
    label: "Fri",
    frontColor: "#10b981",
    gradientColor: "#059669",
    spacing: 2,
    labelWidth: 50,
  },
  {
    value: 0,
    frontColor: "#ef4444",
    gradientColor: "#dc2626",
    day: "Fri",
  },
  {
    value: 0,
    label: "Sat",
    frontColor: "#10b981",
    gradientColor: "#059669",
    spacing: 2,
    labelWidth: 50,
  },
  {
    value: 0,
    frontColor: "#ef4444",
    gradientColor: "#dc2626",
    day: "Sat",
  },
  {
    value: 0,
    label: "Sun",
    frontColor: "#10b981",
    gradientColor: "#059669",
    spacing: 2,
    labelWidth: 50,
  },
  {
    value: 0,
    frontColor: "#ef4444",
    gradientColor: "#dc2626",
    day: "Sun",
  },
];

const defaultData2: PuzzleCategoryData[] = [
  {
    value: 0,
    color: "#4F46E5",
    text: "0%",
    label: "Logic",
    focused: true,
    correct: 0,
    timeSpent: 0,
  },
  {
    value: 0,
    color: "#10B981",
    text: "0%",
    label: "Math",
    focused: false,
    correct: 0,
    timeSpent: 0,
  },
  {
    value: 0,
    color: "#F59E0B",
    text: "0%",
    label: "Wordplay",
    focused: false,
    correct: 0,
    timeSpent: 0,
  },
  {
    value: 0,
    color: "#EF4444",
    text: "0%",
    label: "Lateral",
    focused: false,
    correct: 0,
    timeSpent: 0,
  },
  {
    value: 0,
    color: "#3B82F6",
    text: "0%",
    label: "Patterns",
    focused: false,
    correct: 0,
    timeSpent: 0,
  },
  {
    value: 0,
    color: "#8B5CF6",
    text: "0%",
    label: "Classic",
    focused: false,
    correct: 0,
    timeSpent: 0,
  },
  {
    value: 0,
    color: "#06B6D4",
    text: "0%",
    label: "Trivia",
    focused: false,
    correct: 0,
    timeSpent: 0,
  },
];

export const defaultData3: TodayStats = {
  puzzles: {
    correct: 0,
    incorrect: 0,
  },
  points: 0,
  timeSpent: 0,
  categories: {
    logic: {
      correct: 0,
      incorrect: 0,
    },
    math: {
      correct: 0,
      incorrect: 0,
    },
    wordplay: {
      correct: 0,
      incorrect: 0,
    },
    lateral: {
      correct: 0,
      incorrect: 0,
    },
    patterns: {
      correct: 0,
      incorrect: 0,
    },
    classic: {
      correct: 0,
      incorrect: 0,
    },
    trivia: {
      correct: 0,
      incorrect: 0,
    },
  },
};

export const defaultData4: BarChartData[] = [
  {
    value: 0,
    label: "Mon",
    frontColor: "#10b981",
    gradientColor: "#059669",
  },
  {
    value: 0,
    label: "Tue",
    frontColor: "#10b981",
    gradientColor: "#059669",
  },
  {
    value: 0,
    label: "Wed",
    frontColor: "#10b981",
    gradientColor: "#059669",
  },
  {
    value: 0,
    label: "Thu",
    frontColor: "#10b981",
    gradientColor: "#059669",
  },
  {
    value: 0,
    label: "Fri",
    frontColor: "#10b981",
    gradientColor: "#059669",
  },
  {
    value: 0,
    label: "Sat",
    frontColor: "#10b981",
    gradientColor: "#059669",
  },
  {
    value: 0,
    label: "Sun",
    frontColor: "#10b981",
    gradientColor: "#059669",
  },
];

const PuzzlesCompletedSchema = new Schema<PuzzlesCompleted>(
  {
    correct: { type: Number, required: true },
    incorrect: { type: Number, required: true },
  },
  { _id: false }
);

const TodayStatsSchema = new Schema<TodayStats>(
  {
    puzzles: {
      type: PuzzlesCompletedSchema,
      required: true,
    },
    points: { type: Number, required: true },
    timeSpent: { type: Number, required: true },
    categories: {
      logic: { type: PuzzlesCompletedSchema, required: true },
      math: { type: PuzzlesCompletedSchema, required: true },
      wordplay: { type: PuzzlesCompletedSchema, required: true },
      lateral: { type: PuzzlesCompletedSchema, required: true },
      patterns: { type: PuzzlesCompletedSchema, required: true },
      classic: { type: PuzzlesCompletedSchema, required: true },
      trivia: { type: PuzzlesCompletedSchema, required: true },
    },
  },
  { _id: false }
);

const LevelTypeSchema = new Schema<LevelType>(
  {
    level: { type: Number, required: true },
    title: { type: String, required: true },
    pointsNeeded: { type: Number, required: true },
    puzzlesNeeded: { type: Number, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
  },
  { _id: false }
);

const WeeklySchema = new Schema<Weekly>(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    data: [
      {
        value: { type: Number, required: true },
        frontColor: { type: String, required: true },
        gradientColor: { type: String, required: true },
        label: { type: String },
        spacing: { type: Number },
        labelWidth: { type: Number },
        day: { type: String },
      },
    ],
  },
  { _id: false }
);

const PuzzleCategoryDataSchema = new Schema<PuzzleCategoryData>(
  {
    value: { type: Number, required: true },
    color: { type: String, required: true },
    text: { type: String, required: true },
    label: { type: String, required: true },
    focused: { type: Boolean, required: true },
    correct: { type: Number, required: true },
    timeSpent: { type: Number, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  enableNotifications: { type: Boolean, default: false },
  enableLeaderboard: { type: Boolean, default: true },
  puzzleGoal: { type: Number, default: 50 },
  pointsGoal: { type: Number, default: 500 },
  puzzles: {
    type: PuzzlesCompletedSchema,
    default: {
      correct: 0,
      incorrect: 0,
    },
  },
  points: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 },
  badgesEarned: { type: [String], default: [] },
  level: {
    type: LevelTypeSchema,
    default: {
      level: 1,
      title: "Puzzle Novice",
      pointsNeeded: 0,
      puzzlesNeeded: 0,
      icon: "egg",
      color: "#A0AEC0",
    },
  },
  streak: { type: Number, default: 0 },
  todayStats: { type: TodayStatsSchema, default: defaultData3 },
  lastLogged: { type: Number, default: () => Date.now() - 24 * 60 * 60 * 1000 },
  weekPuzzles: {
    type: [WeeklySchema],
    default: () => [
      {
        from: Date.now(),
        to: calcDaysTillSun(Date.now()),
        data: defaultData,
      },
    ],
  },
  weekPoints: {
    type: [WeeklySchema],
    default: () => [
      {
        from: Date.now(),
        to: calcDaysTillSun(Date.now()),
        data: defaultData4,
      },
    ],
  },
  weekTimeSpent: {
    type: [WeeklySchema],
    default: () => [
      {
        from: Date.now(),
        to: calcDaysTillSun(Date.now()),
        data: defaultData4,
      },
    ],
  },
  puzzleCategoryData: {
    type: [PuzzleCategoryDataSchema],
    default: defaultData2,
  },
  checkNewDay: {
    timezone: { type: String, required: true },
    lastChecked: { type: Number, default: Date.now },
  }
});

const userModel: Model<IUser> =
  mongoose.models.User || mongoose.model("User", UserSchema);
export default userModel;
