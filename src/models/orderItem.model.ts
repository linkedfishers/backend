import mongoose from 'mongoose';
import { OrderItem } from '../interfaces/order-item.interface';

const orderItemSchema = new mongoose.Schema({
  quantity: { type: Number, required: true, min: 1 },
  product: { type: mongoose.Types.ObjectId, ref: 'Product' },
  price: { type: Number, required: true },
  total: {
    type: Number,
    required: true,
  },
});

orderItemSchema.set('timestamps', true);

const orderItemModel = mongoose.model<OrderItem & mongoose.Document>('Order', orderItemSchema);

export default orderItemModel;
