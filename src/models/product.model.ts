import { timeStamp } from 'console';
import mongoose from 'mongoose';
import { Product, Categorie } from '../interfaces/product.interface';
import { Provider } from '../interfaces/provider.interface';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  qtty: { type: Number, required: true },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
});

const categorieSchema = new mongoose.Schema({
  catName: { type: String, required: true },
  catDescription: { type: String, required: true },
  icon: { type: String },
});
productSchema.set('timestamps', true);
categorieSchema.set('timeStamp', true);

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);
const categorieModel = mongoose.model<Categorie & mongoose.Document>('Categorie', categorieSchema);

const marketmodel = {
  productModel,
  categorieModel,
};

export default marketmodel;
