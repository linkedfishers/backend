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
import { areIntervalsOverlapping, differenceInDays, isPast } from 'date-fns';
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
    if (isPast(reservation.dateStart) || isPast(reservation.dateEnd)) {
      throw new HttpException(400, "Can't create reservation in the past");
    }
    reservation.status = ReservationStatus.Pending;
    let reservedBy: User = await userModel.findById(reservationData.reservedBy);
    let confirmedReservations: Reservation[];
    let item;
    if (reservationData.home) {
      let hebergement: Hebergement = await this.hebergements.findById(reservationData.home).populate('owner').lean();
      item = hebergement;
      confirmedReservations = await this.reservations
        .find({
          $and: [{ home: hebergement }, { status: ReservationStatus.Confirmed }],
        })
        .lean();
    } else if (reservationData.boat) {
      let boat: Boat = await this.boats.findById(reservationData.boat).populate('owner').lean();
      item = boat;
      confirmedReservations = await this.reservations
        .find({
          $and: [{ boat: boat }, { status: ReservationStatus.Confirmed }],
        })
        .lean();
    } else if (reservationData.equipment) {
      let equipment: Equipment = await this.equipments.findById(reservationData.equipment).populate('owner').lean();
      item = equipment;
      confirmedReservations = await this.reservations
        .find({
          $and: [{ equipment: equipment }, { status: ReservationStatus.Confirmed }],
        })
        .lean();
    } else if (reservationData.service) {
      let service: Service = await this.services.findById(reservationData.service).populate('owner').lean();
      item = service;
      confirmedReservations = await this.reservations
        .find({
          $and: [{ service: service }, { status: ReservationStatus.Confirmed }],
        })
        .lean();
    }
    const unavailableDates = confirmedReservations.some(confirmedReservation => {
      return areIntervalsOverlapping(
        { start: new Date(confirmedReservation.dateStart), end: new Date(confirmedReservation.dateEnd) },
        { start: new Date(reservation.dateStart), end: new Date(reservation.dateEnd) },
      );
    });
    if (unavailableDates) {
      throw new HttpException(400, 'Those dates are unavailable');
    }
    let owner: User = item.owner;
    let name = item.name;
    reservation.ownedBy = owner;
    reservation.item = item;
    reservation.totalPrice = this.calculatePrice(reservation);
    reservation = await reservation.save();
    const notificationData = new Notification();
    notificationData.sender = reservedBy;
    notificationData.receiver = owner;
    notificationData.type = 'reservation_request';
    notificationData.content = 'Made a reservation request';
    notificationData.targetId = owner._id;
    const notification = new notificationModel(notificationData);
    await notification.save();
    const ownerUrl = `http://linkedfishers.com/booking-requests`;
    const bookerUrl = `http://linkedfishers.com/my-booking-requests`;
    await this.sendReservationEmail(
      owner,
      ownerUrl,
      `Someone made a reservation request for ${name}, click to view the details`,
      'Reservation request received',
    );
    await this.sendReservationEmail(
      reservedBy,
      bookerUrl,
      `You just made a reservation request for ${name}, check your requests`,
      'Reservation request submitted',
    );
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
    const reservations: Reservation[] = await this.reservations.find({ reservedBy: user }).sort('-createdAt');
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
      .populate('boat home equipment service', 'name description image')
      .populate({
        path: 'boat',
        populate: {
          path: 'owner',
          model: 'User',
          select: 'firstName -_id',
        },
      })
      .populate({
        path: 'boat',
        populate: {
          path: 'type',
          model: 'BoatType',
          select: 'name -_id',
        },
      })
      .populate('reservedBy', '-_id firstname profilePicture rating reviews')
      .sort('-createdAt')
      .lean();
    return reservations;
  }

  public async findBoatReservations(
    boatId: string,
    user: User,
  ): Promise<{ reservations: Reservation[]; pendingReservations: Reservation[]; item: any }> {
    if (!isValidObjectId(boatId)) {
      throw new HttpException(400, 'Invalid id');
    }
    const boat = await this.boats.findById(boatId).populate('reviews', 'rating').populate('type', 'name').lean();
    const reservations: Reservation[] = await this.reservations
      .find({
        $and: [{ boat: boat }, { status: ReservationStatus.Confirmed }],
      })
      .sort('-createdAt');
    let pendingReservations: Reservation[] = [];
    if ((boat.owner._id as string) == user._id.toString()) {
      pendingReservations = await this.reservations
        .find({
          $and: [{ boat: boat }, { status: ReservationStatus.Pending }],
        })
        .populate('reservedBy', '-_id firstName profilePicture rating')
        .sort('-createdAt');
    }
    let avgRating = 0;
    if (boat.reviews && boat.reviews.length > 0) {
      avgRating = boat.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= boat.reviews.length;
    }
    boat.rating = avgRating + 0.001;
    return { reservations, item: boat, pendingReservations };
  }

  public async findHomeReservations(homeId: string, user: User): Promise<{ reservations: Reservation[]; pendingReservations: Reservation[]; item: any }> {
    if (!isValidObjectId(homeId)) {
      throw new HttpException(400, 'Invalid id');
    }
    const home = await this.hebergements.findById(homeId).populate('reviews', 'rating').populate('type', 'name').lean();
    const reservations: Reservation[] = await this.reservations
      .find({
        $and: [{ home: home }, { status: ReservationStatus.Confirmed }],
      })
      .sort('-createdAt');
    let pendingReservations: Reservation[] = [];
    if ((home.owner._id as string) == user._id.toString()) {
      pendingReservations = await this.reservations
        .find({
          $and: [{ home: home }, { status: ReservationStatus.Pending }],
        })
        .populate('reservedBy', '-_id firstName profilePicture rating')
        .sort('-createdAt');
    }
    let avgRating = 0;
    if (home.reviews && home.reviews.length > 0) {
      avgRating = home.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= home.reviews.length;
    }
    home.rating = avgRating + 0.001;
    return { reservations, item: home, pendingReservations };
  }

  public async findEquipmentReservations(equipmentId: string, user: User): Promise<{ reservations: Reservation[]; pendingReservations: Reservation[]; item: any }> {
    if (!isValidObjectId(equipmentId)) {
      throw new HttpException(400, 'Invalid id');
    }
    const equipment = await this.equipments.findById(equipmentId).populate('reviews', 'rating').populate('type', 'name').lean();
    const reservations: Reservation[] = await this.reservations
      .find({
        $and: [{ equipment: equipment }, { status: ReservationStatus.Confirmed }],
      })
      .sort('-createdAt');
    let pendingReservations: Reservation[] = [];
    if ((equipment.owner._id as string) == user._id.toString()) {
      pendingReservations = await this.reservations
        .find({
          $and: [{ equipment: equipment }, { status: ReservationStatus.Pending }],
        })
        .populate('reservedBy', '-_id firstName profilePicture rating')
        .sort('-createdAt');
    }
    let avgRating = 0;
    if (equipment.reviews && equipment.reviews.length > 0) {
      avgRating = equipment.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= equipment.reviews.length;
    }
    equipment.rating = avgRating + 0.001;
    return { reservations, item: equipment, pendingReservations };
  }

  public async findServiceReservations(serviceId: string, user: User): Promise<{ reservations: Reservation[]; pendingReservations: Reservation[]; item: any }> {
    if (!isValidObjectId(serviceId)) {
      throw new HttpException(400, 'Invalid id');
    }
    const equipment = await this.equipments.findById(serviceId).populate('reviews', 'rating').populate('type', 'name').lean();
    const reservations: Reservation[] = await this.reservations
      .find({
        $and: [{ equipment: equipment }, { status: ReservationStatus.Confirmed }],
      })
      .sort('-createdAt');
    let pendingReservations: Reservation[] = [];
    if ((equipment.owner._id as string) == user._id.toString()) {
      pendingReservations = await this.reservations
        .find({
          $and: [{ equipment: equipment }, { status: ReservationStatus.Pending }],
        })
        .populate('reservedBy', '-_id firstName profilePicture rating')
        .sort('-createdAt');
    }
    let avgRating = 0;
    if (equipment.reviews && equipment.reviews.length > 0) {
      avgRating = equipment.reviews.reduce((sum, review) => {
        return sum + review.rating;
      }, 0);
      avgRating /= equipment.reviews.length;
    }
    equipment.rating = avgRating + 0.001;
    return { reservations, item: equipment, pendingReservations };
  }

  public async findMyPendingReservations(id: string, user, category: string): Promise<Reservation[]> {
    let reservations: Reservation[];
    switch (category) {
      case 'boat':
        const boat = { _id: id } as Boat;
        reservations = await reservationModel.find({
          $and: [{ boat: boat }, { status: ReservationStatus.Pending }, { reservedBy: user }],
        });
        break;

      default:
        break;
    }
    return reservations;
  }

  public async updateReservation(user: User, reservationData): Promise<Reservation> {
    const id = reservationData._id;
    const status = reservationData.status;
    let reservation = await this.reservations.findById(id);
    if ((reservation.ownedBy._id as string) != user._id.toString()) {
      throw new HttpException(401, "Can't update reservation");
    }
    reservation = await this.reservations.findByIdAndUpdate(id, { status: status }, { new: true }).populate('reservedBy');
    if (reservation.status == ReservationStatus.Confirmed) {
      const notificationData = new Notification();
      notificationData.sender = user;
      notificationData.receiver = reservation.reservedBy;
      notificationData.type = 'reservation_accepted';
      notificationData.content = 'Accepted your reservation request';
      // notificationData.targetId = owner._id;
      const notification = new notificationModel(notificationData);
      await notification.save();
      const ownerUrl = `http://linkedfishers.com/booking-requests`;
      const bookerUrl = `http://linkedfishers.com/my-booking-requests`;
      await this.sendReservationEmail(user, ownerUrl, `Your reservation request have been confirmed.`, 'Reservation confirmed');
      await this.sendReservationEmail(reservation.reservedBy, bookerUrl, `You just confirmed a reservation request.`, 'Reservation confirmed');
    }
    return reservation;
  }

  private calculatePrice(reservation: Reservation): number {
    let numberOfdays = differenceInDays(new Date(reservation.dateEnd), new Date(reservation.dateStart));
    return numberOfdays * reservation.item.price;
  }

  public async updateReservationsStatus() {
    const today = new Date();
    await this.reservations.updateMany(
      { status: ReservationStatus.Pending, dateStart: { $lte: today } },
      { $set: { status: ReservationStatus.Expired } });
    await this.reservations.updateMany({ status: ReservationStatus.Confirmed, dateEnd: { $lte: today } }, {
      $set: { status: ReservationStatus.Completed }
    });
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
