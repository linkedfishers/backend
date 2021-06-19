import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/HttpException';
import { Provider } from '../interfaces/provider.interface';
import userModel from '../models/users.model';
import notificationModel from '../models/notifications.model';
import { isEmptyObject, isNullOrEmpty, slugify, randomString } from '../utils/util';
import shortid from 'shortid';

class ProviderService {

  public async findAllProvider(): Promise<Provider[]> {
    const providers: Provider[] = await userModel.find({ role: 'provider' });
    return providers;
  }

  public async findProviderBySlugOrId(providerId: string): Promise<Provider> {
    let provider: Provider;
    if (isValidObjectId(providerId)) {
      provider = await userModel
        .findOne({
          $and: [{
            $or: [{ _id: providerId }, { slug: providerId.toLowerCase() }]
          },
          { role: 'provider' }
          ]
        })
        .select('-__v -password');
    } else {
      provider = await userModel.findOne({
        $and: [
          { role: 'provider' },
          { slug: providerId }]
      }).select('-__v -password');
    }
    if (!provider) throw new HttpException(409, 'Provider not found');
    return provider;
  }

  public async updateProfilePicture(providerId: string, logo: string): Promise<Provider> {
    const provider: Provider = await userModel
      .findByIdAndUpdate(
        providerId,
        {
          $set: {
            logo: logo,
          },
          $addToSet: {
            pictures: logo,
          },
        },
        { new: true },
      )
      .select('-__v -password');
    return provider;
  }

  public async deleteProvider(id: string): Promise<Provider> {
    const provider = await userModel.findByIdAndDelete(id);

    return provider;
  }
}

export default ProviderService;
