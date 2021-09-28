import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/HttpException';
import { Product, Categorie } from '../interfaces/product.interface';
import { User } from '../interfaces/users.interface';
import marketmodel from '../models/product.model';
import { isEmptyObject } from '../utils/util';
import fs from 'fs';
import { Provider } from '../interfaces/provider.interface';
import userModel from '../models/users.model';

class ProductService {
  public products = marketmodel.productModel;
  public categories = marketmodel.categorieModel;

  public async createProduct(productData): Promise<Product> {
    if (isEmptyObject(productData)) throw new HttpException(400, "can't create empty Product");
    const provider: Provider = await userModel.findById(productData.owner);
    if (provider.role != 'provider') {
      throw new HttpException(400, 'Only providers can add products!');
    }
    const product = new this.products(productData);
    return await product.save();
  }

  public async findAllProducts(/* limit, page  */): Promise<Product[]> {
    const products: Product[] = await this.products
      .find()
     /*  .limit(limit)
      .skip(limit * page) */
      .populate('owner', 'companyName slug')
      .populate('type', 'name');
    return products;
  }

  public async findAllProductsWithLimit(): Promise<Product[]> {
    const perPage = 2;
    const products: Product[] = await this.products.find({}).limit(perPage).populate('owner', 'companyName slug').populate('type', 'name');
    return products;
  }

  public async findProductsByProvider(ownerId: string): Promise<Product[]> {
    if (!isValidObjectId(ownerId)) {
      throw new HttpException(400, 'Invalid user Id ');
    }
    const owner: Provider = await userModel.findById(ownerId);
    if (!owner) {
      return [];
    }
    const products: Product[] = await this.products.find({ owner: owner }).populate('type', 'name').sort('-createdAt');
    return products;
  }

  public async deleteProduct(productId: string): Promise<Product> {
    const product = await this.products.findByIdAndDelete(productId);
    if (fs.existsSync('uploads/' + product.picture)) {
      fs.unlinkSync('uploads/' + product.picture);
    }
    return product;
  }
  public async updateProduct(productData, productId): Promise<Product> {
    return await this.products.findByIdAndUpdate(productId, productData);
  }

  public async getProduct(id: string): Promise<Product> {
    const prod: Product = await this.products.findById(id).populate('owner', 'companyName slug profilePicture').populate('type', 'name').lean();
    return prod;
  }

  public async addCategorie(categorie: Categorie): Promise<Categorie> {
    if (!categorie.name || !categorie.description) {
      throw new HttpException(400, 'All field must be added');
    }
    const newCategorie = new marketmodel.categorieModel(categorie);
    return newCategorie.save();
  }

  public async findCategorie(): Promise<Categorie[]> {
    const catType: Categorie[] = await this.categories.find();
    return await this.categories.find();
  }

  public async DefaultCategorie() {
    const cats = [
      { name: 'test1', description: 'mycat1' },
      { name: 'test2', description: 'mycat2' },
      { name: 'test3', description: 'mycat3' },
    ];
    for (let i = 0; i < cats.length; i++) {
      const cat = new this.categories(cats[i]);
      await cat.save();
    }
  }
  public async findProductByTypeAndProvider(catId: string, ownerId: string): Promise<{ products: Product[]; categorie: Categorie }> {
    if (!isValidObjectId(ownerId) || !isValidObjectId(catId)) {
      throw new HttpException(400, 'Invalid id!');
    }
    const categorie: Categorie = await this.categories.findById(catId);
    if (!categorie) {
      throw new HttpException(400, 'No Product type with this id!');
    }
    const owner: Provider = await userModel.findById(ownerId);
    if (!owner) {
      return { products: [], categorie };
    }
    const products: Product[] = await this.products.find({
      owner: owner,
      type: categorie,
    });
    return { products, categorie };
  }

  public async getProducts(id: string, currentProvider: User): Promise<{ product: Product; isOwner: boolean }> {
    const product = await this.products.findById(id).populate('owner', 'companyName profilePicture').populate('type', 'name description').lean();
    const isOwner = product.owner._id.toString() === currentProvider._id.toString();
    return { product, isOwner };
  }
}

export default ProductService;
