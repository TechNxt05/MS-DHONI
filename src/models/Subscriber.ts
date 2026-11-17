import mongoose, { Schema, Document, Model } from 'mongoose';

/** A daily-email subscriber. Only `active` addresses (confirmed by clicking the emailed link) get the digest. */
export interface ISubscriber extends Document {
  email: string;
  token: string;
  status: 'pending' | 'active';
  createdAt: Date;
  confirmedAt?: Date;
  lastConfirmSentAt?: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'active'], default: 'pending', index: true },
  createdAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  lastConfirmSentAt: Date,
});

const Subscriber: Model<ISubscriber> = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
