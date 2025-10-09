import mongoose, { Schema } from 'mongoose';
const TrainingSessionSchema = new Schema({
    user: { type: String, required: true },
    pointsEarned: { type: Number, required: true },
    puzzlesAttempted: { type: Number, required: true },
    puzzlesSolved: { type: Number, required: true },
    timeLimit: { type: String, required: true },
    timeTaken: { type: String, required: true },
}, { timestamps: true });
const trainingSessionModel = mongoose.models.TrainingSession || mongoose.model("TrainingSession", TrainingSessionSchema);
export default trainingSessionModel;
