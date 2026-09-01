import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';
import { User } from '../models/User';

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & {
        _id?: any;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Missing or invalid Bearer token.', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    if (!payload) {
      return sendError(res, 'Invalid or expired access token.', 401, 'TOKEN_INVALID');
    }

    // Check if user is still active in database
    const user = await User.findById(payload.userId).select('isActive isBlocked role');
    if (!user) {
      return sendError(res, 'User account not found.', 401, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      return sendError(res, 'Account has been deactivated.', 403, 'ACCOUNT_DEACTIVATED');
    }

    if (user.isBlocked) {
      return sendError(res, 'Account has been suspended for safety violations.', 403, 'ACCOUNT_BLOCKED');
    }

    req.user = {
      ...payload,
      _id: user._id,
    };

    next();
  } catch (error) {
    return sendError(res, 'Internal authentication error.', 500, 'AUTH_ERROR');
  }
};

export const requireRole = (allowedRoles: ('user' | 'moderator' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Access forbidden: Insufficient permissions.', 403, 'FORBIDDEN');
    }
    next();
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
};
