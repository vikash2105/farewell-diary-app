import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserService } from '../services/userService';
import { logger } from '../utils/logger';

export class AuthController {
  /**
   * Get current user information
   */
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const user = await UserService.findById(req.user.id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      logger.error('Error getting current user:', error);
      res.status(500).json({
        success: false,
        error: 'Error retrieving user information',
      });
    }
  }

  /**
   * Logout user
   */
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      req.logout((err) => {
        if (err) {
          logger.error('Error during logout:', err);
          res.status(500).json({
            success: false,
            error: 'Error logging out',
          });
          return;
        }

        req.session.destroy((destroyErr) => {
          if (destroyErr) {
            logger.error('Error destroying session:', destroyErr);
            res.status(500).json({
              success: false,
              error: 'Error destroying session',
            });
            return;
          }

          res.clearCookie('connect.sid');
          res.json({
            success: true,
            message: 'Logged out successfully',
          });
        });
      });
    } catch (error) {
      logger.error('Error in logout:', error);
      res.status(500).json({
        success: false,
        error: 'Error logging out',
      });
    }
  }

  /**
   * Check authentication status
   */
  static async checkAuth(req: AuthRequest, res: Response): Promise<void> {
    res.json({
      success: true,
      authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      user: req.user || null,
    });
  }
}
