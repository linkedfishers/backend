import mongoose from 'mongoose';
import { Provider } from '../interfaces/provider.interface';

const providerSchema = new mongoose.Schema({
  comanyName: {
    type: String,
    required: "Full name can't be empty",
  },
  companyEmail: String,
  slug: {
    type: String,
    unique: true,
    index: {
      unique: true,
      partialFilterExpression: { slug: { $type: 'string' } },
    },
  },
  companyPhone: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { phone: { $type: 'string' } },
    },
  },
  companyAdress: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: 'profilePictures/default-profile.png',
  },
  coverPictures: [{ type: String }],
  pictures: [{ type: String }],
  description: { type: String },
  password: String,
  role: { type: String, default: 'user' },
  resetPasswordToken: String,
  confirmationToken: String,
  resetPasswordExpires: Date,
  country: String,
  activated: Boolean,

});

providerSchema.set('timestamps', true);

const providerModel = mongoose.model<Provider & mongoose.Document>('Provider', providerSchema);

export default providerModel;
