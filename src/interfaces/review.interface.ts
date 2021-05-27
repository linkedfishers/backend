import { User } from "./users.interface";

export class Review {
    _id: string;
    content: string;
    author: User;
    createdAt: any;
    rating: number;
}