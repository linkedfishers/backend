import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/HttpException';
import { Boat, Equipment, EquipmentType, BoatType, HebergementType, Hebergement, Service, ServiceType } from '../interfaces/equipments.interface';
import { User } from '../interfaces/users.interface';
import models from '../models/equipments.model';
import userModel from '../models/users.model';
import { isEmptyObject, parseJson } from '../utils/util';
import fs from 'fs';
import { Review } from '../interfaces/review.interface';
class EquipmentService {
  public equipments = models.equipmentModel;
  public equipmentTypes = models.equipmentTypetModel;
  public serviceTypes = models.serviceTypeModel;
  public homeType = models.hebergementType;
  public boatTypes = models.boatType;
  public hebergements = models.hebergementtModel;
  public boats = models.boattModel;
  public services = models.serviceModel;

  public async createBoat(boatData): Promise<Boat> {
    if (isEmptyObject(boatData)) throw new HttpException(400, "Can't create empty boat");
    boatData.details = parseJson(boatData.details);
    if (boatData.position) {
      boatData.position = {
        coordinates: [Number(boatData.lat), Number(boatData.lng)],
      };
    }
    const boat = new this.boats(boatData);
    return await boat.save();
  }

  public async createService(serviceData): Promise<Boat> {
    if (isEmptyObject(serviceData)) throw new HttpException(400, "Can't create empty boat");
    if (serviceData.position) {
      serviceData.position = {
        coordinates: [Number(serviceData.lat), Number(serviceData.lng)],
      };
    }
    const service = new this.services(serviceData);
    return await service.save();
  }

  public async createEquipment(equipmentData): Promise<Equipment> {
    if (isEmptyObject(equipmentData)) throw new HttpException(400, "Can't create empty Equipment");
    equipmentData.details = parseJson(equipmentData.details);
    if (equipmentData.position) {
      equipmentData.position = {
        coordinates: [Number(equipmentData.lat), Number(equipmentData.lng)],
      };
    }
    const equipment = new this.equipments(equipmentData);
    return await equipment.save();
  }

  public async createHebergement(hebergementData): Promise<Hebergement> {
    if (isEmptyObject(hebergementData)) throw new HttpException(400, "Can't create empty Hebergement");
    hebergementData.details = parseJson(hebergementData.details);
    if (hebergementData.position) {
      hebergementData.position = {
        coordinates: [Number(hebergementData.lat), Number(hebergementData.lng)],
      };
    }
    const hebergement = new this.hebergements(hebergementData);
    return await hebergement.save();
  }

  public async findAllHebergements(): Promise<Hebergement[]> {
    const hebergements: Hebergement[] = await this.hebergements.find().populate('owner', 'fullName slug').populate('type', 'name');
    return hebergements;
  }
  public async findAllService(): Promise<Service[]> {
    const services: Service[] = await this.services.find().populate('owner', 'fullName slug').populate('type', 'name');
    return services;
  }

  public async findAllBoats(): Promise<Boat[]> {
    const boats: Boat[] = await this.boats.find().populate('owner', 'fullName slug').populate('type', 'name');
    return boats;
  }

  public async findAllEquipments(): Promise<Equipment[]> {
    const equipments: Equipment[] = await this.equipments.find().populate('owner', 'fullName slug').populate('type', 'name');
    return equipments;
  }

  public async findBoatsByUser(ownerId: string): Promise<Boat[]> {
    if (!isValidObjectId(ownerId)) {
      throw new HttpException(400, 'Invalid user id');
    }
    const owner: User = await userModel.findById(ownerId);
    if (!owner) {
      return [];
    }
    const boats: Boat[] = await this.boats.find({ owner: owner }).sort('-createdAt');
    return boats;
  }

