import mongoose from 'mongoose';
import { Order } from '../interfaces/order.interface';

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

orderSchema.set('timestamps', true);

const orderModel = mongoose.model<Order & mongoose.Document>('Order', orderSchema);

export default orderModel;
