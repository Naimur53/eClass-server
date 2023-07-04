import { NextFunction, Request, Response } from 'express';
import authJwtValidation from '../../helpers/authJwtValidation';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      const verifiedUser = authJwtValidation(token, requiredRoles);
      req.user = verifiedUser; //
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
