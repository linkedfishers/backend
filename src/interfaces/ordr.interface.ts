import { OrdrItems } from './ord_items.interface';
import { User } from './users.interface';

export class Orders {
  _id: string;
  orderItems: any[];
  shippingAddress1: string;
  shippingAddress2: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice: number;
  user: any;
  dateOrdered: string;
  token: string;
}
