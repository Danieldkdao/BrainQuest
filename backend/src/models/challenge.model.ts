import mongoose, { Document, Schema, Model } from "mongoose";

export type UserProgress = {
  user: string | null;
  progress: number;
  isCompleted: boolean;
};

export interface IChallenge extends Document {
  title: string;
  task: string;
  reward: number;
  final: number;
  isDaily: boolean;
  condition: string;
  usersComplete: UserProgress[];
}

const UsersCompleteSchema = new Schema<UserProgress>(
  {
    user: { type: String, required: true },
    progress: { type: Number, required: true },
    isCompleted: { type: Boolean, required: true },
  },
  { _id: false }
);

const ChallengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true, unique: true },
  task: { type: String, required: true, unique: true },
  reward: { type: Number, required: true },
  final: { type: Number, required: true },
  isDaily: { type: Boolean, required: true },
  condition: { type: String, required: true, unique: true },
  usersComplete: { type: [UsersCompleteSchema], default: [] }
});

const challengeModel: Model<IChallenge> =
  mongoose.models.Challenge || mongoose.model("Challenge", ChallengeSchema);
export default challengeModel;
