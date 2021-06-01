import { isValidObjectId } from 'mongoose';
import { isEmptyObject } from '../utils/util';
import HttpException from '../exceptions/HttpException';
import { Reservation, ReservationStatus } from '../interfaces/reservations.interface';
import { reservationModel } from '../models/reservations.model';
import models from '../models/equipments.model';
import notificationModel from '../models/notifications.model';
import { Notification } from '../interfaces/posts.interface';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { Equipment, Hebergement, Service, Boat } from '../interfaces/equipments.interface';
import AuthService from './auth.service';

class ReservationService {
    public reservations = reservationModel;
    public equipments = models.equipmentModel;
    public equipmentTypes = models.equipmentTypetModel;
    public serviceTypes = models.serviceTypeModel;
    public hebergements = models.hebergementtModel;
    public boats = models.boattModel;
    public services = models.serviceModel;
    public authService = new AuthService();

    public async createReservation(reservationData): Promise<Reservation> {
        if (isEmptyObject(reservationData)) throw new HttpException(400, "Can't create empty Reservation");
        let reservation = new this.reservations(reservationData);
        reservation.status = ReservationStatus.Pending;
        let owner: User;
        let reservedBy: User = await userModel.findById(reservationData.reservedBy);
        let name: string;
        if (reservationData.home) {
            let hebergement: Hebergement = await this.hebergements
                .findById(reservationData.home)
                .populate('owner').lean();
            owner = hebergement.owner;
            name = hebergement.name;
        } else if (reservationData.boat) {
            let boat: Boat = await this.boats
                .findById(reservationData.boat)
                .populate('owner').lean();
            owner = boat.owner;
            name = boat.name;
        } else if (reservationData.equipment) {
            let equipment: Equipment = await this.equipments
                .findById(reservationData.equipment)
                .populate('owner').lean();
            owner = equipment.owner;
            name = equipment.name;
        } else if (reservationData.service) {
            let service: Service = await this.services
                .findById(reservationData.service)
                .populate('owner').lean();
            owner = service.owner;
            name = service.name;
        }
        reservation.ownedBy = owner;
        reservation = await reservation.save();
        const notificationData = new Notification();
        notificationData.sender = reservedBy;
        notificationData.receiver = owner;
        notificationData.type = 'reservation_request';
        notificationData.content = 'Made a reservation request';
        notificationData.targetId = owner._id;
        const notification = new notificationModel(notificationData);
        await notification.save();
        const url = `http://linkedfishers.com/my-reservations`;
        // await this.sendReservationEmail(owner, url, `Someone made a reservation request for ${name}, click to view the details`, "Reservation request received");
        // await this.sendReservationEmail(reservedBy, url, `You just made a reservation request for ${name}, check your requests`, "Reservation request submitted");
        return reservation;
    }

    public async findReservationsByUser(id: string): Promise<Reservation[]> {
        if (!isValidObjectId(id)) {
            throw new HttpException(400, 'Invalid user id');
        }
        const user: User = await userModel.findById(id);
        if (!user) {
            return [];
        }
        const reservations: Reservation[] = await this.reservations
            .find({ reservedBy: user })
            .sort('-createdAt');
        return reservations;
    }

    public async findReservationsRequestsByOwner(ownerId: string): Promise<Reservation[]> {
        if (!isValidObjectId(ownerId)) {
            throw new HttpException(400, 'Invalid user id');
        }
        const owner: User = await userModel.findById(ownerId);
        if (!owner) {
            return [];
        }
        const reservations: Reservation[] = await this.reservations
            .find({ $and: [{ ownedBy: owner }, { status: ReservationStatus.Pending }] })
            .sort('-createdAt');
        return reservations;
    }

    public async findBoatReservations(boatId: string, status: ReservationStatus): Promise<{ reservations: Reservation[], item: any }> {
        if (!isValidObjectId(boatId)) {
            throw new HttpException(400, 'Invalid id');
        }
        const boat = await this.boats.findById(boatId).populate('type','name').lean();
        const reservations: Reservation[] = await this.reservations
            .find({
                $and: [{ boat: boat }, { status: status }]
            })
            .sort('-createdAt');
        return { reservations, item: boat };
    }

    public async findHomeReservations(homeId: string, status: string): Promise<Reservation[]> {
        if (!isValidObjectId(homeId)) {
            throw new HttpException(400, 'Invalid id');
        }
        const hebergement = await this.hebergements.findById(homeId);
        const reservations: Reservation[] = await this.reservations
            .find({
                $and: [{ hebergement: hebergement }, { status: ReservationStatus[status] }]
            })
            .sort('-createdAt');
        return reservations;
    }

