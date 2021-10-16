import { NextFunction, Response } from 'express';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { OrderItem } from '../interfaces/order-item.interface';
import { Order } from '../interfaces/order.interface';
import { User } from '../interfaces/users.interface';
import OrderService from '../services/order.service';

class OrderController {
  public orderService = new OrderService();

  public findAllOrders = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders: Order[] = await this.orderService.findAllOrders();
      console.log(orders);

      res.status(200).json({ data: orders });
    } catch (error) {
      next(error);
    }
  };
  public createOrder = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const orderData = req.body;
       orderData.orderItems = req.body.orderItem.map(orderitm=>{
        orderData.orderItems=req
      })

      orderData.owner = user._id;

      const order: Order = await this.orderService.createOrder(orderData);
      res.status(201).json({ data: order, message: 'Created equipment' });
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
