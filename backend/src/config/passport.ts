import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { UserService } from '../services/userService';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BACKEND_URL,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !BACKEND_URL) {
  throw new Error(
    'Missing env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BACKEND_URL'
  );
}

export const configurePassport = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/v1/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email from Google'), undefined);
          }

          const name = profile.displayName || 'User';
          const profilePicture = profile.photos?.[0]?.value ?? null;

          // ✅ find existing user
          let user = await UserService.findByEmail(email);

          // ✅ create if not exists
          if (!user) {
            user = await UserService.create({
              email,
              name,
              profilePicture,
            });
          }

          /**
           * Attach minimal, typed-safe user object
           * Matches Express.Request.user typing
           */
          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
          });
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );

  /**
   * Store entire safe user object in session
   */
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
};
