import { Boat, Equipment, Hebergement, Service } from "./equipments.interface";
import { User } from "./users.interface";

export class Reservation {
    _id: string;
    reservedBy: User;
    ownedBy: User;
    dateStart: Date;
    dateEnd: Date;
    home: Hebergement;
    boat: Boat;
    equipment: Equipment;
    service: Service;
    status: ReservationStatus;
    totalPrice: number;
    item: any;
}

export enum ReservationStatus {
    Pending = "PENDING",
    Confirmed = "CONFIRMED",
    Deleted = "DELETED",
    Completed = "COMPLETED",
    Declined = "DECLINED",
    Expired = "EXPIRED"
}