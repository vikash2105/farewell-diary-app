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
 * Require authentication (Passport-based)
 * 
 * CRITICAL FIX:
 * - Passport stores user in req.user (via deserializeUser)
 * - We check req.isAuthenticated() which relies on req.user
 * - Then populate req.userId, req.userEmail, req.userName for backward compatibility
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // ✅ Check Passport's isAuthenticated (which checks req.user)
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "Please log in to access this resource",
    });
    return;
  }

  // ✅ req.user is populated by Passport after deserializeUser
  if (!req.user?.id) {
    res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "User session is invalid",
    });
    return;
  }

  // ✅ Populate helper properties for backward compatibility
  req.userId = String(req.user.id);
  req.userEmail = req.user.email ? String(req.user.email) : undefined;
  req.userName = req.user.name ? String(req.user.name) : undefined;

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
  try {
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.id) {
        req.userId = String(req.user.id);
        req.userEmail = req.user.email ? String(req.user.email) : undefined;
        req.userName = req.user.name ? String(req.user.name) : undefined;
      }
  } catch (e) {
      // If isAuthenticated throws (e.g. session error), treat as guest
      // Do nothing, just proceed
  }

  next();
};

/**
 * ✅ BACKWARD-COMPATIBLE ALIAS
 * Some routes still import `isAuthenticated`
 */
export const isAuthenticated = requireAuth;
