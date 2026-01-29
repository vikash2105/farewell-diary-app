// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userName?: string;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session || !req.session.userId) {
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource',
    });
    return;
  }

  req.userId = req.session.userId;
  req.userEmail = req.session.userEmail;
  req.userName = req.session.userName;

  next();
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    req.userEmail = req.session.userEmail;
    req.userName = req.session.userName;
  }

  next();
};
