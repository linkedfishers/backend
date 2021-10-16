import mongoose from 'mongoose';
import { Order } from '../interfaces/order.interface';

const orderSchema = new mongoose.Schema({
  orderItems: [{ type: mongoose.Types.ObjectId, ref: 'OrderItem', required: true }],
  shippingAdresse: { type: String, required: true },
  shippingAdresse2: { type: String },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  totalPrice: { type: Number },
  owner: { type: mongoose.Types.ObjectId, ref: 'User' },
  dateOrder: { type: Date, default: Date.now },
});

orderSchema.set('timestamps', true);

const orderModel = mongoose.model<Order & mongoose.Document>('Order', orderSchema);

export default orderModel;
