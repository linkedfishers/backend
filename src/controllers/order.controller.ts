import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';
import { Order } from '../interfaces/order.interface';
import OrderService from '../services/order.service';

class OrderController {
  public orderService = new OrderService();

  public findAllOrders = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders: Order[] = await this.orderService.findAllOrder();
      console.log(orders);

      res.status(200).json({ count: orders.length, orders: orders });
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
