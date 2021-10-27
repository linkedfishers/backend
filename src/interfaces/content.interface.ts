import { User } from './users.interface';

export class Content {
  _id: string;
  images: string[];
  owner: User;
}
