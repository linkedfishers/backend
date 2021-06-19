import { timeStamp } from 'console';
import mongoose from 'mongoose';
import { Product, Categorie } from '../interfaces/product.interface';
import { Provider } from '../interfaces/provider.interface';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  picture: { type: String, required: false },
  pictures: [{ type: String, required: false }]
});

const categorieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
});
productSchema.set('timestamps', true);
categorieSchema.set('timestamps', true);

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);
const categorieModel = mongoose.model<Categorie & mongoose.Document>('Categorie', categorieSchema);

const marketmodel = {
  productModel,
  categorieModel,
};

export default marketmodel;
