import { nextDay } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import { RequestWithFile, RequestWithUser, TokenData } from '../interfaces/auth.interface';
import fetch from 'node-fetch';
class WeatherController {
  public getWetaherData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let city = req.params.city;
      const key = 'ca73b9253fb0753ca439d964a688acba';
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
      let response = await fetch(url);
      const weatherData = await response.json();
      res.status(200).json({ weatherData });
      console.log(weatherData);
    } catch (error) {
      next(error);
    }
  };

  public getForcastweather = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let city = req.params.city;
      const key = '11b8f6715fb89b6f60a081eca4a27352';
      let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`;
      const response = await fetch(url);
      const forcastWeather = await response.json();
      console.log(forcastWeather);
      res.status(200).json({ data: forcastWeather });
    } catch (error) {
      next(error);
    }
  };

  public getOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public getReports = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public deleteReport = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  /*   public addSousCatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const catType = req.body;
      const sousCat = await this.equipmentService.addsouCatType(catType);
      res.status(200).json({ data: sousCat });
    } catch (error) {
      next(error);
    }
  }; */

  public addEquipmentType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public addBoatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };
  public addServiceType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public addProductCategory = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public addHebergementType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public deleteEquipmentType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public updateBoatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public updateHebergementType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (err) {
      next(err);
    }
  };

  public updateEquipmentType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (err) {
      next(err);
    }
  };

  public updateServiceType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (err) {
      next(err);
    }
  };

  public deleteBoatType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public deleteHebergementType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public deleteServiceType = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public createContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public deleteContent = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  //to do add controller images
  public getContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };
  public updateContent = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };
  public findAllContents = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };
}
export default WeatherController;
