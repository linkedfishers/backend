import 'dotenv/config';
import App from './app';
import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';
import Routes from './interfaces/routes.interface';
import PostsRoute from './routes/posts.route';
import EventsRoute from './routes/events.route';
import EquipmentRoute from './routes/equipments.route';
import AdminRoute from './routes/admin.route';
import ReservationRoute from './routes/reservations.route';
import ProductRoute from './routes/product.route';
import ProviderRoute from './routes/provider.route';
import OrderRoute from './routes/order.route';

validateEnv();
const routes: Routes[] = [
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new PostsRoute(),
  new EventsRoute(),
  new EquipmentRoute(),
  new AdminRoute(),
  new ReservationRoute(),
  new ProviderRoute(),
  new ProductRoute(),
  new OrderRoute(),
];
const app = new App(routes);
app.listenTwo();
