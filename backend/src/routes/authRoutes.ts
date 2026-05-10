import { Router, Request, Response } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();
const FRONTEND_URL = env.FRONTEND_URL;

const getSafeRedirectUrl = (callbackUrl?: string): string => {
  if (!callbackUrl) return `${FRONTEND_URL}/dashboard`;

  try {
    const parsedCallback = new URL(callbackUrl);
    const parsedFrontend = new URL(FRONTEND_URL);

    if (parsedCallback.origin !== parsedFrontend.origin) {
      return `${FRONTEND_URL}/dashboard`;
    }

    return parsedCallback.toString();
  } catch {
    return `${FRONTEND_URL}/dashboard`;
  }
};
router.get(
  '/google',
  (req: Request, res: Response, next) => {
     const callbackUrl = req.query.callbackUrl as string | undefined;
 if (callbackUrl && req.session) {
   req.session.oauthCallbackUrl = getSafeRedirectUrl(callbackUrl);
    }
     passport.authenticate('google', { scope: ['profile', 'email'] })(
      req,
      res,
      next
    );
  }
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: FRONTEND_URL,
  }),
  (req: Request, res: Response) => {
    const callbackUrl = req.session?.oauthCallbackUrl;
    
    if (req.session?.oauthCallbackUrl) {
      delete req.session.oauthCallbackUrl;
    }
    
    res.redirect(getSafeRedirectUrl(callbackUrl));
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