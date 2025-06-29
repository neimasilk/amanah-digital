import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const message = `Not found - ${req.originalUrl}`;
  logger.warn(message);
  
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method
    }
  });
};