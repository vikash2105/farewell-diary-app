import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../services/userService';
import { logger } from '../utils/logger';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error('Google OAuth environment variables are not properly configured');
}

/**
 * Configure Passport with Google OAuth strategy
 */
export const configurePassport = (): void => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || 'User';
          const googleId = profile.id;
          const profilePicture = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          // Find or create user
          const user = await UserService.findOrCreate(
            email,
            name,
            googleId,
            profilePicture
          );

          logger.info('User authenticated via Google:', {
            userId: user.id,
            email: user.email,
          });

          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
          });
        } catch (error) {
          logger.error('Error in Google OAuth callback:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
};
