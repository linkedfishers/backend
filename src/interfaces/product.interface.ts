import { Provider } from './provider.interface';

export class Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  pictures: string[];
  picture: string;
  description: string;
  owner: Provider;
  type: Categorie;
}

export class Categorie {
  _id: string;
  name: string;
  description: string;
  icon: string;
}


