import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import multer from 'multer';
import fs from 'fs';
import shortid from 'shortid';
import EquipmentController from '../controllers/equipments.controller';
import ContentController from '../controllers/content.controller';

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
    const a = file.originalname.split('.');
    cb(null, `${shortid.generate()}-${Date.now()}.${a[a.length - 1]}`);
  },
});
const uploadMiddleware = multer({ storage: storage });

class EquipmentRoute implements Route {
  public path = '/equipments';
  public router = Router();
  public equipmentController = new EquipmentController();
  public contentController = new ContentController();
  constructor() {
    this.initializeRoutes();
  }
  //
  private initializeRoutes() {
    /*     this.router.get(`${this.path}/wetaher/all`, this.equipmentController.getweather);
     */ //events
    this.router.post(`${this.path}/boat/new`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.createBoat);
    this.router.post(`${this.path}/equipment/new`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.createEquipment);
    this.router.post(`${this.path}/hebergement/new`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.createHebergement);
    this.router.post(`${this.path}/service/new`, /* authMiddleware,  */ uploadMiddleware.single('file'), this.equipmentController.createService);
    this.router.get(`${this.path}/types`, this.equipmentController.findEquipmentTypes);
    this.router.get(`${this.path}/boat/types`, this.equipmentController.findBoatTypes);
    this.router.get(`${this.path}/hebergement/types`, this.equipmentController.findHebergementTypes);
    this.router.get(`${this.path}/service/types`, this.equipmentController.findServiceTypes);
    this.router.get(`${this.path}/type/:typeId/user/:ownerId`, this.equipmentController.findEquipmentsByTypeAndUser);
    this.router.get(`${this.path}/service/type/:typeId/user/:ownerId`, this.equipmentController.findServicesByTypeAndUser);

    this.router.get(`${this.path}/boats/type/:typeId`, this.equipmentController.findBoatsByType);
    this.router.get(`${this.path}/equipments/type/:typeId`, this.equipmentController.findEquipmentsByType);
    this.router.get(`${this.path}/freelancer/type/:typeId`, this.equipmentController.findServicessByType);
    this.router.get(`${this.path}/hebergements/type/:typeId`, this.equipmentController.findhebergementsByType);

    this.router.get(`${this.path}/limit`, this.equipmentController.getAllEuipmentsWithLimit);

    this.router.get(`${this.path}/service/user/:id`, this.equipmentController.findServicesByUser);
    this.router.get(`${this.path}/user/:id`, this.equipmentController.findEquipmentsByUser);
    this.router.get(`${this.path}/boats/user/:id`, this.equipmentController.findBoatsByUser);
    this.router.get(`${this.path}/hebergements/user/:id`, this.equipmentController.findHebergementsByUser);
    this.router.get(`${this.path}/all`, this.equipmentController.findAllEquipments);
    this.router.get(`${this.path}/boats/all`, this.equipmentController.findAllBoats);
    this.router.get(`${this.path}/hebergements/all`, this.equipmentController.findHebergements);
    this.router.get(`${this.path}/services/all`, this.equipmentController.findServices);
    this.router.delete(`${this.path}/boat/:id`, authMiddleware, this.equipmentController.deleteBoat);
    this.router.delete(`${this.path}/equipment/:id`, authMiddleware, this.equipmentController.deleteEquipment);
    this.router.delete(`${this.path}/hebergement/:id`, authMiddleware, this.equipmentController.deleteHebergement);
    this.router.delete(`${this.path}/service/:id`, authMiddleware, this.equipmentController.deleteService);
    this.router.put(`${this.path}/boat/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.updateBoat);
    this.router.put(`${this.path}/equipment/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.updateEquipment);
    this.router.put(`${this.path}/hebergement/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.updateHebergement);
    this.router.put(`${this.path}/service/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.updateService);
    this.router.get(`${this.path}/boat/:id`, this.equipmentController.getBoat);
    this.router.get(`${this.path}/equipment/:id`, this.equipmentController.getEquipment);
    this.router.get(`${this.path}/hebergement/:id`, this.equipmentController.getHebergement);
    this.router.get(`${this.path}/service/:id`, this.equipmentController.getService);
    //reviews
    this.router.post(`${this.path}/boat/review`, authMiddleware, this.equipmentController.createBoatReview);
    this.router.post(`${this.path}/hebergement/review`, authMiddleware, this.equipmentController.createHebergementReview);
    this.router.post(`${this.path}/service/review`, authMiddleware, this.equipmentController.createServiceReview);
    this.router.post(`${this.path}/equipment/review`, authMiddleware, this.equipmentController.createEquipmentReview);
    this.router.get(`${this.path}/content/:id`, this.contentController.getContent);
    
  }
}

export default EquipmentRoute;
