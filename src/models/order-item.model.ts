import mongoose from 'mongoose';
import { OrderItem } from '../interfaces/order-item.interface';
import { Order } from '../interfaces/order.interface';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
});

orderItemSchema.set('timestamps', true);

const orderItemModel = mongoose.model<OrderItem & mongoose.Document>('OrderItem', orderItemSchema);

export default orderItemModel;
