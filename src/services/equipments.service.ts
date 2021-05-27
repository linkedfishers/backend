import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/HttpException';
import { Boat, Equipment, EquipmentType, BoatType, HebergementType, Hebergement, Reservation } from '../interfaces/equipments.interface';
import { User } from '../interfaces/users.interface';
import models from '../models/equipments.model';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';
import fs from 'fs';
import { Review } from '../interfaces/review.interface';
class EquipmentService {
  public equipments = models.equipmentModel;
  public equipmentTypes = models.equipmentTypetModel;
  public hebergements = models.hebergementtModel;
  public boats = models.boattModel;
  public reservations = models.reservationtModel;

  public async createBoat(boatData): Promise<Boat> {
    if (isEmptyObject(boatData)) throw new HttpException(400, "Can't create empty boat");
    if (boatData.position) {
      boatData.position = {
        coordinates: [Number(boatData.lat), Number(boatData.lng)],
      };
    }
    const boat = new this.boats(boatData);
    return await boat.save();
  }

  public async createEquipment(equipmentData): Promise<Equipment> {
    if (isEmptyObject(equipmentData)) throw new HttpException(400, "Can't create empty Equipment");
    const equipment = new this.equipments(equipmentData);
    return await equipment.save();
  }

  public async createHebergement(hebergementData): Promise<Hebergement> {
    if (isEmptyObject(hebergementData)) throw new HttpException(400, "Can't create empty Hebergement");

    if (hebergementData.position) {
      hebergementData.position = {
        coordinates: [Number(hebergementData.lat), Number(hebergementData.lng)],
      };
    }
    const hebergement = new this.hebergements(hebergementData);
    return await hebergement.save();
  }

  public async findAllHebergements(): Promise<Hebergement[]> {
    const hebergements: Hebergement[] = await this.hebergements.find().populate('owner', 'fullName slug');
    return hebergements;
  }

  public async findAllBoatss(): Promise<Boat[]> {
    const boats: Boat[] = await this.boats.find().populate('owner', 'fullName slug');
    return boats;
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
    const equipmentTypes: EquipmentType[] = await this.equipmentTypes.find();
    if (equipmentTypes.length == 0) {
      this.addDefaultTypes();
    }
    return await this.equipmentTypes.find();
  }

  public async findBoatTypes(): Promise<BoatType[]> {
    return await models.boatType.find();
  }

  public async findHebergementTypes(): Promise<BoatType[]> {
    return await models.hebergementType.find();
  }

  public async addEquipmentType(equipmentType: EquipmentType): Promise<EquipmentType> {
    if (!equipmentType.name || !equipmentType.icon) {
      throw new HttpException(400, 'Missing Equipment type informations!');
    }
    const newType = new this.equipmentTypes(equipmentType);
    return await newType.save();
  }

  public async addBoatType(boatType: BoatType): Promise<BoatType> {
    if (!boatType.name || !boatType.icon) {
      throw new HttpException(400, 'Missing Boat type informations!');
    }
    const newType = new models.boatType(boatType);
    return await newType.save();
  }

  public async addHebergementType(hebergementType: HebergementType): Promise<HebergementType> {
    if (!hebergementType.name || !hebergementType.icon) {
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

  public async deleteEquipment(id: string): Promise<Equipment> {
    const eq = await this.equipments.findByIdAndDelete(id);
    if (fs.existsSync('uploads/' + eq.image)) {
      fs.unlinkSync('uploads/' + eq.image);
    }
    return eq;
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
    //TODO : delete old image if updated
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
    const eq = await this.equipments.findById(id)
      .populate('owner', 'fullName slug profilePicture')
      .populate('type', 'name description')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName slug profilePicture'
        }
      }).lean();
    return eq;
  }

  public async getBoat(id: string): Promise<Boat> {
    const boat = await this.boats.findById(id)
      .populate('owner', 'fullName slug profilePicture')
      .populate('type', 'name description')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName slug profilePicture'
        }
      }).lean();
    let avgRating = 0;
    if (boat.reviews && boat.reviews.length > 0) {
      avgRating = boat.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= boat.reviews.length;
    }
    boat.rating = avgRating + 0.001;
    return boat;
  }

  public async getHebergement(id: string): Promise<Hebergement> {
    const hebergement = await this.hebergements.findById(id)
      .populate('owner', 'fullName slug profilePicture')
      .populate('type', 'name description')
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName slug profilePicture'
        }
      }).lean();
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

  public async addBoatReview(reviewData): Promise<Review> {
    if (isEmptyObject(reviewData)) throw new HttpException(400, "Can't create empty review");
    const boat = await this.boats.findById(reviewData.boat).lean();
    if (!boat) {
      throw new HttpException(400, "Invalid boat");
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
      throw new HttpException(400, "Invalid hebergement");
    }
    if (reviewData.author == hebergement.owner._id.toString()) {
      throw new HttpException(400, "Owner can't add review on own hebergement");
    }
    const review = new models.reviewModel(reviewData);
    await review.save();
    await this.hebergements.updateOne({ _id: reviewData.hebergement }, { $addToSet: { reviews: review } });
    return review;
  }
}

export default EquipmentService;
