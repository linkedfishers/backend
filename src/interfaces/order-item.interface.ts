import { Product } from './product.interface';

export class OrderItem {
  _id: string;
  quantity: number;
  product: Product;
}
