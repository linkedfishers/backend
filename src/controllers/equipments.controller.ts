import { NextFunction, Response } from 'express';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { Boat, BoatType, Equipment, EquipmentType, Hebergement, HebergementType, Service, ServiceType } from '../interfaces/equipments.interface';
import { Review } from '../interfaces/review.interface';
import { User } from '../interfaces/users.interface';
import EquipmentService from '../services/equipments.service';

class EquipmentController {
  public equipmentService = new EquipmentService();

  public createBoat = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const boatData = req.body;
      boatData.owner = user._id;
      if (Array.isArray(req.file)) {
        boatData.image = req.file.map(file => {
          file.path.split('/').splice(1).join('/');
          console.log(file);
        });
      }
      const boat: Boat = await this.equipmentService.createBoat(boatData);
      res.status(201).json({ data: boat, message: 'Created Boat' });
    } catch (error) {
      next(error);
    }
  };
  public createEquipment = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const equipmentData = req.body;
      equipmentData.owner = user._id;
      if (req.file) {
        equipmentData.image = req.file.path.split('/').splice(1).join('/');
      }
      const equipment: Equipment = await this.equipmentService.createEquipment(equipmentData);
      res.status(201).json({ data: equipment, message: 'Created equipment' });
    } catch (error) {
      next(error);
    }
  };
  public createService = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const serviceData = req.body;
      serviceData.owner = user._id;
      if (req.file) {
        serviceData.image = req.file.path.split('/').splice(1).join('/');
      }
      const service: Service = await this.equipmentService.createService(serviceData);
      res.status(201).json({ data: service, message: 'Created service' });
    } catch (error) {
      next(error);
    }
  };
  public createHebergement = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const equipmentData = req.body;
      equipmentData.owner = user._id;
      if (req.file) {
        equipmentData.image = req.file.path.split('/').splice(1).join('/');
      }
      const hebergement: Hebergement = await this.equipmentService.createHebergement(equipmentData);
      res.status(201).json({ data: hebergement, message: 'Created Hebergement' });
    } catch (error) {
      next(error);
    }
  };

  public updateHebergement = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const hebergementId: string = req.params.id;
      const hebergementData = req.body;
      hebergementData.owner = user._id;
      if (req.file) {
        hebergementData.image = req.file.path.split('/').splice(1).join('/');
      }
      const hebergement: Hebergement = await this.equipmentService.updateHebergement(hebergementData, hebergementId);
      res.status(201).json({ data: hebergement, message: 'Updated Hebergement' });
    } catch (error) {
      next(error);
    }
  };
  public updateService = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const serviceId: string = req.params.id;
      const serviceData = req.body;
      serviceData.owner = user._id;
      if (req.file) {
        serviceData.image = req.file.path.split('/').splice(1).join('/');
      }
      const service: Service = await this.equipmentService.updateHebergement(serviceData, serviceId);
      res.status(201).json({ data: service, message: 'Updated Service' });
    } catch (error) {
      next(error);
    }
  };

  public updateBoat = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const boatData = req.body;
      const boatdId: string = req.params.id;
      boatData.owner = user._id;
      if (req.file) {
        boatData.image = req.file.path.split('/').splice(1).join('/');
      }
      const boat: Boat = await this.equipmentService.updateBoat(boatData, boatdId);
      res.status(201).json({ data: boat, message: 'Updated Boat' });
    } catch (error) {
      next(error);
    }
  };
  public updateEquipment = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const equipmentData = req.body;
      const eqId: string = req.params.id;
      equipmentData.owner = user._id;
      if (req.file) {
        equipmentData.image = req.file.path.split('/').splice(1).join('/');
      }
      const equipment: Equipment = await this.equipmentService.updateEquipment(equipmentData, eqId);
      res.status(201).json({ data: equipment, message: 'Updated equipment' });
    } catch (error) {
      next(error);
    }
  };

  public findBoatsByUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.id || req.user._id;
      const boats: Boat[] = await this.equipmentService.findBoatsByUser(ownerId);
      res.status(200).json({ data: boats });
    } catch (error) {
      next(error);
    }
  };

  public findAllBoats = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const boats: Boat[] = await this.equipmentService.findAllBoats();
      res.status(200).json({ data: boats });
    } catch (error) {
      next(error);
    }
  };

  public findEquipmentsByUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.id || req.user._id;
      const equipments: Equipment[] = await this.equipmentService.findEquipmentsByUser(ownerId);
      res.status(200).json({ data: equipments });
    } catch (error) {
      next(error);
    }
  };

  public findAllEquipments = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      /*       const ownerId = req.params.id || req.user._id;
       */ const equipments: Equipment[] = await this.equipmentService.findAllEquipments();
      res.status(200).json({ data: equipments });
    } catch (error) {
      next(error);
    }
  };

  public findServicesByUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.id || req.user._id;
      const services: Service[] = await this.equipmentService.findServicesByUser(ownerId);
      res.status(200).json({ data: services });
    } catch (error) {
      next(error);
    }
  };

  public findEquipmentsByTypeAndUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.ownerId;
      const typeId = req.params.typeId;
      const { equipments, type } = await this.equipmentService.findEquipmentsByTypeAndUser(typeId, ownerId);
      res.status(200).json({ data: { equipments, type } });
    } catch (error) {
      next(error);
    }
  };

  public findServicesByTypeAndUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.ownerId;
      const typeId = req.params.typeId;
      const { services, type } = await this.equipmentService.findServicesByTypeAndUser(typeId, ownerId);
      res.status(200).json({ data: { services, type } });
    } catch (error) {
      next(error);
    }
  };
  public findBoatsByType = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId = req.params.typeId;
      const boats: Boat[] = await this.equipmentService.findBoatByType(typeId);
      res.status(200).json({ data: boats });
    } catch (error) {
      next(error);
    }
  };
  public findhebergementsByType = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId = req.params.typeId;
      const hebergemets: Hebergement[] = await this.equipmentService.findHebergementByType(typeId);
      res.status(200).json({ data: hebergemets });
    } catch (error) {
      next(error);
    }
  };
  public findServicessByType = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId = req.params.typeId;
      const services: Service[] = await this.equipmentService.findServiceByType(typeId);
      res.status(200).json({ data: services });
    } catch (error) {
      next(error);
    }
  };
  public findEquipmentsByType = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId = req.params.typeId;
      const equipments: Equipment[] = await this.equipmentService.findEquipmentByType(typeId);
      res.status(200).json({ data: equipments });
    } catch (error) {
      next(error);
    }
  };

  public findHebergementsByUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ownerId = req.params.id || req.user._id;
      const hebergements: Hebergement[] = await this.equipmentService.findHebergementsByUser(ownerId);
      res.status(200).json({ data: hebergements });
    } catch (error) {
      next(error);
    }
  };

  public findHebergements = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hebergements: Hebergement[] = await this.equipmentService.findAllHebergements();
      res.status(200).json({ data: hebergements });
    } catch (error) {
      next(error);
    }
  };
  public findServices = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const services: Service[] = await this.equipmentService.findAllService();
      res.status(200).json({ data: services });
    } catch (error) {
      next(error);
    }
  };
  public findEquipmentTypes = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types: EquipmentType[] = await this.equipmentService.findEquipmentTypes();
      res.status(200).json({ data: types });
    } catch (error) {
      next(error);
    }
  };

  public findBoatTypes = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types: BoatType[] = await this.equipmentService.findBoatTypes();
      res.status(200).json({ data: types });
    } catch (error) {
      next(error);
    }
  };

  /*   public getweather = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.equipmentService.gelocalWeather();

      res.status(200).json({ data: data });
    } catch (error) {
      next(error);
    }
  }; */

  public findHebergementTypes = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types: HebergementType[] = await this.equipmentService.findHebergementTypes();
      res.status(200).json({ data: types });
    } catch (error) {
      next(error);
    }
  };
  public findServiceTypes = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types: ServiceType[] = await this.equipmentService.findServiceType();
      res.status(200).json({ data: types });
    } catch (error) {
      next(error);
    }
  };

  public deleteEquipment = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const equipment: Equipment = await this.equipmentService.deleteEquipment(id);
      res.status(200).json({ data: equipment });
    } catch (error) {
      next(error);
    }
  };
  public deleteBoat = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const boat: Boat = await this.equipmentService.deleteBoat(id);
      res.status(200).json({ data: boat });
    } catch (error) {
      next(error);
    }
  };
  public deleteHebergement = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const hebergement: Hebergement = await this.equipmentService.deleteHebergement(id);
      res.status(200).json({ data: hebergement });
    } catch (error) {
      next(error);
    }
  };
  public deleteService = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const service: Service = await this.equipmentService.deleteService(id);
      res.status(200).json({ data: service });
    } catch (error) {
      next(error);
    }
  };

  public getEquipment = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const user = req.user;
      const equipment: Equipment = await this.equipmentService.getEquipment(id);
      res.status(200).json({ data: equipment });
    } catch (error) {
      next(error);
    }
  };
  public getBoat = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const user = req.user;
      const { boat, isOwner } = await this.equipmentService.getBoat(id, user);
      res.status(200).json({ data: { boat, isOwner } });
    } catch (error) {
      next(error);
    }
  };
  public getHebergement = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const hebergement: Hebergement = await this.equipmentService.getHebergement(id);
      res.status(200).json({ data: hebergement });
    } catch (error) {
      next(error);
    }
  };
  public getService = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const service: Service = await this.equipmentService.getService(id);
      res.status(200).json({ data: service });
    } catch (error) {
      next(error);
    }
  };

  public createBoatReview = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const reviewData = req.body;
      reviewData.author = user._id;
      const review: Review = await this.equipmentService.addBoatReview(reviewData);
      res.status(201).json({ data: review, message: 'Added review' });
    } catch (error) {
      next(error);
    }
  };
  public createServiceReview = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const reviewData = req.body;
      reviewData.author = user._id;
      const review: Review = await this.equipmentService.addServiceReview(reviewData);
      res.status(201).json({ data: review, message: 'Added review' });
    } catch (error) {
      next(error);
    }
  };

  public createHebergementReview = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const reviewData = req.body;
      reviewData.author = user._id;
      const review: Review = await this.equipmentService.addHebergementReview(reviewData);
      res.status(201).json({ data: review, message: 'Added review' });
    } catch (error) {
      next(error);
    }
  };
  public createEquipmentReview = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const reviewData = req.body;
      reviewData.author = user._id;
      const review: Review = await this.equipmentService.addEquipementReview(reviewData);
      res.status(201).json({ data: review, message: 'Added review' });
    } catch (error) {
      next(error);
    }
  };
}

export default EquipmentController;
