import { nextDay } from 'date-fns';
import { NextFunction, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { Product, Categorie } from '../interfaces/product.interface';
import { Provider } from '../interfaces/provider.interface';
import ProductService from '../services/product.service';

class ProductController {
  public productService = new ProductService();

  public createProduct = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider: Provider = req.user as Provider;
      const productData = req.body;
      productData.owner = provider._id;
      console.log(req.file);
      if (req.file) {
        productData.picture = req.file.path.split('/').splice(1).join('/');
      }
      const product: Product = await this.productService.createProduct(productData);
      res.status(201).json({ data: product, message: 'Created Product' });
    } catch (error) {
      next(error);
    }
  };
  public updateProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider: Provider = req.user as Provider;
      const productData = req.body;
      productData.owner = provider._id;
    } catch (error) {
      next(error);
    }
  };
  public findProductsByProvider = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.id;
      const products: Product[] = await this.productService.findProductsByProvider(ownerId);
      res.status(201).json({ data: products });
    } catch (error) {
      next(error);
    }
  };
  public findCategorie = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories: Categorie[] = await this.productService.findCategorie();
      res.status(201).json({ data: categories });
    } catch (error) {
      next(error);
    }
  };
  public findProductByCategorieAndProvider = async (req: RequestWithUser, resw: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.ownerId;
      const catId = req.params.catId;
      const { products, categorie } = await this.productService.findProductByTypeAndProvider(catId, ownerId);
      resw.status(200).json({ data: { products, categorie } });
    } catch (error) {
      next(error);
    }
  };
  public getProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const provider = req.user;
      const product = await this.productService.getProduct(id);
      res.status(200).json({ data: { product } });
    } catch (error) {
      next(error);
    }
  };

  public getAllProducts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {limit = 6, page = 1 } = req.query;
      const products: Product[] = await this.productService.findAllProducts(limit, page);
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };
  public getAllProductsWithLimit = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products: Product[] = await this.productService.findAllProductsWithLimit();
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const product: Product = await this.productService.deleteProduct(id);
      res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
