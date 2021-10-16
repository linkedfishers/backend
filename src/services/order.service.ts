import { throws } from 'assert';
import HttpException from '../exceptions/HttpException';
import { OrderItem } from '../interfaces/order-item.interface';
import { Order } from '../interfaces/order.interface';
import orderModel from '../models/order.model';
import { isEmptyObject } from '../utils/util';

class OrderService {
  orders = orderModel;
  public async findAllOrders(): Promise<Order[]> {
    const orderList: Order[] = await this.orders.find();

    return orderList;
  }
  public async createOrder(orderData): Promise<Order> {
    if (isEmptyObject(orderData)) throw new HttpException(400, `Can't create Empty Ordr`);

    const order = new this.orders(orderData);
    return await order.save();
  }
}

export default OrderService;
