import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithProvider } from '../interfaces/auth.interface';
import providerModel from '../models/provider.model';

async function authProviderMiddleware(req: RequestWithProvider, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  let token;
  if (cookies && cookies.Authorization) {
    token = cookies.Authorization;
  } else if ('authorization' in req.headers) {
    token = req.headers['authorization'].split(' ')[1];
  } else {
    next(new HttpException(403, ' Authorization token missing'));
    return;
  }
  try {
    const secret = process.env.JWT_SECRET;
    const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
    const providerId = verificationResponse._id;
    const findProvideer = await providerModel.findById(providerId);
    if (findProvideer) {
      req.provider = findProvideer;
      next();
    } else {
      next(new HttpException(401, 'Wrong Authentication Token '));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong Authentication Token '));
  }
}

export default authProviderMiddleware;
