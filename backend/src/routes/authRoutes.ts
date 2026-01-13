import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/authController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * @route   GET /api/v1/auth/google
 * @desc    Initiate Google OAuth
 * @access  Public
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/**
 * @route   GET /api/v1/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: FRONTEND_URL,
  }),
  (req, res) => {
    // Successful authentication → redirect to dashboard
    res.redirect(`${FRONTEND_URL}/dashboard`);
  }
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', isAuthenticated, AuthController.getCurrentUser);

/**
 * @route   GET /api/v1/auth/status
 * @desc    Check authentication status
 * @access  Public
 */
router.get('/status', AuthController.checkAuth);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', isAuthenticated, AuthController.logout);

export default router;
