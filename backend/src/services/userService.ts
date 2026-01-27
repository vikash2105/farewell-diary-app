import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users, User, NewUser } from '../db/schema';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';

export class UserService {
  /**
   * Find user by ID (PASSPORT SAFE)
   * ⚠️ Must NOT throw for auth flow
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return user ?? null;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      return null; // 🔑 critical for passport
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

      return user ?? null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      return null;
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

      return user ?? null;
    } catch (error) {
      logger.error('Error finding user by Google ID:', error);
      return null;
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
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!newUser) {
        throw new Error('Insert returned no user');
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

      return updatedUser;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error updating user:', error);
      throw new ApiError(500, 'Error updating user');
    }
  }

  /**
   * ✅ FIND OR CREATE (GOOGLE OAUTH – FINAL)
   */
  static async findOrCreate(
    email: string,
    name: string,
    googleId: string,
    profilePicture?: string | null
  ): Promise<User> {
    try {
      // 1️⃣ Google ID match (best case)
      let user = await this.findByGoogleId(googleId);
      if (user) return user;

      // 2️⃣ Email match (existing account)
      user = await this.findByEmail(email);
      if (user) {
        // link Google account
        if (!user.googleId) {
          user = await this.update(user.id, { googleId });
        }
        return user;
      }

      // 3️⃣ Create new user
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
