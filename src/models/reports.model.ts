import mongoose from 'mongoose';
import { Report } from '../interfaces/users.interface';

const reportSchema = new mongoose.Schema({
    cause: String,
    type:String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    target_id: String,
    is_done: { type: Boolean, default: false },
});

reportSchema.set('timestamps', true);
const reportModel = mongoose.model<Report & mongoose.Document>('Report', reportSchema);

export default reportModel;
