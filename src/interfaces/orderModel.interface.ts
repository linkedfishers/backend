import { User } from './users.interface';

export class OrderIn {
  user: User;
  orderItems: any[];
  shippingAddress: any;
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}
