import mongoose, { Schema } from "mongoose";
const UsersCompleteSchema = new Schema({
    user: { type: String, required: true },
    progress: { type: Number, required: true },
    isCompleted: { type: Boolean, required: true },
}, { _id: false });
const ChallengeSchema = new Schema({
    title: { type: String, required: true, unique: true },
    task: { type: String, required: true, unique: true },
    reward: { type: Number, required: true },
    final: { type: Number, required: true },
    isDaily: { type: Boolean, required: true },
    condition: { type: String, required: true, unique: true },
    usersComplete: { type: [UsersCompleteSchema], default: [] }
});
const challengeModel = mongoose.models.Challenge || mongoose.model("Challenge", ChallengeSchema);
export default challengeModel;
