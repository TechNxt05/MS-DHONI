import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPressureScore extends Document {
  name: string;
  score: number;
  createdAt: Date;
}

const PressureScoreSchema = new Schema<IPressureScore>({
  name: { type: String, required: true, maxlength: 50 },
  score: { type: Number, required: true, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
});

const PressureScore: Model<IPressureScore> =
  mongoose.models.PressureScore ||
  mongoose.model<IPressureScore>("PressureScore", PressureScoreSchema);

export default PressureScore;
