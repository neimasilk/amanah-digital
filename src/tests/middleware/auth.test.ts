import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { protect, authorize, AuthenticatedRequest } from '../../backend/middleware/auth';
import { query } from '../../backend/config/database';

// Mock dependencies
jest.mock('../../backend/config/database');
jest.mock('../../backend/utils/logger');

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('Auth Middleware Tests', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    req = {
      headers: {},
      cookies: {}
    };
    
    res = {
      status: statusMock,
      json: jsonMock
    };
    
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    const validToken = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET as string || 'test-secret');
    const invalidToken = 'invalid.token.here';

    it('should authenticate user with valid Bearer token', async () => {
      req.headers = {
        authorization: `Bearer ${validToken}`
      };

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'user123',
          email: 'test@example.com',
          role: 'user',
          created_at: new Date()
        }]
      });

      await protect(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toEqual({
        id: 'user123',
        email: 'test@example.com',
        role: 'user',
        created_at: expect.any(Date)
      });
      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should authenticate user with valid cookie token', async () => {
      req.cookies = {
        token: validToken
      };

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'user123',
          email: 'test@example.com',
          role: 'user',
          created_at: new Date()
        }]
      });

      await protect(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
      await protect(req as AuthenticatedRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Not authorized to access this route' }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      req.headers = {
        authorization: `Bearer ${invalidToken}`
      };

      await protect(req as AuthenticatedRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Not authorized to access this route' }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request when user not found in database', async () => {
      req.headers = {
        authorization: `Bearer ${validToken}`
      };

      mockQuery.mockResolvedValueOnce({
        rows: [] // No user found
      });

      await protect(req as AuthenticatedRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: { message: 'User not found' }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      req.headers = {
        authorization: `Bearer ${validToken}`
      };

      mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

      await protect(req as AuthenticatedRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Not authorized to access this route' }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', async () => {
      req.headers = {
        authorization: 'InvalidFormat'
      };

      await protect(req as AuthenticatedRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Not authorized to access this route' }
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    it('should allow access for authorized role', () => {
      req.user = {
        id: 'user123',
        email: 'admin@example.com',
        role: 'admin'
      };

      const authorizeAdmin = authorize('admin', 'superadmin');
      authorizeAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      req.user = {
        id: 'user123',
        email: 'user@example.com',
        role: 'user'
      };

      const authorizeAdmin = authorize('admin', 'superadmin');
      authorizeAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: { message: 'User role not authorized to access this route' }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when user is not authenticated', () => {
      req.user = undefined;

      const authorizeAdmin = authorize('admin');
      authorizeAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: { message: 'User not authenticated' }
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access for user role when no role specified', () => {
      req.user = {
        id: 'user123',
        email: 'user@example.com'
        // No role specified, should default to 'user'
      };

      const authorizeUser = authorize('user');
      authorizeUser(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should allow access for multiple authorized roles', () => {
      req.user = {
        id: 'user123',
        email: 'moderator@example.com',
        role: 'moderator'
      };

      const authorizeMultiple = authorize('admin', 'moderator', 'superadmin');
      authorizeMultiple(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should work with protect and authorize middleware chain', async () => {
      const validToken = jwt.sign({ id: 'admin123' }, process.env.JWT_SECRET as string || 'test-secret');
      
      req.headers = {
        authorization: `Bearer ${validToken}`
      };

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'admin123',
          email: 'admin@example.com',
          role: 'admin',
          created_at: new Date()
        }]
      });

      // First apply protect middleware
      await protect(req as AuthenticatedRequest, res as Response, next);
      
      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalledTimes(1);

      // Reset next mock for authorize middleware
      jest.clearAllMocks();

      // Then apply authorize middleware
      const authorizeAdmin = authorize('admin');
      authorizeAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});