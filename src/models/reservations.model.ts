import mongoose from 'mongoose';
import { Reservation } from '../interfaces/reservations.interface';

const reservationSchema = new mongoose.Schema({
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateStart: mongoose.Schema.Types.Date,
    dateEnd: mongoose.Schema.Types.Date,
    home: { type: mongoose.Schema.Types.ObjectId, ref: 'Hebergement', required: false },
    boat: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: false },
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: false },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'DELETED', 'DECLINED'], default: 'PENDING' }
});

reservationSchema.set('timestamps', true);

export const reservationModel = mongoose.model<Reservation & mongoose.Document>('Reservation', reservationSchema);
