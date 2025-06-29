import request from 'supertest';
import express from 'express';
import { authRoutes } from '../../backend/routes/auth';
import { authController } from '../../backend/controllers/auth';
import { protect, authorize } from '../../backend/middleware/auth';
import { validateRequest } from '../../backend/middleware/validation';
import rateLimit from 'express-rate-limit';

// Mock dependencies
jest.mock('../../backend/controllers/auth');
jest.mock('../../backend/middleware/auth');
jest.mock('../../backend/middleware/validation');
jest.mock('express-rate-limit');

const mockAuthController = authController as jest.Mocked<typeof authController>;
const mockProtect = protect as jest.MockedFunction<typeof protect>;
const mockAuthorize = authorize as jest.MockedFunction<typeof authorize>;
const mockValidateRequest = validateRequest as jest.MockedFunction<typeof validateRequest>;
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;

describe('Auth Routes Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mock rate limiter to pass through
    mockRateLimit.mockImplementation(() => (req, res, next) => next());
    
    // Mock middleware to pass through by default
    mockProtect.mockImplementation((req, res, next) => next());
    mockAuthorize.mockImplementation(() => (req, res, next) => next());
    mockValidateRequest.mockImplementation((req, res, next) => next());
    
    // Mock controller methods
    mockAuthController.register.mockImplementation((req, res) => {
      res.status(201).json({ success: true, message: 'User registered successfully' });
    });
    
    mockAuthController.login.mockImplementation((req, res) => {
      res.status(200).json({ success: true, token: 'mock-token' });
    });
    
    mockAuthController.logout.mockImplementation((req, res) => {
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
    
    mockAuthController.getMe.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: { id: 1, email: 'test@example.com' } });
    });
    
    mockAuthController.forgotPassword.mockImplementation((req, res) => {
      res.status(200).json({ success: true, message: 'Password reset email sent' });
    });
    
    // Use auth routes
    app.use('/api/auth', authRoutes);
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'User registered successfully'
      });
      expect(mockAuthController.register).toHaveBeenCalled();
      expect(mockValidateRequest).toHaveBeenCalled();
    });

    it('should apply rate limiting to registration', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        });

      expect(mockRateLimit).toHaveBeenCalled();
    });

    it('should validate registration data', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        });

      expect(mockValidateRequest).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        token: 'mock-token'
      });
      expect(mockAuthController.login).toHaveBeenCalled();
      expect(mockValidateRequest).toHaveBeenCalled();
    });

    it('should apply rate limiting to login', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(mockRateLimit).toHaveBeenCalled();
    });

    it('should validate login data', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(mockValidateRequest).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Logged out successfully'
      });
      expect(mockAuthController.logout).toHaveBeenCalled();
      expect(mockProtect).toHaveBeenCalled();
    });

    it('should require authentication for logout', async () => {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer mock-token');

      expect(mockProtect).toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user profile successfully', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: { id: 1, email: 'test@example.com' }
      });
      expect(mockAuthController.getMe).toHaveBeenCalled();
      expect(mockProtect).toHaveBeenCalled();
    });

    it('should require authentication for profile access', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer mock-token');

      expect(mockProtect).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email successfully', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'john@example.com' })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Password reset email sent'
      });
      expect(mockAuthController.forgotPassword).toHaveBeenCalled();
      expect(mockValidateRequest).toHaveBeenCalled();
    });

    it('should apply rate limiting to forgot password', async () => {
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'john@example.com' });

      expect(mockRateLimit).toHaveBeenCalled();
    });

    it('should validate forgot password data', async () => {
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'john@example.com' });

      expect(mockValidateRequest).toHaveBeenCalled();
    });
  });

  describe('Route Security', () => {
    it('should apply rate limiting to sensitive endpoints', async () => {
      // Test multiple sensitive endpoints
      await request(app).post('/api/auth/register').send({});
      await request(app).post('/api/auth/login').send({});
      await request(app).post('/api/auth/forgot-password').send({});

      // Rate limiter should be called for each sensitive endpoint
      expect(mockRateLimit).toHaveBeenCalledTimes(3);
    });

    it('should validate input for all endpoints that require it', async () => {
      await request(app).post('/api/auth/register').send({});
      await request(app).post('/api/auth/login').send({});
      await request(app).post('/api/auth/forgot-password').send({});

      // Validation should be applied to endpoints that need it
      expect(mockValidateRequest).toHaveBeenCalledTimes(3);
    });

    it('should protect authenticated routes', async () => {
      await request(app).post('/api/auth/logout').set('Authorization', 'Bearer token');
      await request(app).get('/api/auth/me').set('Authorization', 'Bearer token');

      // Protection middleware should be called for authenticated routes
      expect(mockProtect).toHaveBeenCalledTimes(2);
    });
  });

  describe('HTTP Methods', () => {
    it('should only allow POST for registration', async () => {
      await request(app).get('/api/auth/register').expect(404);
      await request(app).put('/api/auth/register').expect(404);
      await request(app).delete('/api/auth/register').expect(404);
    });

    it('should only allow POST for login', async () => {
      await request(app).get('/api/auth/login').expect(404);
      await request(app).put('/api/auth/login').expect(404);
      await request(app).delete('/api/auth/login').expect(404);
    });

    it('should only allow POST for logout', async () => {
      await request(app).get('/api/auth/logout').expect(404);
      await request(app).put('/api/auth/logout').expect(404);
      await request(app).delete('/api/auth/logout').expect(404);
    });

    it('should only allow GET for profile', async () => {
      await request(app).post('/api/auth/me').expect(404);
      await request(app).put('/api/auth/me').expect(404);
      await request(app).delete('/api/auth/me').expect(404);
    });

    it('should only allow POST for forgot password', async () => {
      await request(app).get('/api/auth/forgot-password').expect(404);
      await request(app).put('/api/auth/forgot-password').expect(404);
      await request(app).delete('/api/auth/forgot-password').expect(404);
    });
  });
});