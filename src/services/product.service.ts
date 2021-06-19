import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/HttpException';
import { Product, Categorie } from '../interfaces/product.interface';
import { User } from '../interfaces/users.interface';
import marketmodel from '../models/product.model';
import { isEmptyObject } from '../utils/util';
import fs from 'fs';
import { Provider } from '../interfaces/provider.interface';
import providerModel from '../models/provider.model';
import userModel from '../models/users.model';

class ProductService {
  public products = marketmodel.productModel;
  public categories = marketmodel.categorieModel;

  public async createProduct(productData): Promise<Product> {
    if (isEmptyObject(productData)) throw new HttpException(400, "can't create empty Product");
    const product = new this.products(productData);
    return await product.save();
  }

  public async findAllProducts(): Promise<Product[]> {
    const products: Product[] = await this.products.find().populate('owner', 'companyName slug').populate('type', 'name');
    return products;
  }

  public async findProductByProvider(ownerId: string): Promise<Product[]> {
    if (!isValidObjectId(ownerId)) {
      throw new HttpException(400, 'Invalid user Id ');
    }
    const owner: Provider = await providerModel.findById(ownerId);
    if (!owner) {
      return [];
    }
    const products: Product[] = await this.products.find({ owner: owner }).sort('-createdAt');
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
    const prod = await this.products.findById(id).populate('owner', 'fullName slug profilePicture').lean();
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
    if (catType.length == 0) {
      this.DefaultCategorie();
    }
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
    const owner: Provider = await providerModel.findById(ownerId);
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
    const product = await this.products.findById(id).populate('owner', 'fullName profilePicture').populate('type', 'name description').lean();
    const isOwner = product.owner._id.toString() === currentProvider._id.toString();
    return { product, isOwner };
  }
}

export default ProductService;
