import { throws } from 'assert';
import { NextFunction, Response } from 'express';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { OrderIn } from '../interfaces/orderModel.interface';
import { User } from '../interfaces/users.interface';
import OrderInService from '../services/orderIn.service';

class OrderInController {
  public orderService = new OrderInService();

  public createOrderIn = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const orderData = req.body;
      orderData.user = user._id;
      orderData.orderItems = req.body.orderItems


      if (orderData.orderItems && orderData.orderItems.length === 0) {
        res.status(401);
        return;
      } else {
        const order: OrderIn = await this.orderService.ceateOrderIn(orderData);
        res.status(201).json({ data: order });
      }
    } catch (error) {
      next(error);
    }
  };
}


export default OrderInController
