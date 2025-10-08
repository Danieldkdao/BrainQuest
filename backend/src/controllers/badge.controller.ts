import { type Request, type Response } from "express";
import badgeModel from "../models/badge.model.ts";

export const fetchBadges = async (req: Request, res: Response) => {
  try {
    const badges = await badgeModel.find();
    res.json({
      success: true,
      message: "Badges fetched successfully!",
      badges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching badges." });
  }
};
