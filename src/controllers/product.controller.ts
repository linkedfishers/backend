import { nextDay } from 'date-fns';
import { NextFunction, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { RequestWithFileProduct, RequestWithProvider } from '../interfaces/auth.interface';
import { Product, Categorie } from '../interfaces/product.interface';
import { Provider } from '../interfaces/provider.interface';
import ProductService from '../services/product.service';

class ProductController {
  public productService = new ProductService();

  public createProduct = async (req: RequestWithFileProduct, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider: Provider = req.provider;
      const productData = req.body;
      productData.owner = provider._id;
      if (req.file) {
        productData.image = req.file.path.split('/').splice(1).join('/');
      }
      const product: Product = await this.productService.createProduct(productData);
      res.status(201).json({ data: product, message: 'Create Product' });
    } catch (error) {
      next(error);
    }
  };
  public updateProduct = async (req: RequestWithProvider, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider: Provider = req.provider;
      const productData = req.body;
      productData.owner = provider._id;
    } catch (error) {
      next(error);
    }
  };
  public findProductByUser = async (req: RequestWithProvider, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.id || req.provider._id;
      const products: Product[] = await this.productService.findProductByProvider(ownerId);
      res.status(201).json({ data: products });
    } catch (error) {
      next(error);
    }
  };
  public findCategorie = async (req: RequestWithProvider, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories: Categorie[] = await this.productService.findCategorie();
      res.status(201).json({ data: categories });
    } catch (error) {
      next(error);
    }
  };
  public findProductByCategorieAndProvider = async (req: RequestWithProvider, resw: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.ownerId;
      const catId = req.params.catId;
      const { products, categorie } = await this.productService.findProductByTypeAndProvider(catId, ownerId);
      resw.status(200).json({ data: { products, categorie } });
    } catch (error) {
      next(error);
    }
  };
  public getProduct = async (req: RequestWithProvider, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const provider = req.provider;
      const product = await this.productService.getProduct(id);
      res.status(200).json({ data: { product } });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
