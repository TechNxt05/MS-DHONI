import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFanPin extends Document {
  name: string;
  city: string;
  country: string;
  message: string;
  lat: number;
  lon: number;
  createdAt: Date;
}

const FanPinSchema = new Schema<IFanPin>({
  name: { type: String, required: true, maxlength: 60 },
  city: { type: String, required: true, maxlength: 100 },
  country: { type: String, required: true, maxlength: 100 },
  message: { type: String, required: true, maxlength: 300 },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FanPin: Model<IFanPin> =
  mongoose.models.FanPin || mongoose.model<IFanPin>("FanPin", FanPinSchema);

export default FanPin;
