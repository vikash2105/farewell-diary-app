import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { logger } from '../utils/logger';

export class AuthController {
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
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

          // ✅ CRITICAL FIX: Clear cookie with same options as when it was set
          res.clearCookie('farewell.sid', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          });
          
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

  static async checkAuth(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      authenticated: req.isAuthenticated?.() ?? false,
      user: req.user ?? null,
    });
  }
}
