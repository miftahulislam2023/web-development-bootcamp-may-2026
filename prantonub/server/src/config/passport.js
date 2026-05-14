const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        const email = profile.emails?.[0]?.value;

        user = await User.findOne({ email });

        if (user) {
          user.googleId = profile.id;
          if (!user.avatar) {
            user.avatar = profile.photos?.[0]?.value || "";
          }
          await user.save();
          return done(null, user);
        }

        const newUser = await User.create({
          name: profile.displayName,
          email,
          passwordHash: "google-oauth",
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || "",
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-passwordHash");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
