import { type Response, type Request } from "express";
import puzzleModel, {
  type PuzzleCategory,
  type PuzzleDifficulty,
} from "../models/puzzle.model.ts";

export const addPuzzle = async (req: Request) => {
  try {
    
  } catch (error) {
    console.error(error);
    
  }
}

export const getPuzzles = async (
  req: Request<
    {},
    {},
    { categories: PuzzleCategory[]; difficulties: PuzzleDifficulty[] }
  >,
  res: Response
) => {
  const { categories, difficulties } = req.body;
  try {
    const filter: any = {};

    if (categories.length !== 0) {
      filter.category = { $in: categories };
    }

    if (difficulties.length !== 0) {
      filter.difficulty = { $in: difficulties };
    }

    const puzzles = await puzzleModel.find(filter);
    res.json({
      success: true,
      message: "Puzzles fetched successfully!",
      puzzles,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching puzzles." });
  }
};
