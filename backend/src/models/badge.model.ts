import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBadge extends Document {
  icon: string;
  title: string;
  description: string;
  condition: string;
}

const BadgeSchema = new Schema<IBadge>({
  icon: { type: String, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: true },
  condition: { type: String, required: true, unique: true },
});

const badgeModel: Model<IBadge> = mongoose.models.Badge || mongoose.model("Badge", BadgeSchema);
export default badgeModel;