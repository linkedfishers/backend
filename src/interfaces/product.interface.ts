import { Provider } from './provider.interface';

export class Product {
  _id: string;
  productName: string;
  price: number;
  qqty: number;
  images: string;
  productDescription: string;
  owner: Provider;
  type: Categorie;
}

export class Categorie {
  _id: string;
  catName: string;
  catDescription: string;
  icon: string;
}


