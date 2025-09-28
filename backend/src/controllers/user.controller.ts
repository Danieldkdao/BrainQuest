import { getAuth } from "@clerk/express";
import { type Request, type Response } from "express";
import userModel from "../models/user.model.ts";

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
      .find({}, { userId: 1, name: 1, points: 1, puzzles: 1, _id: 0 })
      .sort({ points: -1, puzzles: -1 });
    res.json({ success: true, message: "Users fetched successfully!", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};
