import { Router } from 'express';
import AdminController from '../controllers/admin.controller';
import Route from '../interfaces/routes.interface';
import adminMiddleware from '../middlewares/admin.middleware';
import multer from 'multer';
import fs from 'fs';
import authMiddleware from '../middlewares/auth.middleware';
import ContentController from '../controllers/content.controller';
import OrderController from '../controllers/order.controller';
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
  public contentController = new ContentController();
  public orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/order/all`, this.orderController.findAllOrder);
    this.router.get(`${this.path}/order/:id`, this.orderController.getOrder);
    this.router.put(`${this.path}/order/:id`, this.orderController.updateOrder);
    this.router.get(`${this.path}/order/getTotal`, this.orderController.totalSales);
    this.router.post(`${this.path}/content/new`, adminMiddleware, uploadMiddleware.array('files'), this.adminController.createContent);
    this.router.delete(`${this.path}/content/:id`, adminMiddleware, this.adminController.deleteContent);

    this.router.put(`${this.path}/content/:id`, uploadMiddleware.array('files'), this.contentController.UpdateContent);
    this.router.get(`${this.path}/contents/all`, this.adminController.findAllContents);
    this.router.get(`${this.path}/users/:count/:skip`, adminMiddleware, this.adminController.getUsers);
    this.router.get(`${this.path}/providers/`, adminMiddleware, this.adminController.getProviders);
    this.router.put(`${this.path}/users/:userId`, adminMiddleware, this.adminController.updateUserStatus);
    this.router.get(`${this.path}/reports/:id`, adminMiddleware, this.adminController.getReports);
    this.router.delete(`${this.path}/reports/:id`, adminMiddleware, this.adminController.deleteReport);
    this.router.get(`${this.path}/overview`, adminMiddleware, this.adminController.getOverview);
    this.router.post(`${this.path}/equipment/addType`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.addEquipmentType);
    this.router.post(`${this.path}/boat/addType`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.addBoatType);
    this.router.post(`${this.path}/hebergement/addType`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.addHebergementType);
    this.router.post(`${this.path}/service/addType`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.addServiceType);
    this.router.post(
      `${this.path}/productCategory/addType`,
      adminMiddleware,
      uploadMiddleware.single('files'),
      this.adminController.addProductCategory,
    );

    //Update Type Categries
    this.router.put(`${this.path}/boat/:id`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.updateBoatType);
    this.router.put(`${this.path}/hebrgementType/:id`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.updateHebergementType);
    this.router.put(`${this.path}/equipmentType/:id`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.updateEquipmentType);
    this.router.put(`${this.path}/serviceType/:id`, adminMiddleware, uploadMiddleware.single('files'), this.adminController.updateServiceType);

    // a verifier
    this.router.get(`${this.path}/hebergementType/:id`), adminMiddleware;
    this.router.delete(`${this.path}/equipment/:id`, adminMiddleware, this.adminController.deleteEquipmentType);
    this.router.delete(`${this.path}/boat/:id`, adminMiddleware, this.adminController.deleteBoatType);
    this.router.delete(`${this.path}/hebergement/:id`, adminMiddleware, this.adminController.deleteHebergementType);
    this.router.delete(`${this.path}/service/:id`, adminMiddleware, this.adminController.deleteServiceType);

    //homePage add text
    /*
    this.router.post(`${this.path}/content/addContent`, uploadMiddleware.array('files'), this.adminController.createContent);
    this.router.get(`${this.path}/content/:id`, this.adminController.getContent);
    this.router.put(`${this.path}/content/:id`, adminMiddleware, uploadMiddleware.single('file'), this.adminController.updateContent);
    this.router.get(`${this.path}/content/all`); */

    /*     this.router.post(`${this.path}/boat/addSoutype`, this.adminController.addSousCatType);
     */
  }
}

export default AdminRoute;
