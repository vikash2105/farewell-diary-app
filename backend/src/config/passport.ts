import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { UserService } from '../services/userService';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error(
    'Missing env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL'
  );
}

export const configurePassport = (): void => {
  // =========================
  // GOOGLE STRATEGY
  // =========================
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || 'User';
          const profilePicture = profile.photos?.[0]?.value || null;

          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          let user = await UserService.findByEmail(email);

          if (!user) {
            user = await UserService.create({
              email,
              name,
              profilePicture,
            });
          }

          if (!user || !user.id) {
            return done(new Error('User creation failed'));
          }

          return done(null, user);
        } catch (error) {
          console.error('❌ Google OAuth error:', error);
          return done(error as Error);
        }
      }
    )
  );

  // =========================
  // SESSION SERIALIZATION
  // =========================
  passport.serializeUser((user: any, done) => {
    if (!user?.id) {
      return done(new Error('Cannot serialize user without id'));
    }
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log('🔍 Passport deserializeUser id:', id);

      const user = await UserService.findById(id);

      if (!user) {
        console.error('❌ User not found during deserialize');
        return done(new Error('User not found'), null);
      }

      console.log('✅ User deserialized:', user.id);
      done(null, user);
    } catch (error) {
      console.error('❌ Deserialize error:', error);
      done(error as Error, null);
    }
  });
};
