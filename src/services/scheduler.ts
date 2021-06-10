const cron = require("node-cron")
import ReservationService from "../services/reservations.service";

class Scheduler {
    private reservationService = new ReservationService();

    updateReservationsJob = () => {
        cron.schedule("0 1 * * *", async () => {
            this.reservationService.updateReservationsStatus();
        })
    }
}
export default Scheduler;