import mongoose from 'mongoose';
import { OrderPay } from '../interfaces/orderPay.interface';

const OrderPayShema = new mongoose.Schema({
  vendor: [{ type: String, required: true }],
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  note: { type: String },
});

OrderPayShema.set('timestamps', true);

const orderPay = mongoose.model<OrderPay & mongoose.Document>('OrderPay', OrderPayShema);

export default orderPay;
