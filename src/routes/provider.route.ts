import { Router } from 'express';
import ProviderController from '../controllers/provider.controller';
import Route from '../interfaces/routes.interface';
import authProviderMiddleware from '../middlewares/authProvide.middleware';
import multer from 'multer';
import fs from 'fs';
import shortid from 'shortid';

// SET STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      let path = 'uploads/logo';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      cb(null, path);
    }
  },
  filename: (req, file, cb) => {
    let a = file.originalname.split('.');
    cb(null, `${shortid.generate()}-${Date.now()}.${a[a.length - 1]}`);
  },
});
const upload = multer({ storage: storage });

class ProviderRoute implements Route {
  public path = '/providers';
  public router = Router();
  public providerController = new ProviderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.providerController.getProviders);
    this.router.get(`${this.path}/product/:id`, this.providerController.getProviderById);
    this.router.get(`${this.path}/search/:keyword`, this.providerController.search);
  }
}

export default ProviderRoute;
