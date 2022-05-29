import mongoose from 'mongoose';
import {
  Boat,
  BoatType,
  Equipment,
  EquipmentType,
  Hebergement,
  HebergementType,
  Service,
  ServiceType,
  /* souCat, */
} from '../interfaces/equipments.interface';
import { Review } from '../interfaces/review.interface';
//@ts-ignore
const souCatShema = new mongoose.Schema({
  name: { type: String, required: true },
});

const equipmentTypeSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: { type: String, required: false },
  icon: { type: String },
});

const boatTypeSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: { type: String, required: false },
  icon: { type: String },
});

const hebergementTypeSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: { type: String, required: false },
  icon: { type: String },
});

const serviceTypeSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: { type: String, required: false },
  icon: { type: String },
});

const equipmentSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  images: [{ type: String }],
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentType', required: true },
  description: String,
  adress: String,
  country: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: false }],
  price: Number,
  position: {
    coordinates: { type: [Number], index: '2dsphere' },
  },
  details: { type: mongoose.Schema.Types.Mixed, required: false },
});

const serviceShema = new mongoose.Schema({
  name: String,
  country: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  images: [{ type: String }],
  adress: String,
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceType', required: true },
  description: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: false }],
  price: Number,
  position: {
    coordinates: { type: [Number], index: '2dsphere' },
  },
  details: { type: mongoose.Schema.Types.Mixed, required: false },
});

const hebergementSchema = new mongoose.Schema({
  name: String,
  country: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  images: [{ type: String }],
  adress: String,
  description: String,
  price: Number,
  position: {
    coordinates: { type: [Number], index: '2dsphere' },
  },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'HebergementType', required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: false }],
  details: { type: mongoose.Schema.Types.Mixed, required: false },
});

const boatSchema = new mongoose.Schema({
  name: String,
  country: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  images: [{ type: String }],

  description: String,
  price: Number,
  adress: String,
  position: {
    coordinates: { type: [Number], index: '2dsphere' },
  },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'BoatType', required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: false }],
  details: { type: mongoose.Schema.Types.Mixed, required: false },
});

const reviewSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: Number,
});

equipmentTypeSchema.set('timestamps', true);
boatTypeSchema.set('timestamps', true);
serviceTypeSchema.set('timestamps', true);
equipmentSchema.set('timestamps', true);
hebergementSchema.set('timestamps', true);
boatSchema.set('timestamps', true);
reviewSchema.set('timestamps', true);
serviceShema.set('timestamps', true);

const serviceTypeModel = mongoose.model<ServiceType & mongoose.Document>('ServiceType', serviceTypeSchema);
//@ts-ignore
const equipmentModel = mongoose.model<Equipment & mongoose.Document>('Equipment', equipmentSchema);
const equipmentTypetModel = mongoose.model<EquipmentType & mongoose.Document>('EquipmentType', equipmentTypeSchema);
const hebergementType = mongoose.model<HebergementType & mongoose.Document>('HebergementType', hebergementTypeSchema);
const boatType = mongoose.model<BoatType & mongoose.Document>('BoatType', boatTypeSchema);
const hebergementtModel = mongoose.model<Hebergement & mongoose.Document>('Hebergement', hebergementSchema);
const boattModel = mongoose.model<Boat & mongoose.Document>('Boat', boatSchema);
const reviewModel = mongoose.model<Review & mongoose.Document>('Review', reviewSchema);
const serviceModel = mongoose.model<Service & mongoose.Document>('Service', serviceShema);
const models = {
  equipmentModel,
  equipmentTypetModel,
  hebergementtModel,
  boattModel,
  hebergementType,
  boatType,
  reviewModel,
  serviceModel,
  serviceTypeModel,
};

export default models;
