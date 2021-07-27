import { User } from './users.interface';

export class Equipment {
  _id: string;
  name: string;
  owner: User;
  type: EquipmentType;
  image: string;//Required in Model for all
  description: string;
  isAvailable: boolean;
  position: any;
  reviews: any[];
  rating: number;
  price: number;
  details: any;
  adress: string;
}
export class EquipmentType {
  _id: string;
  name: string;
  icon: string;
  description: string;
  items: any[];
}

export class BoatType {
  _id: string;
  name: string;
  icon: string;
  description: string;
  items: any[];
}

export class Service {
  _id: string;
  name: string;
  owner: User;
  image: string;
  description: string;
  isAvailable: boolean;
  price: number;
  position: any;
  adress: string;
  type: ServiceType;
  reviews: any[];
  rating: number;
  details: any;
}
export class ServiceType {
  _id: string;
  name: string;
  icon: string;
  description: string;
  items: any[];
}
export class Boat {
  _id: string;
  name: string;
  owner: User;
  image: string;
  description: string;
  isAvailable: boolean;
  price: number;
  position: any;
  adress: string;
  type: BoatType;
  reviews: any[];
  rating: number;
  details: any;
}

export class HebergementType {
  _id: string;
  name: string;
  icon: string;
  description: string;
  items: any[];
}

export class Hebergement {
  _id: string;
  name: string;
  owner: User;
  image: string;
  description: string;
  isAvailable: boolean;
  adress: string;
  price: number;
  position: any;
  type: HebergementType;
  reviews: any[];
  rating: number;
  details: any;
}
