import HttpException from '../exceptions/HttpException';
import { Order } from '../interfaces/order.interface';
import orderModel from '../models/order.model';
import { isEmptyObject } from '../utils/util';

class OrderService {
  orders = orderModel;
  public async findAllOrder(): Promise<Order[]> {
    const order: Order[] = await this.orders.find().select('_id product quantity').populate('product', '_id name price').exec();
    return order;
  }

  /*   public async createOrder(orderData) : Promise<Order>{
    if (isEmptyObject(orderData)) throw new HttpException(400,`Can't create Empty Ordr`);

  } */
}

export default OrderService;