  public async findServicesByUser(ownerId: string): Promise<Service[]> {
    if (!isValidObjectId(ownerId)) {
      throw new HttpException(400, 'Invalid user id');
    }
    const owner: User = await userModel.findById(ownerId);
    if (!owner) {
      return [];
    }
    const services: Service[] = await this.services.find({ owner: owner }).sort('-createdAt');
    return services;
  }

  public async findEquipmentsByUser(ownerId: string): Promise<Equipment[]> {
    if (!isValidObjectId(ownerId)) {
      throw new HttpException(400, 'Invalid user id');
    }
    const owner: User = await userModel.findById(ownerId);
    if (!owner) {
      return [];
    }
    const equipments: Equipment[] = await this.equipments.find({ owner: owner }).sort('-createdAt');
    return equipments;
  }

  public async findHebergementsByUser(ownerId: string): Promise<Hebergement[]> {
    if (!isValidObjectId(ownerId)) {
      throw new HttpException(400, 'Invalid user id');
    }
    const owner: User = await userModel.findById(ownerId);
    if (!owner) {
      return [];
    }
    const hebergements: Hebergement[] = await this.hebergements.find({ owner: owner }).sort('-createdAt');
    return hebergements;
  }

  public async findEquipmentTypes(): Promise<EquipmentType[]> {
    /*   const equipmentTypes: EquipmentType[] = await this.equipmentTypes.find();
    if (equipmentTypes.length == 0) {
      this.addDefaultTypes();
    } */
    /* return await this.equipmentTypes.find(); */
    return await models.equipmentTypetModel.find();
  }
  public async findServiceType(): Promise<ServiceType[]> {
    const serviceTypes: ServiceType[] = await this.serviceTypes.find();
    if (serviceTypes.length == 0) {
      this.addDefaultTypesService();
    }
    return await this.serviceTypes.find();
  }

  public async findBoatTypes(): Promise<BoatType[]> {
    return await models.boatType.find();
  }

  public async findHebergementTypes(): Promise<HebergementType[]> {
    return await models.hebergementType.find();
  }

  public async addEquipmentType(equipmentType: EquipmentType): Promise<EquipmentType> {
    if (!equipmentType.name || !equipmentType.description) {
      /*       console.log(equipmentType);
       */ throw new HttpException(400, 'Missing Equipment type informations!');
    }
    const newType = new this.equipmentTypes(equipmentType);
    return await newType.save();
  }

  public async addBoatType(boatType: BoatType): Promise<BoatType> {
    if (!boatType.name || !boatType.description) {
      throw new HttpException(400, 'Missing Boat type informations!');
    }
    const newType = new models.boatType(boatType);
    return await newType.save();
  }

  public async updateBoatType(boatData, id): Promise<BoatType> {
    return await this.boatTypes.findByIdAndUpdate(id, boatData);
  }

  public async addServiceType(serviceType: ServiceType): Promise<ServiceType> {
    if (!serviceType.name || !serviceType.description) {
      throw new HttpException(400, 'Missing Service type informations!');
    }
    const newType = new models.serviceTypeModel(serviceType);
    return await newType.save();
  }
  public async addHebergementType(hebergementType: HebergementType): Promise<HebergementType> {
    if (!hebergementType.name || !hebergementType.description) {
      throw new HttpException(400, 'Missing HebergementType type informations!');
    }
    const newType = new models.hebergementType(hebergementType);
    return await newType.save();
  }

  public async deleteEquipmentType(equipmentTypeId: string): Promise<EquipmentType> {
    const equipmentType = await this.equipmentTypes.findByIdAndDelete(equipmentTypeId);
    if (fs.existsSync('uploads/' + equipmentType.icon)) {
      fs.unlinkSync('uploads/' + equipmentType.icon);
    }
    return equipmentType;
  }

  public async deleteBoatType(typeId: string): Promise<BoatType> {
    const type = await models.boatType.findByIdAndDelete(typeId);
    if (fs.existsSync('uploads/' + type.icon)) {
      fs.unlinkSync('uploads/' + type.icon);
    }
    return type;
  }

