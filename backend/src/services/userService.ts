import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users, User, NewUser } from '../db/schema';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';

export class UserService {
  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return user || null;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw new ApiError(500, 'Error retrieving user');
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return user || null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw new ApiError(500, 'Error retrieving user');
    }
  }

  /**
   * Find user by Google ID
   */
  static async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.googleId, googleId))
        .limit(1);

      return user || null;
    } catch (error) {
      logger.error('Error finding user by Google ID:', error);
      throw new ApiError(500, 'Error retrieving user');
    }
  }

  /**
   * Create a new user
   */
  static async create(userData: NewUser): Promise<User> {
    try {
      const [newUser] = await db
        .insert(users)
        .values({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!newUser) {
        throw new ApiError(500, 'User creation failed');
      }

      logger.info('New user created', {
        userId: newUser.id,
        email: newUser.email,
      });

      return newUser;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new ApiError(500, 'Error creating user');
    }
  }

  /**
   * Update user information
   */
  static async update(id: string, updates: Partial<User>): Promise<User> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        throw new ApiError(404, 'User not found');
      }

      logger.info('User updated', { userId: id });
      return updatedUser;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating user:', error);
      throw new ApiError(500, 'Error updating user');
    }
  }

  /**
   * Find or create user (USED BY GOOGLE OAUTH)
   * This is the MOST IMPORTANT method for auth stability
   */
  static async findOrCreate(
    email: string,
    name: string,
    googleId?: string,
    profilePicture?: string | null
  ): Promise<User> {
    try {
      let user: User | null = null;

      // 1. Try find by Google ID first (most reliable)
      if (googleId) {
        user = await this.findByGoogleId(googleId);
      }

      // 2. If not found, try by email
      if (!user) {
        user = await this.findByEmail(email);
      }

      // 3. If found, ensure googleId is linked
      if (user) {
        if (googleId && !user.googleId) {
          user = await this.update(user.id, { googleId });
        }
        return user;
      }

      // 4. If still not found, create new user
      return await this.create({
        email,
        name,
        googleId,
        profilePicture,
        isActive: true,
      });
    } catch (error) {
      logger.error('Error in findOrCreate:', error);
      throw new ApiError(500, 'Error processing user');
    }
  }

  /**
   * Deactivate user account
   */
  static async deactivate(id: string): Promise<void> {
    try {
      await this.update(id, { isActive: false });
      logger.info('User deactivated', { userId: id });
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw new ApiError(500, 'Error deactivating user');
    }
  }
}
