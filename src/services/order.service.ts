import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/HttpException';
import { Boat, Hebergement } from '../interfaces/equipments.interface';
import { Orders } from '../interfaces/ordr.interface';
import { OrdrItems } from '../interfaces/ord_items.interface';
import { User } from '../interfaces/users.interface';
import models from '../models/equipments.model';
import orderItemModel from '../models/order-items.model';
import orderModel from '../models/ordr.model';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';
import mongoose from 'mongoose';

class OrderService {
  public orders = orderModel;
  public orderItem = orderItemModel;

  public async createOrder(orderData): Promise<Orders> {
    if (isEmptyObject(orderData)) throw new HttpException(400, "Can't create empty Order");

    const order = new this.orders(orderData);
    console.log(order);
    return await order.save();
  }
  public async createOrderItem(orderData): Promise<OrdrItems> {
    if (isEmptyObject(orderData)) throw new HttpException(400, "Can't create empty Order");

    const orderItem = new this.orderItem(orderData);
    console.log(orderItem);
    return await orderItem.save();
  }
  public async calculteTotal(id): Promise<OrdrItems> {
    const total = await this.orderItem.findById(id).populate('product', 'price');
    return total;
  }

  public async findAllOrders(): Promise<Orders[]> {
    const orders: Orders[] = await this.orders.find().populate('user', 'fullName').sort({ dateOrdered: -1 });
    return orders;
  }

  public async getTotalSales(): Promise<Orders[]> {
    /*  const id = '';
    const _id = mongoose.Types.ObjectId.createFromHexString(id); */
    console.log('testHamza');

    const totalSales: Orders[] = await this.orders.aggregate([{ $group: { id: 0, totalsales: { $sum: '$totalPrice' } } }]);
    return totalSales;
  }

  public async getOrder(id: string): Promise<Orders> {
    const eq = await this.orders.findById(id).populate('user').populate({ path: 'orderItems', populate: 'product' }).lean();
    return eq;
  }

  public async updateOrder(orderData, orderId): Promise<Orders> {
    return await this.orders.findByIdAndUpdate(orderId, orderData);
  }

  public async findOrdersByUser(ownerId: string): Promise<Orders[]> {
    if (!isValidObjectId(ownerId)) {
      throw new HttpException(400, 'Invalid user id');
    }
    const user: User = await userModel.findById(ownerId);
    if (!user) {
      return [];
    }
    const orders: Orders[] = await this.orders.find({ owner: user }).sort('-createdAt');
    return orders;
  }

  /* public async getAlldata() : Promise<any>{
  const
} */

  /*   public async createCategorie(categories, parentId = null): Promise<any> {
    const categorieList = [];
    let category;
    if (parentId == null) {
      category = categories.filter(cat => cat.parentId == undefined);
    } else {
      category = categories.filter(cat => cat.parentId == parentId);
    }
    for (let cate of category) {
      categorieList.push({
        _id: cate._id,
        name: cate.name,
        icon: cate.icon,
        childre: this.createCategorie(categories, cate._id),
      });
    }
    return categorieList;
  }*/

  /* public async addEquipementReview(reviewData): Promise<Review> {
    if (isEmptyObject(reviewData)) throw new HttpException(400, "Can't create empty review");

    const equipment = await this.equipments.findById(reviewData.equipment).lean();

    if (!equipment) {
      throw new HttpException(400, 'Invalid equipment');
    }
    if (reviewData.author == equipment.owner._id.toString()) {
      throw new HttpException(400, "Owner can't add review on own equipment");
    }
    const review = new models.reviewModel(reviewData);
    await review.save();
    await this.equipments.updateOne({ _id: reviewData.equipment }, { $addToSet: { reviews: review } });
    return review;
  }*/
}

export default OrderService;
