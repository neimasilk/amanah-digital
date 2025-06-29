import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { validateRequest } from '../../backend/middleware/validation';
import { logger } from '../../backend/utils/logger';

// Mock dependencies
jest.mock('express-validator');
jest.mock('../../backend/utils/logger');

const mockValidationResult = validationResult as jest.MockedFunction<typeof validationResult>;
const mockLogger = logger as jest.Mocked<typeof logger>;

describe('Validation Middleware Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    req = {
      originalUrl: '/api/auth/register',
      method: 'POST',
      ip: '127.0.0.1'
    };
    
    res = {
      status: statusMock,
      json: jsonMock
    };
    
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('validateRequest', () => {
    it('should call next() when validation passes', () => {
      // Mock successful validation (no errors)
      mockValidationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it('should return 400 error when validation fails', () => {
      const validationErrors = [
        {
          type: 'field',
          path: 'email',
          msg: 'Please provide a valid email',
          value: 'invalid-email'
        },
        {
          type: 'field',
          path: 'password',
          msg: 'Password must be at least 8 characters long',
          value: '123'
        }
      ];

      // Mock failed validation
      mockValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'email',
              message: 'Please provide a valid email',
              value: 'invalid-email'
            },
            {
              field: 'password',
              message: 'Password must be at least 8 characters long',
              value: '123'
            }
          ]
        }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should log validation failures', () => {
      const validationErrors = [
        {
          type: 'field',
          path: 'email',
          msg: 'Email is required',
          value: undefined
        }
      ];

      mockValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(mockLogger.warn).toHaveBeenCalledWith('Validation failed:', {
        url: '/api/auth/register',
        method: 'POST',
        errors: [
          {
            field: 'email',
            message: 'Email is required',
            value: undefined
          }
        ],
        ip: '127.0.0.1'
      });
    });

    it('should handle validation errors with unknown field type', () => {
      const validationErrors = [
        {
          type: 'unknown',
          msg: 'Unknown validation error'
        }
      ];

      mockValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'unknown',
              message: 'Unknown validation error',
              value: undefined
            }
          ]
        }
      });
    });

    it('should handle multiple validation errors', () => {
      const validationErrors = [
        {
          type: 'field',
          path: 'email',
          msg: 'Email is required',
          value: ''
        },
        {
          type: 'field',
          path: 'password',
          msg: 'Password is required',
          value: ''
        },
        {
          type: 'field',
          path: 'firstName',
          msg: 'First name must be at least 2 characters',
          value: 'A'
        }
      ];

      mockValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'email',
              message: 'Email is required',
              value: ''
            },
            {
              field: 'password',
              message: 'Password is required',
              value: ''
            },
            {
              field: 'firstName',
              message: 'First name must be at least 2 characters',
              value: 'A'
            }
          ]
        }
      });
    });

    it('should handle validation errors without values', () => {
      const validationErrors = [
        {
          type: 'field',
          path: 'email',
          msg: 'Email format is invalid'
          // No value property
        }
      ];

      mockValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'email',
              message: 'Email format is invalid',
              value: undefined
            }
          ]
        }
      });
    });

    it('should handle empty validation errors array', () => {
      mockValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => []
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
          details: []
        }
      });
    });

    it('should handle requests without IP address', () => {
      (req as any).ip = undefined;
      
      const validationErrors = [
        {
          type: 'field',
          path: 'email',
          msg: 'Email is required',
          value: ''
        }
      ];

      mockValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => validationErrors
      } as any);

      validateRequest(req as Request, res as Response, next);

      expect(mockLogger.warn).toHaveBeenCalledWith('Validation failed:', {
        url: '/api/auth/register',
        method: 'POST',
        errors: [
          {
            field: 'email',
            message: 'Email is required',
            value: ''
          }
        ],
        ip: undefined
      });
    });
  });
});