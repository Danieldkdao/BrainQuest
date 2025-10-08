import { getAuth } from "@clerk/express";
import { type Request, type Response } from "express";
import userModel, {
  defaultData3,
  type LevelType,
} from "../models/user.model.ts";
import { chooseDailyChallenges } from "./challenge.controller.ts";
import { addNewWeeks } from "./train.controller.ts";

export const Levels: LevelType[] = [
  {
    level: 1,
    title: "Puzzle Novice",
    pointsNeeded: 0,
    puzzlesNeeded: 0,
    icon: "egg",
    color: "#A0AEC0",
  },
  {
    level: 2,
    title: "Riddle Rookie",
    pointsNeeded: 150,
    puzzlesNeeded: 5,
    icon: "search",
    color: "#718096",
  },
  {
    level: 3,
    title: "Logic Learner",
    pointsNeeded: 450,
    puzzlesNeeded: 15,
    icon: "book",
    color: "#4299E1",
  },
  {
    level: 4,
    title: "Brain Explorer",
    pointsNeeded: 900,
    puzzlesNeeded: 30,
    icon: "rocket",
    color: "#48BB78",
  },
  {
    level: 5,
    title: "Memory Master",
    pointsNeeded: 1500,
    puzzlesNeeded: 50,
    icon: "brain",
    color: "#ED8936",
  },
  {
    level: 6,
    title: "Logic Guru",
    pointsNeeded: 2400,
    puzzlesNeeded: 80,
    icon: "link",
    color: "#D69E2E",
  },
  {
    level: 7,
    title: "Cognitive Champion",
    pointsNeeded: 3600,
    puzzlesNeeded: 120,
    icon: "trophy",
    color: "#B7791F",
  },
  {
    level: 8,
    title: "Mental Strategist",
    pointsNeeded: 5100,
    puzzlesNeeded: 170,
    icon: "target",
    color: "#805AD5",
  },
  {
    level: 9,
    title: "Puzzle Prodigy",
    pointsNeeded: 7200,
    puzzlesNeeded: 240,
    icon: "star",
    color: "#3182CE",
  },
  {
    level: 10,
    title: "Brainiac Mastermind",
    pointsNeeded: 10500,
    puzzlesNeeded: 350,
    icon: "crown",
    color: "#FFD700",
  },
];

export const addUserToDB = async (
  req: Request<{}, {}, { name: string }>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const { name } = req.body;
    if (!userId)
      return res.json({ success: false, message: "User not logged in." });
    const user = await userModel.findOne({ userId });
    if (user)
      return res.json({ success: false, message: "User already exists." });
    const newUser = new userModel({
      userId,
      name,
    });
    await newUser.save();
    res.json({ success: true, message: "New user added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding user.",
    });
  }
};

export const enableNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    await userModel.updateOne({ userId }, [
      { $set: { enableNotifications: { $not: ["$enableNotifications"] } } },
    ]);
    res.json({
      success: true,
      message: "Notification status updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to change notification status.",
    });
  }
};

export const enableLeaderboard = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    await userModel.updateOne({ userId }, [
      { $set: { enableLeaderboard: { $not: ["$enableLeaderboard"] } } },
    ]);
    res.json({
      success: true,
      message: "Leaderboard status updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to change Leaderboard status.",
    });
  }
};

export const updatePuzzleGoal = async (
  req: Request<{}, {}, { newValue: number }>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const { newValue } = req.body;
    await userModel.findOneAndUpdate({ userId }, { puzzleGoal: newValue });
    res.json({ success: true, message: "Puzzle goal updated successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update puzzle goal." });
  }
};

export const updatePointsGoal = async (
  req: Request<{}, {}, { newValue: number }>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const { newValue } = req.body;
    await userModel.findOneAndUpdate({ userId }, { pointsGoal: newValue });
    res.json({ success: true, message: "Points goal updated successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update points goal." });
  }
};

export const fetchUserSettings = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const user = await userModel.findOne({ userId });
    res.json({
      success: true,
      message: "User settings fetched successfully!",
      user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve user settings." });
  }
};

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel
      .find(
        { enableLeaderboard: true },
        { userId: 1, name: 1, points: 1, puzzles: 1, _id: 0 }
      )
      .sort({ points: -1, puzzles: -1 });
    res.json({ success: true, message: "Users fetched successfully!", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

export const checkResetStreak = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const now = Date.now();
    const user = await userModel.findOne(
      { userId },
      {
        lastLogged: 1,
        streak: 1,
        todayPoints: 1,
        todayPuzzles: 1,
      }
    );
    if (!user)
      return res.json({
        success: false,
        message: "User is not logged in or user doesn't exist.",
      });
    const nextDay = new Date(user.lastLogged);
    nextDay.setHours(24, 0, 0, 0);
    if (nextDay.getTime() + 24 * 60 * 60 * 1000 <= now) {
      user.streak = 0;
    }
    if (nextDay.getTime() <= now) {
      user.todayStats = defaultData3;
      await chooseDailyChallenges();
    }
    const puzzleWeeks = await userModel.findOne(
      { userId },
      { "weekPoints.to": 1, _id: 0 }
    );
    if(puzzleWeeks?.weekPuzzles && puzzleWeeks.weekPuzzles.length > 0){
      const sortedWeeks = puzzleWeeks.weekPuzzles.sort((a, b) => b.to - a.to);
      if (sortedWeeks.length === 0 || sortedWeeks[0].to < now) {
        await addNewWeeks(userId, now, 0, 0, 0, 0);
      }
    }
    await user.save();
    res.json({ success: true, message: "Check reset successful!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to reset check reset streak." });
  }
};
