import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from './errorHandler';
import { logger } from '../utils/logger';
import { query } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  // Cek token dari Authorization header (untuk API calls) atau cookies (untuk web app)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Format: "Bearer <token>" - ekstrak token setelah spasi
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Fallback ke cookie token untuk web browser requests
    token = req.cookies.token;
  }

  // Tolak akses jika tidak ada token sama sekali
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized to access this route' }
    });
  }

  try {
    // Verifikasi JWT token dengan secret key
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    
    // Ambil data user terbaru dari database untuk memastikan user masih aktif
    // Tidak menggunakan data dari token untuk menghindari stale data
    const result = await query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    // Jika user tidak ditemukan (mungkin sudah dihapus), tolak akses
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Attach user data ke request object untuk digunakan di route handlers
    req.user = result.rows[0];
    return next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized to access this route' }
    });
  }
});

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    if (!roles.includes(req.user.role || 'user')) {
      return res.status(403).json({
        success: false,
        error: { message: 'User role not authorized to access this route' }
      });
    }

    return next();
  };
};