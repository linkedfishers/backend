import mongoose from 'mongoose';
import { OrderItem } from '../interfaces/order-item.interface';

const orderItemSchema = new mongoose.Schema({
  quantity: { type: Number, true: true },
  product: { type: mongoose.Types.ObjectId, ref: 'Product' },
});

orderItemSchema.set('timestamps', true);

const orderItemModel = mongoose.model<OrderItem & mongoose.Document>('Order', orderItemSchema);

export default orderItemModel;
