import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userName?: string;
    }
  }
}

/**
 * Require authentication (session-based)
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session?.userId) {
    res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "Please log in to access this resource",
    });
    return;
  }

  req.userId = String(req.session.userId);
  req.userEmail = req.session.userEmail
    ? String(req.session.userEmail)
    : undefined;
  req.userName = req.session.userName
    ? String(req.session.userName)
    : undefined;

  next();
};

/**
 * Optional authentication
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.session?.userId) {
    req.userId = String(req.session.userId);
    req.userEmail = req.session.userEmail
      ? String(req.session.userEmail)
      : undefined;
    req.userName = req.session.userName
      ? String(req.session.userName)
      : undefined;
  }

  next();
};

/**
 * ✅ BACKWARD-COMPATIBLE ALIAS
 * Some routes still import `isAuthenticated`
 */
export const isAuthenticated = requireAuth;
