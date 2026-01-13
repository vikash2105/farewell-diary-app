import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { UserService } from '../services/userService';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL!;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error('Google OAuth environment variables are not properly configured');
}

export const configurePassport = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || 'User';
          const profilePicture = profile.photos?.[0]?.value || null;

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          // Find existing user
          let user = await UserService.findByEmail(email);

          // Create if not exists
          if (!user) {
            user = await UserService.create({
              email,
              name,
              profilePicture,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Store ONLY user ID in session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Fetch full user from DB on every request
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await UserService.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
