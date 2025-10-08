import { type Request, type Response } from "express";
import challengeModel from "../models/challenge.model.ts";

export const chooseDailyChallenges = async () => {
  try {
    await challengeModel.updateMany(
      {},
      {
        $set: { isDaily: false, isComplete: false, usersComplete: [] },
      }
    );
    const getIds = await challengeModel.aggregate([
      { $sample: { size: 5 } },
      { $project: { _id: 1 } },
    ]);
    const randomIds = getIds.map((item) => item._id);
    await challengeModel.updateMany(
      { _id: { $in: randomIds } },
      { $set: { isDaily: true } }
    );
  } catch (error) {
    console.error(error);
  }
};

export const getDailyChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await challengeModel.find({ isDaily: true });
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
