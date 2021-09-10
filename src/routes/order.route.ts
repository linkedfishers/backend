import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import Route from '../interfaces/routes.interface';

class OrderRoute implements Route {
  public path = '/order';
  public router = Router();
  public orderController = new OrderController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, this.orderController.findAllOrders);
    /*     this.router.post(`${this.path}/new`, OrderController.createOrder);
     */
  }
}

export default OrderRoute;