  public async deleteHebergementType(typeId: string): Promise<BoatType> {
    const type = await models.hebergementType.findByIdAndDelete(typeId);
    if (fs.existsSync('uploads/' + type.icon)) {
      fs.unlinkSync('uploads/' + type.icon);
    }
    return type;
  }

  public async deleteServiceType(typeId: string): Promise<BoatType> {
    const type = await models.serviceTypeModel.findByIdAndDelete(typeId);
    if (fs.existsSync('uploads/' + type.icon)) {
      fs.unlinkSync('uploads/' + type.icon);
    }
    return type;
  }

  public async addDefaultTypes() {
    const types = [
      { name: 'Fishing Pole', icon: 'equipments/fishing-rod.png' },
      { name: 'fishing baits', icon: 'equipments/fishing-baits.png' },
      { name: 'fishing net', icon: 'equipments/fishing-net.png' },
      { name: 'Spear', icon: 'equipments/spear.png' },
      { name: 'fishing reel', icon: 'equipments/fishing-reel.png' },
      { name: 'can', icon: 'equipments/can.png' },
    ];
    for (let i = 0; i < types.length; i++) {
      const type = new this.equipmentTypes(types[i]);
      await type.save();
    }
  }
  public async addDefaultTypesService() {
    const types = [
      { name: 'test 1', icon: 'equipments/fishing-rod.png' },
      { name: 'test 2', icon: 'equipments/fishing-baits.png' },
      { name: 'test 3', icon: 'equipments/fishing-net.png' },
    ];
    for (let i = 0; i < types.length; i++) {
      const type = new this.serviceTypes(types[i]);
      await type.save();
    }
  }

  public async findEquipmentsByTypeAndUser(typeId: string, ownerId: string): Promise<{ equipments: Equipment[]; type: EquipmentType }> {
    if (!isValidObjectId(ownerId) || !isValidObjectId(typeId)) {
      throw new HttpException(400, 'Invalid id!');
    }
    const type: EquipmentType = await this.equipmentTypes.findById(typeId);
    if (!type) {
      throw new HttpException(400, 'No Equipment type with this id!');
    }
    const owner: User = await userModel.findById(ownerId);
    if (!owner) {
      return { equipments: [], type };
    }
    const equipments: Equipment[] = await this.equipments.find({
      owner: owner,
      type: type,
    });
    return { equipments, type };
  }

  public async findBoatByType(typeId: string): Promise<Boat[]> {
    if (!isValidObjectId(typeId)) {
      throw new HttpException(400, 'Invalid id!');
    }
    const type: BoatType = await this.boatTypes.findById(typeId);
    if (!type) {
return []
    }
    const boats: Boat[] = await this.boats.find({
      type:type
    });
    return boats
  }
   public async findHebergementByType(typeId: string): Promise<Hebergement[]> {
    if (!isValidObjectId(typeId)) {
      throw new HttpException(400, 'Invalid id!');
    }
    const type: HebergementType = await this.homeType.findById(typeId);
    if (!type) {
return []
    }
    const hebergements: Hebergement[] = await this.hebergements.find({
      type:type
    });
    return hebergements
  }
   public async findServiceByType(typeId: string): Promise<Service[]> {
    if (!isValidObjectId(typeId)) {
      throw new HttpException(400, 'Invalid id!');
    }
    const type: ServiceType = await this.serviceTypes.findById(typeId);
    if (!type) {
return []
    }
    const services: Service[] = await this.services.find({
      type:type
    });
    return services
  }
   public async findEquipmentByType(typeId: string): Promise<Equipment[]> {
    if (!isValidObjectId(typeId)) {
      throw new HttpException(400, 'Invalid id!');
    }
    const type: EquipmentType = await this.equipmentTypes.findById(typeId);
    if (!type) {
return []
    }
    const equipments: Equipment[] = await this.equipments.find({
      type:type
    });
    return equipments
  }

