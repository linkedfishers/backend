import { Request } from 'express';
import { Provider } from './provider.interface';
import { User } from './users.interface';

export interface DataStoredInToken {
  _id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  role: string;
  language: string;
  slug: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
}

export interface RequestWithFile extends RequestWithUser {
  file: FileUpload;
 /* files : FileUpload[] */
}
