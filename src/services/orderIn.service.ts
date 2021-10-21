import HttpException from '../exceptions/HttpException';
import { OrderIn } from '../interfaces/orderModel.interface';
import orderInmodel from '../models/orderIn.model';
import { isEmptyObject } from '../utils/util';

class OrderInService {
  orders = orderInmodel;
  public async ceateOrderIn(orderdata): Promise<OrderIn> {
    if (isEmptyObject(orderdata)) throw new HttpException(400, `Cant't create new Order`);
    const order = new this.orders(orderdata);
    return await order.save();
  }

  public async findAllOrers(): Promise<OrderIn[]> {
    const orderList: OrderIn[] = await this.orders.find().populate('user');
    return orderList;
  }
}

export default OrderInService;
