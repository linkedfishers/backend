import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from "../interfaces/auth.interface";
import { Reservation, ReservationStatus } from '../interfaces/reservations.interface';
import { User } from '../interfaces/users.interface';
import ReservationService from "../services/reservations.service";

class ReservationController {
    public reservationService = new ReservationService();

    public createReservationRequest = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user: User = req.user;
            const reservationData = req.body;
            reservationData.reservedBy = user._id;
            const reservation: Reservation = await this.reservationService.createReservation(reservationData);
            res.status(200).json({ data: reservation });
        } catch (error) {
            next(error);
        }
    };

    public findReservationRequestsByUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id || req.user._id;
            const reservations: Reservation[] = await this.reservationService.findReservationsByUser(userId);
            res.status(200).json({ data: reservations });
        } catch (error) {
            next(error);
        }
    };

    public findReservationRequestsByOwner = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const ownerId = req.params.id || req.user._id;
            const reservations: Reservation[] = await this.reservationService.findReservationsRequestsByOwner(ownerId);
            res.status(200).json({ data: reservations });
        } catch (error) {
            next(error);
        }
    };

    public findBoatReservations = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const status = ReservationStatus.Confirmed;
            const { reservations, item } = await this.reservationService.findBoatReservations(id, status);
            res.status(200).json({ data: { reservations, item } });
        } catch (error) {
            next(error);
        }
    };

    public findHomeReservations = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const status = req.params.status;
            const reservations: Reservation[] = await this.reservationService.findHomeReservations(id, status);
            res.status(200).json({ data: reservations });
        } catch (error) {
            next(error);
        }
    };

    public findEquipmentReservations = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const status = req.params.status;
            const reservations: Reservation[] = await this.reservationService.findEquipmentReservations(id, status);
            res.status(200).json({ data: reservations });
        } catch (error) {
            next(error);
        }
    };

    public findServiceReservations = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const status = req.params.status;
            const reservations: Reservation[] = await this.reservationService.findServiceReservations(id, status);
            res.status(200).json({ data: reservations });
        } catch (error) {
            next(error);
        }
    };

    public findMyPendingReservations = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const category = req.params.category;
            const user = req.user;
            const reservations: Reservation[] = await this.reservationService.findMyPendingReservations(id, user, category);
            res.status(200).json({ data: reservations });
        } catch (error) {
            next(error);
        }
    };
}

export default ReservationController;
