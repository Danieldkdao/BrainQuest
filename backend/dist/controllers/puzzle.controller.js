import puzzleModel from "../models/puzzle.model.js";
import cloudinary, { deleteImage } from "../config/cloudinary.js";
import { getAuth } from "@clerk/express";
export const chooseDailyPuzzle = async () => {
    await puzzleModel.updateMany({}, { $set: { isDaily: false } });
    const randomPuzzle = await puzzleModel.aggregate([
        { $sample: { size: 1 } },
        { $project: { _id: 1 } },
    ]);
    if (!randomPuzzle || randomPuzzle.length === 0)
        return;
    const puzzleId = randomPuzzle[0]._id;
    await puzzleModel.updateOne({ _id: puzzleId }, { $set: { isDaily: true } });
};
export const createPuzzle = async (req, res) => {
    try {
        const { question, answer, category, difficulty, image, creator } = req.body;
        const result = await cloudinary.uploader.upload(image);
        const newPuzzle = new puzzleModel({
            question,
            answer,
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding puzzle." });
    }
};
export const getPuzzles = async (req, res) => {
    const { userId } = getAuth(req);
    const { categories, difficulties } = req.body;
    try {
        const filter = { "creator.id": userId };
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
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching puzzles." });
    }
};
export const getUserPuzzles = async (req, res) => {
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
            }
            else {
                puzzles = await puzzleModel
                    .find({ "creator.id": userId })
                    .sort({ _id: -1 })
                    .skip(limit * newCurrentPage)
                    .limit(limit);
                page--;
            }
        }
        else {
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch user puzzles." });
    }
};
export const deletePuzzle = async (req, res) => {
    try {
        let response;
        const puzzle = await puzzleModel.findById(req.params.id);
        if (puzzle) {
            await deleteImage(puzzle.image.publicId);
            await puzzle.deleteOne();
            response = { success: true, message: "Puzzle deleted successfully!" };
        }
        else {
            response = { success: false, message: "Puzzle not found." };
        }
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting puzzle." });
    }
};
export const getPopularPuzzles = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Error fetching popular puzzles." });
    }
};
export const getDiscoverCategoryPuzzles = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve category puzzles on discover page.",
        });
    }
};
export const getScrollPuzzles = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { search, categories, difficulties, skip = 0, limit = 4 } = req.body;
        let query = { "creator.id": { $ne: userId } };
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Failed to retrieve scroll puzzles." });
    }
};
export const getDailyPuzzle = async (req, res) => {
    try {
        const puzzle = await puzzleModel.findOne({ isDaily: true });
        if (!puzzle)
            return res.json({ success: false, message: "No daily puzzle found." });
        res.json({
            success: true,
            message: "Daily puzzle fetched successfully!",
            puzzle,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Error fetching daily puzzle." });
    }
};
export const postComment = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
    }
};
export const getComments = async (req, res) => {
    try {
        const puzzle = await puzzleModel.findById(req.params.id);
        if (!puzzle)
            return res.json({ success: false, message: "Puzzle doesn't exist." });
        res.json({
            success: true,
            message: "Comments fetched successfully!",
            comments: puzzle.comments,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch comments." });
    }
};
export const like = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { id, alreadyLiked } = req.body;
        if (alreadyLiked) {
            await puzzleModel.findByIdAndUpdate(id, { $pull: { likes: userId } });
        }
        else {
            await puzzleModel.findByIdAndUpdate(id, {
                $push: { likes: userId },
                $pull: { dislikes: userId },
            });
        }
        res.json({ success: true, message: "Like successful!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error liking puzzle." });
    }
};
export const dislike = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const { id, alreadyDisliked } = req.body;
        if (alreadyDisliked) {
            await puzzleModel.findByIdAndUpdate(id, { $pull: { dislikes: userId } });
        }
        else {
            await puzzleModel.findByIdAndUpdate(id, {
                $push: { dislikes: userId },
                $pull: { likes: userId },
            });
        }
        res.json({ success: true, message: "Dislike successful!" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Error disliking puzzle." });
    }
};
