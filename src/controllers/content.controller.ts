import { NextFunction, Response } from 'express';
import { RequestWithFile, RequestWithUser } from '../interfaces/auth.interface';
import { Content } from '../interfaces/content.interface';
import ContentService from '../services/content.service';

class ContentController {
  public contentService = new ContentService();

  public createContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contentData = req.body;
      if (req.files) {
        contentData.images = req.files.map(file => {
          contentData.images = file.path.split('/').splice(1).join('/');
        });
      }
      const content: Content = await this.contentService.createContent(contentData);
      res.status(201).json({ data: content, message: `Created Content Succussfully` });
    } catch (error) {
      next(error);
    }
  };

  public findAllContent = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contents: Content[] = await this.contentService.findAllContent();
      console.log('testhamzanasri');

      res.status(201).json({ data: contents });
    } catch (error) {
      next(error);
    }
  };

  public UpdateContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contentId: string = req.params.id;
      const contentData = req.body;

      if (req.files) {
        contentData.images = req.files.map(file => {
          contentData.images = file.path.split('/').splice(1).join('/');
        });

        const content: Content = await this.contentService.UpdateContent(contentData, contentId);
        res.status(201).json({ data: content, message: 'Updated Images' });
      }
    } catch (error) {
      next(error);
    }
  };

  public getContent = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const content = await this.contentService.getContent(id);
      res.status(201).json({ data: content });
    } catch (error) {
      next(error);
    }
  };
}
export default ContentController;