  public async findServicesByTypeAndUser(typeId: string, ownerId: string): Promise<{ services: Service[]; type: EquipmentType }> {
    if (!isValidObjectId(ownerId) || !isValidObjectId(typeId)) {
      throw new HttpException(400, 'Invalid id!');
    }
    const type: ServiceType = await this.serviceTypes.findById(typeId);
    if (!type) {
      throw new HttpException(400, 'No Service type with this id!');
    }
    const owner: User = await userModel.findById(ownerId);
    if (!owner) {
      return { services: [], type };
    }
    const services: Service[] = await this.services.find({
      owner: owner,
      type: type,
    });
    return { services, type };
  }

  public async deleteEquipment(id: string): Promise<Equipment> {
    const eq = await this.equipments.findByIdAndDelete(id);
    if (fs.existsSync('uploads/' + eq.image)) {
      fs.unlinkSync('uploads/' + eq.image);
    }
    return eq;
  }

  public async deleteService(id: string): Promise<Service> {
    const service = await this.services.findByIdAndDelete(id);
    if (fs.existsSync('uploads/' + service.image)) {
      fs.unlinkSync('uploads/' + service.image);
    }
    return service;
  }
  public async deleteBoat(id: string): Promise<Boat> {
    const boat = await this.boats.findByIdAndDelete(id);
    if (fs.existsSync('uploads/' + boat.image)) {
      fs.unlinkSync('uploads/' + boat.image);
    }
    return boat;
  }

  public async deleteHebergement(id: string): Promise<Hebergement> {
    const hebergement = await this.hebergements.findByIdAndDelete(id);
    if (fs.existsSync('uploads/' + hebergement.image)) {
      fs.unlinkSync('uploads/' + hebergement.image);
    }
    return hebergement;
  }

  public async updateService(serviceData, serviceId): Promise<Service> {
    if (serviceData.position) {
      serviceData.position = {
        coordinates: [Number(serviceData.lat), Number(serviceData.lng)],
      };
    }
    //TODO : delete old image if updated
    return await this.services.findByIdAndUpdate(serviceId, serviceData);
  }

  public async updateBoat(boatData, boatId): Promise<Boat> {
    if (boatData.position) {
      boatData.position = {
        coordinates: [Number(boatData.lat), Number(boatData.lng)],
      };
    }
    //TODO : delete old image if updated
    return await this.boats.findByIdAndUpdate(boatId, boatData);
  }

  public async updateEquipment(equipmentData, equipmentId): Promise<Equipment> {
    if (equipmentData.position) {
      equipmentData.position = {
        coordinates: [Number(equipmentData.lat), equipmentData.lng],
      };
    }
    return await this.equipments.findByIdAndUpdate(equipmentId, equipmentData);
  }

  public async updateHebergement(hebergementData, hebergementId): Promise<Hebergement> {
    //TODO : delete old image if updated
    if (hebergementData.position) {
      hebergementData.position = {
        coordinates: [Number(hebergementData.lat), Number(hebergementData.lng)],
      };
    }
    return await this.hebergements.findByIdAndUpdate(hebergementId, hebergementData);
  }

