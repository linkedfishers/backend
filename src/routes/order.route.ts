import { Router } from 'express';
import OrderInController from '../controllers/orderIn.controller';
import Route from '../interfaces/routes.interface';

class OrderRoute implements Route {
  public path = '/order';
  public router = Router();
  public orderInController = new OrderInController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /*     this.router.get(`${this.path}/all`, this.orderInController.);
     */ this.router.post(`${this.path}/new`, this.orderInController.createOrderIn);
  }
}

export default OrderRoute;
