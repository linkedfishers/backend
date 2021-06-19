import { NextFunction, Request, Response } from 'express';
import { Provider } from '../interfaces/provider.interface';
import ProviderService from '../services/provider.service';

class ProviderController {
  public providerService = new ProviderService();

  public getProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllProvidersData = await this.providerService.findAllProvider();
    } catch (error) {
      next(error);
    }
  };

  public getProviderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const providerId = req.params.id;
      const findOneProviderData: Provider = await this.providerService.findProviderBySlugOrId(providerId);

      res.status(200).json({ data: findOneProviderData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
}
export default ProviderController;
