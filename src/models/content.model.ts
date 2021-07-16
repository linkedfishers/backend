import mongoose from 'mongoose';
import { Content } from '../interfaces/content.interface';

const contentShema = new mongoose.Schema({
  content: String,
});

contentShema.set('timestamps', true);

const contentModel = mongoose.model<Content & mongoose.Document>('Content', contentShema);

export default contentModel;
