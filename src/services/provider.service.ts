import { isValidObjectId } from 'mongoose';
import HttpException from '../exceptions/HttpException';
import {  Provider } from '../interfaces/provider.interface';
import providerModel from '../models/provider.model';
import notificationModel from '../models/notifications.model';

class ProviderService {
  public providers = providerModel;

  public async findAllProvider(): Promise<Provider[]> {
    const providers: Provider[] = await this.providers.find();
    return providers;
  }

  public async findFeedProvider(): Promise<{ newestProviders: Provider[]; popularProviders: Provider[]; activeProviders: Provider[] }> {
    const newestProviders: Provider[] = await this.providers.find().sort('-createdAt').limit(5);
    const popularProviders: Provider[] = await this.providers.aggregate([
      {
        $project: {
          companyName: 1,
          logo: 1,
          slug: 1,
        },
      },

    ]);
    const activeProviders: Provider[] = [];
    return { popularProviders, newestProviders, activeProviders };
  }

  public async search(keyword): Promise<Provider[]> {
    const providers = await this.providers.find({ comapnyName: { $regex: keyword, $options: 'i' } }).select('companyName logo slug');
    return providers;
  }

  public async findProviderById(providerId: string): Promise<Provider> {
    const provider: Provider = await this.providers.findOne({ _id: providerId }).select('-__v -password');
    if (!provider) throw new HttpException(409, 'Provider not found');
    return provider;
  }

  public async findProviderBySlugOrId(providerId: string): Promise<Provider> {
    let provider: Provider;
    if (isValidObjectId(providerId)) {
      provider = await this.providers
        .findOne({
          $or: [{ _id: providerId }, { slug: providerId.toLowerCase() }],
        })
        .select('-__v -password');
    } else {
      provider = await this.providers.findOne({ slug: providerId }).select('-__v -password');
    }
    if (!provider) throw new HttpException(409, 'Provider not found');
    return provider;
  }

  public async updateProfilePicture(providerId: string, logo: string): Promise<Provider> {
    const provider: Provider = await this.providers
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


  public async deleteProviderData(providerId: string): Promise<Provider> {
    const deleteProviderById: Provider = await this.providers.findByIdAndDelete(providerId);
    if (!deleteProviderById) throw new HttpException(409, 'User not found');

    return deleteProviderById;
  }




  public async deleteProvider(id: string): Promise<Provider> {
    const provider = await this.providers.findByIdAndDelete(id);

    return provider;
  }
  // public async deletePost(id:string): Promise<Post> {
  //   const post = await this.post.findByIdAndDelete(id);

  //   return post;
  // }
}

export default ProviderService;