  public async getEquipment(id: string): Promise<Equipment> {
    const eq = await this.equipments
      .findById(id)
      .populate('owner', 'fullName slug profilePicture')
      .populate('type', 'name description')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName slug profilePicture',
        },
      })
      .lean();
    let avgRating = 0;
    if (eq.reviews && eq.reviews.length > 0) {
      avgRating = eq.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= eq.reviews.length;
    }
    eq.rating = avgRating + 0.001;
    return eq;
  }

  public async getBoat(id: string, currentUser: User): Promise<{ boat: Boat; isOwner: boolean }> {
    const boat = await this.boats
      .findById(id)
      .populate('owner', 'firstName profilePicture rating')
      .populate('type', 'name description')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName slug profilePicture',
        },
      })
      .lean();
    let isOwner: boolean = false;
    if (currentUser) {
      isOwner = boat.owner._id.toString() === currentUser._id.toString();
    }
    delete boat.owner._id;
    let avgRating = 0;
    if (boat.reviews && boat.reviews.length > 0) {
      avgRating = boat.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= boat.reviews.length;
    }
    boat.rating = avgRating + 0.001;
    return { boat, isOwner };
  }

  public async getHebergement(id: string): Promise<Hebergement> {
    const hebergement = await this.hebergements
      .findById(id)
      .populate('owner', 'fullName slug profilePicture')
      .populate('type', 'name description')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName slug profilePicture',
        },
      })
      .lean();
    let avgRating = 0;
    if (hebergement.reviews && hebergement.reviews.length > 0) {
      avgRating = hebergement.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= hebergement.reviews.length;
    }
    hebergement.rating = avgRating + 0.001;
    return hebergement;
  }
  public async getService(id: string): Promise<Service> {
    const service = await this.services
      .findById(id)
      .populate('owner', 'fullName slug profilePicture')
      .populate('type', 'name description')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName slug profilePicture',
        },
      })
      .lean();
    let avgRating = 0;
    if (service.reviews && service.reviews.length > 0) {
      avgRating = service.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= service.reviews.length;
    }
    service.rating = avgRating + 0.001;
    return service;
  }

  public async addServiceReview(reviewData): Promise<Review> {
    if (isEmptyObject(reviewData)) throw new HttpException(400, "Can't create empty review");
    const service = await this.services.findById(reviewData.boat).lean();
    if (!service) {
      throw new HttpException(400, 'Invalid boat');
    }
    if (reviewData.author == service.owner._id.toString()) {
      throw new HttpException(400, "Owner can't add review on own Service");
    }
    const review = new models.reviewModel(reviewData);
    await review.save();
    await this.services.updateOne({ _id: reviewData.boat }, { $addToSet: { reviews: review } });
    return review;
  }

  public async addBoatReview(reviewData): Promise<Review> {
    if (isEmptyObject(reviewData)) throw new HttpException(400, "Can't create empty review");
    const boat = await this.boats.findById(reviewData.boat).lean();
    if (!boat) {
      throw new HttpException(400, 'Invalid boat');
    }
    if (reviewData.author == boat.owner._id.toString()) {
      throw new HttpException(400, "Owner can't add review on own boat");
    }
    const review = new models.reviewModel(reviewData);
    await review.save();
    await this.boats.updateOne({ _id: reviewData.boat }, { $addToSet: { reviews: review } });
    return review;
  }

  public async addHebergementReview(reviewData): Promise<Review> {
    if (isEmptyObject(reviewData)) throw new HttpException(400, "Can't create empty review");

    const hebergement = await this.hebergements.findById(reviewData.hebergement).lean();

    if (!hebergement) {
      throw new HttpException(400, 'Invalid hebergement');
    }
    if (reviewData.author == hebergement.owner._id.toString()) {
      throw new HttpException(400, "Owner can't add review on own hebergement");
    }
    const review = new models.reviewModel(reviewData);
    await review.save();
    await this.hebergements.updateOne({ _id: reviewData.hebergement }, { $addToSet: { reviews: review } });
    return review;
  }
  public async addEquipementReview(reviewData): Promise<Review> {
    if (isEmptyObject(reviewData)) throw new HttpException(400, "Can't create empty review");

    const equipment = await this.equipments.findById(reviewData.equipment).lean();

    if (!equipment) {
      throw new HttpException(400, 'Invalid equipment');
    }
    if (reviewData.author == equipment.owner._id.toString()) {
      throw new HttpException(400, "Owner can't add review on own equipment");
    }
    const review = new models.reviewModel(reviewData);
    await review.save();
    await this.equipments.updateOne({ _id: reviewData.equipment }, { $addToSet: { reviews: review } });
    return review;
  }
}

export default EquipmentService;
