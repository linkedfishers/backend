import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import multer from 'multer';
import fs from 'fs';
import shortid from 'shortid';
import EquipmentController from '../controllers/equipments.controller';

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

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //events
    this.router.post(`${this.path}/boat/new`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.createBoat);
    this.router.post(`${this.path}/equipment/new`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.createEquipment);
    this.router.post(`${this.path}/hebergement/new`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.createHebergement);

    this.router.get(`${this.path}/types`, authMiddleware, this.equipmentController.findEquipmentTypes);
    this.router.get(`${this.path}/boat/types`, authMiddleware, this.equipmentController.findBoatTypes);
    this.router.get(`${this.path}/hebergement/types`, authMiddleware, this.equipmentController.findHebergementTypes);
    this.router.get(
      `${this.path}/type/:typeId/user/:ownerId`,
      authMiddleware,
      uploadMiddleware.single('file'),
      this.equipmentController.findEquipmentsByTypeAndUser,
    );
    this.router.get(`${this.path}/user/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.findEquipmentsByUser);
    this.router.get(`${this.path}/boats/user/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.findBoatsByUser);
    this.router.get(
      `${this.path}/hebergements/user/:id`,
      authMiddleware,
      uploadMiddleware.single('file'),
      this.equipmentController.findHebergementsByUser,
    );

    this.router.get(`${this.path}/all`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.findEquipmentsByUser);
    this.router.get(`${this.path}/boats/all`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.findBoatsByUser);
    this.router.get(`${this.path}/hebergements/all`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.findHebergements);

    this.router.delete(`${this.path}/boat/:id`, authMiddleware, this.equipmentController.deleteBoat);
    this.router.delete(`${this.path}/equipment/:id`, authMiddleware, this.equipmentController.deleteEquipment);
    this.router.delete(`${this.path}/hebergement/:id`, authMiddleware, this.equipmentController.deleteHebergement);

    this.router.put(`${this.path}/boat/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.updateBoat);
    this.router.put(`${this.path}/equipment/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.updateEquipment);
    this.router.put(`${this.path}/hebergement/:id`, authMiddleware, uploadMiddleware.single('file'), this.equipmentController.updateHebergement);

    this.router.get(`${this.path}/boat/:id`, authMiddleware, this.equipmentController.getBoat);
    this.router.get(`${this.path}/equipment/:id`, authMiddleware, this.equipmentController.getEquipment);
    this.router.get(`${this.path}/hebergement/:id`, authMiddleware, this.equipmentController.getHebergement);

    //reviews
    this.router.post(`${this.path}/boat/review`, authMiddleware, this.equipmentController.createBoatReview);
    this.router.post(`${this.path}/hebergement/review`, authMiddleware, this.equipmentController.createHebergementReview);
    this.router.get(`${this.path}/boat/:id/reviews`, authMiddleware, this.equipmentController.createBoatReview);

  }
}

export default EquipmentRoute;
