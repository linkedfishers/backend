import { isValidObjectId, model } from 'mongoose';
import contentModel from '../models/content.model';
import HttpException from '../exceptions/HttpException';
import { Content } from '../interfaces/content.interface';
import { isEmptyObject } from '../utils/util';
import contentSecurityPolicy from 'helmet/dist/middlewares/content-security-policy';

class ContentService {
  public contents = contentModel;

  public async createContent(contentDat): Promise<Content> {
    if (isEmptyObject(contentDat)) throw new HttpException(400, 'Cant Create emtyContent ');
    const content = new this.contents(contentDat);
    return await content.save();
  }
  public async findAllContent(): Promise<Content[]> {
    const contents: Content[] = await this.contents.find();
    return contents;
  }

  public async UpdateContent(contentData, id): Promise<Content> {
    return await this.contents.findByIdAndUpdate(contentData, id);
  }
  public async getContent(id: string): Promise<Content> {
    const content: Content = await this.contents.findById(id);
    return content;
  }


  
}

export default ContentService;
