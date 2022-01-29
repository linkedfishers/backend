import { NextFunction, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { Orders } from '../interfaces/ordr.interface';
import { OrdrItems } from '../interfaces/ord_items.interface';
import { User } from '../interfaces/users.interface';
import OrderService from '../services/order.service';
import fetch from 'node-fetch';


const API_PAYMEE = 'https://sandbox.paymee.tn/api/v1/payments/create';
class OrderController {
  public orderService = new OrderService();

  public createOrder = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const orderData = req.body;

      const orderItemId = Promise.all(
        req.body.orderItems.map(async item => {
          const orderData = item;
          const newOrder: OrdrItems = await this.orderService.createOrderItem(orderData);
          console.log(item);

          return newOrder._id;
        }),
      );
      const OtherOrderId = await orderItemId;

      const totalPrices = await Promise.all(
        OtherOrderId.map(async orderItemId => {
          const orderItem = await this.orderService.calculteTotal(orderItemId);
          const totalPrice = orderItem.product?.price * orderItem.quantity;
          return totalPrice;
        }),
      );
      const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

      orderData.user = await req.body.user;
      orderData.orderItems = OtherOrderId;
      orderData.totalPrice = totalPrice;
      const data: any = {
        vendor: 2101,
        amount: orderData.totalPrice,
        note: 'test',
      };
      const tokenData = fetch(API_PAYMEE, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Token 54148a5067586aef941cb00ca702e84aef3caf56',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          console.log(json.data);
          const tokenString = json.data.token;
          console.log(tokenString);
          if (!tokenString) {
            return res.status(400).send({ message: 'invalid ' });
          } else {
            return tokenString;
          }
        })

        .catch(err => console.log(err));

      orderData.token = await tokenData;

      const order: Orders = await this.orderService.createOrder(orderData);
      if (order) {
        res.status(201).json({ data: order, message: 'Order Created' });
      } else {
        console.log('error');
      }
    } catch (error) {
      next(error);
    }
  };

  public findAllOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders: Orders[] = await this.orderService.findAllOrders();
      res.status(201).json({ data: orders });
    } catch (error) {
      next(error);
    }
  };

  public totalSales = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('testHama');

      const totalSales = await this.orderService.getTotalSales();
      if (!totalSales) {
        res.status(400).send('the order sales cannot be generated');
      } else {
        res.status(201).send({ totalSales: totalSales });
      }
    } catch (err) {
      console.log('test');

      next(err);
    }
  };

  public getOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const user = req.user;
      const order = await this.orderService.getOrder(id);
      res.status(201).json({ data: order });
    } catch (error) {
      next(error);
    }
  };

  public updateOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const orderId: string = req.params.id;
      const orderData = req.body;
      orderData.status = req.body.status;
      const order: Orders = await this.orderService.updateOrder(orderData, orderId);
      res.status(201).json({ data: order, message: 'Updated Order Status' });
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
