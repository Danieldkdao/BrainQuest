import { type Response, type Request } from "express";
import puzzleModel, {
  type IPuzzle,
  type PuzzleCategory,
  type PuzzleDifficulty,
} from "../models/puzzle.model.js";
import cloudinary, { deleteImage } from "../config/cloudinary.js";
import { getAuth } from "@clerk/express";

type CreateType = {
  question: string;
  answer: string;
  hint: string;
  category: PuzzleCategory;
  difficulty: PuzzleDifficulty;
  image: string;
  creator: {
    name: string;
    profileImage: string;
  };
};

type PostCommentType = {
  id: string;
  userId: string;
  name: string;
  profileImage: string;
  content: string;
};

const getGlobalDailyPuzzle = (puzzles: IPuzzle[]) => {
  const epochDate = new Date("2025-01-01T00:00:00Z");
  const now = new Date();

  const millisecondsPerDay = 1000 * 24 * 60 * 60;
  const daysSinceEpoch = Math.floor(
    (now.getTime() - epochDate.getTime()) / millisecondsPerDay
  );

  const puzzleIndex = daysSinceEpoch % puzzles.length;
  return puzzles[puzzleIndex];
};

export const createPuzzle = async (
  req: Request<{}, {}, CreateType>,
  res: Response
) => {
  try {
    const { question, answer, hint, category, difficulty, image, creator } = req.body;
    const result = await cloudinary.uploader.upload(image);
    const newPuzzle = new puzzleModel({
      question,
      answer,
      hint,
      category,
      difficulty,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
      creator,
    });
    await newPuzzle.save();
    res.json({ success: true, message: "Puzzle created successsfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding puzzle." });
  }
};

export const getPuzzles = async (
  req: Request<
    {},
    {},
    { categories: PuzzleCategory[]; difficulties: PuzzleDifficulty[] }
  >,
  res: Response
) => {
  const { userId } = getAuth(req);
  const { categories, difficulties } = req.body;
  try {
    const filter: any = { "creator.id": userId };

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

export const getUserPuzzles = async (
  req: Request<{}, {}, {}, { limit: string; page: string }>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    let puzzles;
    const limit = Number(req.query.limit);
    let page = Number(req.query.page);
    const total = await puzzleModel.countDocuments({ "creator.id": userId });
    const pages = Math.ceil(total / limit);
    if (page === pages) {
      const newCurrentPage = page - 1;
      if (newCurrentPage < 0) {
        puzzles = await puzzleModel
          .find({ "creator.id": userId })
          .sort({ _id: -1 })
          .limit(limit);
        page = 0;
      } else {
        puzzles = await puzzleModel
          .find({ "creator.id": userId })
          .sort({ _id: -1 })
          .skip(limit * newCurrentPage)
          .limit(limit);
        page--;
      }
    } else {
      puzzles = await puzzleModel
        .find({ "creator.id": userId })
        .sort({ _id: -1 })
        .skip(limit * page)
        .limit(limit);
    }
    res.json({
      success: true,
      message: "User puzzles fetched successfully!",
      puzzles,
      pages,
      page,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user puzzles." });
  }
};

export const deletePuzzle = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    let response;
    const puzzle = await puzzleModel.findById(req.params.id);
    if (puzzle) {
      await deleteImage(puzzle.image.publicId);
      await puzzle.deleteOne();
      response = { success: true, message: "Puzzle deleted successfully!" };
    } else {
      response = { success: false, message: "Puzzle not found." };
    }
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting puzzle." });
  }
};

export const getPopularPuzzles = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const popularPuzzles = await puzzleModel
      .find({ "creator.id": { $ne: userId } })
      .sort({ attempts: -1, createdAt: -1 })
      .limit(3);
    res.json({
      success: true,
      message: "Popular puzzles fetched successfully!",
      popularPuzzles,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching popular puzzles." });
  }
};

export const getDiscoverCategoryPuzzles = async (
  req: Request<{}, {}, {}, { category: string }>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const category = req.query.category;
    const puzzles = await puzzleModel.aggregate([
      {
        $match: {
          category,
          "creator.id": { $ne: userId },
        },
      },
      {
        $sample: { size: 3 },
      },
    ]);
    res.json({
      success: true,
      message: "Category puzzles for discover page fetched successfully!",
      puzzles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve category puzzles on discover page.",
    });
  }
};

export const getScrollPuzzles = async (
  req: Request<
    {},
    {},
    {
      categories: PuzzleCategory[];
      difficulties: PuzzleDifficulty[];
      search: string;
      limit: number;
      skip: number;
    }
  >,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const { search, categories, difficulties, skip = 0, limit = 4 } = req.body;
    let query: any = { "creator.id": { $ne: userId } };
    if (categories && categories.length !== 0) {
      query = { ...query, category: { $in: categories } };
    }
    if (difficulties && difficulties.length !== 0) {
      query = { ...query, difficulty: { $in: difficulties } };
    }
    if (search && search.trim() !== "") {
      query = { ...query, question: { $regex: search, $options: "i" } };
    }
    const puzzles = await puzzleModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1, _id: -1 });
    res.json({
      success: true,
      message: "Scroll puzzles fetched successfully!",
      puzzles,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve scroll puzzles." });
  }
};

export const getDailyPuzzle = async (req: Request, res: Response) => {
  try {
    const puzzles = await puzzleModel.find().sort({createdAt: 1, _id: 1});
    if (!puzzles || puzzles.length === 0)
      return res.json({ success: false, message: "No daily puzzle found." });
    const dailyPuzzle = getGlobalDailyPuzzle(puzzles);
    res.json({
      success: true,
      message: "Daily puzzle fetched successfully!",
      dailyPuzzle,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching daily puzzle." });
  }
};

export const postComment = async (
  req: Request<{}, {}, PostCommentType>,
  res: Response
) => {
  try {
    const { id, userId, name, profileImage, content } = req.body;
    if (!id || !userId || !name || !profileImage || !content)
      return res.json({
        success: false,
        message: "Missing fields, all are required.",
      });
    const newComment = {
      creator: {
        id: userId,
        name,
        profileImage,
      },
      content,
    };
    await puzzleModel.findByIdAndUpdate(id, {
      $push: { comments: newComment },
    });
    res.json({ success: true, message: "Comment posted successfully!" });
  } catch (error) {
    console.error(error);
  }
};

export const getComments = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const puzzle = await puzzleModel.findById(req.params.id);
    if (!puzzle)
      return res.json({ success: false, message: "Puzzle doesn't exist." });
    res.json({
      success: true,
      message: "Comments fetched successfully!",
      comments: puzzle.comments,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments." });
  }
};

export const like = async (
  req: Request<{}, {}, { id: string; alreadyLiked: boolean }>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const { id, alreadyLiked } = req.body;
    if (alreadyLiked) {
      await puzzleModel.findByIdAndUpdate(id, { $pull: { likes: userId } });
    } else {
      await puzzleModel.findByIdAndUpdate(id, {
        $push: { likes: userId },
        $pull: { dislikes: userId },
      });
    }
    res.json({ success: true, message: "Like successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error liking puzzle." });
  }
};

export const dislike = async (
  req: Request<{}, {}, { id: string; alreadyDisliked: boolean }>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const { id, alreadyDisliked } = req.body;
    if (alreadyDisliked) {
      await puzzleModel.findByIdAndUpdate(id, { $pull: { dislikes: userId } });
    } else {
      await puzzleModel.findByIdAndUpdate(id, {
        $push: { dislikes: userId },
        $pull: { likes: userId },
      });
    }
    res.json({ success: true, message: "Dislike successful!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error disliking puzzle." });
  }
};
