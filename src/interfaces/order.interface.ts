import { Product } from './product.interface';
import { User } from './users.interface';

export class Order {
  _id: string;
  product: Product;
  quantity: number;
}
