import mongoose from 'mongoose';
import { Content } from '../interfaces/content.interface';

const contentShema = new mongoose.Schema({
  image: String,
  content: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

contentShema.set('timestamps', true);

const contentModel = mongoose.model<Content & mongoose.Document>('Content', contentShema);

export default contentModel;
