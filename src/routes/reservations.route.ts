import { Router } from 'express';
import ReservationController from '../controllers/reservations.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';


class ReservationRoute implements Route {
    public path = '/reservations';
    public router = Router();
    public reservationController = new ReservationController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/new`, authMiddleware, this.reservationController.createReservationRequest);
        this.router.get(`${this.path}/boat/:id`, authMiddleware, this.reservationController.findBoatReservations);
        this.router.get(`${this.path}/equipment/:id`, authMiddleware, this.reservationController.findEquipmentReservations);
        this.router.get(`${this.path}/home/:id`, authMiddleware, this.reservationController.findHomeReservations);
        this.router.get(`${this.path}/service/:id`, authMiddleware, this.reservationController.findServiceReservations);
        this.router.get(`${this.path}/my-pending/:category/:id`, authMiddleware, this.reservationController.findMyPendingReservations);
        this.router.get(`${this.path}/owner-requests/`, authMiddleware, this.reservationController.findReservationRequestsByOwner);
        this.router.put(`${this.path}/reservation/`, authMiddleware, this.reservationController.updateReservationRequest);
    }
}

export default ReservationRoute;
