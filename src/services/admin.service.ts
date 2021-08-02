import { Report, User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import reportModel from '../models/reports.model';
import { Provider } from '../interfaces/provider.interface';
import { Content } from '../interfaces/content.interface';
import models from '../models/equipments.model';
import contentModel from '../models/content.model';
import { isEmptyObject } from '../utils/util';
import HttpException from '../exceptions/HttpException';

class AdminService {
  public users = userModel;
  public reports = reportModel;
  public content = contentModel;

  public async findUsers(count: number, skip: number): Promise<User[]> {
    const users: User[] = await this.users.aggregate([
      {
        $project: {
          fullName: 1,
          profilePicture: 1,
          slug: 1,
          country: 1,
          createdAt: 1,
          activated: 1,
          role: 1,
          email: 1,
          followers: { $size: '$followers' },
          following: { $size: '$following' },
        },
      },
      { $match: { role: { $ne: 'provider' } } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: count },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts',
        },
      },
      {
        $lookup: {
          from: 'reports',
          localField: '_id',
          foreignField: 'receiver',
          as: 'reports',
        },
      },
    ]);
    return users;
  }

  public async getProviders(count: number, skip: number): Promise<Provider[]> {
    return await this.users.find({ role: 'provider' });
  }

  public async findReports(userId: string): Promise<Report[]> {
    const user: User = await this.users.findById(userId);
    const reports = await this.reports.find({ receiver: user }).populate('author');
    return reports;
  }

  public async deleteReport(reportId: string): Promise<Report> {
    const report: Report = await this.reports.findByIdAndDelete(reportId);
    return report;
  }
  public async getContent(id: string): Promise<Content> {
    const content: Content = await this.content.findById(id);
    return content;
  }

  public async getOverview(): Promise<any> {
    const activeUsers: number = await this.users.count({
      activated: true,
    });
    const today = new Date();
    const month = today.getMonth();

    const newUsersAggregate = await this.users.aggregate([
      { $project: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } } },
      { $match: { month: month + 1 } },
      { $match: { year: today.getFullYear() } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const newUsers: number = newUsersAggregate[0].count;
    return { activeUsers, newUsers };
  }

  public async updateUserStatus(userId: string, activated: boolean): Promise<User> {
    const user: User = await this.users.findByIdAndUpdate(userId, { $set: { activated: activated } }, { new: true }).select('-__v -password');
    return user;
  }
  public async createContent(contentData): Promise<Content> {
    if (isEmptyObject(contentData)) throw new HttpException(400, `Can't create Empty Content`);

    const cont = new this.content(contentData);
    return await cont.save();
  }

  public async UpdateContent(contentData, contentId): Promise<Content> {
    return await this.content.findByIdAndUpdate(contentId, contentData);
  }
   public async findAllContents(): Promise<Content[]> {
    const contents: Content[] = await this.content.find().populate('owner', 'fullName slug');
    return contents;
  }

}

export default AdminService;
