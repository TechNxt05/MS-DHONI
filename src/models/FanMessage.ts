import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFanMessage extends Document {
    name: string;
    message: string;
    createdAt: Date;
}

const FanMessageSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        maxlength: [500, 'Message cannot be more than 500 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Check if model exists to prevent overwrite error in hot reload
const FanMessage: Model<IFanMessage> = mongoose.models.FanMessage || mongoose.model<IFanMessage>('FanMessage', FanMessageSchema);

export default FanMessage;
