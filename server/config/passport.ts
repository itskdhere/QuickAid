import dotenv from "dotenv";
if (process.env?.NODE_ENV !== "production") {
  dotenv.config({
    path: "../.env",
    quiet: true,
  });
}

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User, IUser } from "../db/models/user.model";

export default async function initializePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.GOOGLE_CALLBACK_ORIGIN}/api/v1/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails?.[0].value });

          if (!user) {
            user = await User.create({
              pfp: profile.photos?.[0].value,
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0].value,
              password: Math.random().toString(36).slice(-12),
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.pfp) user.pfp = profile.photos?.[0].value || "";
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) return done(null, false, { message: "Incorrect email." });

          const isMatch = await user.comparePassword(password);
          if (!isMatch)
            return done(null, false, { message: "Incorrect password." });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET as string,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // @ts-ignore
  passport.serializeUser((user: IUser, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
}
