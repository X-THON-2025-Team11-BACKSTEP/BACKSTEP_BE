import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const googleId = profile.id;
        const name = profile.displayName;
        
        if (!email) {
            return done(new Error('No email found from Google'), undefined);
        }

        // Find or Create User
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId }, { email }],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name,
              nickname: name, // Nickname defaults to name
              money: 0,       // Money defaults to 0
              googleId,
            },
          });
        } else if (!user.googleId) {
          // Link Google ID if user exists by email but not linked
          user = await prisma.user.update({
            where: { userId: user.userId },
            data: { googleId },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret',
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { userId: jwtPayload.id },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;

