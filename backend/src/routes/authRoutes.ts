// backend/src/routes/authRoutes.ts

import { Router, Request, Response } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * GET /api/v1/auth/google
 * 
 * ✅ FIXED: Added callback URL preservation via session
 */
router.get(
  '/google',
  (req: Request, res: Response, next) => {
    // Preserve the callback URL from query params
    const callbackUrl = req.query.callbackUrl as string;
    
    // Pass callback URL through OAuth state (will be preserved through the flow)
    const authenticateOptions: any = {
      scope: ['profile', 'email'],
    };
    
    // Store callback URL in session for retrieval after OAuth
    if (callbackUrl && req.session) {
      req.session.oauthCallbackUrl = callbackUrl;
    }
    
    passport.authenticate('google', authenticateOptions)(req, res, next);
  }
);

/**
 * GET /api/v1/auth/google/callback
 * 
 * ✅ FIXED: Redirect to stored callback URL or dashboard
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: FRONTEND_URL,
  }),
  (req: Request, res: Response) => {
    // Retrieve the stored callback URL from session
    const callbackUrl = req.session?.oauthCallbackUrl;
    
    // Clear the stored callback URL
    if (req.session && req.session.oauthCallbackUrl) {
      delete req.session.oauthCallbackUrl;
    }
    
    // Redirect to callback URL or default to dashboard
    const redirectUrl = callbackUrl || `${FRONTEND_URL}/dashboard`;
    res.redirect(redirectUrl);
  }
);

/**
 * GET /api/v1/auth/me
 */
router.get('/me', requireAuth, AuthController.getCurrentUser);

/**
 * GET /api/v1/auth/status
 */
router.get('/status', AuthController.checkAuth);

/**
 * POST /api/v1/auth/logout
 */
router.post('/logout', requireAuth, AuthController.logout);

export default router;
