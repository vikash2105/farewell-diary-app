// backend/src/routes/authRoutes.ts

import { Router, Request, Response } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * GET /api/v1/auth/google
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/**
 * GET /api/v1/auth/google/callback
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: FRONTEND_URL,
  }),
  (_req: Request, res: Response) => {
    res.redirect(`${FRONTEND_URL}/dashboard`);
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
