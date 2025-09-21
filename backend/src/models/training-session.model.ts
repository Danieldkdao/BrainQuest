import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITrainingSession extends Document {
  user: string;
  pointsEarned: number;
  puzzlesAttempted: number;
  puzzlesSolved: number;
  timeLimit: string;
  timeTaken: string;
  createdAt: Date;
}

const TrainingSessionSchema = new Schema<ITrainingSession>({
  user: { type: String, required: true },
  pointsEarned: { type: Number, required: true },
  puzzlesAttempted: { type: Number, required: true },
  puzzlesSolved: { type: Number, required: true },
  timeLimit: { type: String, required: true },
  timeTaken: {type: String, required: true},
}, {timestamps: true});

const trainingSessionModel: Model<ITrainingSession> = mongoose.models.TrainingSession || mongoose.model("TrainingSession", TrainingSessionSchema);

export default trainingSessionModel;