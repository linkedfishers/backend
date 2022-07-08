import { nextDay } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { RequestWithFile, RequestWithUser, TokenData } from '../interfaces/auth.interface';
import { Content } from '../interfaces/content.interface';
import { EquipmentType, BoatType, HebergementType, ServiceType } from '../interfaces/equipments.interface';
import { Categorie } from '../interfaces/product.interface';
import { User } from '../interfaces/users.interface';
import AdminService from '../services/admin.service';
import ContentService from '../services/content.service';
import EquipmentService from '../services/equipments.service';
import ProductService from '../services/product.service';

class AdminController {
  public adminService = new AdminService();
  public equipmentService = new EquipmentService();
  public productService = new ProductService();
  public contentService = new ContentService();
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skip = Number(req.params.skip) || 0;
      const count = Number(req.params.count) || 5;
      const data = await this.adminService.findUsers(count, skip);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public getProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skip = Number(req.params.skip) || 0;
      const count = Number(req.params.count) || 5;
      const data = await this.adminService.getProviders(count, skip);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public getOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.adminService.getOverview();

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public getReports = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const data = await this.adminService.findReports(userId);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public deleteReport = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data = await this.adminService.deleteReport(id);

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  /*   public addSousCatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const catType = req.body;
      const sousCat = await this.equipmentService.addsouCatType(catType);
      res.status(200).json({ data: sousCat });
    } catch (error) {
      next(error);
    }
  }; */

  public addEquipmentType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const equipmentData = req.body;
      if (req.file) {
        equipmentData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const equipmentType = await this.equipmentService.addEquipmentType(equipmentData);
      res.status(200).json({ data: equipmentType });
    } catch (error) {
      next(error);
    }
  };

  public addBoatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const boatData = req.body;

      if (req.file) {
        boatData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const boatType = await this.equipmentService.addBoatType(boatData);
      res.status(200).json({ data: boatType });
    } catch (error) {
      next(error);
    }
  };
  public addServiceType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const serviceData = req.body;
      if (req.file) {
        serviceData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const serviceType = await this.equipmentService.addServiceType(serviceData);
      res.status(200).json({ data: serviceType });
    } catch (error) {
      next(error);
    }
  };

  public addProductCategory = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryData = req.body;
      if (req.file) {
        categoryData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const category: Categorie = await this.productService.addCategorie(categoryData);
      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  };

  public addHebergementType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hebergementData = req.body;
      if (req.file) {
        hebergementData.icon = req.file.path.split('/').splice(1).join('/');
      }

      const hebergementType = await this.equipmentService.addHebergementType(hebergementData);
      res.status(200).json({ data: hebergementType });
    } catch (error) {
      next(error);
    }
  };

  public deleteEquipmentType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const equipmentTypeId: string = req.params.id;
      const equipmentType = await this.equipmentService.deleteEquipmentType(equipmentTypeId);
      res.status(200).json({ data: equipmentType });
    } catch (error) {
      next(error);
    }
  };

  public updateBoatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId: string = req.params.id;
      const boatTypeData = req.body;
     
      if (req.file) {
        boatTypeData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const boatType: BoatType = await this.equipmentService.updateBoatType(boatTypeData, typeId);
      res.status(200).json({ data: boatType, message: 'Updated Boat Type' });
    } catch (error) {
      next(error);
    }
  };

  public updateHebergementType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId: string = req.params.id;
      const hebergementData = req.body;
      if (req.file) {
        hebergementData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const homeType: HebergementType = await this.equipmentService.updateHebergementType(hebergementData, typeId);
      res.status(200).json({ data: homeType, message: 'Accomodation Type Updated' });
    } catch (err) {
      next(err);
    }
  };

  public updateEquipmentType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId: string = req.params.id;
      const equipmentsData = req.body;
      if (req.file) {
        equipmentsData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const equiType: EquipmentType = await this.equipmentService.updateEquipmentsType(equipmentsData, typeId);
      res.status(200).json({ data: equiType, mesage: 'Equipment Type Updated' });
    } catch (err) {
      next(err);
    }
  };

  public updateServiceType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId: string = req.params.id;
      const servicesData = req.body;
      if (req.file) {
        servicesData.icon = req.file.path.split('/').splice(1).join('/');
      }
      const serviceType: EquipmentType = await this.equipmentService.updateEquipmentsType(servicesData, typeId);
      res.status(200).json({ data: serviceType, mesage: 'Equipment Type Updated' });
    } catch (err) {
      next(err);
    }
  };

  public deleteBoatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId: string = req.params.id;
      const type = await this.equipmentService.deleteBoatType(typeId);
      res.status(200).json({ data: type });
    } catch (error) {
      next(error);
    }
  };

  public deleteHebergementType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId: string = req.params.id;
      const type = await this.equipmentService.deleteHebergementType(typeId);
      res.status(200).json({ data: type });
    } catch (error) {
      next(error);
    }
  };

  public deleteServiceType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typeId: string = req.params.id;
      const type = await this.equipmentService.deleteServiceType(typeId);
      res.status(200).json({ data: type });
    } catch (error) {
      next(error);
    }
  };

  public updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activated: boolean = req.body.activated;
      const userId: string = req.params.userId;
      const user: User = await this.adminService.updateUserStatus(userId, activated);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  public createContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req.user;
      const contentData = req.body;
      console.log(req.body);
      contentData.owner = user._id;
      if (req.files) {
        //contentData.images = req.files.map(file => file.path.split('\\').splice(1).join('\\'));
        contentData.images = req.files.map(file => file.path.split('/').splice(1).join('/'));
      }
      const content: Content = await this.contentService.createContent(contentData);
      res.status(201).json({ data: content, message: 'Content Created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteContent = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const content: Content = await this.equipmentService.deleteHebergement(id);
      res.status(200).json({ data: content });
    } catch (error) {
      next(error);
    }
  };

  //to do add controller images
  public getContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const content = await this.adminService.getContent(id);
      res.status(200).json({ data: { content } });
    } catch (error) {
      next(error);
    }
  };
  public updateContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contentId = req.params.id;
      const contentData = req.body;
      const content: Content = await this.adminService.UpdateContent(contentData, contentId);
      res.status(200).json({ data: content, message: 'Updated Content ' });
    } catch (error) {
      next(error);
    }
  };
  public findAllContents = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contents: Content[] = await this.adminService.findAllContents();
      res.status(200).json({ data: contents });
    } catch (error) {
      next(error);
    }
  };
}
export default AdminController;
