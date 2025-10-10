import { type Request, type Response } from "express";
import challengeModel from "../models/challenge.model.js";

export const resetDailyChallenges = async (tz: string) => {
  try {
    await challengeModel.updateMany(
      {},
      {
        $set: {
          "usersComplete.$[elem].progress": 0,
          "usersComplete.$[elem].isCompleted": false,
        },
      },
      { arrayFilters: [{ "elem.timezone": tz }] }
    );
  } catch (error) {
    console.error(error);
  }
};

export const getDailyChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await challengeModel.find();
    res.json({
      success: true,
      message: "Challenges fetched successfully!",
      challenges,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch daily challenges." });
  }
};
