import mongoose, { Document, Schema, Model } from "mongoose";

const calcDaysTillSun = () => {
  const date = new Date(Date.now());
  const dayOfWeek = date.getDay();
  const daysTill = (7 - dayOfWeek) % 7;
  return daysTill;
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
    BarChartData
  ];
};

export interface IUser extends Document {
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

const defaultData: [
  BarChartData,
  BarChartData,
  BarChartData,
  BarChartData,
  BarChartData,
  BarChartData,
  BarChartData
] = [
  {
    value: 0,
    label: "Mon",
  },
  {
    value: 0,
    label: "Tue",
  },
  {
    value: 0,
    label: "Wed",
  },
  {
    value: 0,
    label: "Thu",
  },
  {
    value: 0,
    label: "Fri",
  },
  {
    value: 0,
    label: "Sat",
  },
  {
    value: 0,
    label: "Sun",
  },
];

const defaultData2: PuzzleCategoryData[] = [
  {
    value: 0,
    color: "#4F46E5",
    text: "0%",
    label: "Logic",
    focused: true,
  },
  {
    value: 0,
    color: "#10B981",
    text: "0%",
    label: "Math",
    focused: false,
  },
  {
    value: 0,
    color: "#F59E0B",
    text: "0%",
    label: "Wordplay",
    focused: false,
  },
  {
    value: 0,
    color: "#EF4444",
    text: "0%",
    label: "Lateral",
    focused: false,
  },
  {
    value: 0,
    color: "#3B82F6",
    text: "0%",
    label: "Patterns",
    focused: false,
  },
  {
    value: 0,
    color: "#8B5CF6",
    text: "0%",
    label: "Classic",
    focused: false,
  },
  {
    value: 0,
    color: "#06B6D4",
    text: "0%",
    label: "Trivia",
    focused: false,
  },
];

const WeeklySchema = new Schema<Weekly>(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    data: [
      {
        value: { type: Number, required: true },
        label: { type: String, required: true },
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
  puzzles: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badgesEarned: { type: [String], default: [] },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  todayPuzzles: { type: Number, default: 0 },
  todayPoints: { type: Number, default: 0 },
  lastLogged: { type: Number, default: Date.now },
  weekPuzzles: {
    type: [WeeklySchema],
    default: () => [
      {
        from: Date.now(),
        to: Date.now() + calcDaysTillSun() * 24 * 60 * 60 * 1000,
        data: defaultData,
      },
    ],
  },
  weekPoints: {
    type: [WeeklySchema],
    default: () => [
      {
        from: Date.now(),
        to: Date.now() + calcDaysTillSun() * 24 * 60 * 60 * 1000,
        data: defaultData,
      },
    ],
  },
  puzzleCategoryData: {
    type: [PuzzleCategoryDataSchema],
    default: defaultData2,
  },
});

const userModel: Model<IUser> =
  mongoose.models.User || mongoose.model("User", UserSchema);
export default userModel;
