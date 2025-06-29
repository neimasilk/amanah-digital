import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { query } from '../config/database';
import { logger } from '../utils/logger';
import { sendEmail } from '../utils/email';

interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// Send token response
const sendTokenResponse = (user: Partial<User>, statusCode: number, res: Response): void => {
  const token = generateToken(user.id!);

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE!) || 24) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          isVerified: user.is_verified,
        },
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if user exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  
  if (existingUser.rows.length > 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'User already exists with this email' }
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, email, first_name, last_name, role, is_verified, created_at`,
    [email, passwordHash, firstName, lastName, 'user', false]
  );

  const user = result.rows[0];
  
  logger.info(`New user registered: ${email}`);
  
  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Get user with password
  const result = await query(
    'SELECT id, email, password_hash, first_name, last_name, role, is_verified FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid credentials' }
    });
  }

  const user = result.rows[0];

  // Check password
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid credentials' }
    });
  }

  logger.info(`User logged in: ${email}`);
  
  sendTokenResponse(user, 200, res);
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: { message: 'User logged out successfully' },
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await query(
    'SELECT id, email, first_name, last_name, role, is_verified, created_at FROM users WHERE id = $1',
    [req.user!.id]
  );

  const user = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
    },
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await query('SELECT id, email FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save reset token to database
  await query(
    'UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE email = $3',
    [resetPasswordToken, resetPasswordExpire, email]
  );

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({
      success: true,
      data: { message: 'Email sent' },
    });
  } catch (err) {
    logger.error('Email could not be sent:', err);
    
    // Clear reset token fields
    await query(
      'UPDATE users SET reset_password_token = NULL, reset_password_expire = NULL WHERE email = $1',
      [email]
    );

    return res.status(500).json({
      success: false,
      error: { message: 'Email could not be sent' }
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const result = await query(
    'SELECT id, email FROM users WHERE reset_password_token = $1 AND reset_password_expire > $2',
    [resetPasswordToken, new Date()]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
  }

  const user = result.rows[0];

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // Update password and clear reset token fields
  await query(
    'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2',
    [passwordHash, user.id]
  );

  logger.info(`Password reset for user: ${user.email}`);
  
  sendTokenResponse(user, 200, res);
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const result = await query(
    'SELECT id, email, password_hash, first_name, last_name, role, is_verified FROM users WHERE id = $1',
    [req.user!.id]
  );

  const user = result.rows[0];

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: { message: 'Current password is incorrect' }
    });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  // Update password
  await query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [passwordHash, user.id]
  );

  logger.info(`Password updated for user: ${user.email}`);
  
  sendTokenResponse(user, 200, res);
});