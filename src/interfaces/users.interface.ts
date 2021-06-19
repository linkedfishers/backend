import { Review } from "./review.interface";

export class User {
  _id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  googleId: string;
  slug: string;
  email: string;
  phone: string;
  adress: string;
  birthDate: Date;
  sex: string;
  password: string;
  token: string;
  profilePicture: string;
  coverPicture: string;
  coverPictures: [string];
  description: string;
  language: string;
  job: string;
  facebook: string;
  instagram: string;
  website: string;
  youtube: string;
  following: any[];
  followers: any[];
  pictures: [string];
  country: string;
  wishList: any[];
  specialities: string[];
  role: string;
  activated: boolean;
  confirmationToken: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  reviews: Review[];
  rating: number;
}

export class Report {
  _id: string;
  type: string;
  cause: string;
  author: User;
  createdAt: any;
  is_done: boolean;
  status: any;
  target_id: string;
}
