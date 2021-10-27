import { User } from './users.interface';

export class Content {
  _id: string;
  image: string[];
  content: string;
  owner: User;
}
