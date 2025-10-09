import mongoose, { Schema } from "mongoose";
const CommentSchema = new Schema({
    creator: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        profileImage: { type: String, required: true },
    },
    content: { type: String, required: true },
}, { timestamps: true });
const PuzzleSchema = new Schema({
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    creator: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        profileImage: { type: String, required: true },
    },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
    attempts: { type: [String], default: [] },
    successes: { type: [String], default: [] },
    image: {
        url: { type: String, required: true },
        publicId: { type: String },
    },
    isDaily: { type: Boolean, default: false },
    dailyPuzzleAttempts: { type: [String], default: [] },
}, { timestamps: true });
const puzzleModel = mongoose.models.Puzzle || mongoose.model("Puzzle", PuzzleSchema);
export default puzzleModel;
