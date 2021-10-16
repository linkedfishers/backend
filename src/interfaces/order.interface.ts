import { OrderItem } from './order-item.interface';
import { User } from './users.interface';

export class Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAdresse: string;
  shippingAdresse2: string;
  city: string;
  zip: string;
  country: string;
  phone: number;
  status: string;
  totalPrice: number;
  owner: User;
  dateOrder: Date;
}
