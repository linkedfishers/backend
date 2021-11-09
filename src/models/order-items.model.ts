import mongoose from 'mongoose';
import { OrdrItems } from '../interfaces/ord_items.interface';

const orderItemShcema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
});

orderItemShcema.set('timestamps', true);

const orderItemModel = mongoose.model<OrdrItems & mongoose.Document>('OrdrItems', orderItemShcema);

export default orderItemModel;
