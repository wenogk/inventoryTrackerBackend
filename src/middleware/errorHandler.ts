import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../utils/response/custom-error/CustomError';

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.HttpStatusCode >= 100 && err.HttpStatusCode < 600 ? err.HttpStatusCode : 500;
  return res.status(statusCode).json(err.JSON);
};
