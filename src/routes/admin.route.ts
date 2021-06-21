import { Router } from 'express';
import AdminController from '../controllers/admin.controller';
import Route from '../interfaces/routes.interface';
import adminMiddleware from '../middlewares/admin.middleware';
import multer from 'multer';
import fs from 'fs';

// SET STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path: string;
    if (file.mimetype.includes('image')) {
      path = 'uploads/equipments/';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      cb(null, path);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadMiddleware = multer({ storage: storage });

class AdminRoute implements Route {
  public path = '/admin';
  public router = Router();
  public adminController = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/users/:count/:skip`, adminMiddleware, this.adminController.getUsers);
    this.router.get(`${this.path}/providers/`, adminMiddleware, this.adminController.getProviders);
    this.router.put(`${this.path}/users/:userId`, adminMiddleware, this.adminController.updateUserStatus);
    this.router.get(`${this.path}/reports/:id`, adminMiddleware, this.adminController.getReports);
    this.router.delete(`${this.path}/reports/:id`, adminMiddleware, this.adminController.deleteReport);
    this.router.get(`${this.path}/overview`, adminMiddleware, this.adminController.getOverview);
    this.router.post(`${this.path}/equipment/addType`, adminMiddleware, uploadMiddleware.single('file'), this.adminController.addEquipmentType);
    this.router.post(`${this.path}/boat/addType`, adminMiddleware, uploadMiddleware.single('file'), this.adminController.addBoatType);
    this.router.post(`${this.path}/hebergement/addType`, adminMiddleware, uploadMiddleware.single('file'), this.adminController.addHebergementType);
    this.router.post(`${this.path}/service/addType`, adminMiddleware, uploadMiddleware.single('file'), this.adminController.addServiceType);
    this.router.delete(`${this.path}/equipment/:id`, adminMiddleware, this.adminController.deleteEquipmentType);
    this.router.delete(`${this.path}/boat/:id`, adminMiddleware, this.adminController.deleteBoatType);
    this.router.delete(`${this.path}/hebergement/:id`, adminMiddleware, this.adminController.deleteHebergementType);
    this.router.delete(`${this.path}/service/:id`, adminMiddleware, this.adminController.deleteServiceType);
  }
}

export default AdminRoute;
