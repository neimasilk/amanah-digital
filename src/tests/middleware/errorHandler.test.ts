import { Request, Response, NextFunction } from 'express';
import { errorHandler, asyncHandler, CustomError } from '../../backend/middleware/errorHandler';
import { logger } from '../../backend/utils/logger';

// Mock logger
jest.mock('../../backend/utils/logger');
const mockLogger = logger as jest.Mocked<typeof logger>;

describe('Error Handler Middleware Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    req = {
      originalUrl: '/api/test',
      method: 'GET'
    };
    
    res = {
      status: statusMock,
      json: jsonMock
    };
    
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle generic errors with default 500 status', () => {
      const error = new Error('Something went wrong') as CustomError;
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error 500: Something went wrong');
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Something went wrong'
        }
      });
    });

    it('should handle errors with custom status code', () => {
      const error = new Error('Bad request') as CustomError;
      error.statusCode = 400;
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error 400: Bad request');
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Bad request'
        }
      });
    });

    it('should handle CastError (Mongoose bad ObjectId)', () => {
      const error = new Error('Cast to ObjectId failed') as CustomError;
      error.name = 'CastError';
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Resource not found'
        }
      });
    });

    it('should handle MongoError duplicate key', () => {
      const error = new Error('Duplicate key') as CustomError & { code: number };
      error.name = 'MongoError';
      error.code = 11000;
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Duplicate field value entered'
        }
      });
    });

    it('should handle ValidationError', () => {
      const error = new Error('Validation failed') as CustomError & {
        errors: { [key: string]: { message: string } }
      };
      error.name = 'ValidationError';
      error.errors = {
        email: { message: 'Email is required' },
        password: { message: 'Password must be at least 8 characters' }
      };
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Email is required, Password must be at least 8 characters'
        }
      });
    });

    it('should handle JsonWebTokenError', () => {
      const error = new Error('Invalid token') as CustomError;
      error.name = 'JsonWebTokenError';
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Invalid token'
        }
      });
    });

    it('should handle TokenExpiredError', () => {
      const error = new Error('Token expired') as CustomError;
      error.name = 'TokenExpiredError';
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Token expired'
        }
      });
    });

    it('should handle QueryFailedError', () => {
      const error = new Error('Database connection failed') as CustomError;
      error.name = 'QueryFailedError';
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Database query failed'
        }
      });
    });

    it('should include stack trace in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'development';
      
      const error = new Error('Test error') as CustomError;
      error.stack = 'Error stack trace';
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Test error',
          stack: 'Error stack trace'
        }
      });
      
      // Restore original environment
      (process.env as any).NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = 'production';
      
      const error = new Error('Test error') as CustomError;
      error.stack = 'Error stack trace';
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Test error'
        }
      });
      
      // Restore original environment
      (process.env as any).NODE_ENV = originalEnv;
    });

    it('should handle errors without message', () => {
      const error = new Error() as CustomError;
      error.message = '';
      
      errorHandler(error, req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Server Error'
        }
      });
    });
  });

  describe('asyncHandler', () => {
    it('should call next function for successful async operations', async () => {
      const asyncFunction = jest.fn().mockResolvedValue('success');
      const wrappedFunction = asyncHandler(asyncFunction);
      
      await wrappedFunction(req as Request, res as Response, next);
      
      expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled(); // next should not be called for successful operations
    });

    it('should call next with error for failed async operations', async () => {
      const error = new Error('Async operation failed');
      const asyncFunction = jest.fn().mockRejectedValue(error);
      const wrappedFunction = asyncHandler(asyncFunction);
      
      await wrappedFunction(req as Request, res as Response, next);
      
      expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle synchronous functions that throw errors', async () => {
      const error = new Error('Sync operation failed');
      const syncFunction = jest.fn().mockImplementation(() => {
        throw error;
      });
      const wrappedFunction = asyncHandler(syncFunction);
      
      await wrappedFunction(req as Request, res as Response, next);
      
      expect(syncFunction).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle functions that return promises', async () => {
      const asyncFunction = jest.fn().mockImplementation(async () => {
        return 'success';
      });
      const wrappedFunction = asyncHandler(asyncFunction);
      
      await wrappedFunction(req as Request, res as Response, next);
      
      expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });
});