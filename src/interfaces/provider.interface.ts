import { User } from "./users.interface";

export class Provider extends User {
  companyName: string;
  companyEmail: string;
  companyPhone: number;
  companyAdress: string;
}