    public async findEquipmentReservations(equipmentId: string, status: string): Promise<Reservation[]> {
        if (!isValidObjectId(equipmentId)) {
            throw new HttpException(400, 'Invalid id');
        }
        const equipment = await this.equipments.findById(equipmentId);
        const reservations: Reservation[] = await this.reservations
            .find({
                $and: [{ equipment: equipment }, { status: ReservationStatus[status] }]
            })
            .sort('-createdAt');
        return reservations;
    }

    public async findServiceReservations(serviceId: string, status: string): Promise<Reservation[]> {
        if (!isValidObjectId(serviceId)) {
            throw new HttpException(400, 'Invalid id');
        }
        const service = await this.services.findById(serviceId);
        const reservations: Reservation[] = await this.reservations
            .find({
                $and: [{ service: service }, { status: ReservationStatus[status] }]
            })
            .sort('-createdAt');
        return reservations;
    }

    public async findMyPendingReservations(id: string, user, category: string): Promise<Reservation[]> {
        let reservations: Reservation[];
        switch (category) {
            case 'boat':
                const boat = { _id: id } as Boat;
                reservations = await reservationModel.find({
                    $and: [{ boat: boat },
                    { status: ReservationStatus.Pending },
                    { reservedBy: user }]
                })
                break;

            default:
                break;
        }
        return reservations;
    }

    private async sendReservationEmail(user: User, url: string, content: string, subject: string): Promise<any> {
        const html = `
        <center>
        <td>
        <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row" style="margin:0 auto">
            <tbody>
                <tr>
                    <td class="m_444611345908390707spacer" colspan="2" height="30"
                        style="font-size:30px;line-height:30px;margin:0;padding:0">&nbsp;</td>
                </tr>
    
                <tr>
                    <td class="m_444611345908390707spacer" colspan="2" height="30"
                        style="font-size:30px;line-height:30px;margin:0;padding:0">&nbsp;</td>
                </tr>
            </tbody>
        </table>
    
        <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row"
            style="word-break:break-all;border-spacing:0;margin:0 auto;border-top:1px solid #eeeeee">
            <tbody>
                <tr>
                    <td class="m_444611345908390707spacer" colspan="2" height="30"
                        style="font-size:30px;line-height:30px;margin:0;padding:0" width="100%">&nbsp;</td>
                </tr>
                <tr class="m_444611345908390707mobile-full-width" style="vertical-align:top" valign="top">
                    <th class="m_444611345908390707column m_444611345908390707mobile-last"
                        style="width:400px;padding:0;padding-left:30px;padding-right:30px;font-weight:400" width="400">
                        <table bgcolor="#FFFFFF" style="border-spacing:0;width:100%" width="100%">
                            <tbody>
                                <tr>
                                    <th class="m_444611345908390707sans-serif" style="padding:0;text-align:left">
                                        <div class="m_444611345908390707sans-serif"
                                            style="color:rgb(150,154,161);font-weight:400;line-height:30px;margin:0;padding:0">
    
    
                                            <div style="margin-bottom:15px;font-size:15px;color:#747487">Hello <a
                                                    href="mailto:${user.email}"
                                                    style="color:#747487;text-decoration:none"
                                                    target="_blank">${user.fullName}</a>,</div>
                                            <div style="margin-bottom:15px;font-size:15px;color:#747487">${content}
                                            <br>
                                            <center>
                                                <table bgcolor="#2D8CFF"
                                                    style="border-spacing:0;border-radius:3px;margin:0 auto">
                                                    <tbody>
                                                        <tr>
                                                            <td class="m_444611345908390707sans-serif" style="padding:0"><a
                                                                    href="${url}"
                                                                    style="border:0 solid #2d8cff;display:inline-block;font-size:14px;padding:15px 50px 15px 50px;text-align:center;font-weight:700;text-decoration:none;color:#ffffff"
                                                                    target="_blank">
                                                                    View reservation details</a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </center>
                                            <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row"
                                                style="border-spacing:0;margin:0 auto">
                                                <tbody>
                                                    <tr>
                                                        <td class="m_444611345908390707spacer" colspan="2" height="20"
                                                            style="font-size:20px;line-height:20px;margin:0;padding:0"
                                                            width="100%">&nbsp;</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </th>
                </tr>
    
            </tbody>
        </table>
    
    
    </td>
    </center>
    
        `;
        return this.authService.sendEmail(user.email, html, subject);
    }
}

export default ReservationService;
