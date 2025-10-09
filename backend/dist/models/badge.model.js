import mongoose, { Schema } from 'mongoose';
const BadgeSchema = new Schema({
    icon: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    condition: { type: String, required: true, unique: true },
});
const badgeModel = mongoose.models.Badge || mongoose.model("Badge", BadgeSchema);
export default badgeModel;
